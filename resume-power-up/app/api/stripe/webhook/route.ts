import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-client';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const credits = parseInt(session.metadata?.credits || '0');

  if (!userId) return;

  if (session.mode === 'payment' && credits > 0) {
    // One-time credit purchase
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    const newCredits = (profile?.credits || 0) + credits;

    await supabaseAdmin
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', userId);

    await supabaseAdmin.from('payments').insert({
      user_id: userId,
      stripe_payment_id: session.payment_intent as string,
      amount: session.amount_total || 0,
      credits_added: credits,
      status: 'succeeded',
    });
  } else if (session.mode === 'subscription') {
    // Subscription created
    await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: 'active',
        subscription_id: session.subscription as string,
      })
      .eq('id', userId);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', subscription.customer as string)
    .single();

  if (!profile) return;

  const planType = subscription.items.data[0]?.price.lookup_key || 'starter';

  // Set credits based on plan
  const creditsMap: Record<string, number> = {
    starter: 50,
    professional: 150,
    unlimited: 999999,
  };

  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_status: subscription.status as any,
      credits: creditsMap[planType] || 50,
    })
    .eq('id', profile.id);

  await supabaseAdmin
    .from('subscriptions')
    .upsert({
      user_id: profile.id,
      stripe_subscription_id: subscription.id,
      plan_type: planType as any,
      status: subscription.status as any,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', subscription.customer as string)
    .single();

  if (!profile) return;

  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_status: 'cancelled',
      credits: 0,
    })
    .eq('id', profile.id);

  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'cancelled',
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  await handleSubscriptionUpdate(subscription);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', invoice.customer as string)
    .single();

  if (!profile) return;

  await supabaseAdmin
    .from('profiles')
    .update({ subscription_status: 'past_due' })
    .eq('id', profile.id);
}

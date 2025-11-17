import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
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
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get user by customer ID
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!profile) {
          console.error('Profile not found for customer:', customerId);
          break;
        }

        // Determine tier based on price
        let tier = 'free';
        if (subscription.items.data.length > 0) {
          const priceId = subscription.items.data[0].price.id;
          if (
            priceId === process.env.STRIPE_PRICE_ID_PRO_MONTHLY ||
            priceId === process.env.STRIPE_PRICE_ID_PRO_YEARLY
          ) {
            tier = 'pro';
          } else if (
            priceId === process.env.STRIPE_PRICE_ID_BUSINESS_MONTHLY ||
            priceId === process.env.STRIPE_PRICE_ID_BUSINESS_YEARLY
          ) {
            tier = 'business';
          }
        }

        // Update profile
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_tier: tier,
            subscription_status: subscription.status,
            stripe_subscription_id: subscription.id,
          })
          .eq('id', profile.id);

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Downgrade to free tier
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_tier: 'free',
            subscription_status: 'canceled',
            stripe_subscription_id: null,
          })
          .eq('stripe_customer_id', customerId);

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Reset monthly meeting count on successful payment
        await supabaseAdmin
          .from('profiles')
          .update({
            meetings_this_month: 0,
            subscription_status: 'active',
          })
          .eq('stripe_customer_id', customerId);

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: 'past_due',
          })
          .eq('stripe_customer_id', customerId);

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

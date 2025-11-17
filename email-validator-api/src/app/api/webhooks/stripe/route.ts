import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
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

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id || session.metadata?.userId;

  if (!userId) {
    console.error('No user ID found in checkout session');
    return;
  }

  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;

  // Get subscription details from Stripe
  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = stripeSubscription.items.data[0].price.id;

  // Determine tier based on price ID
  let tier: 'STARTER' | 'PRO' | 'ENTERPRISE' = 'STARTER';
  let monthlyQuota = 5000;

  if (priceId === process.env.STRIPE_PRICE_PRO) {
    tier = 'PRO';
    monthlyQuota = 25000;
  } else if (priceId === process.env.STRIPE_PRICE_ENTERPRISE) {
    tier = 'ENTERPRISE';
    monthlyQuota = 200000;
  }

  // Update subscription
  await prisma.subscription.update({
    where: { userId },
    data: {
      tier,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      monthlyQuota,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!dbSubscription) {
    console.error('Subscription not found for customer:', customerId);
    return;
  }

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!dbSubscription) {
    return;
  }

  // Downgrade to free tier
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      tier: 'FREE',
      monthlyQuota: 100,
      validationsThisMonth: 0,
      stripeSubscriptionId: null,
      stripePriceId: null,
      currentPeriodStart: null,
      currentPeriodEnd: null,
    },
  });
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const subscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!subscription) {
    return;
  }

  // Reset monthly usage at the start of a new billing period
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      validationsThisMonth: 0,
    },
  });
}

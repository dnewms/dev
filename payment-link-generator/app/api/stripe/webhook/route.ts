import { NextRequest, NextResponse } from 'next/server';
import { stripe, constructWebhookEvent } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = await constructWebhookEvent(body, signature);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
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

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const linkId = session.metadata?.linkId;

  if (!linkId) {
    console.error('No linkId in session metadata');
    return;
  }

  // In production, update database
  console.log('Checkout completed for link:', linkId);
  console.log('Customer:', session.customer);
  console.log('Amount:', session.amount_total);

  // TODO: Update link stats
  // await db.links.update(linkId, {
  //   conversions: { increment: 1 },
  //   revenue: { increment: session.amount_total },
  // });

  // TODO: Create transaction record
  // await db.transactions.create({
  //   linkId,
  //   customerId: session.customer,
  //   amount: session.amount_total,
  //   status: 'completed',
  //   stripeSessionId: session.id,
  // });

  // TODO: Send confirmation email to customer
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);

  // TODO: Update customer subscription status
  // await db.customers.update(subscription.customer as string, {
  //   subscriptionId: subscription.id,
  //   subscriptionStatus: subscription.status,
  // });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);

  // TODO: Update customer subscription status
  // await db.customers.update(subscription.customer as string, {
  //   subscriptionStatus: subscription.status,
  // });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);

  // TODO: Update customer subscription status
  // await db.customers.update(subscription.customer as string, {
  //   subscriptionId: null,
  //   subscriptionStatus: 'canceled',
  // });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log('Invoice paid:', invoice.id);

  // TODO: Record payment
  // If this is a subscription payment, increment revenue
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id);

  // TODO: Send notification to customer
  // Update payment status in database
}

// Disable body parsing, need raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

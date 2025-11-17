import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

export async function createStripeProduct(name: string, description: string) {
  try {
    const product = await stripe.products.create({
      name,
      description,
    });
    return product;
  } catch (error) {
    console.error('Error creating Stripe product:', error);
    throw error;
  }
}

export async function createStripePrice(
  productId: string,
  amount: number,
  currency: string,
  type: 'one_time' | 'subscription'
) {
  try {
    const priceData: Stripe.PriceCreateParams = {
      product: productId,
      unit_amount: amount,
      currency: currency.toLowerCase(),
    };

    if (type === 'subscription') {
      priceData.recurring = {
        interval: 'month',
      };
    }

    const price = await stripe.prices.create(priceData);
    return price;
  } catch (error) {
    console.error('Error creating Stripe price:', error);
    throw error;
  }
}

export async function createCheckoutSession(
  priceId: string,
  linkId: string,
  mode: 'payment' | 'subscription' = 'payment'
) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${linkId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${linkId}`,
      metadata: {
        linkId,
      },
    });
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function retrieveCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    throw error;
  }
}

export async function createInvoice(
  customerId: string,
  items: Array<{ description: string; amount: number }>
) {
  try {
    // Create invoice items
    for (const item of items) {
      await stripe.invoiceItems.create({
        customer: customerId,
        amount: item.amount,
        currency: 'usd',
        description: item.description,
      });
    }

    // Create and finalize invoice
    const invoice = await stripe.invoices.create({
      customer: customerId,
      auto_advance: true,
    });

    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
    return finalizedInvoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
}

export async function getOrCreateCustomer(email: string, name?: string) {
  try {
    // Check if customer exists
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0];
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email,
      name,
    });

    return customer;
  } catch (error) {
    console.error('Error getting or creating customer:', error);
    throw error;
  }
}

export async function listTransactions(limit: number = 100) {
  try {
    const paymentIntents = await stripe.paymentIntents.list({
      limit,
    });
    return paymentIntents.data;
  } catch (error) {
    console.error('Error listing transactions:', error);
    throw error;
  }
}

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
    return event;
  } catch (error) {
    console.error('Error constructing webhook event:', error);
    throw error;
  }
}

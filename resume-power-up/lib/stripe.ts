import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Pricing configuration
export const PRICING = {
  // One-time credit purchases
  credits: {
    small: {
      credits: 10,
      price: 999, // $9.99
      priceId: 'price_credits_small', // Replace with actual Stripe price ID
    },
    medium: {
      credits: 25,
      price: 1999, // $19.99
      priceId: 'price_credits_medium',
    },
    large: {
      credits: 50,
      price: 2999, // $29.99 (best value)
      priceId: 'price_credits_large',
    },
  },

  // Subscription plans
  subscriptions: {
    starter: {
      name: 'Starter',
      credits_per_month: 50,
      price: 2900, // $29/month
      priceId: 'price_sub_starter',
    },
    professional: {
      name: 'Professional',
      credits_per_month: 150,
      price: 4900, // $49/month
      priceId: 'price_sub_professional',
    },
    unlimited: {
      name: 'Unlimited',
      credits_per_month: 999999, // Effectively unlimited
      price: 9900, // $99/month
      priceId: 'price_sub_unlimited',
    },
  },
};

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  mode: 'payment' | 'subscription',
  metadata: Record<string, string>
) {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    mode,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata,
  });
}

export async function createCustomer(email: string, name?: string) {
  return await stripe.customers.create({
    email,
    name,
  });
}

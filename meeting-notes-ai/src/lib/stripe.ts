import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    meetingsPerMonth: 3,
    maxDurationMinutes: 60,
    features: [
      '3 meetings per month',
      'Up to 60 minutes per meeting',
      'Basic transcription',
      'AI summary and key points',
      'Search functionality',
      'Export to PDF/Markdown',
    ],
  },
  pro: {
    name: 'Pro',
    priceMonthly: 1999, // $19.99
    priceYearly: 19999, // $199.99 (saves ~17%)
    meetingsPerMonth: 50,
    maxDurationMinutes: 240,
    features: [
      '50 meetings per month',
      'Up to 4 hours per meeting',
      'Advanced transcription',
      'AI summary, action items & decisions',
      'Speaker identification',
      'Advanced search with filters',
      'Export to PDF/Markdown/Notion',
      'Priority support',
      'Custom vocabulary',
    ],
  },
  business: {
    name: 'Business',
    priceMonthly: 4999, // $49.99
    priceYearly: 49999, // $499.99 (saves ~17%)
    meetingsPerMonth: -1, // Unlimited
    maxDurationMinutes: -1, // Unlimited
    features: [
      'Unlimited meetings',
      'Unlimited duration',
      'Premium transcription quality',
      'Advanced AI analysis',
      'Speaker identification',
      'Team collaboration',
      'Shared workspaces',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
      'API access',
      'SSO (coming soon)',
    ],
  },
};

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: {
      userId,
    },
  });

  return session;
}

export async function createCustomerPortalSession(
  customerId: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return session;
}

export async function getOrCreateCustomer(
  email: string,
  userId: string
): Promise<Stripe.Customer> {
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });

  return customer;
}

export function canUserCreateMeeting(
  meetingsThisMonth: number,
  subscriptionTier: string
): boolean {
  const plan = SUBSCRIPTION_PLANS[subscriptionTier as keyof typeof SUBSCRIPTION_PLANS];

  if (!plan) return false;
  if (plan.meetingsPerMonth === -1) return true; // Unlimited

  return meetingsThisMonth < plan.meetingsPerMonth;
}

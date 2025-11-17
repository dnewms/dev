export type PaymentType = 'one_time' | 'subscription';

export interface PaymentLink {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: PaymentType;
  stripeProductId?: string;
  stripePriceId?: string;

  // Branding
  branding: {
    primaryColor: string;
    logoUrl?: string;
    buttonText: string;
  };

  // Stats
  views: number;
  conversions: number;
  revenue: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export interface Customer {
  id: string;
  email: string;
  name?: string;
  totalSpent: number;
  purchaseCount: number;
  stripeCustomerId: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  linkId: string;
  customerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripePaymentIntentId: string;
  createdAt: Date;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalTransactions: number;
  totalCustomers: number;
  conversionRate: number;
  revenueByDay: Array<{
    date: string;
    revenue: number;
    transactions: number;
  }>;
  topLinks: Array<{
    id: string;
    name: string;
    revenue: number;
    conversions: number;
  }>;
}

export interface CreateLinkFormData {
  name: string;
  description: string;
  price: number;
  currency: string;
  type: PaymentType;
  primaryColor: string;
  logoUrl?: string;
  buttonText: string;
}

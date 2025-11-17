export type EnhancementStyle = 'action_oriented' | 'quantified' | 'industry_specific' | 'linkedin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  credits: number;
  subscription_status: 'none' | 'active' | 'cancelled' | 'past_due';
  subscription_id: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Enhancement {
  id: string;
  user_id: string;
  original_text: string;
  enhanced_text: string;
  enhancement_style: EnhancementStyle;
  industry: string | null;
  created_at: string;
}

export interface UsageLog {
  id: string;
  user_id: string;
  action_type: string;
  credits_used: number;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  stripe_payment_id: string;
  amount: number;
  credits_added: number;
  status: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  plan_type: 'starter' | 'professional' | 'unlimited';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface EnhancementRequest {
  originalText: string;
  style: EnhancementStyle;
  industry?: string;
}

export interface EnhancementResponse {
  enhancedText: string;
  creditsRemaining: number;
}

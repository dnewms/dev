export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'pro' | 'business';
  subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  meetings_this_month: number;
  total_meetings: number;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: string;
  user_id: string;
  team_id?: string;
  title: string;
  description?: string;
  audio_url?: string;
  video_url?: string;
  file_size?: number;
  duration_seconds?: number;
  transcription_status: 'pending' | 'processing' | 'completed' | 'failed';
  transcription_text?: string;
  summary?: string;
  key_points?: string[];
  action_items?: ActionItem[];
  key_decisions?: KeyDecision[];
  speakers?: Speaker[];
  tags?: string[];
  meeting_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ActionItem {
  task: string;
  assignee?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface KeyDecision {
  decision: string;
  context: string;
}

export interface Speaker {
  label: string;
  name?: string;
  segments?: number;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  subscription_tier: 'free' | 'pro' | 'business';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
}

export interface MeetingShare {
  id: string;
  meeting_id: string;
  shared_by: string;
  shared_with: string;
  permission: 'view' | 'edit';
  created_at: string;
}

export interface SubscriptionPlan {
  name: string;
  price?: number;
  priceMonthly?: number;
  priceYearly?: number;
  meetingsPerMonth: number;
  maxDurationMinutes: number;
  features: string[];
}

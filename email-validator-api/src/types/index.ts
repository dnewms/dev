// Core types for Email Validator API

export interface ValidationResult {
  email: string;
  isValid: boolean;
  syntaxValid: boolean;
  mxValid: boolean;
  smtpValid: boolean;
  isDisposable: boolean;
  domain: string;
  suggestion?: string;
  timestamp: string;
}

export interface BulkValidationRequest {
  emails: string[];
}

export interface BulkValidationResponse {
  results: ValidationResult[];
  total: number;
  valid: number;
  invalid: number;
}

export interface ApiKeyResponse {
  id: string;
  key: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  lastUsedAt?: string;
}

export interface UsageStats {
  totalValidations: number;
  validationsThisMonth: number;
  monthlyQuota: number;
  remainingQuota: number;
  validationsByDay: {
    date: string;
    count: number;
  }[];
}

export interface SubscriptionInfo {
  tier: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
  monthlyQuota: number;
  validationsThisMonth: number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export const PRICING_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    monthlyQuota: 100,
    features: [
      '100 validations/month',
      'Basic syntax validation',
      'MX record check',
      'Community support'
    ]
  },
  STARTER: {
    name: 'Starter',
    price: 29,
    monthlyQuota: 5000,
    features: [
      '5,000 validations/month',
      'All validation checks',
      'Bulk validation',
      'API key management',
      'Email support'
    ]
  },
  PRO: {
    name: 'Pro',
    price: 99,
    monthlyQuota: 25000,
    features: [
      '25,000 validations/month',
      'All validation checks',
      'Bulk validation',
      'Priority support',
      'Custom integrations',
      'Webhook notifications'
    ]
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 499,
    monthlyQuota: 200000,
    features: [
      '200,000 validations/month',
      'All validation checks',
      'Dedicated support',
      'SLA guarantee',
      'Custom deployment',
      'Webhook notifications',
      'Advanced analytics'
    ]
  }
} as const;

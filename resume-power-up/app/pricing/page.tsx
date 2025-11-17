'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Navbar } from '@/components/dashboard/Navbar';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';

const CREDIT_PACKAGES = [
  {
    name: 'Starter Pack',
    credits: 10,
    price: 9.99,
    priceId: 'price_credits_small',
  },
  {
    name: 'Popular Pack',
    credits: 25,
    price: 19.99,
    priceId: 'price_credits_medium',
    popular: true,
  },
  {
    name: 'Value Pack',
    credits: 50,
    price: 29.99,
    priceId: 'price_credits_large',
  },
];

const SUBSCRIPTION_PLANS = [
  {
    name: 'Starter',
    price: 29,
    credits: 50,
    priceId: 'price_sub_starter',
    features: [
      '50 enhancements per month',
      'All enhancement styles',
      'Export functionality',
      'Email support',
    ],
  },
  {
    name: 'Professional',
    price: 49,
    credits: 150,
    priceId: 'price_sub_professional',
    popular: true,
    features: [
      '150 enhancements per month',
      'All enhancement styles',
      'Priority processing',
      'Export functionality',
      'Priority support',
    ],
  },
  {
    name: 'Unlimited',
    price: 99,
    credits: 999999,
    priceId: 'price_sub_unlimited',
    features: [
      'Unlimited enhancements',
      'All enhancement styles',
      'Priority processing',
      'Export functionality',
      'Priority support',
      'Custom industry profiles',
    ],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [mode, setMode] = useState<'credits' | 'subscription'>('credits');

  const handlePurchase = async (priceId: string, credits: number, isSubscription: boolean) => {
    setLoading(priceId);

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          mode: isSubscription ? 'subscription' : 'payment',
          credits: isSubscription ? 0 : credits,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error.message || 'Failed to start checkout');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 mb-8">
            Get the credits you need to power up your resume
          </p>

          <div className="inline-flex rounded-lg border border-gray-300 p-1 bg-white">
            <button
              onClick={() => setMode('credits')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                mode === 'credits'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              One-Time Credits
            </button>
            <button
              onClick={() => setMode('subscription')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                mode === 'subscription'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Monthly Subscription
            </button>
          </div>
        </div>

        {mode === 'credits' ? (
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {CREDIT_PACKAGES.map((pkg) => (
              <Card key={pkg.priceId} className="relative">
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-primary-600 mb-1">
                    ${pkg.price}
                  </div>
                  <p className="text-gray-600">{pkg.credits} credits</p>
                  <p className="text-sm text-gray-500 mt-1">
                    ${(pkg.price / pkg.credits).toFixed(2)} per credit
                  </p>
                </div>

                <Button
                  onClick={() => handlePurchase(pkg.priceId, pkg.credits, false)}
                  loading={loading === pkg.priceId}
                  variant={pkg.popular ? 'primary' : 'outline'}
                  className="w-full"
                >
                  Purchase Now
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <Card key={plan.priceId} className="relative flex flex-col">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-primary-600 mb-1">
                    ${plan.price}
                  </div>
                  <p className="text-gray-600">per month</p>
                </div>

                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePurchase(plan.priceId, plan.credits, true)}
                  loading={loading === plan.priceId}
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full"
                >
                  Subscribe Now
                </Button>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-gray-600">
            All plans include access to all enhancement styles and export features.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Secure payment processing powered by Stripe
          </p>
        </div>
      </main>
    </div>
  );
}

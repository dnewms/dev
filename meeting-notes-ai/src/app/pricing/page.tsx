'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = async (priceId: string) => {
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription process');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="container mx-auto px-4 py-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the plan that works best for you
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center p-1 bg-gray-200 rounded-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-primary shadow'
                  : 'text-gray-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-primary shadow'
                  : 'text-gray-600'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for trying out</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {SUBSCRIPTION_PLANS.free.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup">
                <Button variant="outline" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-primary border-2 shadow-lg">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For individuals & small teams</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${billingPeriod === 'monthly' ? '19.99' : '16.66'}
                </span>
                <span className="text-gray-600">/month</span>
                {billingPeriod === 'yearly' && (
                  <p className="text-sm text-gray-500 mt-1">Billed annually ($199.99/year)</p>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {SUBSCRIPTION_PLANS.pro.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                onClick={() =>
                  handleSubscribe(
                    billingPeriod === 'monthly'
                      ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY!
                      : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY!
                  )
                }
              >
                Start Pro Trial
              </Button>
            </CardContent>
          </Card>

          {/* Business Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Business</CardTitle>
              <CardDescription>For growing teams</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${billingPeriod === 'monthly' ? '49.99' : '41.66'}
                </span>
                <span className="text-gray-600">/month</span>
                {billingPeriod === 'yearly' && (
                  <p className="text-sm text-gray-500 mt-1">Billed annually ($499.99/year)</p>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {SUBSCRIPTION_PLANS.business.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                onClick={() =>
                  handleSubscribe(
                    billingPeriod === 'monthly'
                      ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS_MONTHLY!
                      : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS_YEARLY!
                  )
                }
              >
                Start Business Trial
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <FAQItem
              question="Can I change plans later?"
              answer="Yes! You can upgrade or downgrade your plan at any time from your account settings."
            />
            <FAQItem
              question="What happens when I reach my meeting limit?"
              answer="You'll be notified when you're approaching your limit. You can upgrade your plan or wait until the next billing cycle."
            />
            <FAQItem
              question="Do you offer refunds?"
              answer="Yes, we offer a 14-day money-back guarantee for all paid plans."
            />
            <FAQItem
              question="Is my data secure?"
              answer="Absolutely. We use enterprise-grade encryption and never share your data with third parties."
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b pb-6">
      <h3 className="text-lg font-semibold mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}

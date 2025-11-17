"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Shield, CreditCard } from "lucide-react";

interface CheckoutFormProps {
  linkId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: 'one_time' | 'subscription';
  primaryColor: string;
  buttonText: string;
}

export function CheckoutForm({
  linkId,
  name,
  description,
  price,
  currency,
  type,
  primaryColor,
  buttonText,
}: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleCheckout = async () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkId,
          email,
        }),
      });

      if (!response.ok) throw new Error('Failed to create checkout session');

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gray-600">
              {type === 'subscription' ? 'Monthly Price' : 'Total'}
            </span>
            <div className="text-right">
              <span className="text-3xl font-bold">
                {formatCurrency(price, currency)}
              </span>
              {type === 'subscription' && (
                <span className="ml-1 text-sm text-gray-600">/month</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full"
          size="lg"
          style={{ backgroundColor: primaryColor }}
        >
          <CreditCard className="mr-2 h-5 w-5" />
          {loading ? 'Processing...' : buttonText}
        </Button>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Shield className="h-4 w-4" />
          <span>Secured by Stripe</span>
        </div>

        <div className="text-center text-xs text-gray-500">
          {type === 'subscription' ? (
            <p>You will be charged {formatCurrency(price, currency)} monthly. Cancel anytime.</p>
          ) : (
            <p>One-time payment. Secure checkout powered by Stripe.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Zap } from 'lucide-react';
import Link from 'next/link';

interface CreditsDisplayProps {
  credits: number;
  subscriptionStatus: string;
}

export function CreditsDisplay({ credits, subscriptionStatus }: CreditsDisplayProps) {
  const isUnlimited = credits === 999999;

  return (
    <Card className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Available Credits</h3>
          </div>
          <p className="text-3xl font-bold">
            {isUnlimited ? '∞' : credits}
          </p>
          {subscriptionStatus === 'active' && (
            <p className="text-sm text-primary-100 mt-1">
              {isUnlimited ? 'Unlimited Plan' : 'Active Subscription'}
            </p>
          )}
        </div>

        {!isUnlimited && credits < 10 && (
          <Link href="/pricing">
            <Button variant="secondary" size="sm">
              Buy More
            </Button>
          </Link>
        )}
      </div>

      {!isUnlimited && credits < 5 && (
        <div className="mt-4 pt-4 border-t border-primary-500">
          <p className="text-sm text-primary-100">
            Running low on credits! Purchase more to keep enhancing.
          </p>
        </div>
      )}
    </Card>
  );
}

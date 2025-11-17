import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { createCheckoutSession, createPortalSession } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      tier: subscription.tier,
      monthlyQuota: subscription.monthlyQuota,
      validationsThisMonth: subscription.validationsThisMonth,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Check if user already has a subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    if (subscription?.stripeCustomerId) {
      // User has existing subscription, create portal session
      const portalSession = await createPortalSession(subscription.stripeCustomerId);
      return NextResponse.json({ url: portalSession.url });
    }

    // Create new checkout session
    const checkoutSession = await createCheckoutSession(
      user.id,
      priceId,
      user.email
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Create checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

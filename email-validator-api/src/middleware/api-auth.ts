import { NextRequest, NextResponse } from 'next/server';
import { getApiKeyFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export interface AuthenticatedRequest extends NextRequest {
  user?: any;
  apiKey?: any;
}

export async function requireApiKey(req: NextRequest) {
  const apiKeyData = await getApiKeyFromRequest(req);

  if (!apiKeyData) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        message: 'Valid API key required. Include X-API-Key header.',
      },
      { status: 401 }
    );
  }

  return apiKeyData;
}

export async function checkQuota(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    return {
      allowed: false,
      message: 'No subscription found',
    };
  }

  if (subscription.validationsThisMonth >= subscription.monthlyQuota) {
    return {
      allowed: false,
      message: 'Monthly quota exceeded. Please upgrade your plan.',
      validationsUsed: subscription.validationsThisMonth,
      monthlyQuota: subscription.monthlyQuota,
    };
  }

  return {
    allowed: true,
    validationsUsed: subscription.validationsThisMonth,
    monthlyQuota: subscription.monthlyQuota,
  };
}

export async function incrementUsage(userId: string, apiKeyId: string, count: number = 1) {
  await Promise.all([
    // Increment subscription usage
    prisma.subscription.update({
      where: { userId },
      data: {
        validationsThisMonth: {
          increment: count,
        },
      },
    }),
    // Record usage
    prisma.usage.create({
      data: {
        userId,
        apiKeyId,
        endpoint: 'validation',
        validations: count,
      },
    }),
  ]);
}

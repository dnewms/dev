import { NextRequest, NextResponse } from 'next/server';
import { emailValidatorService } from '@/services/email-validator';
import { requireApiKey, checkQuota, incrementUsage } from '@/middleware/api-auth';
import { checkRateLimit, rateLimitResponse, TIER_RATE_LIMITS } from '@/middleware/rate-limit';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // Authenticate
    const apiKeyData = await requireApiKey(req);
    if (apiKeyData instanceof NextResponse) {
      return apiKeyData; // Return error response
    }

    const { user, id: apiKeyId } = apiKeyData;

    // Check rate limit based on tier
    const tier = user.subscription?.tier || 'FREE';
    const rateLimitConfig = TIER_RATE_LIMITS[tier];
    const rateLimit = await checkRateLimit(`api:${user.id}`, rateLimitConfig);

    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.resetAt);
    }

    // Check quota
    const quotaCheck = await checkQuota(user.id);
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Quota Exceeded',
          message: quotaCheck.message,
          validationsUsed: quotaCheck.validationsUsed,
          monthlyQuota: quotaCheck.monthlyQuota,
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Email address is required',
        },
        { status: 400 }
      );
    }

    // Validate email
    const result = await emailValidatorService.validateEmail(email);

    // Save validation and increment usage
    await Promise.all([
      prisma.validation.create({
        data: {
          email: result.email,
          isValid: result.isValid,
          syntaxValid: result.syntaxValid,
          mxValid: result.mxValid,
          smtpValid: result.smtpValid,
          isDisposable: result.isDisposable,
          domain: result.domain,
          suggestion: result.suggestion,
          userId: user.id,
          apiKeyId,
        },
      }),
      incrementUsage(user.id, apiKeyId, 1),
    ]);

    return NextResponse.json(result, {
      headers: {
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-Quota-Remaining': (quotaCheck.monthlyQuota - quotaCheck.validationsUsed - 1).toString(),
      },
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An error occurred during validation',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'Email Validator API v1',
    documentation: '/api/docs',
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { emailValidatorService } from '@/services/email-validator';
import { requireApiKey, checkQuota, incrementUsage } from '@/middleware/api-auth';
import { checkRateLimit, rateLimitResponse, TIER_RATE_LIMITS } from '@/middleware/rate-limit';
import { prisma } from '@/lib/prisma';
import { BulkValidationResponse } from '@/types';

const MAX_BULK_SIZE = parseInt(process.env.MAX_BULK_VALIDATIONS || '100');

export async function POST(req: NextRequest) {
  try {
    // Authenticate
    const apiKeyData = await requireApiKey(req);
    if (apiKeyData instanceof NextResponse) {
      return apiKeyData;
    }

    const { user, id: apiKeyId } = apiKeyData;

    // Check rate limit
    const tier = user.subscription?.tier || 'FREE';
    const rateLimitConfig = TIER_RATE_LIMITS[tier];
    const rateLimit = await checkRateLimit(`api:${user.id}`, rateLimitConfig);

    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.resetAt);
    }

    // Parse request
    const body = await req.json();
    const { emails } = body;

    if (!emails || !Array.isArray(emails)) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'emails must be an array',
        },
        { status: 400 }
      );
    }

    if (emails.length === 0) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'At least one email is required',
        },
        { status: 400 }
      );
    }

    if (emails.length > MAX_BULK_SIZE) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: `Maximum ${MAX_BULK_SIZE} emails per request`,
        },
        { status: 400 }
      );
    }

    // Check quota for bulk validation
    const quotaCheck = await checkQuota(user.id);
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Quota Exceeded',
          message: quotaCheck.message,
        },
        { status: 403 }
      );
    }

    const remainingQuota = quotaCheck.monthlyQuota - quotaCheck.validationsUsed;
    if (emails.length > remainingQuota) {
      return NextResponse.json(
        {
          error: 'Quota Exceeded',
          message: `Not enough quota. Requested: ${emails.length}, Available: ${remainingQuota}`,
          remainingQuota,
        },
        { status: 403 }
      );
    }

    // Validate emails
    const results = await emailValidatorService.validateBulk(emails);

    // Save all validations
    await Promise.all([
      prisma.validation.createMany({
        data: results.map(result => ({
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
        })),
      }),
      incrementUsage(user.id, apiKeyId, results.length),
    ]);

    const response: BulkValidationResponse = {
      results,
      total: results.length,
      valid: results.filter(r => r.isValid).length,
      invalid: results.filter(r => !r.isValid).length,
    };

    return NextResponse.json(response, {
      headers: {
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-Quota-Remaining': (remainingQuota - results.length).toString(),
      },
    });
  } catch (error) {
    console.error('Bulk validation error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An error occurred during bulk validation',
      },
      { status: 500 }
    );
  }
}

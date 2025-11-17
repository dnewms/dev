import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '60'), // 60 requests
};

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  try {
    // Remove old entries and count current requests
    await redis.zremrangebyscore(key, 0, windowStart);
    const currentCount = await redis.zcard(key);

    if (currentCount >= config.maxRequests) {
      const oldestEntry = await redis.zrange(key, 0, 0, 'WITHSCORES');
      const resetAt = oldestEntry.length > 1
        ? parseInt(oldestEntry[1]) + config.windowMs
        : now + config.windowMs;

      return {
        allowed: false,
        remaining: 0,
        resetAt,
      };
    }

    // Add current request
    await redis.zadd(key, now, `${now}`);
    await redis.expire(key, Math.ceil(config.windowMs / 1000));

    return {
      allowed: true,
      remaining: config.maxRequests - (currentCount + 1),
      resetAt: now + config.windowMs,
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // Fail open on Redis errors
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: now + config.windowMs,
    };
  }
}

export function rateLimitResponse(resetAt: number) {
  return NextResponse.json(
    {
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      resetAt: new Date(resetAt).toISOString(),
    },
    {
      status: 429,
      headers: {
        'X-RateLimit-Reset': new Date(resetAt).toISOString(),
        'Retry-After': Math.ceil((resetAt - Date.now()) / 1000).toString(),
      },
    }
  );
}

// Tier-based rate limiting
export const TIER_RATE_LIMITS: Record<string, RateLimitConfig> = {
  FREE: {
    windowMs: 60000, // 1 minute
    maxRequests: 10,
  },
  STARTER: {
    windowMs: 60000,
    maxRequests: 60,
  },
  PRO: {
    windowMs: 60000,
    maxRequests: 300,
  },
  ENTERPRISE: {
    windowMs: 60000,
    maxRequests: 1000,
  },
};

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { UsageStats } from '@/types';

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

    // Get total validations
    const totalValidations = await prisma.validation.count({
      where: { userId: user.id },
    });

    // Get validations by day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const validationsByDay = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as count
      FROM "Validation"
      WHERE user_id = ${user.id}
        AND created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;

    const stats: UsageStats = {
      totalValidations,
      validationsThisMonth: subscription.validationsThisMonth,
      monthlyQuota: subscription.monthlyQuota,
      remainingQuota: subscription.monthlyQuota - subscription.validationsThisMonth,
      validationsByDay: validationsByDay.map(row => ({
        date: row.date,
        count: Number(row.count),
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Get usage error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage statistics' },
      { status: 500 }
    );
  }
}

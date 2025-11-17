import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with subscription and API key
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        subscription: {
          create: {
            tier: 'FREE',
            monthlyQuota: 100,
            validationsThisMonth: 0,
          },
        },
        apiKeys: {
          create: {
            key: `evapi_${nanoid(32)}`,
            name: 'Default API Key',
            isActive: true,
          },
        },
      },
      include: {
        subscription: true,
        apiKeys: true,
      },
    });

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      apiKey: user.apiKeys[0].key,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createStripeProduct, createStripePrice } from '@/lib/stripe';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, currency, type, primaryColor, buttonText } = body;

    // Validate required fields
    if (!name || !description || !price || !currency || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create product in Stripe
    const product = await createStripeProduct(name, description);

    // Create price in Stripe
    const stripePrice = await createStripePrice(
      product.id,
      price,
      currency,
      type
    );

    // In production, save to database
    // For now, we'll return the created link data
    const link = {
      id: nanoid(12),
      name,
      description,
      price,
      currency,
      type,
      stripeProductId: product.id,
      stripePriceId: stripePrice.id,
      branding: {
        primaryColor: primaryColor || '#9333ea',
        buttonText: buttonText || 'Pay Now',
      },
      views: 0,
      conversions: 0,
      revenue: 0,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // TODO: Save link to database
    // await db.links.create(link);

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error('Error creating payment link:', error);
    return NextResponse.json(
      { error: 'Failed to create payment link' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // In production, fetch from database
    // const links = await db.links.findAll();

    // Mock data for now
    const links = [
      {
        id: 'link_1',
        name: 'Premium Consultation',
        description: 'One-hour strategy session',
        price: 9900,
        currency: 'USD',
        type: 'one_time',
        active: true,
        views: 145,
        conversions: 12,
        revenue: 118800,
      },
    ];

    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching payment links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment links' },
      { status: 500 }
    );
  }
}

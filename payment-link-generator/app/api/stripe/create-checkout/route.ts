import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { linkId, email } = body;

    if (!linkId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, fetch link from database
    // const link = await db.links.findById(linkId);

    // Mock link data for now
    const link = {
      id: linkId,
      stripePriceId: 'price_mock', // In production, get from DB
      type: 'one_time',
    };

    // For demo purposes, create a mock price if needed
    // In production, you would use the actual stripePriceId from your database
    let priceId = link.stripePriceId;

    // Create a customer or get existing one
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customer;

    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        metadata: {
          linkId,
        },
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: link.type === 'subscription' ? 'subscription' : 'payment',
      line_items: [
        {
          // For demo, using a fixed price. In production, use link.stripePriceId
          price_data: {
            currency: 'usd',
            unit_amount: 9900, // $99.00 - from mock data
            product_data: {
              name: 'Premium Consultation',
              description: 'One-hour strategy session',
            },
            ...(link.type === 'subscription' && {
              recurring: {
                interval: 'month',
              },
            }),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${linkId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${linkId}`,
      metadata: {
        linkId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

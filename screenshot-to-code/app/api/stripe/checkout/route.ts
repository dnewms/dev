import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe, CREDIT_PACKAGES } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      )
    }

    const { packageId } = await req.json()

    const creditPackage = CREDIT_PACKAGES.find((pkg) => pkg.id === packageId)

    if (!creditPackage) {
      return NextResponse.json(
        { error: "Invalid package selected" },
        { status: 400 }
      )
    }

    // Create a pending purchase record
    const purchase = await prisma.purchase.create({
      data: {
        userId: session.user.id,
        stripeSessionId: "", // Will be updated after creating checkout session
        credits: creditPackage.credits,
        amount: creditPackage.price,
        status: "pending",
      },
    })

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: creditPackage.name,
              description: `${creditPackage.credits} generation credits`,
            },
            unit_amount: creditPackage.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=cancelled`,
      metadata: {
        userId: session.user.id,
        purchaseId: purchase.id,
        credits: creditPackage.credits.toString(),
      },
    })

    // Update purchase with Stripe session ID
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { stripeSessionId: checkoutSession.id },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Stripe Checkout Error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const { userId, purchaseId, credits } = session.metadata!

        // Update user credits
        await prisma.user.update({
          where: { id: userId },
          data: {
            credits: {
              increment: parseInt(credits),
            },
          },
        })

        // Update purchase status
        await prisma.purchase.update({
          where: { id: purchaseId },
          data: { status: "completed" },
        })

        console.log(`Credits added for user ${userId}: ${credits}`)
        break
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session
        const { purchaseId } = session.metadata!

        // Mark purchase as failed
        await prisma.purchase.update({
          where: { id: purchaseId },
          data: { status: "failed" },
        })

        console.log(`Checkout session expired for purchase ${purchaseId}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

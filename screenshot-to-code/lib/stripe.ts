import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
})

export const CREDIT_PACKAGES = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 10,
    price: 999, // $9.99 in cents
    priceId: process.env.STRIPE_PRICE_ID_STARTER!,
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 30,
    price: 2499, // $24.99 in cents
    priceId: process.env.STRIPE_PRICE_ID_PRO!,
  },
  {
    id: "business",
    name: "Business Pack",
    credits: 100,
    price: 6999, // $69.99 in cents
    priceId: process.env.STRIPE_PRICE_ID_BUSINESS!,
  },
]

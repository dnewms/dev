"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Coins, LogOut, Home, Sparkles, CreditCard } from "lucide-react"
import Link from "next/link"

const CREDIT_PACKAGES = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 10,
    price: "$9.99",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 30,
    price: "$24.99",
    popular: true,
  },
  {
    id: "business",
    name: "Business Pack",
    credits: 100,
    price: "$69.99",
    popular: false,
  },
]

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  const handlePurchase = async (packageId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Home className="w-5 h-5" />
                Back to App
              </Link>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Info */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {session.user.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {session.user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Credits Balance */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-12 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-6 h-6" />
                <span className="text-lg font-medium">Available Credits</span>
              </div>
              <p className="text-5xl font-bold">{session.user.credits}</p>
              <p className="text-blue-100 mt-2">
                Each credit = 1 screenshot conversion
              </p>
            </div>
            <Sparkles className="w-24 h-24 opacity-20" />
          </div>
        </div>

        {/* Credit Packages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Purchase More Credits
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {CREDIT_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${
                  pkg.popular
                    ? "border-blue-500 scale-105"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {pkg.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1 mb-1">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {pkg.price}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {pkg.credits} credits
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    ${(parseFloat(pkg.price.slice(1)) / pkg.credits).toFixed(2)} per
                    credit
                  </p>
                </div>
                <button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    pkg.popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <CreditCard className="w-5 h-5" />
                  Purchase
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            How It Works
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Upload Screenshot
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Upload any design screenshot, mockup, or wireframe (PNG, JPG, WebP)
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Choose Output Type
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select HTML + Tailwind for static pages or React component for
                  reusable components
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  AI Generates Code
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our AI analyzes your design and generates production-ready code in
                  seconds
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Edit, Preview & Download
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Edit code in Monaco editor, preview in real-time, then download or
                  copy to clipboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

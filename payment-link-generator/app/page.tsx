import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, TrendingUp, Palette, QrCode, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500" />
            <span className="text-xl font-bold">PayLink</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/dashboard/links/new">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
            Beautiful Payment Links
            <span className="block bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              For Creators
            </span>
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Create stunning payment links in seconds. Accept one-time payments and subscriptions
            with custom branding, QR codes, and powerful analytics.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard/links/new">
              <Button size="lg" className="group">
                Create Your First Link
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Everything You Need to Get Paid</h2>
          <p className="text-gray-600">Simple, powerful, and beautiful payment links</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Zap className="mb-2 h-8 w-8 text-purple-600" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Create payment links in seconds. No coding required.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Palette className="mb-2 h-8 w-8 text-purple-600" />
              <CardTitle>Custom Branding</CardTitle>
              <CardDescription>
                Match your brand with custom colors and logos on payment pages.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <QrCode className="mb-2 h-8 w-8 text-purple-600" />
              <CardTitle>QR Codes</CardTitle>
              <CardDescription>
                Automatically generate QR codes for easy mobile payments.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="mb-2 h-8 w-8 text-purple-600" />
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Track revenue, conversions, and customer insights in real-time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="mb-2 h-8 w-8 text-purple-600" />
              <CardTitle>Subscriptions</CardTitle>
              <CardDescription>
                Accept recurring payments with built-in subscription support.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="mb-2 h-8 w-8 text-purple-600" />
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                Powered by Stripe. Bank-level security for all transactions.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-lg">
              Create your first payment link in less than a minute
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/dashboard/links/new">
              <Button size="lg" className="group">
                Create Payment Link
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-sm text-gray-600">
        <p>&copy; 2024 PayLink. Built with Next.js and Stripe.</p>
      </footer>
    </div>
  );
}

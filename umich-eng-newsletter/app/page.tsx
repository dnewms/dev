import Link from 'next/link'
import { Mail, Users, BarChart3, Archive, Send, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="michigan-gradient rounded-2xl p-12 text-white">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold mb-4">
            U-M Engineering Newsletter Builder
          </h1>
          <p className="text-xl text-michigan-wave-blue mb-8">
            Create, manage, and send professional newsletters to the University of Michigan Engineering community with ease.
          </p>
          <div className="flex gap-4">
            <Link
              href="/builder"
              className="bg-michigan-maize text-michigan-blue px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Create Newsletter
            </Link>
            <Link
              href="/templates"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
            >
              Browse Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-3xl font-bold text-michigan-blue mb-8">Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Mail className="w-8 h-8" />}
            title="Drag & Drop Builder"
            description="Intuitive email template builder with drag-and-drop functionality. No coding required."
            href="/builder"
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="Pre-built Templates"
            description="Ready-to-use templates for research highlights, student achievements, and upcoming events."
            href="/templates"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Email List Management"
            description="Organize and manage your subscriber lists with ease. Import, export, and segment contacts."
            href="/contacts"
          />
          <FeatureCard
            icon={<Send className="w-8 h-8" />}
            title="SendGrid & Mailchimp"
            description="Seamless integration with SendGrid and Mailchimp for reliable email delivery."
            href="/settings"
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Analytics Dashboard"
            description="Track open rates, click-through rates, and engagement metrics for your newsletters."
            href="/analytics"
          />
          <FeatureCard
            icon={<Archive className="w-8 h-8" />}
            title="Newsletter Archive"
            description="Browse and access all previously sent newsletters in one organized place."
            href="/archive"
          />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-michigan-blue mb-6">Quick Stats</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <StatCard label="Total Newsletters" value="0" />
          <StatCard label="Total Subscribers" value="0" />
          <StatCard label="Avg. Open Rate" value="0%" />
          <StatCard label="Avg. Click Rate" value="0%" />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description, href }: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href} className="block">
      <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full">
        <div className="text-michigan-blue mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-michigan-blue mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-michigan-blue mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}

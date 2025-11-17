import Link from 'next/link';
import { PRICING_TIERS } from '@/types';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">EmailValidator</div>
          <div className="space-x-4">
            <Link href="/docs" className="text-gray-600 hover:text-blue-600">
              Documentation
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Validate Emails Like a Pro
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Production-ready email validation API with syntax checking, MX records,
          SMTP verification, and disposable domain detection. Simple, fast, and reliable.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Start Free Trial
          </Link>
          <Link
            href="/docs"
            className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50"
          >
            View Docs
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Comprehensive Validation',
              description: 'Syntax, MX records, SMTP, and disposable domain checks in one API call',
              icon: '',
            },
            {
              title: 'Lightning Fast',
              description: 'Redis caching and optimized queries ensure sub-100ms response times',
              icon: '¡',
            },
            {
              title: 'Developer Friendly',
              description: 'RESTful API, OpenAPI docs, and SDKs for JavaScript and Python',
              icon: '=h=»',
            },
            {
              title: 'Bulk Validation',
              description: 'Validate up to 100 emails in a single request for maximum efficiency',
              icon: '=æ',
            },
            {
              title: 'Rate Limiting',
              description: 'Built-in rate limiting and quota management for all tiers',
              icon: '=',
            },
            {
              title: 'Simple Billing',
              description: 'Transparent pricing with Stripe integration. Cancel anytime.',
              icon: '=³',
            },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {Object.entries(PRICING_TIERS).map(([key, tier]) => (
            <div
              key={key}
              className={`bg-white p-8 rounded-lg shadow-lg ${
                key === 'PRO' ? 'ring-2 ring-blue-600 scale-105' : ''
              }`}
            >
              {key === 'PRO' && (
                <div className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                  POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">${tier.price}</span>
                {tier.price > 0 && <span className="text-gray-600">/month</span>}
              </div>
              <p className="text-gray-600 mb-6">
                {tier.monthlyQuota.toLocaleString()} validations/month
              </p>
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-600 mr-2"></span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className={`block w-full text-center py-3 rounded-lg font-semibold ${
                  key === 'PRO'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Code Example */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Quick Start</h2>
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 text-white p-6 rounded-lg">
            <pre className="overflow-x-auto">
              <code>{`// Validate a single email
const response = await fetch('https://api.emailvalidator.com/api/v1/validate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify({ email: 'user@example.com' })
});

const result = await response.json();
console.log(result);
// {
//   "email": "user@example.com",
//   "isValid": true,
//   "syntaxValid": true,
//   "mxValid": true,
//   "smtpValid": true,
//   "isDisposable": false,
//   "domain": "example.com"
// }`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 Email Validator API. Built with Next.js and TypeScript.</p>
        </div>
      </footer>
    </div>
  );
}

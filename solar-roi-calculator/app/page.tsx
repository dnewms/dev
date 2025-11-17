import SolarCalculator from '@/components/SolarCalculator';
import AffiliateLinks from '@/components/AffiliateLinks';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Solar Panel ROI Calculator 2024 | Calculate Your Solar Savings',
  description: 'Calculate your solar panel investment return, payback period, and 25-year savings. Free solar ROI calculator with local incentives, tax credits, and instant quotes from installers.',
  keywords: 'solar panel calculator, solar ROI, solar payback period, solar savings calculator, solar panel cost, solar incentives, federal tax credit, solar investment',
  openGraph: {
    title: 'Free Solar Panel ROI Calculator - Calculate Your Solar Savings',
    description: 'Discover how much you can save with solar panels. Get instant ROI calculations, payback periods, and free quotes from local installers.',
    type: 'website',
    url: 'https://yourdomain.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Solar Panel ROI Calculator'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Solar Panel ROI Calculator 2024',
    description: 'Calculate your solar panel investment return and 25-year savings in seconds.',
    images: ['/og-image.jpg']
  },
  alternates: {
    canonical: 'https://yourdomain.com'
  }
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="h-8 w-8 text-blue-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h1 className="text-xl font-bold text-gray-900">
                Solar ROI Calculator
              </h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#calculator" className="text-gray-700 hover:text-blue-600">
                Calculator
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600">
                How It Works
              </a>
              <a href="#benefits" className="text-gray-700 hover:text-blue-600">
                Benefits
              </a>
              <a href="#faq" className="text-gray-700 hover:text-blue-600">
                FAQ
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            How Much Can You Save with Solar?
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Calculate your solar panel ROI in 60 seconds. Get personalized savings estimates, payback periods, and free quotes from top-rated local installers.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">30%</div>
              <div className="text-sm text-gray-600">Federal Tax Credit</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">25</div>
              <div className="text-sm text-gray-600">Year Warranty</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">$50K+</div>
              <div className="text-sm text-gray-600">Avg. Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator">
        <SolarCalculator />
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How Our Calculator Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Your Info</h3>
              <p className="text-gray-600">
                Provide your location, roof size, and current energy bill. Takes less than 60 seconds.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Instant Results</h3>
              <p className="text-gray-600">
                See your estimated savings, ROI, payback period, and available incentives instantly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Free Quotes</h3>
              <p className="text-gray-600">
                Connect with pre-screened local installers for personalized quotes. No obligation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Solar Energy?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Save Money</h3>
              <p className="text-gray-600 text-sm">Reduce or eliminate your electricity bills</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Help Environment</h3>
              <p className="text-gray-600 text-sm">Reduce carbon footprint and pollution</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Increase Home Value</h3>
              <p className="text-gray-600 text-sm">Boost property value by 4-6%</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Energy Independence</h3>
              <p className="text-gray-600 text-sm">Protection from rising utility rates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Links Section */}
      <AffiliateLinks />

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <details className="bg-white p-6 rounded-lg shadow-md">
              <summary className="font-semibold text-lg cursor-pointer">
                How accurate is this solar calculator?
              </summary>
              <p className="mt-4 text-gray-600">
                Our calculator uses industry-standard formulas and real data for solar production, electricity rates, and incentives. However, results are estimates. For precise quotes, consult with local installers who can assess your specific property.
              </p>
            </details>
            <details className="bg-white p-6 rounded-lg shadow-md">
              <summary className="font-semibold text-lg cursor-pointer">
                What is the federal solar tax credit?
              </summary>
              <p className="mt-4 text-gray-600">
                The federal solar Investment Tax Credit (ITC) allows you to deduct 30% of your solar installation cost from your federal taxes. This applies to residential solar installations through 2032.
              </p>
            </details>
            <details className="bg-white p-6 rounded-lg shadow-md">
              <summary className="font-semibold text-lg cursor-pointer">
                How long do solar panels last?
              </summary>
              <p className="mt-4 text-gray-600">
                Most solar panels come with a 25-year warranty and can last 30+ years. They typically maintain 80-90% efficiency after 25 years, continuing to generate savings for decades.
              </p>
            </details>
            <details className="bg-white p-6 rounded-lg shadow-md">
              <summary className="font-semibold text-lg cursor-pointer">
                Do I need to replace my roof before installing solar?
              </summary>
              <p className="mt-4 text-gray-600">
                If your roof is in good condition with 10+ years of life remaining, you can install solar. If your roof needs replacement soon, it&apos;s best to do that first since removing and reinstalling panels adds cost.
              </p>
            </details>
            <details className="bg-white p-6 rounded-lg shadow-md">
              <summary className="font-semibold text-lg cursor-pointer">
                What happens during cloudy days or at night?
              </summary>
              <p className="mt-4 text-gray-600">
                Solar panels produce less energy on cloudy days but still generate power. At night, you draw power from the grid. With net metering, excess daytime production credits offset nighttime usage. Battery storage is also an option.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Solar ROI Calculator</h3>
              <p className="text-gray-400 text-sm">
                Free solar panel investment calculator with accurate ROI estimates and local installer quotes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#calculator" className="hover:text-white">Calculator</a></li>
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="#benefits" className="hover:text-white">Benefits</a></li>
                <li><a href="#faq" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/blog" className="hover:text-white">Solar Blog</a></li>
                <li><a href="/incentives" className="hover:text-white">State Incentives</a></li>
                <li><a href="/guides" className="hover:text-white">Installation Guides</a></li>
                <li><a href="/comparison" className="hover:text-white">Panel Comparison</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
                <li><a href="/disclaimer" className="hover:text-white">Disclaimer</a></li>
                <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Solar ROI Calculator. All rights reserved.</p>
            <p className="mt-2">
              Estimates are for informational purposes only. Consult with licensed solar professionals for accurate quotes.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

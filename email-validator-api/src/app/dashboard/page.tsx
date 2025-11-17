'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              EmailValidator
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/docs" className="text-gray-600 hover:text-blue-600">
                Documentation
              </Link>
              <button className="text-gray-600 hover:text-blue-600">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="bg-white rounded-lg shadow p-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === 'overview'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('api-keys')}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === 'api-keys'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                API Keys
              </button>
              <button
                onClick={() => setActiveTab('usage')}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === 'usage'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Usage
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === 'subscription'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Subscription
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === 'overview' && (
              <div>
                <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-1">This Month</div>
                    <div className="text-3xl font-bold">1,234</div>
                    <div className="text-sm text-gray-600">validations</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-1">Remaining</div>
                    <div className="text-3xl font-bold">3,766</div>
                    <div className="text-sm text-gray-600">validations</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-1">Plan</div>
                    <div className="text-3xl font-bold">Free</div>
                    <div className="text-sm text-blue-600 cursor-pointer">Upgrade</div>
                  </div>
                </div>

                {/* Quick Start */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Quick Start</h2>
                  <p className="text-gray-600 mb-4">
                    Get your API key and start validating emails in minutes.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                        1
                      </div>
                      <div>Copy your API key from the API Keys tab</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                        2
                      </div>
                      <div>Make your first API request</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                        3
                      </div>
                      <div>Check the documentation for more examples</div>
                    </div>
                  </div>
                  <Link
                    href="/docs"
                    className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    View Documentation
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'api-keys' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold">API Keys</h1>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Create New Key
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-center border-b pb-4">
                      <div>
                        <div className="font-semibold">Default API Key</div>
                        <code className="text-sm text-gray-600">evapi_****************************</code>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-700">Copy</button>
                        <button className="text-red-600 hover:text-red-700">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div>
                <h1 className="text-3xl font-bold mb-6">Usage Statistics</h1>

                <div className="bg-white p-6 rounded-lg shadow mb-6">
                  <h2 className="text-xl font-bold mb-4">Monthly Usage</h2>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Usage chart will be displayed here
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Recent Validations</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">user@example.com</span>
                      <span className="text-green-600">Valid</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">invalid@domain</span>
                      <span className="text-red-600">Invalid</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div>
                <h1 className="text-3xl font-bold mb-6">Subscription</h1>

                <div className="bg-white p-6 rounded-lg shadow mb-6">
                  <h2 className="text-xl font-bold mb-2">Current Plan: Free</h2>
                  <p className="text-gray-600 mb-4">100 validations per month</p>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Upgrade Plan
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-2">Starter - $29/mo</h3>
                    <p className="text-gray-600 mb-4">5,000 validations/month</p>
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Select Plan
                    </button>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow ring-2 ring-blue-600">
                    <div className="text-sm text-blue-600 font-semibold mb-2">POPULAR</div>
                    <h3 className="text-xl font-bold mb-2">Pro - $99/mo</h3>
                    <p className="text-gray-600 mb-4">25,000 validations/month</p>
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Select Plan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

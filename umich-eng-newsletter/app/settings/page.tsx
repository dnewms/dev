'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, Send, Key, CheckCircle, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const [activeProvider, setActiveProvider] = useState<'sendgrid' | 'mailchimp'>('sendgrid')
  const [sendgridKey, setSendgridKey] = useState('')
  const [mailchimpKey, setMailchimpKey] = useState('')
  const [mailchimpServer, setMailchimpServer] = useState('')

  const handleSaveSettings = () => {
    // In production, this would save to environment variables or a secure database
    localStorage.setItem('email_provider', activeProvider)
    if (activeProvider === 'sendgrid') {
      localStorage.setItem('sendgrid_key', sendgridKey)
    } else {
      localStorage.setItem('mailchimp_key', mailchimpKey)
      localStorage.setItem('mailchimp_server', mailchimpServer)
    }
    alert('Settings saved! Remember to add these to your .env file for production.')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-michigan-blue mb-2">Settings</h1>
        <p className="text-gray-600">Configure email delivery and integrations</p>
      </div>

      {/* Email Provider Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-michigan-blue mb-4 flex items-center gap-2">
          <Send className="w-5 h-5" />
          Email Delivery Provider
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setActiveProvider('sendgrid')}
            className={`p-6 rounded-lg border-2 transition-all ${
              activeProvider === 'sendgrid'
                ? 'border-michigan-blue bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-michigan-blue">SendGrid</h3>
              {activeProvider === 'sendgrid' && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
            <p className="text-sm text-gray-600">
              Reliable email delivery with detailed analytics and high deliverability
            </p>
          </button>

          <button
            onClick={() => setActiveProvider('mailchimp')}
            className={`p-6 rounded-lg border-2 transition-all ${
              activeProvider === 'mailchimp'
                ? 'border-michigan-blue bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-michigan-blue">Mailchimp</h3>
              {activeProvider === 'mailchimp' && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
            <p className="text-sm text-gray-600">
              All-in-one marketing platform with advanced automation features
            </p>
          </button>
        </div>

        {/* SendGrid Configuration */}
        {activeProvider === 'sendgrid' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-michigan-blue mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                SendGrid Setup Instructions
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>
                  Create a free account at{' '}
                  <a
                    href="https://signup.sendgrid.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-michigan-blue underline"
                  >
                    sendgrid.com
                  </a>
                </li>
                <li>Navigate to Settings → API Keys in your SendGrid dashboard</li>
                <li>Click "Create API Key" and select "Full Access"</li>
                <li>Copy the generated API key and paste it below</li>
                <li>Add your API key to your .env.local file as SENDGRID_API_KEY</li>
              </ol>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SendGrid API Key
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={sendgridKey}
                    onChange={(e) => setSendgridKey(e.target.value)}
                    placeholder="SG.xxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Your API key will be stored securely. Never commit this to version control.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Code Example:</h4>
              <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`// .env.local
SENDGRID_API_KEY=your_api_key_here

// lib/sendgrid.ts
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendNewsletter(to: string[], html: string) {
  const msg = {
    to,
    from: 'engineering@umich.edu',
    subject: 'U-M Engineering Newsletter',
    html,
  };
  return await sgMail.sendMultiple(msg);
}`}
              </pre>
            </div>
          </div>
        )}

        {/* Mailchimp Configuration */}
        {activeProvider === 'mailchimp' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-michigan-blue mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Mailchimp Setup Instructions
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>
                  Create a free account at{' '}
                  <a
                    href="https://mailchimp.com/signup/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-michigan-blue underline"
                  >
                    mailchimp.com
                  </a>
                </li>
                <li>Go to Account → Extras → API keys</li>
                <li>Click "Create A Key" to generate a new API key</li>
                <li>Copy your API key and server prefix (e.g., us1, us2)</li>
                <li>Add these to your .env.local file</li>
              </ol>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mailchimp API Key
              </label>
              <div className="flex-1 relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={mailchimpKey}
                  onChange={(e) => setMailchimpKey(e.target.value)}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxx-us1"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Server Prefix
              </label>
              <input
                type="text"
                value={mailchimpServer}
                onChange={(e) => setMailchimpServer(e.target.value)}
                placeholder="us1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Found at the end of your API key (e.g., us1, us2, us3)
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Code Example:</h4>
              <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`// .env.local
MAILCHIMP_API_KEY=your_api_key_here
MAILCHIMP_SERVER_PREFIX=us1

// lib/mailchimp.ts
import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export async function sendCampaign(listId: string, html: string) {
  const campaign = await mailchimp.campaigns.create({
    type: 'regular',
    recipients: { list_id: listId },
    settings: {
      subject_line: 'U-M Engineering Newsletter',
      from_name: 'U-M Engineering',
      reply_to: 'engineering@umich.edu',
    },
  });

  await mailchimp.campaigns.setContent(campaign.id, { html });
  return await mailchimp.campaigns.send(campaign.id);
}`}
              </pre>
            </div>
          </div>
        )}

        <button
          onClick={handleSaveSettings}
          className="w-full bg-michigan-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-michigan-arboretum-blue transition-colors"
        >
          Save Settings
        </button>
      </div>

      {/* Installation Instructions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-michigan-blue mb-4">Installation</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              1. Install Required Packages
            </h3>
            <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
              {activeProvider === 'sendgrid'
                ? 'npm install @sendgrid/mail'
                : 'npm install @mailchimp/mailchimp_marketing'}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              2. Create Environment Variables
            </h3>
            <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
              {activeProvider === 'sendgrid'
                ? 'SENDGRID_API_KEY=your_api_key_here'
                : `MAILCHIMP_API_KEY=your_api_key_here\nMAILCHIMP_SERVER_PREFIX=us1`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">3. Test Your Connection</h3>
            <p className="text-sm text-gray-600 mb-2">
              Use the "Send Test Email" button in the builder to verify your integration is working
              correctly.
            </p>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-michigan-blue mb-4">Additional Resources</h2>
        <div className="space-y-2 text-sm">
          <div>
            <strong>SendGrid Documentation:</strong>{' '}
            <a
              href="https://docs.sendgrid.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-michigan-blue underline"
            >
              docs.sendgrid.com
            </a>
          </div>
          <div>
            <strong>Mailchimp Documentation:</strong>{' '}
            <a
              href="https://mailchimp.com/developer/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-michigan-blue underline"
            >
              mailchimp.com/developer
            </a>
          </div>
          <div>
            <strong>Email Best Practices:</strong> Ensure your sender domain is verified and set up
            SPF/DKIM records for better deliverability
          </div>
        </div>
      </div>
    </div>
  )
}

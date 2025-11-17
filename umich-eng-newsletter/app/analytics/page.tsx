'use client'

import { useNewsletterStore } from '@/lib/store'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Mail, Eye, MousePointer, TrendingUp } from 'lucide-react'

export default function AnalyticsPage() {
  const { newsletters } = useNewsletterStore()

  const sentNewsletters = newsletters.filter(n => n.status === 'sent')

  // Calculate aggregate metrics
  const totalSent = sentNewsletters.reduce((sum, n) => sum + (n.analytics?.sent || 0), 0)
  const totalOpened = sentNewsletters.reduce((sum, n) => sum + (n.analytics?.opened || 0), 0)
  const totalClicked = sentNewsletters.reduce((sum, n) => sum + (n.analytics?.clicked || 0), 0)

  const avgOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : '0.0'
  const avgClickRate = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : '0.0'
  const avgClickToOpenRate = totalOpened > 0 ? ((totalClicked / totalOpened) * 100).toFixed(1) : '0.0'

  // Prepare chart data
  const chartData = sentNewsletters.map(n => ({
    name: n.title.substring(0, 20) + (n.title.length > 20 ? '...' : ''),
    sent: n.analytics?.sent || 0,
    opened: n.analytics?.opened || 0,
    clicked: n.analytics?.clicked || 0,
    openRate: n.analytics?.sent ? ((n.analytics.opened / n.analytics.sent) * 100).toFixed(1) : 0,
    clickRate: n.analytics?.sent ? ((n.analytics.clicked / n.analytics.sent) * 100).toFixed(1) : 0,
  }))

  // Time series data (last 6 newsletters)
  const timeSeriesData = sentNewsletters
    .slice(-6)
    .map(n => ({
      date: new Date(n.sentAt!).toLocaleDateString(),
      'Open Rate': n.analytics?.sent ? ((n.analytics.opened / n.analytics.sent) * 100).toFixed(1) : 0,
      'Click Rate': n.analytics?.sent ? ((n.analytics.clicked / n.analytics.sent) * 100).toFixed(1) : 0,
    }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-michigan-blue mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Track the performance of your newsletters</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<Mail className="w-6 h-6" />}
          label="Total Sent"
          value={totalSent.toLocaleString()}
          color="bg-blue-500"
        />
        <MetricCard
          icon={<Eye className="w-6 h-6" />}
          label="Avg. Open Rate"
          value={`${avgOpenRate}%`}
          color="bg-green-500"
        />
        <MetricCard
          icon={<MousePointer className="w-6 h-6" />}
          label="Avg. Click Rate"
          value={`${avgClickRate}%`}
          color="bg-purple-500"
        />
        <MetricCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Click-to-Open"
          value={`${avgClickToOpenRate}%`}
          color="bg-orange-500"
        />
      </div>

      {sentNewsletters.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Analytics Yet</h3>
          <p className="text-gray-500">
            Send your first newsletter to start tracking analytics
          </p>
        </div>
      ) : (
        <>
          {/* Engagement Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-michigan-blue mb-4">Engagement by Newsletter</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sent" fill="#00274C" name="Sent" />
                <Bar dataKey="opened" fill="#2F65A7" name="Opened" />
                <Bar dataKey="clicked" fill="#FFCB05" name="Clicked" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trends Over Time */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-michigan-blue mb-4">Engagement Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Open Rate" stroke="#00274C" strokeWidth={2} />
                <Line type="monotone" dataKey="Click Rate" stroke="#FFCB05" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Newsletter Performance Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-michigan-blue">Newsletter Performance</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                    Newsletter
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                    Sent Date
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                    Sent
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                    Opened
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                    Clicked
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                    Open Rate
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                    Click Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sentNewsletters.map((newsletter) => {
                  const sent = newsletter.analytics?.sent || 0
                  const opened = newsletter.analytics?.opened || 0
                  const clicked = newsletter.analytics?.clicked || 0
                  const openRate = sent > 0 ? ((opened / sent) * 100).toFixed(1) : '0.0'
                  const clickRate = sent > 0 ? ((clicked / sent) * 100).toFixed(1) : '0.0'

                  return (
                    <tr key={newsletter.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {newsletter.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(newsletter.sentAt!).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">
                        {sent.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">
                        {opened.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">
                        {clicked.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          parseFloat(openRate) > 25 ? 'bg-green-100 text-green-800' :
                          parseFloat(openRate) > 15 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {openRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          parseFloat(clickRate) > 5 ? 'bg-green-100 text-green-800' :
                          parseFloat(clickRate) > 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {clickRate}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Industry Benchmarks */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-michigan-blue mb-4">Industry Benchmarks</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Average Open Rate</div>
                <div className="text-2xl font-bold text-michigan-blue">21.5%</div>
                <div className="text-xs text-gray-500">Education Industry</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Average Click Rate</div>
                <div className="text-2xl font-bold text-michigan-blue">2.6%</div>
                <div className="text-xs text-gray-500">Education Industry</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Average Click-to-Open</div>
                <div className="text-2xl font-bold text-michigan-blue">12.1%</div>
                <div className="text-xs text-gray-500">Education Industry</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function MetricCard({ icon, label, value, color }: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-4">
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-michigan-blue">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useNewsletterStore } from '@/lib/store'
import { format } from 'date-fns'
import { Calendar, Eye, Mail, Search, Download, Trash2 } from 'lucide-react'

export default function ArchivePage() {
  const { newsletters, deleteNewsletter, setCurrentNewsletter } = useNewsletterStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'sent'>('all')

  const filteredNewsletters = newsletters
    .filter(n => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.subject.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = filterStatus === 'all' || n.status === filterStatus

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-michigan-blue mb-2">Newsletter Archive</h1>
        <p className="text-gray-600">Browse and manage all your newsletters</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search newsletters..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filterStatus === 'all'
                  ? 'bg-michigan-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filterStatus === 'draft'
                  ? 'bg-michigan-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Drafts
            </button>
            <button
              onClick={() => setFilterStatus('sent')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filterStatus === 'sent'
                  ? 'bg-michigan-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sent
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-3xl font-bold text-michigan-blue mb-1">
            {newsletters.length}
          </div>
          <div className="text-sm text-gray-600">Total Newsletters</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-3xl font-bold text-yellow-600 mb-1">
            {newsletters.filter(n => n.status === 'draft').length}
          </div>
          <div className="text-sm text-gray-600">Drafts</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {newsletters.filter(n => n.status === 'sent').length}
          </div>
          <div className="text-sm text-gray-600">Sent</div>
        </div>
      </div>

      {/* Newsletter Grid */}
      {filteredNewsletters.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Newsletters Found</h3>
          <p className="text-gray-500">
            {searchQuery
              ? 'Try adjusting your search or filter'
              : 'Create your first newsletter to get started'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNewsletters.map((newsletter) => (
            <NewsletterCard
              key={newsletter.id}
              newsletter={newsletter}
              onDelete={() => deleteNewsletter(newsletter.id)}
              onView={() => {
                setCurrentNewsletter(newsletter)
                window.location.href = '/builder'
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function NewsletterCard({ newsletter, onDelete, onView }: {
  newsletter: any
  onDelete: () => void
  onView: () => void
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-michigan-blue mb-1 line-clamp-1">
              {newsletter.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">{newsletter.subject}</p>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              newsletter.status === 'sent'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {newsletter.status}
          </span>
        </div>

        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {newsletter.status === 'sent' && newsletter.sentAt
                ? `Sent: ${format(new Date(newsletter.sentAt), 'MMM d, yyyy')}`
                : `Updated: ${format(new Date(newsletter.updatedAt), 'MMM d, yyyy')}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{newsletter.blocks.length} blocks</span>
          </div>
        </div>

        {newsletter.status === 'sent' && newsletter.analytics && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="font-bold text-michigan-blue">
                  {newsletter.analytics.sent}
                </div>
                <div className="text-gray-600">Sent</div>
              </div>
              <div>
                <div className="font-bold text-green-600">
                  {((newsletter.analytics.opened / newsletter.analytics.sent) * 100).toFixed(0)}%
                </div>
                <div className="text-gray-600">Opened</div>
              </div>
              <div>
                <div className="font-bold text-purple-600">
                  {((newsletter.analytics.clicked / newsletter.analytics.sent) * 100).toFixed(0)}%
                </div>
                <div className="text-gray-600">Clicked</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 bg-michigan-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-michigan-arboretum-blue transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {newsletter.status === 'draft' ? 'Edit' : 'View'}
          </button>
          <button
            onClick={onDelete}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

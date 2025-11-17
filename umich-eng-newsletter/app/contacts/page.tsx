'use client'

import { useState } from 'react'
import { useNewsletterStore, Contact } from '@/lib/store'
import { UserPlus, Upload, Download, Search, Tag, Trash2 } from 'lucide-react'

export default function ContactsPage() {
  const { contacts, addContact, updateContact, deleteContact, importContacts } = useNewsletterStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTag, setFilterTag] = useState<string | null>(null)

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.trim())

      const newContacts: Contact[] = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',').map(v => v.trim())
          return {
            id: Math.random().toString(36).substr(2, 9),
            email: values[headers.indexOf('email')] || '',
            firstName: values[headers.indexOf('firstName')] || '',
            lastName: values[headers.indexOf('lastName')] || '',
            tags: values[headers.indexOf('tags')]?.split(';') || [],
            subscribedAt: new Date().toISOString(),
          }
        })

      importContacts(newContacts)
      alert(`Imported ${newContacts.length} contacts!`)
    }
    reader.readAsText(file)
  }

  const handleExportCSV = () => {
    const csv = [
      'email,firstName,lastName,tags,subscribedAt',
      ...contacts.map(c =>
        `${c.email},${c.firstName},${c.lastName},${c.tags.join(';')},${c.subscribedAt}`
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contacts.csv'
    a.click()
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTag = !filterTag || contact.tags.includes(filterTag)

    return matchesSearch && matchesTag
  })

  const allTags = Array.from(new Set(contacts.flatMap(c => c.tags)))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-michigan-blue mb-2">Email Contacts</h1>
          <p className="text-gray-600">{contacts.length} total contacts</p>
        </div>
        <div className="flex gap-2">
          <label className="cursor-pointer bg-white text-michigan-blue border-2 border-michigan-blue px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </label>
          <button
            onClick={handleExportCSV}
            className="bg-white text-michigan-blue border-2 border-michigan-blue px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-michigan-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-michigan-arboretum-blue transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterTag(null)}
              className={`px-3 py-1 rounded-full text-sm ${
                !filterTag
                  ? 'bg-michigan-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  filterTag === tag
                    ? 'bg-michigan-blue text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                Email
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                Name
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                Tags
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                Subscribed
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredContacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{contact.email}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {contact.firstName} {contact.lastName}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {contact.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-michigan-wave-blue/20 text-michigan-blue text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(contact.subscribedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No contacts found
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <AddContactModal
          onClose={() => setShowAddModal(false)}
          onAdd={(contact) => {
            addContact(contact)
            setShowAddModal(false)
          }}
        />
      )}
    </div>
  )
}

function AddContactModal({ onClose, onAdd }: {
  onClose: () => void
  onAdd: (contact: Contact) => void
}) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    tags: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      subscribedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-michigan-blue mb-4">Add New Contact</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="student, alumni, faculty"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-michigan-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-michigan-arboretum-blue transition-colors"
            >
              Add Contact
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useNewsletterStore } from '@/lib/store'
import { Send, Save, Eye } from 'lucide-react'

export default function BuilderPreview() {
  const { currentNewsletter } = useNewsletterStore()

  const handleSave = () => {
    if (currentNewsletter) {
      // In a real app, this would save to a database
      localStorage.setItem('newsletters', JSON.stringify(useNewsletterStore.getState().newsletters))
      alert('Newsletter saved!')
    }
  }

  const handleSend = () => {
    alert('In production, this would integrate with SendGrid/Mailchimp to send the newsletter.')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-bold text-lg text-michigan-blue flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Preview
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-gray-50 rounded-lg p-4 space-y-4 text-xs">
          {currentNewsletter?.blocks.map((block) => (
            <div key={block.id} className="bg-white p-3 rounded shadow-sm">
              <div className="font-semibold text-gray-500 mb-2 uppercase text-[10px]">
                {block.type}
              </div>
              <EmailBlockPreview block={block} />
            </div>
          ))}

          {currentNewsletter?.blocks.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No blocks added yet
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={handleSave}
          className="w-full bg-michigan-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-michigan-arboretum-blue transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Draft
        </button>
        <button
          onClick={handleSend}
          className="w-full bg-michigan-maize text-michigan-blue px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send Newsletter
        </button>
      </div>
    </div>
  )
}

function EmailBlockPreview({ block }: { block: any }) {
  switch (block.type) {
    case 'header':
      return <div className="font-bold text-sm">{block.content.title}</div>

    case 'text':
      return <div className="text-gray-700">{block.content.text}</div>

    case 'image':
      return block.content.imageUrl ? (
        <div className="bg-gray-200 h-16 rounded flex items-center justify-center text-[10px]">
          IMAGE
        </div>
      ) : (
        <div className="bg-gray-100 h-16 rounded flex items-center justify-center text-[10px]">
          No image
        </div>
      )

    case 'button':
      return (
        <div className="bg-blue-600 text-white px-3 py-1 rounded text-center">
          {block.content.buttonText}
        </div>
      )

    case 'divider':
      return <hr className="border-t border-gray-300" />

    case 'event':
      return (
        <div>
          <div className="font-bold">{block.content.title}</div>
          <div className="text-gray-600">{block.content.date} | {block.content.location}</div>
        </div>
      )

    case 'research':
      return (
        <div className="bg-blue-50 p-2 rounded">
          <div className="font-bold">{block.content.title}</div>
          <div className="text-gray-600">{block.content.researcher}</div>
        </div>
      )

    case 'achievement':
      return (
        <div className="bg-yellow-50 p-2 rounded">
          <div className="font-bold">{block.content.title}</div>
          <div className="text-gray-600">{block.content.student}</div>
        </div>
      )

    default:
      return <div>Unknown block</div>
  }
}

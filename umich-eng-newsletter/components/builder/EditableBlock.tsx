'use client'

import { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { ContentBlock, useNewsletterStore } from '@/lib/store'
import { Trash2, GripVertical, Edit2, Check } from 'lucide-react'

interface EditableBlockProps {
  block: ContentBlock
  index: number
}

export default function EditableBlock({ block, index }: EditableBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const { updateBlock, deleteBlock, reorderBlocks } = useNewsletterStore()

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'block',
    item: { id: block.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const [, drop] = useDrop(() => ({
    accept: 'block',
    hover: (item: { id: string; index: number }) => {
      if (item.index !== index) {
        reorderBlocks(item.index, index)
        item.index = index
      }
    },
  }))

  const handleUpdate = (content: Partial<ContentBlock['content']>) => {
    updateBlock(block.id, content)
  }

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`group relative bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-michigan-blue transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {/* Block Controls */}
      <div className="absolute -left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 cursor-move">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="absolute -right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50"
        >
          {isEditing ? <Check className="w-4 h-4 text-green-600" /> : <Edit2 className="w-4 h-4 text-gray-600" />}
        </button>
        <button
          onClick={() => deleteBlock(block.id)}
          className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>

      {/* Block Content */}
      <div className="p-4">
        {isEditing ? (
          <BlockEditor block={block} onUpdate={handleUpdate} />
        ) : (
          <BlockPreview block={block} />
        )}
      </div>
    </div>
  )
}

function BlockEditor({ block, onUpdate }: { block: ContentBlock; onUpdate: (content: Partial<ContentBlock['content']>) => void }) {
  switch (block.type) {
    case 'header':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={block.content.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Header text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
          />
          <select
            value={block.content.alignment || 'center'}
            onChange={(e) => onUpdate({ alignment: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      )

    case 'text':
      return (
        <div className="space-y-2">
          <textarea
            value={block.content.text || ''}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Text content"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
          />
          <select
            value={block.content.alignment || 'left'}
            onChange={(e) => onUpdate({ alignment: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      )

    case 'image':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={block.content.imageUrl || ''}
            onChange={(e) => onUpdate({ imageUrl: e.target.value })}
            placeholder="Image URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
          />
        </div>
      )

    case 'button':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={block.content.buttonText || ''}
            onChange={(e) => onUpdate({ buttonText: e.target.value })}
            placeholder="Button text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
          />
          <input
            type="text"
            value={block.content.buttonUrl || ''}
            onChange={(e) => onUpdate({ buttonUrl: e.target.value })}
            placeholder="Button URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
          />
        </div>
      )

    case 'event':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={block.content.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Event title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
          />
          <input
            type="date"
            value={block.content.date || ''}
            onChange={(e) => onUpdate({ date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
          />
          <input
            type="text"
            value={block.content.location || ''}
            onChange={(e) => onUpdate({ location: e.target.value })}
            placeholder="Location"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
          />
          <textarea
            value={block.content.text || ''}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Event description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
          />
        </div>
      )

    case 'research':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={block.content.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Research title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
          />
          <input
            type="text"
            value={block.content.researcher || ''}
            onChange={(e) => onUpdate({ researcher: e.target.value })}
            placeholder="Researcher name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
          />
          <textarea
            value={block.content.text || ''}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Research description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
          />
        </div>
      )

    case 'achievement':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={block.content.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Achievement title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
          />
          <input
            type="text"
            value={block.content.student || ''}
            onChange={(e) => onUpdate({ student: e.target.value })}
            placeholder="Student name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
          />
          <textarea
            value={block.content.text || ''}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Achievement description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-michigan-blue focus:border-transparent"
          />
        </div>
      )

    default:
      return <div>Unsupported block type</div>
  }
}

function BlockPreview({ block }: { block: ContentBlock }) {
  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[block.content.alignment || 'left']

  switch (block.type) {
    case 'header':
      return <h2 className={`text-3xl font-bold text-michigan-blue ${alignmentClass}`}>{block.content.title}</h2>

    case 'text':
      return <p className={`text-gray-700 ${alignmentClass}`}>{block.content.text}</p>

    case 'image':
      return block.content.imageUrl ? (
        <img src={block.content.imageUrl} alt="Content" className="max-w-full h-auto rounded" />
      ) : (
        <div className="bg-gray-200 h-48 rounded flex items-center justify-center text-gray-400">
          No image URL provided
        </div>
      )

    case 'button':
      return (
        <div className={alignmentClass}>
          <button className="bg-michigan-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-michigan-arboretum-blue">
            {block.content.buttonText}
          </button>
        </div>
      )

    case 'divider':
      return <hr className="border-t-2 border-gray-300 my-4" />

    case 'event':
      return (
        <div className="border-l-4 border-michigan-taubman-teal pl-4">
          <h3 className="text-xl font-bold text-michigan-blue mb-2">{block.content.title}</h3>
          <div className="text-sm text-gray-600 mb-1">
            <strong>Date:</strong> {block.content.date}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            <strong>Location:</strong> {block.content.location}
          </div>
          <p className="text-gray-700">{block.content.text}</p>
        </div>
      )

    case 'research':
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-xl font-bold text-michigan-blue mb-2">{block.content.title}</h3>
          <div className="text-sm font-semibold text-gray-700 mb-2">
            By {block.content.researcher}
          </div>
          <p className="text-gray-700">{block.content.text}</p>
        </div>
      )

    case 'achievement':
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-xl font-bold text-michigan-blue mb-2">{block.content.title}</h3>
          <div className="text-sm font-semibold text-gray-700 mb-2">
            {block.content.student}
          </div>
          <p className="text-gray-700">{block.content.text}</p>
        </div>
      )

    default:
      return <div>Unsupported block type</div>
  }
}

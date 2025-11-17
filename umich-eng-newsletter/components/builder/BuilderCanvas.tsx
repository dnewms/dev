'use client'

import { useDrop } from 'react-dnd'
import { useNewsletterStore, BlockType, ContentBlock } from '@/lib/store'
import EditableBlock from './EditableBlock'
import { Plus } from 'lucide-react'

const generateId = () => Math.random().toString(36).substr(2, 9)

export default function BuilderCanvas() {
  const { currentNewsletter, addBlock, reorderBlocks } = useNewsletterStore()

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'block',
    drop: (item: { type: BlockType; id?: string; index?: number }) => {
      if (!item.id) {
        // New block being added
        const newBlock: ContentBlock = {
          id: generateId(),
          type: item.type,
          content: getDefaultContent(item.type),
        }
        addBlock(newBlock)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  const blocks = currentNewsletter?.blocks || []

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <input
          type="text"
          value={currentNewsletter?.title || ''}
          onChange={(e) => {
            if (currentNewsletter) {
              useNewsletterStore.getState().updateNewsletter({
                ...currentNewsletter,
                title: e.target.value,
              })
            }
          }}
          placeholder="Newsletter Title"
          className="text-2xl font-bold text-michigan-blue w-full border-none focus:outline-none focus:ring-0"
        />
        <input
          type="text"
          value={currentNewsletter?.subject || ''}
          onChange={(e) => {
            if (currentNewsletter) {
              useNewsletterStore.getState().updateNewsletter({
                ...currentNewsletter,
                subject: e.target.value,
              })
            }
          }}
          placeholder="Email Subject Line"
          className="text-sm text-gray-600 w-full border-none focus:outline-none focus:ring-0 mt-2"
        />
      </div>

      <div
        ref={drop}
        className={`p-6 min-h-[400px] ${isOver ? 'bg-blue-50' : ''}`}
      >
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Plus className="w-16 h-16 mb-4" />
            <p className="text-lg font-semibold">Drag blocks here to start building</p>
            <p className="text-sm">Your newsletter canvas is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <EditableBlock
                key={block.id}
                block={block}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getDefaultContent(type: BlockType) {
  switch (type) {
    case 'header':
      return { title: 'Header Title', alignment: 'center' as const }
    case 'text':
      return { text: 'Add your text content here...', alignment: 'left' as const }
    case 'image':
      return { imageUrl: '', alignment: 'center' as const }
    case 'button':
      return { buttonText: 'Click Here', buttonUrl: '#', alignment: 'center' as const }
    case 'divider':
      return {}
    case 'event':
      return {
        title: 'Event Title',
        date: new Date().toISOString().split('T')[0],
        location: 'Event Location',
        text: 'Event description goes here...',
      }
    case 'research':
      return {
        title: 'Research Title',
        researcher: 'Researcher Name',
        text: 'Research highlight description...',
      }
    case 'achievement':
      return {
        title: 'Achievement Title',
        student: 'Student Name',
        text: 'Achievement description...',
      }
    default:
      return {}
  }
}

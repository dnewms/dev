'use client'

import { useDrag } from 'react-dnd'
import { Type, Image, MousePointer, Minus, Calendar, FlaskConical, Award } from 'lucide-react'
import { BlockType } from '@/lib/store'

const blockTypes = [
  { type: 'header' as BlockType, label: 'Header', icon: Type, color: 'bg-blue-500' },
  { type: 'text' as BlockType, label: 'Text Block', icon: Type, color: 'bg-gray-500' },
  { type: 'image' as BlockType, label: 'Image', icon: Image, color: 'bg-green-500' },
  { type: 'button' as BlockType, label: 'Button', icon: MousePointer, color: 'bg-yellow-500' },
  { type: 'divider' as BlockType, label: 'Divider', icon: Minus, color: 'bg-gray-400' },
  { type: 'event' as BlockType, label: 'Event', icon: Calendar, color: 'bg-purple-500' },
  { type: 'research' as BlockType, label: 'Research Highlight', icon: FlaskConical, color: 'bg-teal-500' },
  { type: 'achievement' as BlockType, label: 'Student Achievement', icon: Award, color: 'bg-orange-500' },
]

function DraggableBlock({ type, label, icon: Icon, color }: {
  type: BlockType
  label: string
  icon: any
  color: string
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'block',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`p-4 bg-white rounded-lg border-2 border-gray-200 cursor-move hover:border-michigan-blue transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center text-white`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-gray-900">{label}</div>
        </div>
      </div>
    </div>
  )
}

export default function BuilderSidebar() {
  return (
    <div className="bg-gray-50 rounded-xl p-4 h-full overflow-y-auto">
      <h2 className="font-bold text-lg text-michigan-blue mb-4">Blocks</h2>
      <div className="space-y-3">
        {blockTypes.map((block) => (
          <DraggableBlock key={block.type} {...block} />
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-sm text-gray-700 mb-3">Tips</h3>
        <ul className="text-xs text-gray-600 space-y-2">
          <li>• Drag blocks to the canvas</li>
          <li>• Click blocks to edit content</li>
          <li>• Reorder by dragging blocks</li>
          <li>• Preview updates in real-time</li>
        </ul>
      </div>
    </div>
  )
}

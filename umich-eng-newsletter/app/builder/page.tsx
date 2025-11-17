'use client'

import { useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useNewsletterStore } from '@/lib/store'
import BuilderSidebar from '@/components/builder/BuilderSidebar'
import BuilderCanvas from '@/components/builder/BuilderCanvas'
import BuilderPreview from '@/components/builder/BuilderPreview'

export default function BuilderPage() {
  const { currentNewsletter, createNewsletter } = useNewsletterStore()

  useEffect(() => {
    if (!currentNewsletter) {
      createNewsletter()
    }
  }, [currentNewsletter, createNewsletter])

  if (!currentNewsletter) {
    return <div>Loading...</div>
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-[calc(100vh-12rem)]">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-michigan-blue">Newsletter Builder</h1>
          <p className="text-gray-600">Drag and drop blocks to build your newsletter</p>
        </div>

        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Sidebar with blocks */}
          <div className="col-span-3">
            <BuilderSidebar />
          </div>

          {/* Canvas */}
          <div className="col-span-6">
            <BuilderCanvas />
          </div>

          {/* Preview */}
          <div className="col-span-3">
            <BuilderPreview />
          </div>
        </div>
      </div>
    </DndProvider>
  )
}

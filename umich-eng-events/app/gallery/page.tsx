"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Image as ImageIcon, Upload, Calendar, X } from 'lucide-react'

interface Photo {
  id: string
  eventId: string
  eventTitle: string
  url: string
  caption: string
  uploadedAt: string
}

const mockPhotos: Photo[] = [
  {
    id: '1',
    eventId: '1',
    eventTitle: 'AI & Robotics Symposium',
    url: 'https://placehold.co/600x400/00274C/FFCB05?text=AI+Robotics+1',
    caption: 'Keynote presentation on machine learning',
    uploadedAt: '2024-11-15T14:30:00'
  },
  {
    id: '2',
    eventId: '1',
    eventTitle: 'AI & Robotics Symposium',
    url: 'https://placehold.co/600x400/00274C/FFCB05?text=AI+Robotics+2',
    caption: 'Student project demonstrations',
    uploadedAt: '2024-11-15T15:00:00'
  },
  {
    id: '3',
    eventId: '2',
    eventTitle: 'Career Fair 2024',
    url: 'https://placehold.co/600x400/00274C/FFCB05?text=Career+Fair+1',
    caption: 'Students networking with employers',
    uploadedAt: '2024-11-10T11:00:00'
  },
  {
    id: '4',
    eventId: '2',
    eventTitle: 'Career Fair 2024',
    url: 'https://placehold.co/600x400/00274C/FFCB05?text=Career+Fair+2',
    caption: 'Company booths and presentations',
    uploadedAt: '2024-11-10T12:00:00'
  },
  {
    id: '5',
    eventId: '3',
    eventTitle: 'Student Project Showcase',
    url: 'https://placehold.co/600x400/00274C/FFCB05?text=Project+Showcase+1',
    caption: 'Engineering design projects',
    uploadedAt: '2024-11-05T16:00:00'
  },
  {
    id: '6',
    eventId: '3',
    eventTitle: 'Student Project Showcase',
    url: 'https://placehold.co/600x400/00274C/FFCB05?text=Project+Showcase+2',
    caption: 'Awards ceremony',
    uploadedAt: '2024-11-05T17:00:00'
  },
]

export default function GalleryPage() {
  const [photos] = useState<Photo[]>(mockPhotos)
  const [selectedEvent, setSelectedEvent] = useState<string>('all')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const events = Array.from(new Set(photos.map(p => p.eventTitle)))
  
  const filteredPhotos = selectedEvent === 'all'
    ? photos
    : photos.filter(p => p.eventTitle === selectedEvent)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-michigan-blue">Photo Gallery</h1>
          <p className="text-gray-600 mt-1">Browse photos from past engineering events</p>
        </div>
        <Button className="bg-michigan-blue hover:bg-michigan-blue/90">
          <Upload className="h-4 w-4 mr-2" />
          Upload Photos
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter by Event</CardTitle>
          <CardDescription>Select an event to view its photos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedEvent === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedEvent('all')}
              className={selectedEvent === 'all' ? 'bg-michigan-blue hover:bg-michigan-blue/90' : ''}
            >
              All Events ({photos.length})
            </Button>
            {events.map((event) => (
              <Button
                key={event}
                variant={selectedEvent === event ? 'default' : 'outline'}
                onClick={() => setSelectedEvent(event)}
                className={selectedEvent === event ? 'bg-michigan-blue hover:bg-michigan-blue/90' : ''}
              >
                {event} ({photos.filter(p => p.eventTitle === event).length})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <Card
            key={photo.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="relative aspect-video bg-gray-100">
              <Image
                src={photo.url}
                alt={photo.caption}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Badge className="bg-michigan-blue text-white">
                  {photo.eventTitle}
                </Badge>
                <p className="text-sm font-medium">{photo.caption}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(photo.uploadedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 bg-white hover:bg-gray-100"
                onClick={() => setSelectedPhoto(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                width={1200}
                height={800}
                className="w-full h-auto"
              />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Badge className="bg-michigan-blue text-white mb-2">
                  {selectedPhoto.eventTitle}
                </Badge>
                <h2 className="text-2xl font-bold">{selectedPhoto.caption}</h2>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                Uploaded on {new Date(selectedPhoto.uploadedAt).toLocaleDateString()} at{' '}
                {new Date(selectedPhoto.uploadedAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredPhotos.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-600">No photos found for this event</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

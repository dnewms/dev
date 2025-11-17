"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { QrCode as QrCodeIcon, CheckCircle, Search } from 'lucide-react'
import QRCode from 'react-qr-code'

interface Registration {
  id: string
  name: string
  email: string
  eventTitle: string
  qrCode: string
  checkedIn: boolean
  checkedInAt?: string
}

const mockRegistrations: Registration[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'jsmith@umich.edu',
    eventTitle: 'AI & Robotics Symposium',
    qrCode: 'REG-001-AIROBOSYM',
    checkedIn: false
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarahj@umich.edu',
    eventTitle: 'AI & Robotics Symposium',
    qrCode: 'REG-002-AIROBOSYM',
    checkedIn: true,
    checkedInAt: '2024-11-17T14:30:00'
  },
]

export default function CheckInPage() {
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null)

  const handleCheckIn = (id: string) => {
    setRegistrations(registrations.map(reg =>
      reg.id === id
        ? { ...reg, checkedIn: true, checkedInAt: new Date().toISOString() }
        : reg
    ))
  }

  const filteredRegistrations = registrations.filter(reg =>
    reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.qrCode.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-michigan-blue">QR Code Check-In</h1>
        <p className="text-gray-600 mt-1">Scan QR codes or manually check in attendees</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Search & Check-In</CardTitle>
            <CardDescription>Find and check in attendees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search by name, email, or QR code</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search registrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedReg(reg)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{reg.name}</p>
                      <p className="text-sm text-gray-600">{reg.email}</p>
                      <p className="text-xs text-gray-500 mt-1">{reg.eventTitle}</p>
                    </div>
                    {reg.checkedIn ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Checked In
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCheckIn(reg.id)
                        }}
                        className="bg-michigan-blue hover:bg-michigan-blue/90"
                      >
                        Check In
                      </Button>
                    )}
                  </div>
                  {reg.checkedIn && reg.checkedInAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Checked in at {new Date(reg.checkedInAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>QR Code Preview</CardTitle>
            <CardDescription>
              {selectedReg ? 'Attendee QR Code' : 'Select a registration to view QR code'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedReg ? (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border-2 border-michigan-blue flex justify-center">
                  <QRCode value={selectedReg.qrCode} size={200} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm">{selectedReg.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">{selectedReg.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Event:</span>
                    <span className="text-sm">{selectedReg.eventTitle}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">QR Code:</span>
                    <span className="text-sm font-mono">{selectedReg.qrCode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    {selectedReg.checkedIn ? (
                      <Badge className="bg-green-100 text-green-800">Checked In</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">Not Checked In</Badge>
                    )}
                  </div>
                </div>
                {!selectedReg.checkedIn && (
                  <Button
                    className="w-full bg-michigan-blue hover:bg-michigan-blue/90"
                    onClick={() => handleCheckIn(selectedReg.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Check In Now
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <QrCodeIcon className="h-16 w-16 mb-4" />
                <p>Select a registration to view QR code</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Check-In Statistics</CardTitle>
          <CardDescription>Today&apos;s check-in summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-michigan-blue">{registrations.length}</p>
              <p className="text-sm text-gray-600">Total Registrations</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {registrations.filter(r => r.checkedIn).length}
              </p>
              <p className="text-sm text-gray-600">Checked In</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">
                {registrations.filter(r => !r.checkedIn).length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

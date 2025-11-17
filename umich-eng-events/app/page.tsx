"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Calendar, Users, TrendingUp, Image } from 'lucide-react'

const analyticsData = [
  { month: 'Jan', events: 4, attendees: 240 },
  { month: 'Feb', events: 6, attendees: 380 },
  { month: 'Mar', events: 5, attendees: 320 },
  { month: 'Apr', events: 8, attendees: 520 },
  { month: 'May', events: 7, attendees: 450 },
  { month: 'Jun', events: 9, attendees: 610 },
]

const stats = [
  {
    title: "Total Events",
    value: "39",
    change: "+12% from last month",
    icon: Calendar,
    color: "bg-michigan-blue"
  },
  {
    title: "Total Attendees",
    value: "2,520",
    change: "+18% from last month",
    icon: Users,
    color: "bg-michigan-blue"
  },
  {
    title: "Avg. Attendance",
    value: "65",
    change: "+5% from last month",
    icon: TrendingUp,
    color: "bg-michigan-blue"
  },
  {
    title: "Photo Gallery",
    value: "842",
    change: "New photos this month",
    icon: Image,
    color: "bg-michigan-blue"
  },
]

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-michigan-blue">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your engineering events performance</p>
        </div>
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={stat.color + " p-2 rounded-md"}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Events Per Month</CardTitle>
            <CardDescription>Number of events hosted each month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="events" fill="#00274C" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend</CardTitle>
            <CardDescription>Total attendees over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attendees" stroke="#FFCB05" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>Your latest engineering department events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'AI & Robotics Symposium', date: '2024-11-20', attendees: 156, status: 'Upcoming' },
              { name: 'Career Fair 2024', date: '2024-11-15', attendees: 340, status: 'Completed' },
              { name: 'Student Project Showcase', date: '2024-11-10', attendees: 98, status: 'Completed' },
              { name: 'Industry Panel Discussion', date: '2024-11-05', attendees: 76, status: 'Completed' },
            ].map((event, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div>
                  <p className="font-medium">{event.name}</p>
                  <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">{event.attendees} attendees</div>
                  <div className={"px-3 py-1 rounded-full text-xs font-medium " + (event.status === 'Upcoming' ? 'bg-michigan-maize text-black' : 'bg-green-100 text-green-800')}>
                    {event.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

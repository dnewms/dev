'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Eye, Heart, Share2, MessageCircle } from 'lucide-react';

const engagementData = [
  { name: 'Mon', Twitter: 400, LinkedIn: 240, Instagram: 320 },
  { name: 'Tue', Twitter: 300, LinkedIn: 380, Instagram: 420 },
  { name: 'Wed', Twitter: 600, LinkedIn: 300, Instagram: 380 },
  { name: 'Thu', Twitter: 800, LinkedIn: 420, Instagram: 500 },
  { name: 'Fri', Twitter: 500, LinkedIn: 380, Instagram: 450 },
  { name: 'Sat', Twitter: 300, LinkedIn: 200, Instagram: 550 },
  { name: 'Sun', Twitter: 350, LinkedIn: 180, Instagram: 480 },
];

const platformData = [
  { name: 'Twitter', value: 3250, color: '#1DA1F2' },
  { name: 'LinkedIn', value: 2100, color: '#0A66C2' },
  { name: 'Instagram', value: 3100, color: '#E4405F' },
];

const performanceData = [
  { month: 'Sep', impressions: 45000, engagements: 3200 },
  { month: 'Oct', impressions: 52000, engagements: 3800 },
  { month: 'Nov', impressions: 48000, engagements: 4100 },
];

const topPosts = [
  {
    id: 1,
    content: 'Congratulations to our students who won first place...',
    platform: 'Twitter',
    impressions: 15420,
    engagements: 892,
    engagement_rate: 5.8,
  },
  {
    id: 2,
    content: 'Exciting research breakthrough in autonomous systems...',
    platform: 'LinkedIn',
    impressions: 12350,
    engagements: 756,
    engagement_rate: 6.1,
  },
  {
    id: 3,
    content: 'Join us for our upcoming webinar on sustainable...',
    platform: 'Instagram',
    impressions: 10890,
    engagements: 634,
    engagement_rate: 5.8,
  },
];

export function AnalyticsDashboard() {
  const totalImpressions = 145000;
  const totalEngagements = 11100;
  const avgEngagementRate = 7.7;
  const followerGrowth = 12.5;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-umich-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-umich-blue">
              {totalImpressions.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Engagements</CardTitle>
            <Heart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-umich-blue">
              {totalEngagements.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Engagement Rate</CardTitle>
            <Share2 className="h-4 w-4 text-umich-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-umich-blue">{avgEngagementRate}%</div>
            <p className="text-xs text-red-600 flex items-center mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              -1.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follower Growth</CardTitle>
            <MessageCircle className="h-4 w-4 text-umich-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-umich-blue">+{followerGrowth}%</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Engagement by Platform</CardTitle>
              <CardDescription>
                Total engagements across all platforms this week
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Twitter" fill="#1DA1F2" />
                  <Bar dataKey="LinkedIn" fill="#0A66C2" />
                  <Bar dataKey="Instagram" fill="#E4405F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Distribution</CardTitle>
                <CardDescription>Total engagements by platform</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Breakdown</CardTitle>
                <CardDescription>Detailed statistics by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformData.map((platform) => (
                    <div key={platform.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: platform.color }}
                        />
                        <span className="font-medium">{platform.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-umich-blue">
                          {platform.value.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">engagements</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Impressions and engagements over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="impressions"
                    stroke="#00274C"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="engagements"
                    stroke="#FFCB05"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Performing Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
          <CardDescription>Your best content from the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div
                key={post.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary">{post.platform}</Badge>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{post.content}</p>
                  <div className="flex space-x-4 text-xs text-gray-600">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {post.impressions.toLocaleString()} impressions
                    </span>
                    <span className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {post.engagements.toLocaleString()} engagements
                    </span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-lg font-bold text-umich-blue">
                    {post.engagement_rate}%
                  </div>
                  <div className="text-xs text-gray-500">engagement rate</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

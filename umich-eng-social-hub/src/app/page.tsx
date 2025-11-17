import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Send, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { mockPosts } from '@/data/mockData';
import Link from 'next/link';

export default function DashboardPage() {
  const scheduledPosts = mockPosts.filter(p => p.status === 'scheduled').length;
  const pendingApproval = mockPosts.filter(p => p.status === 'pending_approval').length;
  const publishedThisWeek = mockPosts.filter(p => p.status === 'published').length;
  const draftPosts = mockPosts.filter(p => p.status === 'draft').length;

  const recentPosts = mockPosts.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-umich-blue">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome to UMich Engineering Social Hub
          </p>
        </div>
        <Link href="/scheduler">
          <Button className="flex items-center space-x-2">
            <Send className="h-4 w-4" />
            <span>Create Post</span>
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
            <Clock className="h-4 w-4 text-umich-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-umich-blue">{scheduledPosts}</div>
            <p className="text-xs text-muted-foreground">
              Ready to publish
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <AlertCircle className="h-4 w-4 text-umich-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-umich-blue">{pendingApproval}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published This Week</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-umich-blue">{publishedThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Successfully posted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Posts</CardTitle>
            <TrendingUp className="h-4 w-4 text-umich-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-umich-blue">{draftPosts}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your social media</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/calendar">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </Link>
            <Link href="/scheduler">
              <Button variant="outline" className="w-full justify-start">
                <Send className="mr-2 h-4 w-4" />
                Schedule Post
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest social media posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {post.platforms.map((platform) => (
                      <Badge key={platform} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                    <Badge
                      variant={
                        post.status === 'published'
                          ? 'success'
                          : post.status === 'scheduled'
                          ? 'info'
                          : post.status === 'pending_approval'
                          ? 'warning'
                          : 'default'
                      }
                      className="text-xs"
                    >
                      {post.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    By {post.createdBy} • {post.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

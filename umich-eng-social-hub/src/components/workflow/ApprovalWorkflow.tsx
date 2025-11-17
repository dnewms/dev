'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, Eye, User } from 'lucide-react';
import { SocialPost } from '@/types';

interface ApprovalWorkflowProps {
  posts: SocialPost[];
}

export function ApprovalWorkflow({ posts }: ApprovalWorkflowProps) {
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pendingPosts = posts.filter((post) => post.status === 'pending_approval');

  const handleApprove = (postId: string) => {
    console.log('Approving post:', postId, 'Comments:', reviewComments);
    alert('Post approved successfully!');
    setIsDialogOpen(false);
    setReviewComments('');
  };

  const handleReject = (postId: string) => {
    console.log('Rejecting post:', postId, 'Comments:', reviewComments);
    alert('Post rejected. Creator will be notified.');
    setIsDialogOpen(false);
    setReviewComments('');
  };

  const openReviewDialog = (post: SocialPost) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'bg-blue-100 text-blue-800';
      case 'linkedin':
        return 'bg-blue-200 text-blue-900';
      case 'instagram':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-umich-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-umich-blue">{pendingPosts.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting your approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved This Week</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-umich-blue">12</div>
            <p className="text-xs text-muted-foreground">Posts approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Review Time</CardTitle>
            <Eye className="h-4 w-4 text-umich-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-umich-blue">2.5h</div>
            <p className="text-xs text-muted-foreground">Typical turnaround</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Review and approve posts before they go live</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingPosts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
              <p className="text-gray-600 font-medium">All caught up!</p>
              <p className="text-sm text-gray-500 mt-1">
                No posts pending approval at the moment
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        {post.platforms.map((platform) => (
                          <Badge
                            key={platform}
                            className={getPlatformColor(platform)}
                            variant="secondary"
                          >
                            {platform}
                          </Badge>
                        ))}
                        <Badge variant="warning" className="text-xs">
                          Pending Review
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                        {post.content}
                      </p>

                      {post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.hashtags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-umich-teal font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          Created by {post.createdBy}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {post.createdAt.toLocaleDateString()}
                        </span>
                        {post.scheduledDate && (
                          <span className="flex items-center font-medium text-umich-blue">
                            Scheduled: {post.scheduledDate.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="ml-4">
                      <Dialog open={isDialogOpen && selectedPost?.id === post.id} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => openReviewDialog(post)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Review Post</DialogTitle>
                            <DialogDescription>
                              Review the content and decide whether to approve or reject this
                              post
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4 py-4">
                            <div>
                              <Label className="text-sm font-semibold mb-2 block">
                                Content
                              </Label>
                              <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-md">
                                {post.content}
                              </p>
                            </div>

                            <div>
                              <Label className="text-sm font-semibold mb-2 block">
                                Platforms
                              </Label>
                              <div className="flex space-x-2">
                                {post.platforms.map((platform) => (
                                  <Badge
                                    key={platform}
                                    className={getPlatformColor(platform)}
                                  >
                                    {platform}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {post.hashtags.length > 0 && (
                              <div>
                                <Label className="text-sm font-semibold mb-2 block">
                                  Hashtags
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                  {post.hashtags.map((tag) => (
                                    <Badge key={tag} variant="secondary">
                                      #{tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div>
                              <Label htmlFor="comments" className="mb-2 block">
                                Review Comments (Optional)
                              </Label>
                              <Textarea
                                id="comments"
                                placeholder="Add any feedback or notes..."
                                value={reviewComments}
                                onChange={(e) => setReviewComments(e.target.value)}
                                rows={4}
                              />
                            </div>
                          </div>

                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => handleReject(post.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                            <Button onClick={() => handleApprove(post.id)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Approvals</CardTitle>
          <CardDescription>Recently approved and rejected posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                id: 1,
                content: 'Faculty spotlight: Professor Jane Smith...',
                status: 'approved',
                reviewer: 'John Doe',
                date: new Date(2025, 10, 16),
              },
              {
                id: 2,
                content: 'New engineering building opening ceremony...',
                status: 'approved',
                reviewer: 'Sarah Johnson',
                date: new Date(2025, 10, 15),
              },
              {
                id: 3,
                content: 'Student project showcase next week...',
                status: 'rejected',
                reviewer: 'John Doe',
                date: new Date(2025, 10, 14),
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{item.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Reviewed by {item.reviewer} • {item.date.toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant={item.status === 'approved' ? 'success' : 'destructive'}
                  className="ml-4"
                >
                  {item.status === 'approved' ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

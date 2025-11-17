export type Platform = 'twitter' | 'linkedin' | 'instagram';

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'pending_approval' | 'rejected';

export interface SocialPost {
  id: string;
  content: string;
  platforms: Platform[];
  scheduledDate?: Date;
  status: PostStatus;
  imageUrls: string[];
  hashtags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  approvedBy?: string;
  analytics?: PostAnalytics;
}

export interface PostAnalytics {
  impressions: number;
  engagements: number;
  likes: number;
  shares: number;
  comments: number;
  clicks: number;
  platform: Platform;
}

export interface ContentAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  thumbnailUrl?: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
  tags: string[];
}

export interface HashtagSuggestion {
  tag: string;
  popularity: number;
  relevance: number;
  category: string;
}

export interface ApprovalWorkflow {
  id: string;
  postId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  comments?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  post: SocialPost;
  color: string;
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatDuration } from '@/utils/formatters';

interface MeetingCardProps {
  meeting: {
    id: string;
    title: string;
    description?: string;
    meeting_date?: string;
    duration_seconds?: number;
    transcription_status: string;
    tags?: string[];
    created_at: string;
  };
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/meeting/${meeting.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{meeting.title}</CardTitle>
              {meeting.description && (
                <CardDescription className="line-clamp-2">{meeting.description}</CardDescription>
              )}
            </div>
            <Badge className={getStatusColor(meeting.transcription_status)}>
              {meeting.transcription_status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {formatDate(meeting.meeting_date || meeting.created_at)}
            </div>
            {meeting.duration_seconds && (
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {formatDuration(meeting.duration_seconds)}
              </div>
            )}
          </div>
          {meeting.tags && meeting.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {meeting.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
              {meeting.tags.length > 3 && (
                <Badge variant="outline">+{meeting.tags.length - 3}</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

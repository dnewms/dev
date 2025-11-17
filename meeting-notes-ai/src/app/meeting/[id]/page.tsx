'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Share2, Clock, Calendar, Users, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatDuration } from '@/utils/formatters';

export default function MeetingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'transcript'>('summary');

  useEffect(() => {
    fetchMeeting();
  }, [params.id]);

  const fetchMeeting = async () => {
    try {
      const response = await fetch(`/api/meetings/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setMeeting(data.meeting);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'markdown') => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId: params.id, format }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${meeting.title}.${format === 'pdf' ? 'pdf' : 'md'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export meeting');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading meeting...</p>
      </div>
    );
  }

  if (!meeting) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExport('markdown')}>
                <Download className="mr-2 h-4 w-4" />
                Markdown
              </Button>
              <Button variant="outline" onClick={() => handleExport('pdf')}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Meeting Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{meeting.title}</h1>
              {meeting.description && (
                <p className="text-gray-600">{meeting.description}</p>
              )}
            </div>
            <Badge
              className={
                meeting.transcription_status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }
            >
              {meeting.transcription_status}
            </Badge>
          </div>
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
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-4 px-1 border-b-2 font-medium ${
                activeTab === 'summary'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Summary & Insights
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`pb-4 px-1 border-b-2 font-medium ${
                activeTab === 'transcript'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Full Transcript
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'summary' ? (
          <div className="grid gap-6">
            {/* Summary */}
            {meeting.summary && (
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{meeting.summary}</p>
                </CardContent>
              </Card>
            )}

            {/* Key Points */}
            {meeting.key_points && meeting.key_points.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {meeting.key_points.map((point: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Action Items */}
            {meeting.action_items && meeting.action_items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Action Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {meeting.action_items.map((item: any, index: number) => (
                      <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <CheckSquare className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.task}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {item.assignee && (
                              <span className="text-sm text-gray-600">
                                Assigned to: {item.assignee}
                              </span>
                            )}
                            <Badge variant={item.priority === 'high' ? 'destructive' : 'outline'}>
                              {item.priority || 'medium'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Decisions */}
            {meeting.key_decisions && meeting.key_decisions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Decisions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {meeting.key_decisions.map((decision: any, index: number) => (
                      <div key={index} className="border-l-4 border-primary pl-4">
                        <p className="font-medium text-gray-900 mb-1">{decision.decision}</p>
                        <p className="text-sm text-gray-600">{decision.context}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Speakers */}
            {meeting.speakers && meeting.speakers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Speakers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {meeting.speakers.map((speaker: any, index: number) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                        <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="font-medium">{speaker.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Full Transcript</CardTitle>
              <CardDescription>
                Complete transcription of the meeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {meeting.transcription_text || 'No transcription available'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

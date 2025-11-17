import { useState, useEffect } from 'react';

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  meeting_date?: string;
  duration_seconds?: number;
  transcription_status: string;
  transcription_text?: string;
  summary?: string;
  key_points?: string[];
  action_items?: any[];
  key_decisions?: any[];
  speakers?: any[];
  tags?: string[];
  created_at: string;
}

export function useMeetings(searchQuery?: string, statusFilter?: string) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMeetings();
  }, [searchQuery, statusFilter]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/meetings?${params}`);
      const data = await response.json();

      if (response.ok) {
        setMeetings(data.meetings || []);
      } else {
        setError(data.error || 'Failed to fetch meetings');
      }
    } catch (err) {
      setError('Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchMeetings();
  };

  return { meetings, loading, error, refetch };
}

export function useMeeting(meetingId: string) {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMeeting();
  }, [meetingId]);

  const fetchMeeting = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/meetings/${meetingId}`);
      const data = await response.json();

      if (response.ok) {
        setMeeting(data.meeting);
      } else {
        setError(data.error || 'Failed to fetch meeting');
      }
    } catch (err) {
      setError('Failed to fetch meeting');
    } finally {
      setLoading(false);
    }
  };

  const updateMeeting = async (updates: Partial<Meeting>) => {
    try {
      const response = await fetch(`/api/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const { meeting: updatedMeeting } = await response.json();
        setMeeting(updatedMeeting);
        return updatedMeeting;
      } else {
        throw new Error('Failed to update meeting');
      }
    } catch (err) {
      throw err;
    }
  };

  const deleteMeeting = async () => {
    try {
      const response = await fetch(`/api/meetings/${meetingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete meeting');
      }

      return true;
    } catch (err) {
      throw err;
    }
  };

  return { meeting, loading, error, updateMeeting, deleteMeeting, refetch: fetchMeeting };
}

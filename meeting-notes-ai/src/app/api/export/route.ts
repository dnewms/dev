import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { exportToMarkdown, exportToPDF } from '@/lib/export';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { meetingId, format } = await request.json();

    if (!meetingId || !format) {
      return NextResponse.json(
        { error: 'Missing meeting ID or format' },
        { status: 400 }
      );
    }

    // Fetch meeting
    const { data: meeting, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', meetingId)
      .single();

    if (error || !meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // Check access
    if (meeting.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const meetingData = {
      title: meeting.title,
      date: new Date(meeting.meeting_date || meeting.created_at),
      duration: meeting.duration_seconds,
      summary: meeting.summary || '',
      keyPoints: meeting.key_points || [],
      actionItems: meeting.action_items || [],
      keyDecisions: meeting.key_decisions || [],
      transcription: meeting.transcription_text || '',
    };

    if (format === 'markdown') {
      const markdown = exportToMarkdown(meetingData);
      return new NextResponse(markdown, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': `attachment; filename="${meeting.title.replace(/[^a-z0-9]/gi, '_')}.md"`,
        },
      });
    }

    if (format === 'pdf') {
      const pdf = exportToPDF(meetingData);
      const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${meeting.title.replace(/[^a-z0-9]/gi, '_')}.pdf"`,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export meeting' }, { status: 500 });
  }
}

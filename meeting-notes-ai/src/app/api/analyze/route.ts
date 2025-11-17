import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { analyzeTranscription, identifySpeakers } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { meetingId, transcription, title } = await request.json();

    if (!meetingId || !transcription) {
      return NextResponse.json(
        { error: 'Missing meeting ID or transcription' },
        { status: 400 }
      );
    }

    // Analyze transcription
    const analysis = await analyzeTranscription(transcription, title || 'Meeting');

    // Identify speakers (if supported)
    let speakers = null;
    try {
      speakers = await identifySpeakers(transcription);
    } catch (error) {
      console.error('Speaker identification error:', error);
    }

    // Update meeting with analysis
    const { error: updateError } = await supabase
      .from('meetings')
      .update({
        summary: analysis.summary,
        key_points: analysis.keyPoints,
        action_items: analysis.actionItems,
        key_decisions: analysis.keyDecisions,
        speakers: speakers?.speakers || [],
      })
      .eq('id', meetingId);

    if (updateError) throw updateError;

    // Store speakers in separate table if available
    if (speakers?.speakers && speakers.speakers.length > 0) {
      for (const speaker of speakers.speakers) {
        await supabase.from('meeting_speakers').insert({
          meeting_id: meetingId,
          speaker_label: speaker.label,
          total_words: speaker.segments?.length || 0,
        });
      }
    }

    return NextResponse.json({
      success: true,
      analysis: {
        ...analysis,
        speakers: speakers?.speakers || [],
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze transcription' },
      { status: 500 }
    );
  }
}

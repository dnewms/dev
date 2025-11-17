import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { transcribeAudio } from '@/lib/openai';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes max

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const meetingId = formData.get('meetingId') as string;

    if (!file || !meetingId) {
      return NextResponse.json({ error: 'Missing file or meeting ID' }, { status: 400 });
    }

    // Update meeting status to processing
    await supabase
      .from('meetings')
      .update({ transcription_status: 'processing' })
      .eq('id', meetingId);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save temporarily (OpenAI requires file path)
    const tempPath = join('/tmp', `${meetingId}-${file.name}`);
    await writeFile(tempPath, buffer);

    try {
      // Transcribe audio
      const result = await transcribeAudio(buffer, file.name);

      // Upload audio to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('meeting-recordings')
        .upload(`${session.user.id}/${meetingId}/${file.name}`, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('meeting-recordings')
        .getPublicUrl(uploadData.path);

      // Update meeting with transcription
      const { error: updateError } = await supabase
        .from('meetings')
        .update({
          transcription_text: result.text,
          transcription_status: 'completed',
          duration_seconds: result.duration,
          audio_url: publicUrl,
          file_size: file.size,
        })
        .eq('id', meetingId);

      if (updateError) throw updateError;

      // Clean up temp file
      await unlink(tempPath);

      return NextResponse.json({
        success: true,
        transcription: result.text,
        duration: result.duration,
        audioUrl: publicUrl,
      });
    } catch (error) {
      // Clean up temp file on error
      try {
        await unlink(tempPath);
      } catch {}

      throw error;
    }
  } catch (error) {
    console.error('Transcription error:', error);

    // Update meeting status to failed
    const formData = await request.formData();
    const meetingId = formData.get('meetingId') as string;

    if (meetingId) {
      const supabase = createServerClient();
      await supabase
        .from('meetings')
        .update({ transcription_status: 'failed' })
        .eq('id', meetingId);
    }

    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}

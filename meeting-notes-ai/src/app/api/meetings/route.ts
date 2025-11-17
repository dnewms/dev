import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { canUserCreateMeeting } from '@/lib/stripe';

// GET all meetings for the current user
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let query = supabase
      .from('meetings')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,transcription_text.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('transcription_status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ meetings: data });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 });
  }
}

// POST create a new meeting
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile to check subscription limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if user can create a meeting
    if (!canUserCreateMeeting(profile.meetings_this_month, profile.subscription_tier)) {
      return NextResponse.json(
        {
          error: 'Meeting limit reached',
          message: 'You have reached your monthly meeting limit. Please upgrade your plan.',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, meeting_date, team_id } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { data: meeting, error } = await supabase
      .from('meetings')
      .insert({
        user_id: session.user.id,
        title,
        description,
        meeting_date: meeting_date || new Date().toISOString(),
        team_id,
        transcription_status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ meeting }, { status: 201 });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
  }
}

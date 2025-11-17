import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { enhanceWithAI } from '@/lib/openai';
import type { EnhancementRequest } from '@/types';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: EnhancementRequest = await request.json();
    const { originalText, style, industry } = body;

    if (!originalText || !style) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if user has credits
    if (profile.credits < 1 && profile.subscription_status !== 'active') {
      return NextResponse.json({
        error: 'Insufficient credits',
        creditsRemaining: profile.credits
      }, { status: 402 });
    }

    // Enhance with AI
    const enhancedText = await enhanceWithAI(originalText, style, industry);

    // Deduct credit (only if not on active subscription with unlimited plan)
    let newCredits = profile.credits;
    if (profile.subscription_status !== 'active' || profile.credits !== 999999) {
      newCredits = Math.max(0, profile.credits - 1);

      await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', session.user.id);
    }

    // Save enhancement to database
    await supabase.from('enhancements').insert({
      user_id: session.user.id,
      original_text: originalText,
      enhanced_text: enhancedText,
      enhancement_style: style,
      industry: industry || null,
    });

    // Log usage
    await supabase.from('usage_logs').insert({
      user_id: session.user.id,
      action_type: 'enhance',
      credits_used: 1,
      metadata: { style, industry },
    });

    return NextResponse.json({
      enhancedText,
      creditsRemaining: newCredits,
    });
  } catch (error: any) {
    console.error('Enhancement error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to enhance text' },
      { status: 500 }
    );
  }
}

-- Meeting Notes AI - Supabase Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For better text search

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'business')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  meetings_this_month INTEGER DEFAULT 0,
  total_meetings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE public.teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'business')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members
CREATE TABLE public.team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Meetings table
CREATE TABLE public.meetings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT,
  video_url TEXT,
  file_size BIGINT,
  duration_seconds INTEGER,
  transcription_status TEXT DEFAULT 'pending' CHECK (transcription_status IN ('pending', 'processing', 'completed', 'failed')),
  transcription_text TEXT,
  summary TEXT,
  key_points JSONB DEFAULT '[]'::jsonb,
  action_items JSONB DEFAULT '[]'::jsonb,
  key_decisions JSONB DEFAULT '[]'::jsonb,
  speakers JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  meeting_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meeting participants/speakers
CREATE TABLE public.meeting_speakers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  speaker_label TEXT NOT NULL, -- e.g., "Speaker 1", "Speaker 2"
  speaker_name TEXT, -- Manually assigned name
  total_words INTEGER DEFAULT 0,
  speaking_time_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transcription segments (for detailed transcript)
CREATE TABLE public.transcription_segments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  speaker_id UUID REFERENCES public.meeting_speakers(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  start_time FLOAT NOT NULL,
  end_time FLOAT NOT NULL,
  confidence FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meeting shares (for collaboration)
CREATE TABLE public.meeting_shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  shared_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  shared_with UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  permission TEXT DEFAULT 'view' CHECK (permission IN ('view', 'edit')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(meeting_id, shared_with)
);

-- Comments on meetings
CREATE TABLE public.meeting_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  timestamp_reference FLOAT, -- Optional: reference to specific time in meeting
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking
CREATE TABLE public.usage_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'transcription', 'export', 'search', etc.
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_meetings_user_id ON public.meetings(user_id);
CREATE INDEX idx_meetings_team_id ON public.meetings(team_id);
CREATE INDEX idx_meetings_created_at ON public.meetings(created_at DESC);
CREATE INDEX idx_meetings_transcription_text ON public.meetings USING GIN (to_tsvector('english', transcription_text));
CREATE INDEX idx_transcription_segments_meeting_id ON public.transcription_segments(meeting_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcription_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Meetings policies
CREATE POLICY "Users can view own meetings" ON public.meetings
  FOR SELECT USING (
    auth.uid() = user_id
    OR team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
    OR id IN (SELECT meeting_id FROM public.meeting_shares WHERE shared_with = auth.uid())
  );

CREATE POLICY "Users can insert own meetings" ON public.meetings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meetings" ON public.meetings
  FOR UPDATE USING (
    auth.uid() = user_id
    OR (id IN (SELECT meeting_id FROM public.meeting_shares WHERE shared_with = auth.uid() AND permission = 'edit'))
  );

CREATE POLICY "Users can delete own meetings" ON public.meetings
  FOR DELETE USING (auth.uid() = user_id);

-- Meeting speakers policies
CREATE POLICY "Users can view speakers from accessible meetings" ON public.meeting_speakers
  FOR SELECT USING (
    meeting_id IN (SELECT id FROM public.meetings WHERE
      user_id = auth.uid()
      OR team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
      OR id IN (SELECT meeting_id FROM public.meeting_shares WHERE shared_with = auth.uid())
    )
  );

-- Transcription segments policies
CREATE POLICY "Users can view segments from accessible meetings" ON public.transcription_segments
  FOR SELECT USING (
    meeting_id IN (SELECT id FROM public.meetings WHERE
      user_id = auth.uid()
      OR team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
      OR id IN (SELECT meeting_id FROM public.meeting_shares WHERE shared_with = auth.uid())
    )
  );

-- Team policies
CREATE POLICY "Users can view teams they are members of" ON public.teams
  FOR SELECT USING (
    id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Team owners can update their teams" ON public.teams
  FOR UPDATE USING (auth.uid() = owner_id);

-- Team members policies
CREATE POLICY "Users can view team members of their teams" ON public.team_members
  FOR SELECT USING (
    team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
  );

-- Meeting shares policies
CREATE POLICY "Users can view shares for their meetings" ON public.meeting_shares
  FOR SELECT USING (
    shared_by = auth.uid() OR shared_with = auth.uid()
  );

CREATE POLICY "Meeting owners can create shares" ON public.meeting_shares
  FOR INSERT WITH CHECK (
    meeting_id IN (SELECT id FROM public.meetings WHERE user_id = auth.uid())
  );

-- Functions

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON public.meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to increment monthly meeting count
CREATE OR REPLACE FUNCTION increment_meeting_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET meetings_this_month = meetings_this_month + 1,
      total_meetings = total_meetings + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_user_meetings
  AFTER INSERT ON public.meetings
  FOR EACH ROW EXECUTE FUNCTION increment_meeting_count();

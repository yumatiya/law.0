-- Create user modes table
CREATE TABLE public.user_modes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('school', 'college', 'lawyer')),
  grade_level TEXT,
  stream TEXT,
  preferred_language TEXT DEFAULT 'english',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ebooks table
CREATE TABLE public.ebooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('school', 'college', 'lawyer')),
  subject TEXT NOT NULL,
  grade_level TEXT,
  stream TEXT,
  language TEXT DEFAULT 'english',
  author TEXT,
  description TEXT,
  file_url TEXT,
  file_type TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ebook chapters table
CREATE TABLE public.ebook_chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ebook_id UUID NOT NULL REFERENCES public.ebooks(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create legal cases table (1947-2025)
CREATE TABLE public.legal_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_name TEXT NOT NULL,
  citation TEXT NOT NULL,
  court TEXT NOT NULL,
  case_type TEXT NOT NULL,
  year INTEGER NOT NULL,
  case_date DATE,
  summary TEXT,
  facts TEXT,
  arguments_prosecution TEXT,
  arguments_defense TEXT,
  judgment TEXT,
  legal_sections TEXT[],
  related_acts TEXT[],
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mock court sessions table
CREATE TABLE public.mock_court_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  case_id UUID REFERENCES public.legal_cases(id),
  role TEXT NOT NULL CHECK (role IN ('judge', 'prosecutor', 'defense', 'witness', 'observer')),
  session_data JSONB,
  verdict TEXT,
  feedback TEXT,
  score INTEGER,
  recording_url TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create AI chat history table for context
CREATE TABLE public.ai_chat_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mode TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'english',
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebook_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_court_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_modes
CREATE POLICY "Users can view their own modes"
  ON public.user_modes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own modes"
  ON public.user_modes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own modes"
  ON public.user_modes FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for ebooks (public read)
CREATE POLICY "Public read access for ebooks"
  ON public.ebooks FOR SELECT
  USING (true);

-- RLS Policies for ebook_chapters (public read)
CREATE POLICY "Public read access for chapters"
  ON public.ebook_chapters FOR SELECT
  USING (true);

-- RLS Policies for legal_cases (public read)
CREATE POLICY "Public read access for legal cases"
  ON public.legal_cases FOR SELECT
  USING (true);

-- RLS Policies for mock_court_sessions
CREATE POLICY "Users can view their own sessions"
  ON public.mock_court_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
  ON public.mock_court_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON public.mock_court_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for ai_chat_history
CREATE POLICY "Users can view their own chat history"
  ON public.ai_chat_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat history"
  ON public.ai_chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_ebooks_mode ON public.ebooks(mode);
CREATE INDEX idx_ebooks_subject ON public.ebooks(subject);
CREATE INDEX idx_legal_cases_year ON public.legal_cases(year);
CREATE INDEX idx_legal_cases_court ON public.legal_cases(court);
CREATE INDEX idx_mock_sessions_user ON public.mock_court_sessions(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_user_modes_updated_at
  BEFORE UPDATE ON public.user_modes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ebooks_updated_at
  BEFORE UPDATE ON public.ebooks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
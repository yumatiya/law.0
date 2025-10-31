-- Government Exam Zone tables
CREATE TABLE public.government_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_name TEXT NOT NULL,
  exam_type TEXT NOT NULL, -- 'UPSC', 'SSC', 'Banking', 'Defence', 'Police', 'PSC', 'Teaching'
  description TEXT,
  syllabus JSONB,
  total_seats INTEGER,
  exam_pattern JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES public.government_exams(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_taken_seconds INTEGER,
  answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Software Engineer Zone tables
CREATE TABLE public.coding_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL, -- 'easy', 'medium', 'hard'
  description TEXT NOT NULL,
  input_format TEXT,
  output_format TEXT,
  constraints TEXT,
  test_cases JSONB NOT NULL,
  solution_template JSONB, -- templates for different languages
  tags TEXT[],
  company_tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.coding_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES public.coding_problems(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  status TEXT NOT NULL, -- 'accepted', 'wrong_answer', 'time_limit', 'runtime_error'
  test_cases_passed INTEGER,
  total_test_cases INTEGER,
  execution_time_ms INTEGER,
  memory_used_kb INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interview_type TEXT NOT NULL, -- 'technical', 'hr', 'mixed'
  difficulty TEXT NOT NULL,
  questions JSONB NOT NULL,
  responses JSONB,
  score INTEGER,
  feedback TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.government_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for government_exams
CREATE POLICY "Public read access for government exams"
  ON public.government_exams FOR SELECT
  USING (true);

-- RLS Policies for exam_attempts
CREATE POLICY "Users can view their own exam attempts"
  ON public.exam_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exam attempts"
  ON public.exam_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for coding_problems
CREATE POLICY "Public read access for coding problems"
  ON public.coding_problems FOR SELECT
  USING (true);

-- RLS Policies for coding_submissions
CREATE POLICY "Users can view their own coding submissions"
  ON public.coding_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coding submissions"
  ON public.coding_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for interview_sessions
CREATE POLICY "Users can view their own interview sessions"
  ON public.interview_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interview sessions"
  ON public.interview_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interview sessions"
  ON public.interview_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_government_exams_updated_at
  BEFORE UPDATE ON public.government_exams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
export interface User {
  id: string;
  name: string;
  email: string;
  profile: UserProfile;
  grade?: string;
  degree?: string;
  university?: string;
  specialization?: string[];
  subscriptionPlan: 'free' | 'pro-student' | 'pro-law' | 'institution';
  createdAt: Date;
  lastActive: Date;
}

export type UserProfile = 'school' | 'college' | 'lawyer';

export interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  messageType: 'text' | 'code' | 'legal-draft' | 'citation' | 'step-solution';
  sources?: Source[];
  attachments?: Attachment[];
}

export interface Source {
  type: 'textbook' | 'statute' | 'case-law' | 'ncert' | 'ugc';
  title: string;
  chapter?: string;
  section?: string;
  url?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document';
  url: string;
  size: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  profile: UserProfile;
  grade?: string;
  stream?: string;
  topics: Topic[];
  progress: number;
}

export interface Topic {
  id: string;
  name: string;
  subjectId: string;
  conceptCards: ConceptCard[];
  practiceQuestions: Question[];
  completed: boolean;
}

export interface ConceptCard {
  id: string;
  title: string;
  content: string;
  examples: string[];
  commonMistakes: string[];
  topicId: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Question {
  id: string;
  question: string;
  type: 'mcq' | 'short' | 'long' | 'numerical' | 'code';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
  points: number;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  questions: Question[];
  duration: number;
  totalPoints: number;
  isTimed: boolean;
  created: Date;
  attempts: TestAttempt[];
}

export interface TestAttempt {
  id: string;
  testId: string;
  userId: string;
  answers: Record<string, string | string[]>;
  score: number;
  percentage: number;
  timeSpent: number;
  completedAt: Date;
  feedback: string[];
}

export interface LegalDocument {
  id: string;
  title: string;
  type: 'petition' | 'affidavit' | 'contract' | 'notice' | 'application';
  template: string;
  clauses: DocumentClause[];
  jurisdiction: 'india' | 'us' | 'uk' | 'canada';
  category: string;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
}

export interface DocumentClause {
  id: string;
  title: string;
  content: string;
  purpose: string;
  risks: string[];
  isRequired: boolean;
  alternatives?: string[];
}

export interface MockCourtSession {
  id: string;
  title: string;
  caseType: 'civil' | 'criminal' | 'constitutional' | 'consumer';
  facts: string;
  legalIssues: string[];
  judgePersonality: 'strict' | 'lenient' | 'inquisitive' | 'practical';
  opposingCounselStyle: 'aggressive' | 'technical' | 'persuasive' | 'scholarly';
  duration: number;
  score?: MockCourtScore;
  transcript?: CourtTranscript[];
  feedback?: string[];
  completed: boolean;
}

export interface MockCourtScore {
  irac: number;
  authorities: number;
  oralAdvocacy: number;
  legalReasoning: number;
  courtRoomEtiquette: number;
  overall: number;
  feedback: string;
}

export interface CourtTranscript {
  speaker: 'user' | 'judge' | 'opposing-counsel';
  content: string;
  timestamp: Date;
  type: 'statement' | 'question' | 'objection' | 'ruling';
}

export interface Statute {
  id: string;
  title: string;
  act: string;
  section: string;
  content: string;
  amendments: Amendment[];
  relatedSections: string[];
  jurisdiction: string;
  illustrations: Illustration[];
}

export interface Amendment {
  date: Date;
  description: string;
  changes: string;
}

export interface Illustration {
  title: string;
  scenario: string;
  application: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  tags: string[];
  subjectId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview: Date;
  reviewCount: number;
  successRate: number;
}

export interface StudyPlan {
  id: string;
  title: string;
  userId: string;
  subjects: string[];
  startDate: Date;
  targetDate: Date;
  dailyGoal: number;
  weeklyGoal: number;
  currentStreak: number;
  longestStreak: number;
  tasks: StudyTask[];
}

export interface StudyTask {
  id: string;
  title: string;
  type: 'study' | 'practice' | 'revision' | 'test';
  subjectId: string;
  dueDate: Date;
  completed: boolean;
  estimatedTime: number;
  actualTime?: number;
}

export interface Analytics {
  userId: string;
  totalStudyTime: number;
  questionsAttempted: number;
  questionsCorrect: number;
  averageScore: number;
  subjectProgress: Record<string, number>;
  weeklyActivity: number[];
  achievements: Achievement[];
  learningVelocity: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'streak' | 'score' | 'time' | 'special';
}
export const ROUTES = {
  HOME: '/',
  CHAT: '/chat',
  PRACTICE: '/practice',
  LIBRARY: '/library',
  PROFILE: '/profile',
  SUBJECTS: '/subjects',
  MOCK_COURT: '/mock-court',
  DRAFT_BUILDER: '/draft-builder',
  STATUTE_NAVIGATOR: '/statute-navigation',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const;

export const SUBJECTS = {
  SCHOOL: {
    'grades-1-5': ['Mathematics', 'English', 'Science', 'Social Studies', 'Hindi'],
    'grades-6-8': ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Sanskrit'],
    'grades-9-10': ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer Science'],
    'grades-11-12-science': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Computer Science'],
    'grades-11-12-commerce': ['Accountancy', 'Business Studies', 'Economics', 'English', 'Mathematics'],
    'grades-11-12-humanities': ['History', 'Geography', 'Political Science', 'Economics', 'English', 'Psychology'],
  },
  COLLEGE: {
    'bcom': ['Financial Accounting', 'Cost Accounting', 'Business Mathematics', 'Economics', 'Business Law'],
    'ba': ['English Literature', 'History', 'Political Science', 'Sociology', 'Philosophy'],
    'bsc': ['Mathematics', 'Physics', 'Chemistry', 'Statistics', 'Computer Science'],
    'bba-bbm': ['Management Principles', 'Marketing', 'Finance', 'HR Management', 'Operations'],
    'btech': ['Engineering Mathematics', 'Data Structures', 'Computer Networks', 'Database Systems', 'Software Engineering'],
    'mtech': ['Advanced Algorithms', 'Machine Learning', 'System Design', 'Research Methodology'],
    'mca': ['Advanced Programming', 'Software Engineering', 'Database Management', 'Computer Networks'],
    'mbbs': ['Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology', 'Medicine'],
    'ma': ['Research Methodology', 'Advanced Theory', 'Dissertation', 'Specialized Subjects'],
    'msc': ['Advanced Mathematics', 'Research Methods', 'Specialized Topics', 'Project Work'],
  },
  LAW: {
    'llb': ['Constitutional Law', 'Contract Law', 'Criminal Law', 'Civil Procedure', 'Evidence Act'],
    'llm': ['Advanced Constitutional Law', 'Corporate Law', 'International Law', 'Jurisprudence'],
  }
} as const;

export const LEGAL_DOCUMENT_TYPES = [
  { id: 'petition', name: 'Petition', category: 'Court Documents' },
  { id: 'affidavit', name: 'Affidavit', category: 'Court Documents' },
  { id: 'application', name: 'Application', category: 'Court Documents' },
  { id: 'contract', name: 'Contract', category: 'Commercial' },
  { id: 'agreement', name: 'Agreement', category: 'Commercial' },
  { id: 'notice', name: 'Legal Notice', category: 'Notices' },
  { id: 'demand', name: 'Demand Notice', category: 'Notices' },
  { id: 'complaint', name: 'Consumer Complaint', category: 'Consumer' },
  { id: 'bail-application', name: 'Bail Application', category: 'Criminal' },
  { id: 'divorce-petition', name: 'Divorce Petition', category: 'Family Law' },
] as const;

export const MOCK_COURT_CASES = [
  {
    id: 'consumer-laptop',
    title: 'Consumer Dispute: Defective Laptop',
    type: 'consumer',
    facts: '22-year-old student bought laptop worth ₹65,000. Developed motherboard issues within 3 months. Company refused replacement citing user damage.',
    issues: ['Consumer protection', 'Warranty claims', 'Burden of proof'],
    difficulty: 'medium'
  },
  {
    id: 'property-dispute',
    title: 'Property Ownership Dispute',
    type: 'civil',
    facts: 'Two brothers claim ownership of ancestral property. Elder has possession, younger has sale deed from father.',
    issues: ['Property law', 'Succession rights', 'Documentary evidence'],
    difficulty: 'hard'
  },
  {
    id: 'employment-termination',
    title: 'Wrongful Termination Case',
    type: 'civil',
    facts: 'Employee terminated after 8 years without notice. Company claims misconduct, employee claims discrimination.',
    issues: ['Labor law', 'Natural justice', 'Industrial disputes'],
    difficulty: 'medium'
  }
] as const;

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      '5 AI doubts per day',
      'Basic concept cards',
      '2 practice tests per week',
      'Basic legal templates'
    ],
    limits: {
      dailyDoubts: 5,
      weeklyTests: 2,
      mockCourtSessions: 1,
      legalDrafts: 2
    }
  },
  PRO_STUDENT: {
    id: 'pro-student',
    name: 'Pro Student',
    price: 299,
    features: [
      'Unlimited AI chat',
      'Advanced test series',
      'PDF upload & analysis',
      'Study planner',
      'Progress analytics'
    ],
    limits: {
      dailyDoubts: -1, // unlimited
      weeklyTests: -1,
      mockCourtSessions: 5,
      legalDrafts: 10
    }
  },
  PRO_LAW: {
    id: 'pro-law',
    name: 'Pro Law',
    price: 999,
    features: [
      'All Pro Student features',
      'Unlimited Mock Court',
      'Advanced Draft Builder',
      'Case law database',
      'Citation checker',
      'Client simulator'
    ],
    limits: {
      dailyDoubts: -1,
      weeklyTests: -1,
      mockCourtSessions: -1,
      legalDrafts: -1
    }
  }
} as const;

export const JURISDICTIONS = [
  { id: 'india', name: 'India', courts: ['Supreme Court', 'High Court', 'District Court', 'Magistrate Court'] },
  { id: 'us', name: 'United States', courts: ['Federal Court', 'State Court', 'Appeals Court'] },
  { id: 'uk', name: 'United Kingdom', courts: ['House of Lords', 'Court of Appeal', 'High Court'] },
] as const;

export const DIFFICULTY_LEVELS = {
  EASY: { id: 'easy', name: 'Easy', color: 'green', points: 1 },
  MEDIUM: { id: 'medium', name: 'Medium', color: 'yellow', points: 2 },
  HARD: { id: 'hard', name: 'Hard', color: 'red', points: 3 },
} as const;
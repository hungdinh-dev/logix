import type {
  CourseProgress,
  WeeklyActivity,
  Skill,
  Certificate,
  QuizResult,
  StreakDay,
} from '../types/progress.types';

export const MOCK_STATS = {
  overallCompletion: 72,
  totalHours: 47.5,
  currentStreak: 12,
  certificatesEarned: 3,
};

export const MOCK_STREAK_DAYS: readonly StreakDay[] = [
  { date: 'Mon', active: true },
  { date: 'Tue', active: true },
  { date: 'Wed', active: true },
  { date: 'Thu', active: true },
  { date: 'Fri', active: false },
  { date: 'Sat', active: true },
  { date: 'Sun', active: true },
];

export const MOCK_HOURS_SPARKLINE = [3.5, 4.2, 2.8, 6.1, 5.5, 3.0, 7.2];

export const MOCK_COURSES: readonly CourseProgress[] = [
  {
    id: 'c1',
    title: 'Cybersecurity Awareness 2024',
    category: 'Compliance',
    thumbnailColor: '#efe9de',
    currentModule: 5,
    totalModules: 16,
    progressPercent: 31,
    lastAccessed: '2 hours ago',
    status: 'in-progress',
  },
  {
    id: 'c2',
    title: 'Strategic Leadership Fundamentals',
    category: 'Leadership',
    thumbnailColor: '#f5f0e8',
    currentModule: 8,
    totalModules: 8,
    progressPercent: 100,
    lastAccessed: '3 days ago',
    status: 'completed',
  },
  {
    id: 'c3',
    title: 'React Advanced Patterns: Hooks & Performance',
    category: 'Technical',
    thumbnailColor: '#efe9de',
    currentModule: 6,
    totalModules: 12,
    progressPercent: 50,
    lastAccessed: 'Yesterday',
    status: 'in-progress',
  },
  {
    id: 'c4',
    title: 'GDPR & Data Privacy Compliance Essentials',
    category: 'Compliance',
    thumbnailColor: '#f5f0e8',
    currentModule: 4,
    totalModules: 10,
    progressPercent: 40,
    lastAccessed: '5 days ago',
    status: 'in-progress',
  },
  {
    id: 'c5',
    title: 'Effective Communication Skills in the Workplace',
    category: 'Soft Skills',
    thumbnailColor: '#efe9de',
    currentModule: 6,
    totalModules: 6,
    progressPercent: 100,
    lastAccessed: '1 week ago',
    status: 'completed',
  },
];

export const MOCK_WEEKLY_ACTIVITY: readonly WeeklyActivity[] = [
  { day: 'Mon', minutes: 45, isToday: false },
  { day: 'Tue', minutes: 120, isToday: false },
  { day: 'Wed', minutes: 75, isToday: false },
  { day: 'Thu', minutes: 180, isToday: false },
  { day: 'Fri', minutes: 60, isToday: false },
  { day: 'Sat', minutes: 90, isToday: false },
  { day: 'Sun', minutes: 145, isToday: true },
];

export const MOCK_SKILLS: readonly Skill[] = [
  { id: 's1', name: 'Information Security', level: 'intermediate', percent: 68 },
  { id: 's2', name: 'Leadership', level: 'advanced', percent: 91 },
  { id: 's3', name: 'React / TypeScript', level: 'advanced', percent: 84 },
  { id: 's4', name: 'Data Privacy (GDPR)', level: 'intermediate', percent: 55 },
  { id: 's5', name: 'Communication', level: 'advanced', percent: 95 },
  { id: 's6', name: 'Risk Management', level: 'beginner', percent: 28 },
  { id: 's7', name: 'Python / Data Analysis', level: 'beginner', percent: 18 },
  { id: 's8', name: 'Change Management', level: 'intermediate', percent: 62 },
];

export const MOCK_CERTIFICATES: readonly Certificate[] = [
  { id: 'cert1', courseName: 'Strategic Leadership Fundamentals', completedDate: 'March 15, 2026', locked: false },
  { id: 'cert2', courseName: 'Effective Communication Skills', completedDate: 'April 2, 2026', locked: false },
  { id: 'cert3', courseName: 'GDPR Compliance Essentials', completedDate: 'January 28, 2026', locked: false },
  { id: 'cert4', courseName: 'Cybersecurity Awareness 2024', completedDate: '', locked: true },
  { id: 'cert5', courseName: 'Python for Business Data Analysis', completedDate: '', locked: true },
];

export const MOCK_QUIZ_RESULTS: readonly QuizResult[] = [
  { id: 'qr1', courseName: 'Cybersecurity Awareness', quizName: 'Module 1 Knowledge Check', score: 90, status: 'passed', date: 'May 12, 2026' },
  { id: 'qr2', courseName: 'Cybersecurity Awareness', quizName: 'Phishing Simulation Test', score: 75, status: 'passed', date: 'May 14, 2026' },
  { id: 'qr3', courseName: 'Strategic Leadership', quizName: 'Leadership Styles Assessment', score: 95, status: 'passed', date: 'Mar 10, 2026' },
  { id: 'qr4', courseName: 'Strategic Leadership', quizName: 'Final Competency Test', score: 88, status: 'passed', date: 'Mar 15, 2026' },
  { id: 'qr5', courseName: 'GDPR Compliance', quizName: 'Data Processing Principles', score: 65, status: 'passed', date: 'Jan 20, 2026' },
  { id: 'qr6', courseName: 'GDPR Compliance', quizName: 'Rights of Data Subjects', score: 55, status: 'failed', date: 'Jan 22, 2026' },
  { id: 'qr7', courseName: 'React Advanced Patterns', quizName: 'Hooks & State Management', score: 72, status: 'passed', date: 'May 18, 2026' },
  { id: 'qr8', courseName: 'React Advanced Patterns', quizName: 'Performance Optimization', score: 45, status: 'retake', date: 'May 19, 2026' },
];

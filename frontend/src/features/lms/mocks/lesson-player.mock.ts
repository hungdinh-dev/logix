import type {
  LessonChapter,
  TranscriptLine,
  ResourceFile,
  DiscussionComment,
  ChatMessage,
  PlayerLesson,
} from '../types/lesson-player.types';

export const MOCK_CURRENT_LESSON: PlayerLesson = {
  id: 'l5',
  title: 'Anatomy of a Phishing Email',
  chapterTitle: 'Phishing & Social Engineering',
  chapterNumber: 2,
  lessonIndex: 5,
  totalLessons: 16,
  videoDuration: '8:45',
  videoDurationSeconds: 525,
};

export const MOCK_CHAPTERS: readonly LessonChapter[] = [
  {
    id: 's1',
    number: 1,
    title: 'The Threat Landscape in 2024',
    lessons: [
      { id: 'l1', title: "Why Cybersecurity Is Everyone's Responsibility", duration: '5:10', type: 'video', status: 'completed' },
      { id: 'l2', title: 'How Attackers Choose Their Targets', duration: '7:30', type: 'video', status: 'completed' },
      { id: 'l3', title: 'The Cost of a Breach — Real Incident Data', duration: '6:20', type: 'video', status: 'completed' },
      { id: 'l4', title: 'Module 1 Knowledge Check', duration: '3:00', type: 'quiz', status: 'completed' },
    ],
  },
  {
    id: 's2',
    number: 2,
    title: 'Phishing & Social Engineering',
    lessons: [
      { id: 'l5', title: 'Anatomy of a Phishing Email', duration: '8:45', type: 'video', status: 'current' },
      { id: 'l6', title: 'Spear-Phishing, Whaling & Vishing', duration: '7:00', type: 'video', status: 'available' },
      { id: 'l7', title: 'Live Simulation: Spot the Phish', duration: '9:15', type: 'document', status: 'available' },
      { id: 'l8', title: 'Reporting Suspicious Emails — Step by Step', duration: '3:00', type: 'document', status: 'available' },
    ],
  },
  {
    id: 's3',
    number: 3,
    title: 'Password & Credential Security',
    lessons: [
      { id: 'l9', title: 'Why Passwords Fail and What to Do Instead', duration: '6:30', type: 'video', status: 'locked' },
      { id: 'l10', title: 'Setting Up a Password Manager', duration: '8:00', type: 'video', status: 'locked' },
      { id: 'l11', title: 'Multi-Factor Authentication — Hands-On Guide', duration: '5:30', type: 'document', status: 'locked' },
    ],
  },
  {
    id: 's4',
    number: 4,
    title: 'Safe Working Practices',
    lessons: [
      { id: 'l12', title: 'Public Wi-Fi & VPN Usage Policy', duration: '7:15', type: 'video', status: 'locked' },
      { id: 'l13', title: 'Removable Media and Shadow IT Risks', duration: '6:00', type: 'video', status: 'locked' },
      { id: 'l14', title: 'Clean Desk & Clear Screen Policy', duration: '4:30', type: 'video', status: 'locked' },
      { id: 'l15', title: 'Incident Response: What to Do in the First 15 Minutes', duration: '9:45', type: 'video', status: 'locked' },
      { id: 'l16', title: 'Final Assessment & Compliance Certificate', duration: '7:30', type: 'quiz', status: 'locked' },
    ],
  },
];

export const MOCK_TRANSCRIPT: readonly TranscriptLine[] = [
  { id: 't1', timestamp: '0:00', timestampSeconds: 0, text: 'Welcome to this lesson on phishing emails. Today we\'ll break down exactly what makes a phishing email dangerous.' },
  { id: 't2', timestamp: '0:32', timestampSeconds: 32, text: 'Attackers craft messages that look legitimate — mimicking your bank, your CEO, or even your IT department.' },
  { id: 't3', timestamp: '1:05', timestampSeconds: 65, text: 'There are five key red flags to look for in any suspicious email. Let\'s go through each one.' },
  { id: 't4', timestamp: '1:40', timestampSeconds: 100, text: 'First: the sender address. Always check the full email domain, not just the display name.' },
  { id: 't5', timestamp: '2:15', timestampSeconds: 135, text: 'A phishing email might show "IT Support" as the name, but the actual address is from a random Gmail or lookalike domain.' },
  { id: 't6', timestamp: '2:58', timestampSeconds: 178, text: 'Second: urgency language. Phrases like "Your account will be suspended in 24 hours" are designed to bypass your critical thinking.' },
  { id: 't7', timestamp: '3:40', timestampSeconds: 220, text: 'Third: suspicious links. Hover over any link before clicking. The real URL often reveals the attack.' },
  { id: 't8', timestamp: '4:20', timestampSeconds: 260, text: 'Fourth: unexpected attachments. Never open .exe, .zip, or Office files with macros from unknown senders.' },
  { id: 't9', timestamp: '5:00', timestampSeconds: 300, text: 'Fifth: requests for credentials. No legitimate service will ask for your password via email.' },
];

export const MOCK_RESOURCES: readonly ResourceFile[] = [
  { id: 'r1', name: 'Phishing Red Flags Checklist.pdf', size: '284 KB', url: '#' },
  { id: 'r2', name: 'Sample Phishing Email Analysis.pdf', size: '1.2 MB', url: '#' },
  { id: 'r3', name: 'Incident Report Template.docx', size: '48 KB', url: '#' },
];

export const MOCK_COMMENTS: readonly DiscussionComment[] = [
  {
    id: 'c1',
    authorName: 'Nadia Kim',
    authorInitials: 'NK',
    timeAgo: '2 days ago',
    text: 'The section on lookalike domains was eye-opening. Our company actually received a phishing email like this last month.',
    likes: 12,
    replies: 3,
  },
  {
    id: 'c2',
    authorName: 'David Lee',
    authorInitials: 'DL',
    timeAgo: '5 days ago',
    text: 'Great breakdown. The timestamp at 3:40 about urgency language is particularly useful for training new hires.',
    likes: 8,
    replies: 1,
  },
  {
    id: 'c3',
    authorName: 'Hana Müller',
    authorInitials: 'HM',
    timeAgo: '1 week ago',
    text: 'Is there a way to do live phishing simulations with this course? Our ISO auditor asked about this.',
    likes: 5,
    replies: 2,
  },
];

export const INITIAL_AI_MESSAGES: readonly ChatMessage[] = [
  {
    id: 'm0',
    role: 'assistant',
    text: 'Hi! I\'m your AI assistant for this lesson. Ask me anything about phishing emails, social engineering, or the concepts covered here.',
  },
];

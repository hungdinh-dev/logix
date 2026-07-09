import type { QuizMeta, QuizQuestion } from '../types/quiz.types';

export const MOCK_QUIZ_META: QuizMeta = {
  id: 'quiz-cs-2024',
  title: 'Cybersecurity Awareness Assessment',
  courseName: 'Cybersecurity Awareness 2024',
  totalQuestions: 15,
  durationSeconds: 872, // ~14:32 remaining
};

export const MOCK_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 'q1', number: 1, type: 'multiple-choice', points: 2,
    text: 'Which of the following best describes a "zero-day" vulnerability?',
    options: [
      { id: 'q1-a', letter: 'A', text: 'A vulnerability that has existed for zero days' },
      { id: 'q1-b', letter: 'B', text: 'A security flaw unknown to the software vendor with no patch available' },
      { id: 'q1-c', letter: 'C', text: 'An attack that happens within zero seconds' },
      { id: 'q1-d', letter: 'D', text: 'A password reset policy enforced every day' },
    ],
    correctOptionId: 'q1-b',
  },
  {
    id: 'q2', number: 2, type: 'multiple-choice', points: 2,
    text: 'What is the primary purpose of Multi-Factor Authentication (MFA)?',
    options: [
      { id: 'q2-a', letter: 'A', text: 'To replace passwords entirely with biometric data' },
      { id: 'q2-b', letter: 'B', text: 'To require multiple credentials so a stolen password alone is not enough' },
      { id: 'q2-c', letter: 'C', text: 'To log every login attempt on the network' },
      { id: 'q2-d', letter: 'D', text: 'To encrypt data at rest on the device' },
    ],
    correctOptionId: 'q2-b',
  },
  {
    id: 'q3', number: 3, type: 'true-false', points: 1,
    text: 'Using a personal USB drive on a corporate workstation is generally safe as long as you have scanned it with antivirus software.',
    options: [
      { id: 'q3-t', letter: 'True', text: 'True' },
      { id: 'q3-f', letter: 'False', text: 'False' },
    ],
    correctOptionId: 'q3-f',
  },
  {
    id: 'q4', number: 4, type: 'multiple-choice', points: 2,
    text: 'An attacker calls an employee pretending to be from IT support and asks for login credentials. This is an example of:',
    options: [
      { id: 'q4-a', letter: 'A', text: 'Brute force attack' },
      { id: 'q4-b', letter: 'B', text: 'SQL injection' },
      { id: 'q4-c', letter: 'C', text: 'Vishing (voice phishing)' },
      { id: 'q4-d', letter: 'D', text: 'Man-in-the-middle attack' },
    ],
    correctOptionId: 'q4-c',
  },
  {
    id: 'q5', number: 5, type: 'multiple-choice', points: 2,
    text: 'Which password is the strongest according to current security best practices?',
    options: [
      { id: 'q5-a', letter: 'A', text: 'P@ssw0rd123' },
      { id: 'q5-b', letter: 'B', text: 'correct-horse-battery-staple-47' },
      { id: 'q5-c', letter: 'C', text: 'Admin2024!' },
      { id: 'q5-d', letter: 'D', text: 'JohnSmith1985' },
    ],
    correctOptionId: 'q5-b',
  },
  {
    id: 'q6', number: 6, type: 'true-false', points: 1,
    text: 'Public Wi-Fi networks are safe to use for accessing corporate systems as long as the website uses HTTPS.',
    options: [
      { id: 'q6-t', letter: 'True', text: 'True' },
      { id: 'q6-f', letter: 'False', text: 'False' },
    ],
    correctOptionId: 'q6-f',
  },
  {
    id: 'q7', number: 7, type: 'multiple-choice', points: 2, hasImage: true,
    text: 'Looking at the email header above, which element is the strongest indicator that this is a phishing attempt?',
    options: [
      { id: 'q7-a', letter: 'A', text: 'The email was sent on a Monday morning' },
      { id: 'q7-b', letter: 'B', text: 'The sender domain is "support@paypa1.com" with the number 1 instead of letter l' },
      { id: 'q7-c', letter: 'C', text: 'The email contains a corporate logo' },
      { id: 'q7-d', letter: 'D', text: 'The email requests that you update your payment details' },
    ],
    correctOptionId: 'q7-b',
  },
  {
    id: 'q8', number: 8, type: 'multiple-choice', points: 2,
    text: 'Under GDPR, what is the maximum timeframe within which a data breach must be reported to the relevant supervisory authority?',
    options: [
      { id: 'q8-a', letter: 'A', text: '24 hours' },
      { id: 'q8-b', letter: 'B', text: '48 hours' },
      { id: 'q8-c', letter: 'C', text: '72 hours' },
      { id: 'q8-d', letter: 'D', text: '7 days' },
    ],
    correctOptionId: 'q8-c',
  },
  {
    id: 'q9', number: 9, type: 'text-input', points: 3,
    text: 'Describe the correct step-by-step procedure you should follow within the first 15 minutes of discovering a potential security incident on your workstation.',
  },
  {
    id: 'q10', number: 10, type: 'true-false', points: 1,
    text: 'The clean-desk policy only applies when you are leaving the office for the day.',
    options: [
      { id: 'q10-t', letter: 'True', text: 'True' },
      { id: 'q10-f', letter: 'False', text: 'False' },
    ],
    correctOptionId: 'q10-f',
  },
  {
    id: 'q11', number: 11, type: 'multiple-choice', points: 2,
    text: 'Which of the following is NOT a characteristic of ransomware?',
    options: [
      { id: 'q11-a', letter: 'A', text: 'It encrypts files on the victim\'s system' },
      { id: 'q11-b', letter: 'B', text: 'It demands payment for decryption' },
      { id: 'q11-c', letter: 'C', text: 'It monitors user keystrokes silently' },
      { id: 'q11-d', letter: 'D', text: 'It can spread via malicious email attachments' },
    ],
    correctOptionId: 'q11-c',
  },
  {
    id: 'q12', number: 12, type: 'multiple-choice', points: 2,
    text: 'What does "least privilege" mean in the context of access control?',
    options: [
      { id: 'q12-a', letter: 'A', text: 'Users should have the minimum level of access needed to perform their job' },
      { id: 'q12-b', letter: 'B', text: 'Admin accounts should never be used for daily tasks' },
      { id: 'q12-c', letter: 'C', text: 'Privileged accounts should have the weakest passwords' },
      { id: 'q12-d', letter: 'D', text: 'Only IT staff should have system access' },
    ],
    correctOptionId: 'q12-a',
  },
  {
    id: 'q13', number: 13, type: 'true-false', points: 1,
    text: 'It is acceptable to share your credentials with a colleague temporarily if they are locked out of the system.',
    options: [
      { id: 'q13-t', letter: 'True', text: 'True' },
      { id: 'q13-f', letter: 'False', text: 'False' },
    ],
    correctOptionId: 'q13-f',
  },
  {
    id: 'q14', number: 14, type: 'multiple-choice', points: 2,
    text: 'Which ISO standard specifically addresses Information Security Management Systems (ISMS)?',
    options: [
      { id: 'q14-a', letter: 'A', text: 'ISO 9001' },
      { id: 'q14-b', letter: 'B', text: 'ISO 27001' },
      { id: 'q14-c', letter: 'C', text: 'ISO 14001' },
      { id: 'q14-d', letter: 'D', text: 'ISO 31000' },
    ],
    correctOptionId: 'q14-b',
  },
  {
    id: 'q15', number: 15, type: 'text-input', points: 4,
    text: 'Your colleague receives an email asking them to transfer €5,000 to a new vendor account "urgently approved by the CEO." The CEO is currently traveling. Explain what steps your colleague should take and why.',
  },
];

// Initial state: Q1-Q6 answered, Q3 flagged, Q7 is current
export const INITIAL_ANSWERS: Record<string, string> = {
  q1: 'q1-b',
  q2: 'q2-b',
  q3: 'q3-f',
  q4: 'q4-c',
  q5: 'q5-b',
  q6: 'q6-f',
};

export const INITIAL_FLAGGED = new Set(['q3']);
export const INITIAL_QUESTION_INDEX = 6; // Q7 (0-indexed)

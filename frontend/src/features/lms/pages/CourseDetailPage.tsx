'use client'

import { CourseHero } from '../components/course-detail/CourseHero';
import { WhatYouLearnCard } from '../components/course-detail/WhatYouLearnCard';
import { CourseContentAccordion } from '../components/course-detail/CourseContentAccordion';
import { CourseDetailTabs } from '../components/course-detail/CourseDetailTabs';
import { CourseEnrollmentCard } from '../components/course-detail/CourseEnrollmentCard';
import type { CourseDetail } from '../types/course.types';

const MOCK_COURSE: CourseDetail = {
  id: '7',
  title: 'Cybersecurity Awareness 2024',
  category: 'Compliance',
  subtitle:
    'Protect yourself and your organization from modern cyber threats — learn to spot phishing attacks, manage credentials safely, and respond to security incidents before they escalate.',
  description:
    'Cyber threats are the fastest-growing risk category for organizations of every size. This mandatory awareness course is designed for every employee, regardless of technical background. You will gain a clear, practical understanding of how attackers operate and what you can do daily to reduce your company\'s attack surface.\n\nThe course covers the most common threat vectors — phishing, social engineering, weak credentials, unsafe browsing, and removable media — through realistic scenarios drawn from real incident reports. No jargon, no theory overload: each lesson maps directly to behavior you can change immediately.\n\nCompletion earns a compliance certificate valid for 12 months and satisfies GDPR Article 39 security awareness requirements and ISO 27001 Annex A.7.2.2.',
  level: 'Beginner',
  language: 'English',
  lastUpdated: 'January 2026',
  duration: '1h 45m',
  enrolledCount: 3200,
  rating: 4.7,
  reviewCount: 845,
  enrolled: false,
  isSponsored: true,
  learningOutcomes: [
    'Recognize phishing emails and spear-phishing attempts',
    'Create and manage strong, unique passwords with a password manager',
    'Understand social engineering tactics and how to refuse them',
    'Browse the internet safely on corporate networks',
    'Handle sensitive data in compliance with GDPR & ISO 27001',
    'Report a security incident using the correct internal procedure',
    'Identify risks from removable media and personal devices',
    'Apply the clean-desk and clear-screen policy correctly',
  ],
  requirements: [
    'No technical background required — open to all employees',
    'Access to a corporate email account for the phishing simulation exercise',
  ],
  targetAudience: [
    'All full-time and contract employees company-wide',
    'New hires completing mandatory onboarding compliance training',
    'Managers responsible for team security compliance sign-off',
    'Remote workers handling sensitive data outside the office network',
  ],
  sections: [
    {
      id: 's1',
      number: 1,
      title: 'The Threat Landscape in 2024',
      totalDuration: '22m',
      lessons: [
        { id: 'l1', title: 'Why Cybersecurity Is Everyone\'s Responsibility', duration: '5:10', type: 'video', locked: false, completed: true },
        { id: 'l2', title: 'How Attackers Choose Their Targets', duration: '7:30', type: 'video', locked: false, completed: true },
        { id: 'l3', title: 'The Cost of a Breach — Real Incident Data', duration: '6:20', type: 'video', locked: false, completed: false },
        { id: 'l4', title: 'Module 1 Knowledge Check', duration: '3:00', type: 'quiz', locked: false, completed: false },
      ],
    },
    {
      id: 's2',
      number: 2,
      title: 'Phishing & Social Engineering',
      totalDuration: '28m',
      lessons: [
        { id: 'l5', title: 'Anatomy of a Phishing Email', duration: '8:45', type: 'video', locked: false, completed: false },
        { id: 'l6', title: 'Spear-Phishing, Whaling & Vishing', duration: '7:00', type: 'video', locked: false, completed: false },
        { id: 'l7', title: 'Live Simulation: Spot the Phish', duration: '9:15', type: 'document', locked: false, completed: false },
        { id: 'l8', title: 'Reporting Suspicious Emails — Step by Step', duration: '3:00', type: 'document', locked: false, completed: false },
      ],
    },
    {
      id: 's3',
      number: 3,
      title: 'Password & Credential Security',
      totalDuration: '20m',
      lessons: [
        { id: 'l9', title: 'Why Passwords Fail and What to Do Instead', duration: '6:30', type: 'video', locked: true, completed: false },
        { id: 'l10', title: 'Setting Up a Password Manager', duration: '8:00', type: 'video', locked: true, completed: false },
        { id: 'l11', title: 'Multi-Factor Authentication — Hands-On Guide', duration: '5:30', type: 'document', locked: true, completed: false },
      ],
    },
    {
      id: 's4',
      number: 4,
      title: 'Safe Working Practices',
      totalDuration: '35m',
      lessons: [
        { id: 'l12', title: 'Public Wi-Fi & VPN Usage Policy', duration: '7:15', type: 'video', locked: true, completed: false },
        { id: 'l13', title: 'Removable Media and Shadow IT Risks', duration: '6:00', type: 'video', locked: true, completed: false },
        { id: 'l14', title: 'Clean Desk & Clear Screen Policy', duration: '4:30', type: 'video', locked: true, completed: false },
        { id: 'l15', title: 'Incident Response: What to Do in the First 15 Minutes', duration: '9:45', type: 'video', locked: true, completed: false },
        { id: 'l16', title: 'Final Assessment & Compliance Certificate', duration: '7:30', type: 'quiz', locked: true, completed: false },
      ],
    },
  ],
  instructor: {
    name: 'Alex Thompson',
    title: 'Senior Information Security Engineer, CISSP',
    bio: 'Alex Thompson is a Certified Information Systems Security Professional (CISSP) with 12 years of hands-on experience in enterprise security architecture, penetration testing, and security awareness program design. Previously a security engineer at Cloudflare and Palantir, Alex now leads corporate security training programs used by over 200 organizations across financial services, healthcare, and government sectors. His practical, non-alarmist teaching style makes complex threats immediately understandable for non-technical audiences.',
    coursesCount: 8,
    studentsCount: 31400,
    rating: 4.8,
  },
  reviews: [
    {
      id: 'r1',
      reviewerName: 'Nadia K.',
      rating: 5,
      date: 'March 2026',
      comment:
        'Finally a security awareness course that doesn\'t feel like a checkbox exercise. The phishing simulation was eye-opening — I nearly clicked one of the test emails myself before catching the red flags.',
    },
    {
      id: 'r2',
      reviewerName: 'David L.',
      rating: 5,
      date: 'February 2026',
      comment:
        'Rolled this out to our entire 400-person org during onboarding week. Completion rate was 98% — unheard of for compliance training. The short lesson format kept people engaged throughout.',
    },
    {
      id: 'r3',
      reviewerName: 'Hana M.',
      rating: 4,
      date: 'January 2026',
      comment:
        'Very practical and well-paced. I would like a more advanced track for IT staff, but as a baseline awareness course for all employees it\'s exactly what we needed to satisfy our ISO 27001 audit.',
    },
  ],
  ratingBreakdown: [
    { stars: 5, count: 571, percentage: 68 },
    { stars: 4, count: 202, percentage: 24 },
    { stars: 3, count: 51, percentage: 6 },
    { stars: 2, count: 13, percentage: 1 },
    { stars: 1, count: 8, percentage: 1 },
  ],
};

export default function CourseDetailPage() {
  return (
    <div className="min-h-screen bg-t-bg-primary">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Left column — 60% */}
          <div className="min-w-0 lg:flex-[3]">
            <CourseHero course={MOCK_COURSE} />
            <WhatYouLearnCard outcomes={MOCK_COURSE.learningOutcomes} />
            <CourseContentAccordion courseId={MOCK_COURSE.id} sections={MOCK_COURSE.sections} />
            <CourseDetailTabs course={MOCK_COURSE} />
          </div>

          {/* Right column — 40% sticky */}
          <aside className="shrink-0 lg:flex-[2]">
            <div className="lg:sticky lg:top-24">
              <CourseEnrollmentCard course={MOCK_COURSE} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

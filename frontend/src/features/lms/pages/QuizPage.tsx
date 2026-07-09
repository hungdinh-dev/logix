'use client'

import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { QuizTopBar } from '../components/quiz/QuizTopBar';
import { QuizNavigatorPanel } from '../components/quiz/QuizNavigatorPanel';
import { QuizQuestionCard } from '../components/quiz/QuizQuestionCard';
import {
  MOCK_QUIZ_META,
  MOCK_QUESTIONS,
  INITIAL_ANSWERS,
  INITIAL_FLAGGED,
  INITIAL_QUESTION_INDEX,
} from '../mocks/quiz.mock';

export default function QuizPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(INITIAL_QUESTION_INDEX);
  const [answers, setAnswers] = useState<Record<string, string>>(INITIAL_ANSWERS);
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set(INITIAL_FLAGGED));
  const [submitted, setSubmitted] = useState(false);

  const question = MOCK_QUESTIONS[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === MOCK_QUESTIONS.length - 1;
  const hasAnswer =
    question.type === 'text-input'
      ? Boolean(textAnswers[question.id]?.trim())
      : Boolean(answers[question.id]);

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  };

  const handleTextChange = (text: string) => {
    setTextAnswers((prev) => ({ ...prev, [question.id]: text }));
    if (text.trim()) {
      setAnswers((prev) => ({ ...prev, [question.id]: '__text__' }));
    } else {
      setAnswers((prev) => {
        const next = { ...prev };
        delete next[question.id];
        return next;
      });
    }
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(question.id)) next.delete(question.id);
      else next.add(question.id);
      return next;
    });
  };

  const handleSubmit = () => setSubmitted(true);

  const handleSaveExit = () => router.back();

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Top bar */}
      <QuizTopBar
        courseName={MOCK_QUIZ_META.courseName}
        quizTitle={MOCK_QUIZ_META.title}
        currentQuestion={currentIndex + 1}
        totalQuestions={MOCK_QUIZ_META.totalQuestions}
        initialSeconds={MOCK_QUIZ_META.durationSeconds}
        onSaveExit={handleSaveExit}
      />

      {/* Left navigator panel */}
      <QuizNavigatorPanel
        questions={MOCK_QUESTIONS}
        currentQuestionId={question.id}
        answers={answers}
        flagged={flagged}
        onNavigate={setCurrentIndex}
        onToggleFlag={handleToggleFlag}
        onSubmit={handleSubmit}
      />

      {/* Main content */}
      <div className="pt-16">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <QuizQuestionCard
            question={question}
            questionNumber={currentIndex + 1}
            selectedOptionId={answers[question.id]}
            textAnswer={textAnswers[question.id] ?? ''}
            submitted={submitted}
            onSelectOption={handleSelectOption}
            onTextChange={handleTextChange}
          />

          {/* Navigation row */}
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={isFirst}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50',
                isFirst && 'cursor-not-allowed opacity-40',
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            {!isLast ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((i) => Math.min(MOCK_QUESTIONS.length - 1, i + 1))}
                disabled={!hasAnswer && !submitted}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-colors',
                  hasAnswer || submitted
                    ? 'bg-primary hover:bg-primary/80'
                    : 'cursor-not-allowed bg-border text-muted-foreground',
                )}
              >
                Next Question
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentIndex((i) => Math.min(MOCK_QUESTIONS.length - 1, i + 1))}
                disabled
                className="cursor-not-allowed rounded-xl bg-border px-5 py-2.5 text-sm font-medium text-muted-foreground"
              >
                Last Question
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

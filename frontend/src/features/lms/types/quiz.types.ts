export type QuestionType = 'multiple-choice' | 'true-false' | 'text-input';

export interface AnswerOption {
  readonly id: string;
  readonly letter: string;
  readonly text: string;
}

export interface QuizQuestion {
  readonly id: string;
  readonly number: number;
  readonly type: QuestionType;
  readonly points: number;
  readonly text: string;
  readonly hasImage?: boolean;
  readonly options?: readonly AnswerOption[];
  readonly correctOptionId?: string;
}

export interface QuizMeta {
  readonly id: string;
  readonly title: string;
  readonly courseName: string;
  readonly totalQuestions: number;
  readonly durationSeconds: number;
}

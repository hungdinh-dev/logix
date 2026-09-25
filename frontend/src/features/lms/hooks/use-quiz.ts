'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { quizService } from '../services/quiz.service'
import { PROGRESS_KEYS } from './use-course-progress'
import type {
  QuizTakeResponse,
  QuizSubmitPayload,
  QuizSubmitResult,
} from '../types/quiz.types'

export const QUIZ_KEYS = {
  all: ['quizzes'] as const,
  take: (id: string) => [...QUIZ_KEYS.all, 'take', id] as const,
  attempts: (id: string) => [...QUIZ_KEYS.all, 'attempts', id] as const,
  detail: (id: string) => [...QUIZ_KEYS.all, 'detail', id] as const,
}

export function useQuizTake(quizOrLessonId: string) {
  return useQuery<QuizTakeResponse>({
    queryKey: QUIZ_KEYS.take(quizOrLessonId),
    queryFn: () => quizService.getQuizForTake(quizOrLessonId),
    enabled: Boolean(quizOrLessonId),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

export function useQuizAttempts(quizOrLessonId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.attempts(quizOrLessonId),
    queryFn: () => quizService.getQuizAttempts(quizOrLessonId),
    enabled: Boolean(quizOrLessonId),
    staleTime: 1000 * 30,
  })
}

export function useSubmitQuiz(quizOrLessonId: string) {
  const queryClient = useQueryClient()

  return useMutation<QuizSubmitResult, Error, QuizSubmitPayload>({
    mutationFn: (payload: QuizSubmitPayload) =>
      quizService.submitQuiz(quizOrLessonId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.take(quizOrLessonId) })
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.attempts(quizOrLessonId) })
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEYS.all })
      queryClient.invalidateQueries({ queryKey: ['courses'] })

      if (data.isPassed) {
        toast.success(
          `🎉 Chúc mừng! Bạn đã đạt ${data.score}% điểm (Yêu cầu: ${data.passScore}%)!`
        )
      } else {
        toast.warning(
          `Bạn đạt ${data.score}% điểm (Chưa đạt mức ${data.passScore}%). ${
            data.remainingAttempts !== null && data.remainingAttempts > 0
              ? `Bạn còn ${data.remainingAttempts} lượt thi lại.`
              : 'Đã hết lượt thi lại cho bài kiểm tra này.'
          }`
        )
      }
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Có lỗi khi nộp bài kiểm tra. Vui lòng thử lại.'
      )
    },
  })
}

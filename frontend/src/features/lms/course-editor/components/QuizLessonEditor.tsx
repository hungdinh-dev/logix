'use client'

import React from 'react'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { LessonItem } from '../types/course-editor.types'

interface QuizLessonEditorProps {
  lesson: LessonItem
  onChange: (updated: LessonItem) => void
  onAddQuestion: () => void
}

export function QuizLessonEditor({ lesson, onChange, onAddQuestion }: QuizLessonEditorProps) {
  const questions = lesson.quizQuestions || []

  const handleDeleteQuestion = (qId: string) => {
    const updatedQuestions = questions.filter((item) => item.id !== qId)
    onChange({ ...lesson, quizQuestions: updatedQuestions })
  }

  const handleUpdateQuestionText = (qId: string, text: string) => {
    const updatedQuestions = questions.map((item) =>
      item.id === qId ? { ...item, questionText: text } : item
    )
    onChange({ ...lesson, quizQuestions: updatedQuestions })
  }

  const handleMarkCorrectOption = (qId: string, optId: string) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id !== qId) return q
      return {
        ...q,
        options: q.options.map((o) => ({
          ...o,
          isCorrect: o.id === optId,
        })),
      }
    })
    onChange({ ...lesson, quizQuestions: updatedQuestions })
  }

  const handleUpdateOptionText = (qId: string, optId: string, text: string) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id !== qId) return q
      return {
        ...q,
        options: q.options.map((o) => (o.id === optId ? { ...o, text } : o)),
      }
    })
    onChange({ ...lesson, quizQuestions: updatedQuestions })
  }

  return (
    <div className="space-y-4 rounded-lg border p-4 bg-amber-500/5 border-amber-300/40">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-amber-800 dark:text-amber-300">
            Điểm Đạt Yêu Cầu (%)
          </Label>
          <Input
            type="number"
            value={lesson.quizPassScore || 80}
            onChange={(e) => onChange({ ...lesson, quizPassScore: Number(e.target.value) || 80 })}
            className="text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-amber-800 dark:text-amber-300">
            Thời gian làm bài (Phút)
          </Label>
          <Input
            type="number"
            value={lesson.quizTimeLimit || 15}
            onChange={(e) => onChange({ ...lesson, quizTimeLimit: Number(e.target.value) || 15 })}
            className="text-xs"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Danh Sách Câu Hỏi Trắc Nghiệm ({questions.length} câu)
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddQuestion}
            className="h-7 cursor-pointer gap-1 px-2 text-[11px] font-medium"
          >
            <PlusCircle className="h-3.5 w-3.5 text-amber-600" />
            + Thêm Câu Hỏi
          </Button>
        </div>

        <div className="space-y-3">
          {questions.map((q, qIdx) => (
            <div key={q.id} className="rounded-lg border bg-card p-3 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary">Câu {qIdx + 1}:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="h-6 text-red-500 text-[10px] p-1 cursor-pointer"
                >
                  Xóa câu hỏi
                </Button>
              </div>

              <Input
                value={q.questionText}
                onChange={(e) => handleUpdateQuestionText(q.id, e.target.value)}
                className="text-xs font-medium"
              />

              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-semibold text-muted-foreground">
                  Các lựa chọn trả lời (Tích chọn đáp án đúng):
                </span>
                {q.options.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={opt.isCorrect}
                      onChange={() => handleMarkCorrectOption(q.id, opt.id)}
                      className="h-3.5 w-3.5 text-primary cursor-pointer"
                    />
                    <Input
                      value={opt.text}
                      onChange={(e) => handleUpdateOptionText(q.id, opt.id, e.target.value)}
                      className={`text-xs h-7 ${
                        opt.isCorrect
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 font-medium'
                          : ''
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

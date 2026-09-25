'use client'

import React from 'react'
import { PlusCircle, HelpCircle, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

  const handleUpdateQuestionType = (
    qId: string,
    qType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE'
  ) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id !== qId) return q
      if (qType === 'TRUE_FALSE') {
        return {
          ...q,
          questionType: qType,
          options: [
            { id: `${q.id}-opt-1`, text: 'Đúng', isCorrect: true },
            { id: `${q.id}-opt-2`, text: 'Sai', isCorrect: false },
          ],
        }
      }
      if (qType === 'SINGLE_CHOICE') {
        const firstCorrect = q.options.findIndex((o) => o.isCorrect)
        return {
          ...q,
          questionType: qType,
          options: q.options.map((o, idx) => ({
            ...o,
            isCorrect: firstCorrect >= 0 ? idx === firstCorrect : idx === 0,
          })),
        }
      }
      return {
        ...q,
        questionType: qType,
      }
    })
    onChange({ ...lesson, quizQuestions: updatedQuestions })
  }

  const handleToggleOptionCorrect = (qId: string, optId: string, isMulti: boolean) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id !== qId) return q
      if (isMulti) {
        return {
          ...q,
          options: q.options.map((o) => (o.id === optId ? { ...o, isCorrect: !o.isCorrect } : o)),
        }
      }
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

  const handleAddOptionToQuestion = (qId: string) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id !== qId || q.options.length >= 6) return q
      const nextLetter = String.fromCharCode(65 + q.options.length)
      return {
        ...q,
        options: [
          ...q.options,
          {
            id: `opt-${Date.now()}-${q.options.length + 1}`,
            text: `Lựa chọn ${nextLetter}`,
            isCorrect: false,
          },
        ],
      }
    })
    onChange({ ...lesson, quizQuestions: updatedQuestions })
  }

  const handleRemoveOptionFromQuestion = (qId: string, optId: string) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id !== qId || q.options.length <= 2) return q
      return {
        ...q,
        options: q.options.filter((o) => o.id !== optId),
      }
    })
    onChange({ ...lesson, quizQuestions: updatedQuestions })
  }

  const handleUpdateExplanation = (qId: string, text: string) => {
    const updatedQuestions = questions.map((item) =>
      item.id === qId ? { ...item, explanation: text } : item
    )
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
          {questions.map((q, qIdx) => {
            const isMulti = q.questionType === 'MULTIPLE_CHOICE'
            const isTrueFalse = q.questionType === 'TRUE_FALSE'

            return (
              <div key={q.id} className="rounded-lg border bg-card p-3 shadow-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">Câu {qIdx + 1}:</span>
                    <Select
                      value={q.questionType || 'SINGLE_CHOICE'}
                      onValueChange={(val: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE') =>
                        handleUpdateQuestionType(q.id, val)
                      }
                    >
                      <SelectTrigger className="h-6 w-36 text-[10px] font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SINGLE_CHOICE" className="text-xs">
                          1 Đáp án (Radio)
                        </SelectItem>
                        <SelectItem value="MULTIPLE_CHOICE" className="text-xs">
                          Nhiều đáp án (Checkbox)
                        </SelectItem>
                        <SelectItem value="TRUE_FALSE" className="text-xs">
                          Đúng / Sai
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                  placeholder="Nhập nội dung câu hỏi..."
                  className="text-xs font-medium"
                />

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      {isMulti
                        ? 'Các lựa chọn trả lời (Tích chọn một hoặc nhiều ô vuông để chỉ định đáp án đúng):'
                        : 'Các lựa chọn trả lời (Tích chọn tròn để chỉ định đáp án đúng duy nhất):'}
                    </span>
                    {!isTrueFalse && q.options.length < 6 && (
                      <button
                        type="button"
                        onClick={() => handleAddOptionToQuestion(q.id)}
                        className="text-[10px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Thêm lựa chọn</span>
                      </button>
                    )}
                  </div>

                  {q.options.map((opt) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <input
                        type={isMulti ? 'checkbox' : 'radio'}
                        name={isMulti ? undefined : `correct-${q.id}`}
                        checked={opt.isCorrect}
                        onChange={() => handleToggleOptionCorrect(q.id, opt.id, isMulti)}
                        className="h-3.5 w-3.5 text-primary cursor-pointer accent-primary shrink-0"
                        title={isMulti ? 'Tích chọn đáp án đúng' : 'Đánh dấu đáp án đúng duy nhất'}
                      />
                      <Input
                        value={opt.text}
                        onChange={(e) => handleUpdateOptionText(q.id, opt.id, e.target.value)}
                        disabled={isTrueFalse}
                        className={`text-xs h-7 flex-1 ${
                          opt.isCorrect
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 font-medium'
                            : ''
                        }`}
                      />
                      {!isTrueFalse && q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionFromQuestion(q.id, opt.id)}
                          className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                          title="Xóa lựa chọn này"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Explanation Field */}
                <div className="pt-2 space-y-1.5 border-t border-dashed">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                    <HelpCircle className="h-3.5 w-3.5 text-primary" />
                    <span>Giải thích đáp án chi tiết (Hiển thị sau khi học viên nộp bài / xem lại):</span>
                  </div>
                  <Textarea
                    value={q.explanation || ''}
                    onChange={(e) => handleUpdateExplanation(q.id, e.target.value)}
                    placeholder="Ví dụ: Theo chuẩn SOP-01, cần kiểm tra nhiệt độ dầu trước khi bật bếp để đảm bảo an toàn..."
                    rows={2}
                    className="text-xs bg-muted/20 min-h-[44px] leading-relaxed resize-y"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

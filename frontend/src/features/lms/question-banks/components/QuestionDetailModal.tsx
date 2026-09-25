'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Loader2,
  HelpCircle,
  CheckCircle2,
  CheckSquare,
  Square,
  Plus,
  Trash2,
} from 'lucide-react'
import type { BankQuestionItem, CreateBankQuestionInput } from '../types/question-banks.types'

interface QuestionDetailModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: BankQuestionItem | null
  onSubmit: (data: CreateBankQuestionInput) => Promise<void>
  isSubmitting: boolean
}

interface OptionFormState {
  text: string
  isCorrect: boolean
}

export function QuestionDetailModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isSubmitting,
}: QuestionDetailModalProps) {
  const isEdit = Boolean(initialData)

  const [code, setCode] = useState('')
  const [question, setQuestion] = useState('')
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM')
  const [type, setType] = useState<'SINGLE' | 'MULTIPLE' | 'TRUE_FALSE'>('SINGLE')
  const [points, setPoints] = useState(1)
  const [explanation, setExplanation] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [options, setOptions] = useState<OptionFormState[]>([
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setCode(initialData.externalCode || initialData.code || '')
      setQuestion(initialData.questionText || initialData.question || '')
      setDifficulty(initialData.difficulty || 'MEDIUM')
      const rawType = initialData.questionType || initialData.type || 'SINGLE_CHOICE'
      setType(rawType.includes('MULTIPLE') ? 'MULTIPLE' : rawType.includes('TRUE') ? 'TRUE_FALSE' : 'SINGLE')
      setPoints(initialData.points || 1)
      setExplanation(initialData.explanation || '')
      
      const tagsVal = initialData.tags
      if (typeof tagsVal === 'string') {
        setTagsInput(tagsVal)
      } else if (Array.isArray(tagsVal)) {
        setTagsInput(tagsVal.join(', '))
      } else {
        setTagsInput('')
      }

      if (initialData.options && initialData.options.length > 0) {
        setOptions(
          initialData.options.map((o) => ({
            text: o.optionText || o.text || '',
            isCorrect: Boolean(o.isCorrect),
          }))
        )
      } else {
        setOptions([
          { text: '', isCorrect: true },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ])
      }
    } else {
      setCode('')
      setQuestion('')
      setDifficulty('MEDIUM')
      setType('SINGLE')
      setPoints(1)
      setExplanation('')
      setTagsInput('')
      setOptions([
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ])
    }
    setErrorMsg(null)
  }, [initialData, isOpen])

  const handleTypeChange = (newType: 'SINGLE' | 'MULTIPLE' | 'TRUE_FALSE') => {
    setType(newType)
    if (newType === 'TRUE_FALSE') {
      setOptions([
        { text: 'Đúng', isCorrect: true },
        { text: 'Sai', isCorrect: false },
      ])
    } else if (newType === 'SINGLE') {
      // Giữ duy nhất 1 đáp án đúng
      setOptions((prev) => {
        const firstCorrectIdx = prev.findIndex((o) => o.isCorrect)
        return prev.map((o, idx) => ({
          ...o,
          isCorrect: firstCorrectIdx >= 0 ? idx === firstCorrectIdx : idx === 0,
        }))
      })
    }
  }

  const handleOptionTextChange = (index: number, val: string) => {
    setOptions((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], text: val }
      return next
    })
  }

  const handleToggleCorrectOption = (index: number) => {
    if (type === 'MULTIPLE') {
      // Tích/bỏ tích nhiều đáp án
      setOptions((prev) =>
        prev.map((opt, idx) => (idx === index ? { ...opt, isCorrect: !opt.isCorrect } : opt))
      )
    } else {
      // Chỉ 1 đáp án duy nhất đúng
      setOptions((prev) =>
        prev.map((opt, idx) => ({
          ...opt,
          isCorrect: idx === index,
        }))
      )
    }
  }

  const handleAddOption = () => {
    if (options.length >= 6) return
    setOptions((prev) => [...prev, { text: '', isCorrect: false }])
  }

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return
    setOptions((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code.trim()) {
      setErrorMsg('Mã câu hỏi không được để trống')
      return
    }
    if (!question.trim()) {
      setErrorMsg('Nội dung câu hỏi không được để trống')
      return
    }

    const validOptions = options.filter((o) => o.text.trim() !== '')
    if (validOptions.length < 2) {
      setErrorMsg('Vui lòng nhập ít nhất 2 đáp án lựa chọn')
      return
    }

    const normalizedType =
      type === 'SINGLE' ? 'SINGLE_CHOICE' : type === 'MULTIPLE' ? 'MULTIPLE_CHOICE' : 'TRUE_FALSE'

    const correctCount = validOptions.filter((o) => o.isCorrect).length
    if (normalizedType === 'SINGLE_CHOICE' || normalizedType === 'TRUE_FALSE') {
      if (correctCount !== 1) {
        setErrorMsg('Câu hỏi trắc nghiệm 1 đáp án (hoặc Đúng/Sai) bắt buộc phải có đúng 1 đáp án đúng')
        return
      }
    } else if (normalizedType === 'MULTIPLE_CHOICE') {
      if (correctCount < 1) {
        setErrorMsg('Câu hỏi trắc nghiệm nhiều đáp án bắt buộc phải chọn ít nhất 1 đáp án đúng')
        return
      }
    }

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    setErrorMsg(null)

    await onSubmit({
      externalCode: code.trim().toUpperCase(),
      code: code.trim().toUpperCase(),
      questionText: question.trim(),
      question: question.trim(),
      difficulty,
      questionType: normalizedType,
      type,
      points: Number(points) || 1,
      explanation: explanation.trim() || undefined,
      tags: parsedTags,
      options: validOptions.map((o, idx) => ({
        optionText: o.text.trim(),
        text: o.text.trim(),
        isCorrect: o.isCorrect,
        sortOrder: idx + 1,
        orderIndex: idx,
      })),
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-card border-border">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  {isEdit ? 'Chỉnh sửa câu hỏi ngân hàng' : 'Thêm câu hỏi mới vào ngân hàng'}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Điền thông tin chi tiết câu hỏi, phân loại định dạng và các phương án đáp án.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-lg border border-destructive/20 font-medium">
                {errorMsg}
              </div>
            )}

            {/* Mã & Loại câu hỏi & Độ khó & Điểm */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Mã câu hỏi <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="VD: Q_JS_001"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono uppercase text-xs"
                  disabled={isEdit}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Loại câu hỏi</Label>
                <Select
                  value={type}
                  onValueChange={(val: 'SINGLE' | 'MULTIPLE' | 'TRUE_FALSE') => handleTypeChange(val)}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE" className="text-xs">1 Đáp án (Single)</SelectItem>
                    <SelectItem value="MULTIPLE" className="text-xs">Nhiều đáp án (Multiple)</SelectItem>
                    <SelectItem value="TRUE_FALSE" className="text-xs">Đúng / Sai (True/False)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Độ khó</Label>
                <Select
                  value={difficulty}
                  onValueChange={(val: 'EASY' | 'MEDIUM' | 'HARD') => setDifficulty(val)}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EASY" className="text-xs">Dễ (Easy)</SelectItem>
                    <SelectItem value="MEDIUM" className="text-xs">Trung bình (Medium)</SelectItem>
                    <SelectItem value="HARD" className="text-xs">Khó (Hard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Điểm số</Label>
                <Input
                  type="number"
                  min={0.5}
                  step={0.5}
                  max={100}
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Nội dung câu hỏi */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Nội dung câu hỏi <span className="text-destructive">*</span>
              </Label>
              <Textarea
                rows={3}
                placeholder="Nhập nội dung câu hỏi trắc nghiệm..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="text-xs resize-none"
              />
            </div>

            {/* Các lựa chọn đáp án */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground">
                  Phương án lựa chọn (Chọn đáp án đúng) <span className="text-destructive">*</span>
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  {type === 'MULTIPLE'
                    ? 'Tích chọn một hoặc nhiều ô vuông để chỉ định đáp án đúng'
                    : 'Tích tròn để chọn đáp án đúng duy nhất'}
                </span>
              </div>

              <div className="space-y-2">
                {options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx)
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border transition-colors ${
                        opt.isCorrect
                          ? 'border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10'
                          : 'border-border/70 bg-muted/10'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleCorrectOption(idx)}
                        className={`h-6 w-6 flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer transition-colors ${
                          type === 'MULTIPLE' ? 'rounded-md' : 'rounded-full'
                        } ${
                          opt.isCorrect
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-muted text-muted-foreground hover:bg-muted-foreground/20'
                        }`}
                        title={type === 'MULTIPLE' ? 'Tích chọn đáp án đúng' : 'Đánh dấu đáp án này là đúng'}
                      >
                        {type === 'MULTIPLE' ? (
                          opt.isCorrect ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />
                        ) : opt.isCorrect ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          letter
                        )}
                      </button>

                      <Input
                        placeholder={`Đáp án ${letter}...`}
                        value={opt.text}
                        onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                        className="text-xs flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:bg-background"
                        disabled={type === 'TRUE_FALSE'}
                      />

                      {opt.isCorrect && (
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0 pr-1">
                          Đáp án đúng
                        </span>
                      )}

                      {type !== 'TRUE_FALSE' && options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                          title="Xóa phương án này"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              {type !== 'TRUE_FALSE' && options.length < 6 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddOption}
                  className="text-xs text-primary hover:text-primary/80 h-8 gap-1.5 mt-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Thêm phương án lựa chọn</span>
                </Button>
              )}
            </div>

            {/* Giải thích */}
            <div className="space-y-1.5 pt-2">
              <Label className="text-xs font-semibold text-foreground">
                Lời giải thích / Hướng dẫn trả lời
              </Label>
              <Textarea
                rows={2}
                placeholder="Giải thích tại sao đáp án này là chính xác..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="text-xs resize-none"
              />
            </div>

            {/* Thẻ tags */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Thẻ phân loại (Tags, phân cách bằng dấu phẩy)
              </Label>
              <Input
                placeholder="javascript, closures, scope, es6"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="p-4 border-t border-border bg-muted/20 flex items-center justify-between sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>{isEdit ? 'Cập nhật câu hỏi' : 'Lưu vào ngân hàng'}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Edit,
  Trash2,
  Inbox,
  Sparkles,
  Tag,
  Plus,
} from 'lucide-react'
import type { BankQuestionItem } from '../types/question-banks.types'

interface BankQuestionsTableProps {
  questions: BankQuestionItem[]
  isLoading: boolean
  onEditQuestion: (question: BankQuestionItem) => void
  onDeleteQuestion: (question: BankQuestionItem) => void
  onAddNewQuestion: () => void
}

const DIFFICULTY_MAP: Record<string, { label: string; badgeClass: string }> = {
  EASY: {
    label: 'Dễ',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  MEDIUM: {
    label: 'Trung bình',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  HARD: {
    label: 'Khó',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  },
}

const TYPE_MAP: Record<string, string> = {
  SINGLE: 'Một đáp án',
  MULTIPLE: 'Nhiều đáp án',
  TRUE_FALSE: 'Đúng / Sai',
}

export function BankQuestionsTable({
  questions,
  isLoading,
  onEditQuestion,
  onDeleteQuestion,
  onAddNewQuestion,
}: BankQuestionsTableProps) {
  const [search, setSearch] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [deletingQuestion, setDeletingQuestion] = useState<BankQuestionItem | null>(null)

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const qText = (q.questionText || q.question || '').toLowerCase()
      const qCode = (q.externalCode || q.code || '').toLowerCase()
      const tagStr = typeof q.tags === 'string' ? q.tags.toLowerCase() : Array.isArray(q.tags) ? q.tags.join(' ').toLowerCase() : ''

      const matchSearch =
        !search.trim() ||
        qText.includes(search.toLowerCase()) ||
        qCode.includes(search.toLowerCase()) ||
        tagStr.includes(search.toLowerCase())

      const matchDifficulty =
        difficultyFilter === 'ALL' || q.difficulty === difficultyFilter

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && q.isActive) ||
        (statusFilter === 'INACTIVE' && !q.isActive)

      return matchSearch && matchDifficulty && matchStatus
    })
  }, [questions, search, difficultyFilter, statusFilter])

  const hasActiveFilters = search.trim() !== '' || difficultyFilter !== 'ALL' || statusFilter !== 'ALL'

  const handleResetFilters = () => {
    setSearch('')
    setDifficultyFilter('ALL')
    setStatusFilter('ALL')
  }

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-4 py-3">
              <Skeleton className="h-6 w-16 rounded" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Sub-toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nội dung, mã câu, thẻ tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-32 text-xs h-9">
              <SelectValue placeholder="Độ khó" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">Tất cả độ khó</SelectItem>
              <SelectItem value="EASY" className="text-xs">Dễ</SelectItem>
              <SelectItem value="MEDIUM" className="text-xs">Trung bình</SelectItem>
              <SelectItem value="HARD" className="text-xs">Khó</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 text-xs h-9">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">Tất cả trạng thái</SelectItem>
              <SelectItem value="ACTIVE" className="text-xs">Đang áp dụng</SelectItem>
              <SelectItem value="INACTIVE" className="text-xs">Vô hiệu hóa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs h-9 text-muted-foreground hover:text-foreground"
            >
              Đặt lại lọc
            </Button>
          )}
          <Button
            size="sm"
            onClick={onAddNewQuestion}
            className="text-xs h-9 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm câu hỏi</span>
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mx-auto">
              <Inbox className="h-6 w-6 opacity-60" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Không tìm thấy câu hỏi nào</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {hasActiveFilters
                  ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem kết quả khác.'
                  : 'Ngân hàng này chưa có câu hỏi nào. Bạn có thể đồng bộ Google Sheets, Import CSV hoặc thêm thủ công.'}
              </p>
            </div>
            {hasActiveFilters ? (
              <Button variant="outline" size="sm" onClick={handleResetFilters} className="text-xs">
                Xóa bộ lọc
              </Button>
            ) : (
              <Button size="sm" onClick={onAddNewQuestion} className="text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                <span>Tạo câu hỏi đầu tiên</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40 border-b border-border/80">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-24 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Mã
                  </TableHead>
                  <TableHead className="min-w-[280px] text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Nội dung câu hỏi
                  </TableHead>
                  <TableHead className="min-w-[260px] text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Các lựa chọn đáp án
                  </TableHead>
                  <TableHead className="w-28 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Độ khó
                  </TableHead>
                  <TableHead className="w-24 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-center">
                    Điểm
                  </TableHead>
                  <TableHead className="w-24 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-center">
                    Phiên bản
                  </TableHead>
                  <TableHead className="w-20 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-right pr-4">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.map((q) => {
                  const diffMeta = DIFFICULTY_MAP[q.difficulty] || DIFFICULTY_MAP.MEDIUM

                  return (
                    <TableRow
                      key={q.id}
                      className={`hover:bg-muted/30 transition-colors ${!q.isActive ? 'opacity-60 bg-muted/10' : ''}`}
                    >
                      {/* Mã & Loại câu hỏi */}
                      <TableCell className="font-mono text-xs text-foreground align-top pt-3.5 space-y-1.5">
                        <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0">
                          {q.externalCode || q.code || 'Q'}
                        </Badge>
                        <div>
                          {q.questionType === 'MULTIPLE_CHOICE' || q.type === 'MULTIPLE' ? (
                            <Badge className="text-[10px] px-1.5 py-0 bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800 font-semibold">
                              Nhiều đáp án
                            </Badge>
                          ) : q.questionType === 'TRUE_FALSE' || q.type === 'TRUE_FALSE' ? (
                            <Badge className="text-[10px] px-1.5 py-0 bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800 font-semibold">
                              Đúng / Sai
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 text-muted-foreground font-normal">
                              1 Đáp án
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Nội dung câu hỏi & tags */}
                      <TableCell className="align-top pt-3.5 space-y-1.5">
                        <p className="text-xs font-medium text-foreground leading-relaxed">
                          {q.questionText || q.question}
                        </p>
                        {q.explanation && (
                          <p className="text-[11px] text-muted-foreground bg-muted/40 p-1.5 rounded border border-border/50">
                            💡 <span className="font-medium">Giải thích:</span> {q.explanation}
                          </p>
                        )}
                        {q.tags && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {(Array.isArray(q.tags)
                              ? q.tags
                              : typeof q.tags === 'string'
                              ? q.tags.split(',').map((t) => t.trim()).filter(Boolean)
                              : []
                            ).map((tag, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 bg-muted text-muted-foreground font-normal"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </TableCell>

                      {/* Các lựa chọn đáp án */}
                      <TableCell className="align-top pt-3.5">
                        <div className="space-y-1">
                          {q.options && q.options.length > 0 ? (
                            q.options.map((opt, optIdx) => (
                              <div
                                key={opt.id || optIdx}
                                className={`text-[11px] px-2 py-1 rounded flex items-center gap-1.5 ${
                                  opt.isCorrect
                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/20'
                                    : 'text-muted-foreground bg-muted/20'
                                }`}
                              >
                                {opt.isCorrect ? (
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                ) : (
                                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 shrink-0 ml-0.5" />
                                )}
                                <span className="truncate">{opt.optionText || opt.text}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-[11px] text-muted-foreground italic">Chưa có lựa chọn</span>
                          )}
                        </div>
                      </TableCell>

                      {/* Độ khó */}
                      <TableCell className="align-top pt-3.5">
                        <div className="space-y-1">
                          <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${diffMeta.badgeClass}`}>
                            {diffMeta.label}
                          </Badge>
                          <div className="text-[10px] text-muted-foreground">
                            {q.type ? TYPE_MAP[q.type] || q.type : q.questionType || 'Một đáp án'}
                          </div>
                        </div>
                      </TableCell>

                      {/* Điểm */}
                      <TableCell className="align-top pt-3.5 text-center">
                        <span className="text-xs font-semibold text-foreground">
                          {q.points} pt
                        </span>
                      </TableCell>

                      {/* Phiên bản */}
                      <TableCell className="align-top pt-3.5 text-center">
                        <div className="space-y-1">
                          <span className="text-[11px] font-mono text-muted-foreground">
                            v{q.version}
                          </span>
                          <div>
                            {q.isActive ? (
                              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Đang áp dụng" />
                            ) : (
                              <span className="inline-block w-2 h-2 rounded-full bg-rose-500" title="Đã vô hiệu hóa" />
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Thao tác */}
                      <TableCell className="align-top pt-3.5 text-right pr-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                            onClick={() => onEditQuestion(q)}
                            title="Chỉnh sửa câu hỏi"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
                            onClick={() => setDeletingQuestion(q)}
                            title="Xóa câu hỏi"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Alert Dialog for Question Deletion */}
      <AlertDialog
        open={Boolean(deletingQuestion)}
        onOpenChange={(open) => !open && setDeletingQuestion(null)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base text-foreground">
              Xác nhận xóa câu hỏi khỏi ngân hàng?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground space-y-1">
              <span>Bạn chuẩn bị xóa câu hỏi:</span>{' '}
              <strong className="text-foreground">
                [{deletingQuestion?.externalCode || deletingQuestion?.code || 'Q'}] {deletingQuestion?.questionText || deletingQuestion?.question}
              </strong>
              <p className="text-destructive text-[11px] pt-1">
                Thao tác này sẽ cập nhật phiên bản ngân hàng câu hỏi và ghi nhận vào lịch sử Audit Log.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deletingQuestion) {
                  onDeleteQuestion(deletingQuestion)
                  setDeletingQuestion(null)
                }
              }}
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

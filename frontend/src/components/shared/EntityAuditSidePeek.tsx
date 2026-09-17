'use client'

import React, { useState, useMemo } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  History,
  Clock,
  PlusCircle,
  Edit3,
  CheckCircle2,
  Copy,
  Trash2,
  Layers,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  FileText,
  User,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Plus,
  Minus,
  BookOpen,
  Video,
  CornerDownRight,
} from 'lucide-react'
import { useEntityAuditLogs } from '@/features/lms/hooks/use-audit-logs'
import type { AuditLogItem, FieldDiffItem } from '@/features/lms/types/audit-log.types'
import { cn } from '@/lib/utils'

interface EntityAuditSidePeekProps {
  isOpen: boolean
  onClose: () => void
  tableName: string
  entityId?: string | null
  entityTitle?: string
  entitySubtitle?: string
}

const FIELD_LABEL_MAP: Record<string, string> = {
  title: 'Tên khóa học',
  code: 'Mã khóa học',
  slug: 'Đường dẫn (Slug)',
  description: 'Mô tả chi tiết',
  categoryId: 'Danh mục khóa học',
  courseType: 'Loại khóa học',
  isMandatory: 'Khóa học bắt buộc',
  durationDays: 'Thời hạn hoàn thành (ngày)',
  progressionMode: 'Chế độ học tuần tự',
  status: 'Trạng thái phát hành',
  thumbnailUrl: 'Ảnh đại diện (Thumbnail)',
  targetPositionId: 'Chức danh áp dụng',
  targetDepartmentId: 'Phòng ban áp dụng',
  targetStoreId: 'Cửa hàng áp dụng',
  targetEmploymentStatus: 'Loại nhân sự',
  hasCertificate: 'Cấp chứng chỉ hoàn thành',
  certificateTemplateId: 'Mẫu chứng chỉ',
  isActive: 'Trạng thái hoạt động',
}

const ACTION_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string; badgeClass: string }
> = {
  CREATE: {
    label: 'Tạo mới',
    icon: PlusCircle,
    color: 'emerald',
    badgeClass:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  UPDATE: {
    label: 'Chỉnh sửa',
    icon: Edit3,
    color: 'blue',
    badgeClass:
      'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  STATUS_CHANGE: {
    label: 'Đổi trạng thái',
    icon: CheckCircle2,
    color: 'amber',
    badgeClass:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  CLONE: {
    label: 'Sao chép',
    icon: Copy,
    color: 'cyan',
    badgeClass:
      'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  },
  SYNC: {
    label: 'Đồng bộ giáo trình',
    icon: Layers,
    color: 'purple',
    badgeClass:
      'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
  DELETE: {
    label: 'Xóa',
    icon: Trash2,
    color: 'rose',
    badgeClass:
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  },
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Vừa xong'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
    if (diffInSeconds < 172800) return 'Hôm qua'
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return '(Trống)'
  if (typeof value === 'boolean') return value ? 'Có / Bật' : 'Không / Tắt'
  if (typeof value === 'object') return JSON.stringify(value)
  if (value === 'PUBLISHED') return 'Đang phát hành'
  if (value === 'DRAFT') return 'Bản nháp (Draft)'
  if (value === 'ARCHIVED') return 'Lưu trữ (Archived)'
  if (value === 'FREE') return 'Tự do'
  if (value === 'LINEAR_LESSON') return 'Tuần tự bài học'
  if (value === 'LINEAR_MODULE') return 'Tuần tự chương'
  return String(value)
}

export function EntityAuditSidePeek({
  isOpen,
  onClose,
  tableName,
  entityId,
  entityTitle,
  entitySubtitle,
}: EntityAuditSidePeekProps) {
  const [selectedTab, setSelectedTab] = useState<'ALL' | 'UPDATE' | 'STATUS_CHANGE' | 'SYNC'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useEntityAuditLogs(tableName, entityId, {
    enabled: isOpen && !!entityId,
  })

  const logs = data?.items || []

  // Filter logs by tab & search
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Tab filter
      if (selectedTab !== 'ALL' && log.action !== selectedTab) {
        return false
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchUser = log.userName.toLowerCase().includes(query)
        const matchField = (log.fieldName || '').toLowerCase().includes(query)
        const matchAction = log.action.toLowerCase().includes(query)
        return matchUser || matchField || matchAction
      }
      return true
    })
  }, [logs, selectedTab, searchQuery])

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-card border-l border-border shadow-2xl z-50 overflow-hidden"
      >
        {/* 1. Header Notion Style */}
        <div className="p-5 border-b border-border/70 bg-muted/20 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                <History className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Lịch Sử Chỉnh Sửa
                  </span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4.5 bg-background">
                    {logs.length} sự kiện
                  </Badge>
                </div>
                <h3 className="text-base font-semibold text-foreground truncate mt-0.5">
                  {entityTitle || 'Chi tiết thực thể'}
                </h3>
                {entitySubtitle && (
                  <p className="text-xs text-muted-foreground truncate">{entitySubtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 mr-6">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => refetch()}
                disabled={isLoading || isRefetching}
                title="Làm mới lịch sử"
              >
                <RefreshCw className={cn('h-4 w-4', (isLoading || isRefetching) && 'animate-spin')} />
              </Button>
            </div>
          </div>

          {/* Search & Action Tabs */}
          <div className="mt-4 flex flex-col gap-2.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo người sửa, trường thay đổi..."
                className="w-full bg-background border border-border/80 rounded-md pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
              {[
                { id: 'ALL', label: 'Tất cả' },
                { id: 'UPDATE', label: 'Nội dung' },
                { id: 'STATUS_CHANGE', label: 'Trạng thái' },
                { id: 'SYNC', label: 'Giáo trình' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={cn(
                    'px-2.5 py-1 text-[11px] font-medium rounded-md cursor-pointer transition-colors shrink-0',
                    selectedTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Timeline Body */}
        <ScrollArea className="flex-1 p-5">
          {isLoading ? (
            <div className="space-y-4 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="h-8 w-8 rounded-full bg-muted shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-16 bg-muted/60 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12 space-y-3">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
              <p className="text-sm text-foreground font-medium">Không thể tải lịch sử chỉnh sửa</p>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Thử lại
              </Button>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-16 space-y-2 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto opacity-30 stroke-1" />
              <p className="text-sm font-medium text-foreground">Chưa có lịch sử thay đổi</p>
              <p className="text-xs max-w-xs mx-auto">
                Mọi thao tác chỉnh sửa, đổi trạng thái hoặc cập nhật nội dung sẽ được ghi nhận chi tiết tại đây.
              </p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-border">
              {filteredLogs.map((log) => {
                const actionMeta = ACTION_CONFIG[log.action] || {
                  label: log.action,
                  icon: Edit3,
                  color: 'slate',
                  badgeClass: 'bg-muted text-muted-foreground',
                }
                const ActionIcon = actionMeta.icon

                return (
                  <div key={log.id} className="relative group">
                    {/* Timeline Node Icon */}
                    <div className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-card border-2 border-border flex items-center justify-center text-muted-foreground group-hover:border-primary transition-colors">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>

                    {/* Timeline Card */}
                    <div className="bg-background rounded-lg border border-border/80 p-3.5 shadow-xs space-y-3 hover:border-border transition-colors">
                      {/* Card Header: User & Action */}
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 text-[10px]">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {log.userAvatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-foreground truncate block">
                              {log.userName}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate block">
                              {log.userEmail}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn('text-[10px] px-2 py-0.5 font-medium', actionMeta.badgeClass)}>
                            <ActionIcon className="h-3 w-3 mr-1" />
                            {actionMeta.label}
                          </Badge>
                          <span
                            className="text-[11px] text-muted-foreground shrink-0 cursor-default"
                            title={new Date(log.createdAt).toLocaleString('vi-VN')}
                          >
                            {formatRelativeTime(log.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Field Diff Breakdown */}
                      {log.diff && Object.keys(log.diff).length > 0 ? (
                        <div className="space-y-2 pt-1">
                          <div className="text-[11px] font-medium text-muted-foreground">
                            Chi tiết các trường thay đổi:
                          </div>
                          <div className="space-y-1.5">
                            {Object.entries(log.diff).map(([key, diffItem]) => {
                              const fieldLabel = FIELD_LABEL_MAP[key] || key
                              return (
                                <div
                                  key={key}
                                  className="bg-muted/30 rounded-md p-2 text-xs border border-border/50 space-y-1"
                                >
                                  <div className="font-semibold text-[11px] text-foreground flex items-center justify-between">
                                    <span>{fieldLabel}</span>
                                    <span className="text-[10px] font-mono text-muted-foreground">{key}</span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
                                    {/* Giá trị cũ */}
                                    <div className="bg-destructive/5 text-destructive/90 rounded px-2 py-1 text-[11px] line-through border border-destructive/15 break-all">
                                      <span className="font-semibold mr-1">Cũ:</span>
                                      {formatValue(diffItem.old)}
                                    </div>
                                    {/* Giá trị mới */}
                                    <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded px-2 py-1 text-[11px] font-medium border border-emerald-500/20 break-all">
                                      <span className="font-semibold mr-1">Mới:</span>
                                      {formatValue(diffItem.new)}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground bg-muted/20 rounded p-2 border border-border/40">
                          {log.fieldName && (
                            <div className="font-medium text-foreground">{log.fieldName}</div>
                          )}
                          {log.newValue && (
                            <div className="text-[11px] mt-0.5 text-foreground/80">{log.newValue}</div>
                          )}
                        </div>
                      )}

                      {/* Curriculum Granular Changelog / Metadata */}
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div className="space-y-2 pt-0.5">
                          {/* 1. Added Lessons / Modules */}
                          {Array.isArray(log.metadata.addedLessons) &&
                            log.metadata.addedLessons.length > 0 && (
                              <div className="space-y-1">
                                <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <Plus className="h-3 w-3" />
                                  <span>Đã thêm {log.metadata.addedLessons.length} bài học mới:</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {log.metadata.addedLessons.map((title: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center gap-1 text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded"
                                    >
                                      <Video className="h-3 w-3 shrink-0" />
                                      {title}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                          {Array.isArray(log.metadata.addedModules) &&
                            log.metadata.addedModules.length > 0 && (
                              <div className="space-y-1">
                                <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <Plus className="h-3 w-3" />
                                  <span>Đã thêm {log.metadata.addedModules.length} chương mới:</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {log.metadata.addedModules.map((title: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center gap-1 text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-medium"
                                    >
                                      <Layers className="h-3 w-3 shrink-0" />
                                      {title}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* 2. Deleted Lessons / Modules */}
                          {Array.isArray(log.metadata.deletedLessons) &&
                            log.metadata.deletedLessons.length > 0 && (
                              <div className="space-y-1">
                                <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                  <Minus className="h-3 w-3" />
                                  <span>Đã xóa {log.metadata.deletedLessons.length} bài học:</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {log.metadata.deletedLessons.map((title: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center gap-1 text-[11px] bg-destructive/10 text-destructive border border-destructive/20 px-2 py-0.5 rounded line-through"
                                    >
                                      <Video className="h-3 w-3 shrink-0 opacity-70" />
                                      {title}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                          {Array.isArray(log.metadata.deletedModules) &&
                            log.metadata.deletedModules.length > 0 && (
                              <div className="space-y-1">
                                <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                  <Minus className="h-3 w-3" />
                                  <span>Đã xóa {log.metadata.deletedModules.length} chương:</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {log.metadata.deletedModules.map((title: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center gap-1 text-[11px] bg-destructive/10 text-destructive border border-destructive/20 px-2 py-0.5 rounded line-through font-medium"
                                    >
                                      <Layers className="h-3 w-3 shrink-0 opacity-70" />
                                      {title}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* 3. Renamed Lessons / Modules */}
                          {Array.isArray(log.metadata.renamedLessons) &&
                            log.metadata.renamedLessons.length > 0 && (
                              <div className="space-y-1">
                                <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                  <Edit3 className="h-3 w-3" />
                                  <span>Đổi tên {log.metadata.renamedLessons.length} bài học:</span>
                                </div>
                                <div className="space-y-1">
                                  {log.metadata.renamedLessons.map((item: any, idx: number) => (
                                    <div
                                      key={idx}
                                      className="text-[11px] bg-blue-500/10 text-blue-800 dark:text-blue-300 border border-blue-500/20 px-2 py-1 rounded flex items-center gap-1.5 flex-wrap"
                                    >
                                      <span className="line-through text-muted-foreground">{item.from}</span>
                                      <ArrowRight className="h-3 w-3 text-blue-500 shrink-0" />
                                      <span className="font-semibold">{item.to}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* 4. Reason Note */}
                          {log.metadata.reason && (
                            <div className="text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 p-2 rounded-md">
                              <span className="font-semibold mr-1">Lý do:</span>
                              {String(log.metadata.reason)}
                            </div>
                          )}

                          {/* 5. Fallback for other simple metadata if not curriculum delta */}
                          {!log.metadata.addedLessons &&
                            !log.metadata.deletedLessons &&
                            !log.metadata.renamedLessons &&
                            !log.metadata.addedModules &&
                            !log.metadata.deletedModules &&
                            !log.metadata.reason && (
                              <div className="text-[10px] text-muted-foreground font-mono bg-muted/20 p-1.5 rounded flex items-center gap-2 flex-wrap">
                                {Object.entries(log.metadata).map(([k, v]) => (
                                  <span key={k} className="bg-background px-1.5 py-0.5 rounded border border-border/50">
                                    {k}: <strong>{String(v)}</strong>
                                  </span>
                                ))}
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {/* 3. Footer */}
        <div className="p-3.5 border-t border-border bg-muted/20 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-muted-foreground">
            Bảo toàn chuẩn C# .NET 8 (`sys_audit_logs`)
          </span>
          <Button size="sm" variant="outline" onClick={onClose} className="cursor-pointer text-xs h-8">
            Đóng
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

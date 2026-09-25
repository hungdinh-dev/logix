'use client'

import React, { useState } from 'react'
import { Plus, Trash2, ExternalLink, FileText, Globe, Download, Link2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { LessonItem, ResourceAttachment, ResourceType } from '../types/course-editor.types'

interface LessonResourcesEditorProps {
  lesson: LessonItem
  onChange: (updatedLesson: LessonItem) => void
}

export function LessonResourcesEditor({ lesson, onChange }: LessonResourcesEditorProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [addMode, setAddMode] = useState<ResourceType>('DOCUMENT_FILE')
  const [formTitle, setFormTitle] = useState('')
  const [formUrl, setFormUrl] = useState('')
  const [formSize, setFormSize] = useState('')

  const resources = lesson.resources || []

  const handleOpenAdd = (type: ResourceType) => {
    setAddMode(type)
    setFormTitle('')
    setFormUrl('')
    setFormSize(type === 'DOCUMENT_FILE' ? '250 KB' : '')
    setIsAdding(true)
  }

  const handleCancel = () => {
    setIsAdding(false)
    setFormTitle('')
    setFormUrl('')
    setFormSize('')
  }

  const handleSaveResource = () => {
    if (!formTitle.trim() || !formUrl.trim()) return

    const newResource: ResourceAttachment = {
      id: `res-${Date.now()}`,
      name: formTitle.trim(),
      url: formUrl.trim(),
      type: addMode,
      size: addMode === 'DOCUMENT_FILE' ? (formSize.trim() || 'Tài liệu đính kèm') : undefined,
      extension: addMode === 'DOCUMENT_FILE' ? (formUrl.split('.').pop() || 'pdf').toLowerCase() : undefined,
    }

    const updatedResources = [...resources, newResource]
    onChange({
      ...lesson,
      resources: updatedResources,
    })

    handleCancel()
  }

  const handleDeleteResource = (resourceId: string) => {
    const updatedResources = resources.filter((r) => r.id !== resourceId)
    onChange({
      ...lesson,
      resources: updatedResources,
    })
  }

  return (
    <div className="rounded-xl border border-border/70 bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Link2 className="h-4 w-4 text-primary" />
            Tài nguyên đính kèm bài học (Lesson Resources)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Đính kèm file PDF, biểu mẫu checklist hoặc liên kết web tham khảo trực tiếp cho bài học này
          </p>
        </div>

        {!isAdding && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenAdd('EXTERNAL_LINK')}
              className="text-xs h-7 px-2.5 gap-1 text-primary border-primary/30 hover:bg-primary/5"
            >
              <Globe className="h-3.5 w-3.5" />
              + Link ngoài
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenAdd('DOCUMENT_FILE')}
              className="text-xs h-7 px-2.5 gap-1 border-border/80 hover:bg-muted"
            >
              <FileText className="h-3.5 w-3.5" />
              + File PDF / Doc
            </Button>
          </div>
        )}
      </div>

      {/* Add Resource Inline Form */}
      {isAdding && (
        <div className="bg-muted/40 rounded-lg p-3.5 border border-border/80 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-border/40">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              {addMode === 'EXTERNAL_LINK' ? (
                <>
                  <Globe className="h-3.5 w-3.5 text-blue-500" />
                  Thêm liên kết web ngoài (External Link)
                </>
              ) : (
                <>
                  <FileText className="h-3.5 w-3.5 text-amber-500" />
                  Đính kèm tệp tài liệu (PDF / Word / Excel)
                </>
              )}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setAddMode('EXTERNAL_LINK')}
                className={`text-[11px] px-2 py-0.5 rounded transition ${
                  addMode === 'EXTERNAL_LINK'
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Link web
              </button>
              <button
                type="button"
                onClick={() => setAddMode('DOCUMENT_FILE')}
                className={`text-[11px] px-2 py-0.5 rounded transition ${
                  addMode === 'DOCUMENT_FILE'
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Tệp file
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] font-medium">Tiêu đề hiển thị</Label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder={
                  addMode === 'EXTERNAL_LINK'
                    ? 'VD: Tài liệu MDN về HTTP Request'
                    : 'VD: Checklist Kiểm thực Ba bước.pdf'
                }
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-medium">
                {addMode === 'EXTERNAL_LINK' ? 'Đường dẫn URL' : 'Link tải file (URL Storage)'}
              </Label>
              <Input
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder={
                  addMode === 'EXTERNAL_LINK'
                    ? 'https://developer.mozilla.org/...'
                    : 'https://cdn.example.com/docs/checklist.pdf'
                }
                className="h-8 text-xs"
              />
            </div>
          </div>

          {addMode === 'DOCUMENT_FILE' && (
            <div className="space-y-1 max-w-xs">
              <Label className="text-[11px] font-medium">Dung lượng ước tính (tùy chọn)</Label>
              <Input
                value={formSize}
                onChange={(e) => setFormSize(e.target.value)}
                placeholder="VD: 284 KB, 1.2 MB"
                className="h-8 text-xs"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-xs h-7 px-3"
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveResource}
              disabled={!formTitle.trim() || !formUrl.trim()}
              className="text-xs h-7 px-3 gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Lưu tài nguyên
            </Button>
          </div>
        </div>
      )}

      {/* Resources List */}
      {resources.length === 0 ? (
        <div className="py-6 text-center border border-dashed border-border/60 rounded-lg text-xs text-muted-foreground bg-muted/20">
          Chưa có tài nguyên nào được đính kèm vào bài học này. Bấm vào nút bên trên để gắn link hoặc file PDF.
        </div>
      ) : (
        <div className="space-y-2">
          {resources.map((res) => {
            const isLink = res.type === 'EXTERNAL_LINK'
            return (
              <div
                key={res.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-3">
                  <div className="p-1.5 rounded-md bg-background border border-border/60 shrink-0">
                    {isLink ? (
                      <Globe className="h-4 w-4 text-blue-500" />
                    ) : (
                      <FileText className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {res.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 font-normal ${
                          isLink
                            ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {isLink ? 'Link ngoài' : res.extension ? res.extension.toUpperCase() : 'Tệp'}
                      </Badge>
                      {res.size && (
                        <span className="text-[10px] text-muted-foreground">{res.size}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate font-mono mt-0.5">
                      {res.url}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-muted-foreground/60 hover:text-foreground rounded transition"
                    title={isLink ? 'Mở liên kết' : 'Tải / Xem file'}
                  >
                    {isLink ? (
                      <ExternalLink className="h-3.5 w-3.5" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDeleteResource(res.id)}
                    className="p-1 text-muted-foreground/50 hover:text-destructive rounded transition cursor-pointer"
                    title="Xóa tài nguyên này"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

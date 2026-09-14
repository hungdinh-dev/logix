import { useState } from 'react'
import { Edit2, Plus, Trash2, Lock, ChevronDown, ChevronRight } from 'lucide-react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useCustomFields, useDeleteCustomField } from '../hooks/use-custom-fields'
import { FIELD_TYPE_LABELS, type CustomFieldDefinitionResponse } from '../types/admin.types'
import { CustomFieldDialog } from '../components/CustomFieldsPage/CustomFieldDialog'

const FIELD_TYPE_BADGE: Record<string, string> = {
  Text:        'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
  Number:      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
  Date:        'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300',
  Select:      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300',
  MultiSelect: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300',
  Checkbox:    'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300',
  TextArea:    'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300',
}

function OptionsPreview({ def }: { def: CustomFieldDefinitionResponse }) {
  const [expanded, setExpanded] = useState(false)
  if (!['Select', 'MultiSelect'].includes(def.fieldType)) return <span className="text-muted-foreground text-xs">—</span>
  const active = def.options.filter(o => o.isActive)
  if (active.length === 0) return <span className="text-muted-foreground text-xs">Chưa có lựa chọn</span>
  return (
    <button
      onClick={() => setExpanded(v => !v)}
      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      aria-expanded={expanded}
    >
      {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      {active.length} lựa chọn
      {expanded && (
        <span className="ml-1 text-foreground">
          ({active.slice(0, 3).map(o => o.label).join(', ')}{active.length > 3 ? '...' : ''})
        </span>
      )}
    </button>
  )
}

export default function CustomFieldsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDef, setEditDef] = useState<CustomFieldDefinitionResponse | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<CustomFieldDefinitionResponse | null>(null)

  const { data: definitions = [], isLoading } = useCustomFields()
  const deleteDef = useDeleteCustomField()

  const sorted = [...definitions].sort((a, b) => a.sortOrder - b.sortOrder)

  const openCreate = () => { setEditDef(undefined); setDialogOpen(true) }
  const openEdit = (def: CustomFieldDefinitionResponse) => { setEditDef(def); setDialogOpen(true) }
  const confirmDelete = () => { if (deleteTarget) { deleteDef.mutate(deleteTarget.id); setDeleteTarget(null) } }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'Trường tùy chỉnh', isActive: true }]} />

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Trường tùy chỉnh</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {definitions.length} trường · Quản lý các trường dữ liệu mở rộng cho nhân viên
            </p>
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Thêm trường
          </Button>
        </div>

        <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Tên trường</TableHead>
                <TableHead>Mã</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Nhóm</TableHead>
                <TableHead>Lựa chọn</TableHead>
                <TableHead>Bắt buộc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[80px] text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 10 }).map((__, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-16 text-muted-foreground text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <p>Chưa có trường tùy chỉnh nào</p>
                      <Button variant="outline" size="sm" onClick={openCreate} className="gap-1.5 mt-1">
                        <Plus className="h-3.5 w-3.5" /> Tạo trường đầu tiên
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((def) => (
                  <TableRow key={def.id} className="group">
                    <TableCell className="text-muted-foreground text-xs tabular-nums">{def.sortOrder}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-sm">{def.name}</span>
                        {def.isSystem && (
                          <Lock className="h-3 w-3 text-muted-foreground shrink-0" aria-label="Trường hệ thống" />
                        )}
                      </div>
                      {def.helpText && (
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-[180px] truncate">{def.helpText}</p>
                      )}
                    </TableCell>

                    <TableCell>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{def.code}</code>
                    </TableCell>

                    <TableCell>
                      <Badge className={`text-xs ${FIELD_TYPE_BADGE[def.fieldType] ?? ''}`}>
                        {FIELD_TYPE_LABELS[def.fieldType]}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">{def.module}</TableCell>

                    <TableCell className="text-xs text-muted-foreground">{def.group ?? '—'}</TableCell>

                    <TableCell><OptionsPreview def={def} /></TableCell>

                    <TableCell>
                      {def.isRequired ? (
                        <Badge className="text-xs bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300">Bắt buộc</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Tùy chọn</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {def.isActive ? (
                        <Badge className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300">Hoạt động</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">Tắt</Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost" size="sm" className="h-7 w-7 p-0"
                          onClick={() => openEdit(def)}
                          aria-label={`Sửa ${def.name}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        {!def.isSystem && (
                          <Button
                            variant="ghost" size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(def)}
                            aria-label={`Xóa ${def.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CustomFieldDialog
        open={dialogOpen}
        definition={editDef}
        onOpenChange={setDialogOpen}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa trường `{deleteTarget?.name}`?</AlertDialogTitle>
            <AlertDialogDescription>
              Thao tác này không thể hoàn tác nếu trường đã có dữ liệu. Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Xóa trường
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

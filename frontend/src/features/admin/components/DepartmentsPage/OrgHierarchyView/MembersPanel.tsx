import { useState } from 'react'
import { Plus, Trash2, UserCog } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useAddDepartmentMember,
  useDepartmentMembers,
  useRemoveDepartmentMember,
  useUpdateDepartmentMember,
} from '../../../hooks/use-departments'
import type { DepartmentMemberResponse, DepartmentTreeResponse } from '../../../types/admin.types'
import type { JobLevelOption } from './types'

function groupByLevel(members: DepartmentMemberResponse[]) {
  const map = new Map<string, { levelName: string; order: number; items: DepartmentMemberResponse[] }>()
  for (const m of members) {
    const key = m.jobLevelId ?? '__none__'
    if (!map.has(key)) {
      map.set(key, { levelName: m.jobLevelName ?? 'Chưa phân cấp', order: m.jobLevelOrder ?? 999, items: [] })
    }
    map.get(key)!.items.push(m)
  }
  return [...map.values()].sort((a, b) => a.order - b.order)
}

function initials(name: string) {
  return name.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase()
}

function MemberRow({ member, departmentId, jobLevels }: {
  member: DepartmentMemberResponse
  departmentId: string
  jobLevels: JobLevelOption[]
}) {
  const updateMember = useUpdateDepartmentMember()
  const removeMember = useRemoveDepartmentMember()

  return (
    <div className="flex items-center gap-2.5 px-3 py-2 hover:bg-muted/40 transition-colors group">
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarImage src={member.avatarUrl} alt={member.fullName} />
        <AvatarFallback className="text-[10px] font-medium">{initials(member.fullName)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium truncate leading-none">{member.fullName}</span>
          {member.isPrimary && (
            <span className="text-[9px] px-1 py-px rounded border text-muted-foreground shrink-0 leading-none">chính</span>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground font-mono leading-none mt-0.5 block">{member.employeeCode}</span>
      </div>

      <Select
        value={member.jobLevelId ?? '__none__'}
        onValueChange={v => updateMember.mutate({
          userId: member.userId, departmentId,
          data: { jobLevelId: v === '__none__' ? null : v },
        })}
        disabled={updateMember.isPending}
      >
        <SelectTrigger className="h-6 w-32 text-[11px] border-dashed">
          <SelectValue placeholder="Chức vụ..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__" className="text-[11px] text-muted-foreground">— Chưa có —</SelectItem>
          {jobLevels.map(jl => (
            <SelectItem key={jl.id} value={jl.id} className="text-[11px]">{jl.levelName}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        type="button"
        onClick={() => {
          if (!confirm(`Xóa ${member.fullName} khỏi phòng ban?`)) return
          removeMember.mutate({ userId: member.userId, departmentId })
        }}
        disabled={removeMember.isPending}
        aria-label={`Xóa ${member.fullName}`}
        className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all shrink-0 cursor-pointer disabled:opacity-40"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  )
}

function AddMemberDialog({ open, departmentId, onOpenChange, jobLevels }: {
  open: boolean
  departmentId: string
  onOpenChange: (v: boolean) => void
  jobLevels: JobLevelOption[]
}) {
  const [userId, setUserId] = useState('')
  const [jobLevelId, setJobLevelId] = useState('')
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0])
  const addMember = useAddDepartmentMember()

  const reset = () => { setUserId(''); setJobLevelId('') }

  return (
    <Dialog open={open} onOpenChange={v => { onOpenChange(v); if (!v) reset() }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm">Thêm thành viên</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault()
            if (!userId.trim()) return
            addMember.mutate(
              { userId: userId.trim(), data: { departmentId, startDate, jobLevelId: jobLevelId || undefined } },
              { onSuccess: () => { onOpenChange(false); reset() } },
            )
          }}
          className="space-y-3 pt-1"
        >
          <div className="space-y-1">
            <Label htmlFor="uid" className="text-xs">User ID <span className="text-destructive">*</span></Label>
            <Input id="uid" value={userId} onChange={e => setUserId(e.target.value)}
              placeholder="UUID của user..." className="h-8 text-xs" required />
            <p className="text-[11px] text-muted-foreground">Lấy từ trang quản lý tài khoản.</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="jl" className="text-xs">Chức vụ</Label>
            <Select value={jobLevelId} onValueChange={setJobLevelId}>
              <SelectTrigger id="jl" className="h-8 text-xs"><SelectValue placeholder="Chọn chức vụ..." /></SelectTrigger>
              <SelectContent>
                {jobLevels.map(jl => <SelectItem key={jl.id} value={jl.id} className="text-xs">{jl.levelName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="sd" className="text-xs">Ngày bắt đầu <span className="text-destructive">*</span></Label>
            <Input id="sd" type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="h-8 text-xs" required />
          </div>
          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" size="sm" disabled={addMember.isPending || !userId.trim()}>
              {addMember.isPending ? 'Đang thêm...' : 'Thêm'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function MembersContent({ dept, jobLevels, addOpen, onAddOpenChange }: {
  dept: DepartmentTreeResponse
  jobLevels: JobLevelOption[]
  addOpen: boolean
  onAddOpenChange: (v: boolean) => void
}) {
  const { data: members, isLoading } = useDepartmentMembers(dept.id)
  const grouped = groupByLevel(members ?? [])
  const total = members?.length ?? 0

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-2 space-y-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2">
                <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                <div className="flex-1 space-y-1"><Skeleton className="h-3 w-28" /><Skeleton className="h-2.5 w-16" /></div>
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </div>
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 gap-2 text-center">
            <UserCog className="w-7 h-7 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">Chưa có thành viên</p>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1 mt-1" onClick={() => onAddOpenChange(true)}>
              <Plus className="w-3 h-3" />Thêm ngay
            </Button>
          </div>
        ) : (
          grouped.map(group => (
            <div key={group.levelName}>
              <div className="px-3 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wide bg-muted/30 border-b sticky top-0">
                {group.levelName} <span className="normal-case font-normal opacity-70">({group.items.length})</span>
              </div>
              {group.items.map(m => (
                <MemberRow key={m.userDepartmentId} member={m} departmentId={dept.id} jobLevels={jobLevels} />
              ))}
            </div>
          ))
        )}
      </div>

      <AddMemberDialog open={addOpen} departmentId={dept.id} onOpenChange={onAddOpenChange} jobLevels={jobLevels} />
    </>
  )
}

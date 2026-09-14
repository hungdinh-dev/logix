import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export type TypeFilter = 'all' | 'system' | 'custom'

interface RolesToolbarProps {
  count: number
  search: string
  typeFilter: TypeFilter
  onSearchChange: (v: string) => void
  onTypeFilterChange: (v: TypeFilter) => void
  onCreateClick: () => void
}

export function RolesToolbar({
  count, search, typeFilter,
  onSearchChange, onTypeFilterChange, onCreateClick,
}: RolesToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-xl font-semibold">Vai trò</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{count} vai trò</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          placeholder="Tìm vai trò..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-48"
        />
        <Select value={typeFilter} onValueChange={(v) => onTypeFilterChange(v as TypeFilter)}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="Loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="system">Hệ thống</SelectItem>
            <SelectItem value="custom">Tùy chỉnh</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onCreateClick} size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Tạo vai trò
        </Button>
      </div>
    </div>
  )
}

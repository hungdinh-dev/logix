'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search } from 'lucide-react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useEmployees } from '../hooks/use-employees'
import { CreateEmployeeSheet } from '../components/EmployeesPage'
import { useDebounce } from '@/hooks/use-debounce'

const PAGE_SIZE_OPTIONS = [15, 50, 100] as const

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total]
  if (current >= total - 3) return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total]
}

export default function EmployeesPage() {
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(15)
  const debouncedSearch = useDebounce(search, 300)

  const { data: employees = [], isLoading } = useEmployees(debouncedSearch || undefined)

  const totalCount = employees.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const paginated = employees.slice(start, start + pageSize)

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handlePageSize(value: string) {
    setPageSize(Number(value))
    setPage(1)
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'Nhân sự', isActive: true }]} />

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Nhân sự</h1>
            <div className="text-sm text-muted-foreground mt-0.5">
              {isLoading ? <Skeleton className="h-4 w-24 inline-block" /> : `${totalCount} nhân viên`}
            </div>
          </div>
          <Button onClick={() => setSheetOpen(true)} size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Tạo nhân sự
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm shrink-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Tìm theo tên, mã nhân viên..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card flex flex-col flex-1 min-h-0 overflow-hidden [&>[data-slot=table-container]]:overflow-y-auto [&>[data-slot=table-container]]:flex-1 [&>[data-slot=table-container]]:min-h-0">
          <div className="contents">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky top-0 z-10 bg-card">Nhân viên</TableHead>
                  <TableHead className="sticky top-0 z-10 bg-card">Mã NV</TableHead>
                  <TableHead className="sticky top-0 z-10 bg-card">Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: pageSize > 15 ? 15 : pageSize }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    </TableRow>
                  ))
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-muted-foreground text-sm">
                      {search ? 'Không tìm thấy nhân viên' : 'Chưa có nhân viên nào'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((emp) => (
                    <TableRow
                      key={emp.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => router.push(`/admin/employees/${emp.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={emp.avatarUrl} alt={emp.fullName} />
                            <AvatarFallback className="text-xs">
                              {emp.fullName.split(' ').map(w => w[0]).slice(-2).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{emp.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground tabular-nums">{emp.employeeCode}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{emp.email}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer: total + page size + pagination */}
          <div className="shrink-0 border-t border-border px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap">
            {/* Left: count */}
            <div className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
              {isLoading ? (
                <Skeleton className="h-3.5 w-44 inline-block" />
              ) : (
                `Hiển thị ${totalCount === 0 ? 0 : Math.min(start + 1, totalCount)}–${Math.min(start + pageSize, totalCount)} trong ${totalCount} nhân viên`
              )}
            </div>

            {/* Right: page size + pagination */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                <span>Hiển thị</span>
                <Select value={String(pageSize)} onValueChange={handlePageSize}>
                  <SelectTrigger className="h-7 w-16 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((n) => (
                      <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>/ trang</span>
              </div>

              {totalPages > 1 && (
                <PaginationContent className="gap-0.5">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={`h-7 text-xs cursor-pointer ${safePage === 1 ? 'pointer-events-none opacity-40' : ''}`}
                    />
                  </PaginationItem>

                  {buildPageNumbers(safePage, totalPages).map((item, idx) =>
                    item === 'ellipsis' ? (
                      <PaginationItem key={`e-${idx}`}>
                        <PaginationEllipsis className="h-7 w-7" />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          isActive={item === safePage}
                          onClick={() => setPage(item)}
                          className="h-7 w-7 text-xs cursor-pointer"
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={`h-7 text-xs cursor-pointer ${safePage === totalPages ? 'pointer-events-none opacity-40' : ''}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateEmployeeSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  )
}

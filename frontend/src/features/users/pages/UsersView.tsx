'use client'

import { useState } from 'react'
import { Search, UserPlus, Shield, Users, UserCheck, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

type Role   = 'Admin' | 'Manager' | 'Sales' | 'Support' | 'Marketing'
type Status = 'active' | 'inactive'

interface UserRecord {
  name:     string
  initials: string
  email:    string
  role:     Role
  status:   Status
  lastSeen: string
  deals:    number
}

const ROLE_STYLES: Record<Role, { bg: string; text: string }> = {
  Admin:     { bg: '#f5ede8', text: '#cc785c' },
  Manager:   { bg: '#eaeefc', text: '#4f6ac6' },
  Sales:     { bg: '#e6f5f2', text: '#3d9080' },
  Support:   { bg: '#fdf3e3', text: '#b87020' },
  Marketing: { bg: '#f4eefa', text: '#8b5e9c' },
}

const USERS: UserRecord[] = [
  { name: 'Huy Quang',  initials: 'HQ', email: 'huy.quang@digifnb.com',  role: 'Admin',     status: 'active',   lastSeen: 'Vừa xong',      deals: 14 },
  { name: 'Alex Kim',   initials: 'AK', email: 'alex.kim@digifnb.com',    role: 'Sales',     status: 'active',   lastSeen: '2 phút trước',  deals: 18 },
  { name: 'Tuan Anh',   initials: 'TA', email: 'tuan.anh@digifnb.com',    role: 'Manager',   status: 'active',   lastSeen: '10 phút trước', deals: 11 },
  { name: 'Mai Thu',    initials: 'MT', email: 'mai.thu@digifnb.com',      role: 'Sales',     status: 'active',   lastSeen: '15 phút trước', deals: 12 },
  { name: 'Bao Nguyen', initials: 'BN', email: 'bao.nguyen@digifnb.com',  role: 'Support',   status: 'active',   lastSeen: '30 phút trước', deals: 0  },
  { name: 'Nam Phong',  initials: 'NP', email: 'nam.phong@digifnb.com',   role: 'Support',   status: 'active',   lastSeen: '1 giờ trước',   deals: 9  },
  { name: 'Lan Pham',   initials: 'LP', email: 'lan.pham@digifnb.com',     role: 'Marketing', status: 'active',   lastSeen: '3 giờ trước',   deals: 7  },
  { name: 'Linh Dao',   initials: 'LD', email: 'linh.dao@digifnb.com',     role: 'Sales',     status: 'inactive', lastSeen: '3 ngày trước',  deals: 5  },
]

const STATS = [
  { icon: Users,     label: 'Tổng thành viên', value: '8',          sub: '2 teams' },
  { icon: UserCheck, label: 'Đang hoạt động',  value: '7',          sub: 'trong 24 giờ qua' },
  { icon: Shield,    label: 'Quản trị viên',   value: '1',          sub: 'full access' },
  { icon: BarChart3, label: 'Deals TB/người',  value: '9.5',        sub: 'tháng này' },
]

export default function UsersView() {
  const [search, setSearch] = useState('')

  const filtered = USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <main className="w-full px-8 pt-6">

        {/* Header */}
        <div className="pt-8 pb-6 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#141413] font-display">Người dùng</h1>
            <p className="mt-1 text-sm text-[#6c6a64]">Quản lý thành viên và phân quyền</p>
          </div>
          <Button
            type="button"
            className="gap-2 bg-[#cc785c] hover:bg-[#a9583e] text-white cursor-pointer"
          >
            <UserPlus className="w-4 h-4" aria-hidden="true" />
            Mời thành viên
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {STATS.map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="bg-white border border-[#e6dfd8] rounded-xl p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#8e8b82] uppercase tracking-wide">{label}</span>
                <Icon className="w-4 h-4 text-[#d0ccc8]" aria-hidden="true" />
              </div>
              <p className="text-3xl font-bold text-[#141413]">{value}</p>
              <p className="text-xs text-[#8e8b82]">{sub}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white border border-[#e6dfd8] rounded-xl overflow-hidden mb-6">
          <div className="px-5 py-3.5 border-b border-[#e6dfd8] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#141413]">Danh sách thành viên</h2>
            <div className="relative" style={{ minWidth: 220 }}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8e8b82] pointer-events-none" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Tìm theo tên, email, vai trò…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 bg-[#faf9f5] text-sm"
                aria-label="Tìm kiếm người dùng"
              />
            </div>
          </div>

          <Table aria-label="Danh sách người dùng">
            <TableHeader>
              <TableRow className="border-b border-[#e6dfd8]">
                <TableHead className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-[#8e8b82]">Thành viên</TableHead>
                <TableHead className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-[#8e8b82]">Vai trò</TableHead>
                <TableHead className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-widest text-[#8e8b82]">Trạng thái</TableHead>
                <TableHead className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-[#8e8b82]">Hoạt động</TableHead>
                <TableHead className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-widest text-[#8e8b82]">Deals</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => {
                const roleStyle = ROLE_STYLES[user.role]
                return (
                  <TableRow
                    key={user.email}
                    className="h-14 border-b border-[#e6dfd8] last:border-b-0 hover:bg-[#efe9de] transition-colors duration-150 cursor-pointer"
                  >
                    <TableCell className="px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f5ede8] flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-[#cc785c]">{user.initials}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#141413]">{user.name}</p>
                          <p className="text-xs text-[#8e8b82]">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: roleStyle.bg, color: roleStyle.text }}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span
                          className={cn(
                            'w-2 h-2 rounded-full',
                            user.status === 'active' ? 'bg-[#5db872]' : 'bg-[#d0ccc8]',
                          )}
                        />
                        <span className={cn('text-xs', user.status === 'active' ? 'text-[#3b6d11]' : 'text-[#8e8b82]')}>
                          {user.status === 'active' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <span className="text-sm text-[#6c6a64]">{user.lastSeen}</span>
                    </TableCell>
                    <TableCell className="px-4 text-right">
                      <span className="text-sm font-semibold text-[#141413]">{user.deals}</span>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="px-5 py-12 text-center text-sm text-[#8e8b82]">
                    Không tìm thấy thành viên nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

      </main>
    </div>
  )
}

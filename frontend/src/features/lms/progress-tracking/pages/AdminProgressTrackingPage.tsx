'use client'

import { useState } from 'react'
import {
  Search,
  Download,
  Bell,
  Mail,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Users,
  Building2,
  MapPin,
  FileSpreadsheet,
  Send,
  MoreVertical,
  ExternalLink,
  ChevronDown,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type StudentProgressRecord = {
  id: string
  studentName: string
  studentCode: string
  avatar: string
  department: string
  location: string
  courseTitle: string
  courseCode: string
  progress: number
  score: number | null
  passScore: number
  deadline: string
  status: 'PASSED' | 'IN_PROGRESS' | 'FAILED' | 'OVERDUE' | 'NOT_STARTED'
}

const MOCK_PROGRESS_DATA: StudentProgressRecord[] = [
  {
    id: 'pr-1',
    studentName: 'Nguyễn Văn An',
    studentCode: 'NV-0012',
    avatar: 'NA',
    department: 'Khối Sản xuất & Xưởng',
    location: 'Chi nhánh Quận 1 (HCM)',
    courseTitle: 'Quy trình Sản xuất & Tiệt trùng Khâu Làm Kem',
    courseCode: 'BH-SX-01',
    progress: 100,
    score: 92,
    passScore: 85,
    deadline: '2026-09-15',
    status: 'PASSED',
  },
  {
    id: 'pr-2',
    studentName: 'Trần Thị Bích',
    studentCode: 'NV-0045',
    avatar: 'TB',
    department: 'Khối Vận hành F&B',
    location: 'Cửa hàng Hai Bà Trưng (HN)',
    courseTitle: 'Tiêu chuẩn Vệ sinh & An toàn Thực phẩm 2026',
    courseCode: 'BH-ATTP-01',
    progress: 65,
    score: null,
    passScore: 90,
    deadline: '2026-09-10',
    status: 'IN_PROGRESS',
  },
  {
    id: 'pr-3',
    studentName: 'Lê Hoàng Long',
    studentCode: 'NV-0089',
    avatar: 'LL',
    department: 'Khối Vận hành F&B',
    location: 'Cửa hàng Cầu Giấy (HN)',
    courseTitle: 'Quy trình SOP Vận hành Cửa hàng Hàng ngày',
    courseCode: 'BH-OMB-01',
    progress: 80,
    score: 65,
    passScore: 80,
    deadline: '2026-08-20',
    status: 'FAILED',
  },
  {
    id: 'pr-4',
    studentName: 'Phạm Minh Đức',
    studentCode: 'NV-0102',
    avatar: 'MD',
    department: 'Khối Dịch vụ Khách hàng',
    location: 'Chi nhánh Đà Nẵng (DN)',
    courseTitle: 'Kỹ năng Giao tiếp & Xử lý Khiếu nại Khách hàng',
    courseCode: 'CS-002',
    progress: 45,
    score: null,
    passScore: 80,
    deadline: '2026-09-01',
    status: 'IN_PROGRESS',
  },
  {
    id: 'pr-5',
    studentName: 'Đặng Quốc Huy',
    studentCode: 'NV-0118',
    avatar: 'DH',
    department: 'Khối Kho vận & Chuỗi cung ứng',
    location: 'Tổng kho Tân Bình (HCM)',
    courseTitle: 'Kiểm soát Nguyên vật liệu và Tồn kho Bar/Bếp',
    courseCode: 'LOG-004',
    progress: 10,
    score: null,
    passScore: 75,
    deadline: '2026-08-25',
    status: 'OVERDUE',
  },
  {
    id: 'pr-6',
    studentName: 'Hoàng Mai Phương',
    studentCode: 'NV-0130',
    avatar: 'MP',
    department: 'Khối Vận hành F&B',
    location: 'Cửa hàng Ba Đình (HN)',
    courseTitle: 'Tiêu chuẩn Vệ sinh & An toàn Thực phẩm 2026',
    courseCode: 'BH-ATTP-01',
    progress: 0,
    score: null,
    passScore: 90,
    deadline: '2026-09-30',
    status: 'NOT_STARTED',
  },
  {
    id: 'pr-7',
    studentName: 'Vũ Quốc Bảo',
    studentCode: 'NV-0144',
    avatar: 'VB',
    department: 'Khối Sản xuất & Xưởng',
    location: 'Xưởng Sản xuất Củ Chi (HCM)',
    courseTitle: 'Quy trình Sản xuất & Tiệt trùng Khâu Làm Kem',
    courseCode: 'BH-SX-01',
    progress: 100,
    score: 95,
    passScore: 85,
    deadline: '2026-09-12',
    status: 'PASSED',
  },
]

export default function AdminProgressTrackingPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('ALL')
  const [locationFilter, setLocationFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isReminderSent, setIsReminderSent] = useState(false)

  // Filter logic
  const filteredData = MOCK_PROGRESS_DATA.filter((item) => {
    const matchSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())

    const matchDept = departmentFilter === 'ALL' || item.department === departmentFilter
    const matchLoc = locationFilter === 'ALL' || item.location.includes(locationFilter)
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter

    return matchSearch && matchDept && matchLoc && matchStatus
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredData.map((d) => d.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSendReminder = () => {
    setIsReminderSent(true)
    setTimeout(() => setIsReminderSent(false), 3000)
  }

  const totalLearners = filteredData.length
  const passedCount = filteredData.filter((d) => d.status === 'PASSED').length
  const inProgressCount = filteredData.filter((d) => d.status === 'IN_PROGRESS').length
  const overdueCount = filteredData.filter((d) => d.status === 'OVERDUE' || d.status === 'FAILED').length

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {/* Header Area */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Theo dõi Tiến độ &amp; Ghi danh Đào tạo
            </h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Enrollment &amp; Tracking
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Giám sát quá trình hoàn thành các bài học, điểm số bài thi và đôn đốc nhân sự hoàn thành đúng hạn.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendReminder}
            className="cursor-pointer gap-1.5 text-xs font-medium"
          >
            <Bell className="h-3.5 w-3.5 text-amber-600" />
            {isReminderSent ? 'Đã gửi nhắc nhở!' : 'Gửi Nhắc nhở'}
          </Button>

          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer gap-1.5 shadow-sm text-xs font-medium"
          >
            <Download className="h-4 w-4" />
            Xuất Báo cáo (Excel)
          </Button>
        </div>
      </div>

      {/* Overview Stat Mini Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-3 shadow-sm">
          <span className="text-[11px] font-medium text-muted-foreground">Tổng lượt ghi danh</span>
          <div className="text-xl font-bold text-foreground mt-1">{totalLearners}</div>
        </div>
        <div className="rounded-lg border bg-card p-3 shadow-sm">
          <span className="text-[11px] font-medium text-emerald-600">Đã hoàn thành (Đạt)</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">{passedCount}</div>
        </div>
        <div className="rounded-lg border bg-card p-3 shadow-sm">
          <span className="text-[11px] font-medium text-primary">Đang trong tiến trình</span>
          <div className="text-xl font-bold text-primary mt-1">{inProgressCount}</div>
        </div>
        <div className="rounded-lg border bg-card p-3 shadow-sm">
          <span className="text-[11px] font-medium text-red-600">Quá hạn / Chưa đạt</span>
          <div className="text-xl font-bold text-red-600 mt-1">{overdueCount}</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-border/80 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Tìm học viên, mã NV hoặc khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-xs"
              />
            </div>

            {/* Department */}
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Tất cả phòng ban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">Tất cả Phòng ban</SelectItem>
                <SelectItem value="Khối Vận hành F&B" className="text-xs">Khối Vận hành F&B</SelectItem>
                <SelectItem value="Khối Sản xuất & Xưởng" className="text-xs">Khối Sản xuất &amp; Xưởng</SelectItem>
                <SelectItem value="Khối Dịch vụ Khách hàng" className="text-xs">Khối Dịch vụ Khách hàng</SelectItem>
                <SelectItem value="Khối Kho vận & Chuỗi cung ứng" className="text-xs">Khối Kho vận &amp; Chuỗi cung ứng</SelectItem>
              </SelectContent>
            </Select>

            {/* Location */}
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Tất cả chi nhánh/cửa hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">Tất cả Chi nhánh / Cửa hàng</SelectItem>
                <SelectItem value="HN" className="text-xs">Khu vực Hà Nội</SelectItem>
                <SelectItem value="HCM" className="text-xs">Khu vực TP. Hồ Chí Minh</SelectItem>
                <SelectItem value="DN" className="text-xs">Khu vực Đà Nẵng</SelectItem>
              </SelectContent>
            </Select>

            {/* Status */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">Tất cả Trạng thái</SelectItem>
                <SelectItem value="PASSED" className="text-xs">Đạt (Passed)</SelectItem>
                <SelectItem value="IN_PROGRESS" className="text-xs">Đang học (In Progress)</SelectItem>
                <SelectItem value="FAILED" className="text-xs">Chưa đạt điểm (Failed)</SelectItem>
                <SelectItem value="OVERDUE" className="text-xs">Quá hạn (Overdue)</SelectItem>
                <SelectItem value="NOT_STARTED" className="text-xs">Chưa bắt đầu (Not Started)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="border-border/80 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b bg-muted/50 text-muted-foreground font-semibold">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === filteredData.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="py-3 px-4">Nhân sự / Học viên</th>
                  <th className="py-3 px-4">Phòng ban &amp; Chi nhánh</th>
                  <th className="py-3 px-4">Khóa học đào tạo</th>
                  <th className="py-3 px-4 min-w-[130px]">Tiến độ học</th>
                  <th className="py-3 px-4">Điểm / Hạn chót</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-muted-foreground">
                      Không tìm thấy dữ liệu học viên nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleToggleRow(item.id)}
                          className="rounded border-border"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                            {item.avatar}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">{item.studentName}</span>
                            <span className="text-[10px] text-muted-foreground">{item.studentCode}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{item.department}</span>
                          <span className="text-[10px] text-muted-foreground">{item.location}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-[220px]">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground truncate">{item.courseTitle}</span>
                          <span className="text-[10px] text-muted-foreground">{item.courseCode}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-medium">
                            <span>{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-1.5 bg-muted" />
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          {item.score !== null ? (
                            <span className="font-semibold text-foreground">
                              {item.score} / {item.passScore}đ
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Chưa thi</span>
                          )}
                          <span className="text-[10px] text-muted-foreground">Hạn: {item.deadline}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {item.status === 'PASSED' && (
                          <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-300 dark:text-emerald-400 font-medium text-[10px]">
                            <CheckCircle2 className="mr-1 h-3 w-3 inline text-emerald-600" />
                            Đã Đạt
                          </Badge>
                        )}
                        {item.status === 'IN_PROGRESS' && (
                          <Badge className="bg-primary/15 text-primary hover:bg-primary/25 border-primary/30 font-medium text-[10px]">
                            <Clock className="mr-1 h-3 w-3 inline" />
                            Đang học
                          </Badge>
                        )}
                        {item.status === 'FAILED' && (
                          <Badge variant="destructive" className="bg-red-500/15 text-red-700 hover:bg-red-500/25 border-red-300 dark:text-red-400 font-medium text-[10px]">
                            <XCircle className="mr-1 h-3 w-3 inline text-red-600" />
                            Chưa đạt
                          </Badge>
                        )}
                        {item.status === 'OVERDUE' && (
                          <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border-amber-300 dark:text-amber-400 font-medium text-[10px]">
                            <AlertTriangle className="mr-1 h-3 w-3 inline text-amber-600" />
                            Quá hạn
                          </Badge>
                        )}
                        {item.status === 'NOT_STARTED' && (
                          <Badge variant="secondary" className="text-[10px]">
                            Chưa học
                          </Badge>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 text-xs">
                            <DropdownMenuItem className="cursor-pointer gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-primary" />
                              Gửi email nhắc nhở
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer gap-1.5">
                              <ExternalLink className="h-3.5 w-3.5" />
                              Xem chi tiết bài làm
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

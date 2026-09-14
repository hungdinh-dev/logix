'use client'

import { useState } from 'react';
import { Search, SlidersHorizontal, LayoutGrid, List, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryPillTabs } from '../components/course-catalog/CategoryPillTabs';
import { CourseCard } from '../components/course-catalog/CourseCard';
import { useCourses } from '@/features/lms/hooks/use-courses';
import { courseApiService } from '@/features/lms/services/course.service';
import type { SortOption, ViewMode } from '../types/course.types';

const ITEMS_PER_PAGE = 6;

function CourseCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Skeleton className="h-[160px] w-full rounded-none" />
      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3.5 w-20" />
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-border/40">
            <Skeleton className="h-9 flex-1 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CourseCatalog() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isMandatoryFilter, setIsMandatoryFilter] = useState<string>('all'); // 'all', 'mandatory', 'optional'
  const [sort, setSort] = useState<SortOption>('newest');
  const [view, setView] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const { courses, categories, isLoading, error, refetchCourses } = useCourses({
    status: 'PUBLISHED',
  });

  const filtered = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === 'All' || course.categoryId === selectedCategory;
    const matchesSearch =
      !search.trim() ||
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(search.toLowerCase()));

    const matchesMandatory =
      isMandatoryFilter === 'all'
        ? true
        : isMandatoryFilter === 'mandatory'
        ? course.isMandatory
        : !course.isMandatory;

    return matchesCategory && matchesSearch && matchesMandatory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'a-z') return a.title.localeCompare(b.title);
    if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return (b._count?.enrollments || 0) - (a._count?.enrollments || 0);
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleEnroll = async (courseId: string) => {
    try {
      setEnrollingId(courseId);
      await courseApiService.enrollCourse(courseId);
      alert('Ghi danh khóa học thành công!');
      refetchCourses();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Ghi danh thất bại');
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Danh Mục Khóa Học Đào Tạo</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Khám phá các khóa học Onboarding, An toàn thực phẩm & Quy trình vận hành Ba Hưng
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              aria-label="Tìm kiếm khóa học"
              placeholder="Tìm kiếm theo mã, tên..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-64 rounded-md pl-9 text-sm"
            />
          </div>

          {/* Mandatory filter */}
          <Select value={isMandatoryFilter} onValueChange={(val) => { setIsMandatoryFilter(val); setPage(1); }}>
            <SelectTrigger className="w-36 text-xs font-medium">
              <SelectValue placeholder="Phân loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="mandatory">Bắt buộc</SelectItem>
              <SelectItem value="optional">Tùy chọn</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sort} onValueChange={(val) => { setSort(val as SortOption); setPage(1); }}>
            <SelectTrigger className="w-36 text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="most-popular">Ghi danh nhiều</SelectItem>
              <SelectItem value="a-z">Tên (A–Z)</SelectItem>
            </SelectContent>
          </Select>

          {/* Refresh */}
          <Button variant="outline" size="icon" onClick={() => refetchCourses()} title="Tải lại dữ liệu">
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>

          {/* View toggle */}
          <div className="flex items-center overflow-hidden rounded-md border border-border">
            <button
              aria-label="Grid view"
              onClick={() => setView('grid')}
              className={cn(
                'flex h-8 w-8 cursor-pointer items-center justify-center transition-colors',
                view === 'grid' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              aria-label="List view"
              onClick={() => setView('list')}
              className={cn(
                'flex h-8 w-8 cursor-pointer items-center justify-center border-l border-border transition-colors',
                view === 'list' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills (LMS-001) */}
      <div className="border-y border-border/40 py-2.5">
        <CategoryPillTabs
          value={selectedCategory}
          categories={categories}
          onValueChange={handleCategoryChange}
        />
      </div>

      {/* Loading & Error States */}
      {isLoading ? (
        <div
          className={cn(
            'grid gap-5',
            view === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1',
          )}
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <CourseCardSkeleton key={idx} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-destructive bg-destructive/5 rounded-xl border border-destructive/20 p-6">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm font-semibold">{error}</p>
          <Button size="sm" variant="outline" onClick={() => refetchCourses()}>Thử lại</Button>
        </div>
      ) : paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground rounded-xl border border-dashed border-border p-12">
          <BookOpen className="h-10 w-10 opacity-40" />
          <p className="text-sm font-medium">Không tìm thấy khóa học nào phù hợp với bộ lọc.</p>
          <Button size="sm" variant="outline" onClick={() => { setSearch(''); setSelectedCategory('All'); setIsMandatoryFilter('all'); }}>
            Xóa bộ lọc
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            'grid gap-5',
            view === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1',
          )}
        >
          {paginated.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={handleEnroll}
              isEnrolling={enrollingId === course.id}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
                aria-disabled={currentPage === 1}
                className={cn(currentPage === 1 && 'pointer-events-none opacity-50')}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1).map(
              (pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === pageNumber}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                aria-disabled={currentPage === totalPages}
                className={cn(currentPage === totalPages && 'pointer-events-none opacity-50')}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

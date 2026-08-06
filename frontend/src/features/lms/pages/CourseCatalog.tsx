'use client'

import { useState } from 'react';
import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
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
import { CategoryPillTabs } from '../components/course-catalog/CategoryPillTabs';
import { CourseCard } from '../components/course-catalog/CourseCard';
import type { CategoryFilter, Course, SortOption, ViewMode } from '../types/course.types';

const ITEMS_PER_PAGE = 6;

import { JS_INFO_COURSES } from '../mocks/javascript-info.mock';

const MOCK_COURSES: Course[] = JS_INFO_COURSES.map(c => ({
  id: c.id,
  title: c.title,
  category: 'Technical',
  instructor: { name: c.instructor.name },
  duration: c.duration,
  enrolledCount: c.enrolled,
  rating: c.rating,
  reviewCount: c.reviews,
  enrolled: c.id === '1',
}));

export default function CourseCatalog() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [sort, setSort] = useState<SortOption>('most-popular');
  const [view, setView] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);

  const filtered = MOCK_COURSES.filter((course) => {
    const matchesCategory = category === 'All' || course.category === category;
    const matchesSearch =
      !search.trim() ||
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'most-popular') return b.enrolledCount - a.enrolledCount;
    if (sort === 'a-z') return a.title.localeCompare(b.title);
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCategoryChange = (value: CategoryFilter) => {
    setCategory(value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value as SortOption);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-t-text-primary">Course Catalog</h1>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-t-text-muted"
              aria-hidden
            />
            <Input
              aria-label="Search courses"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-64 rounded-md border-t-border pl-9 text-sm"
            />
          </div>

          {/* Filter */}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-t-border text-t-text-secondary hover:bg-t-bg-hover hover:text-t-text-primary"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Filter
          </Button>

          {/* View toggle */}
          <div
            className="flex items-center overflow-hidden rounded-md border border-t-border"
            role="group"
            aria-label="View mode"
          >
            <button
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
              onClick={() => setView('grid')}
              className={cn(
                'flex h-8 w-8 cursor-pointer items-center justify-center transition-colors',
                view === 'grid'
                  ? 'bg-t-bg-selected text-t-text-primary'
                  : 'text-t-text-muted hover:text-t-text-secondary',
              )}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden />
            </button>
            <button
              aria-label="List view"
              aria-pressed={view === 'list'}
              onClick={() => setView('list')}
              className={cn(
                'flex h-8 w-8 cursor-pointer items-center justify-center border-l border-t-border transition-colors',
                view === 'list'
                  ? 'bg-t-bg-selected text-t-text-primary'
                  : 'text-t-text-muted hover:text-t-text-secondary',
              )}
            >
              <List className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <CategoryPillTabs value={category} onValueChange={handleCategoryChange} />
        </div>

        <div className="flex-shrink-0">
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-40 border-t-border text-sm" aria-label="Sort courses by">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="most-popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="a-z">A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Course grid / list */}
      {paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20 text-t-text-muted">
          <span className="text-sm">No courses match your filters.</span>
        </div>
      ) : (
        <div
          className={cn(
            'grid gap-4',
            view === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1',
          )}
        >
          {paginated.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
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
                    className={cn(
                      currentPage === pageNumber && 'border-t-accent bg-t-accent text-white hover:bg-t-accent-hover hover:text-white',
                    )}
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

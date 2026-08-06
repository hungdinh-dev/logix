import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { marked } from 'marked'
import { FileText, Clock, HardDrive, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface PageProps {
  searchParams: Promise<{ file?: string }>
}

// Helper to format file size
function formatBytes(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Helper to format date
function formatDate(date: Date) {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export default async function ReportsPage({ searchParams }: PageProps) {
  const { file } = await searchParams
  const docDir = path.resolve(process.cwd(), '../doc')

  let files: { name: string; size: string; mtime: Date }[] = []
  let errorMsg = ''

  // 1. Read files in the root /doc directory
  try {
    if (fs.existsSync(docDir)) {
      const rawFiles = fs.readdirSync(docDir)
      files = rawFiles
        .filter((f) => f.endsWith('.md'))
        .map((f) => {
          const stats = fs.statSync(path.join(docDir, f))
          return {
            name: f,
            size: formatBytes(stats.size),
            mtime: stats.mtime,
          }
        })
        // Sort by modification date (newest first)
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
    } else {
      errorMsg = 'Thư mục /doc không tồn tại ở thư mục gốc của dự án.'
    }
  } catch (err: any) {
    errorMsg = `Lỗi đọc thư mục /doc: ${err.message}`
  }

  // 2. Load and parse selected file
  const selectedFile = file || (files.length > 0 ? files[0].name : '')
  let htmlContent = ''
  let selectedStats = null

  if (selectedFile && files.some((f) => f.name === selectedFile)) {
    try {
      const filePath = path.join(docDir, selectedFile)
      const rawMarkdown = fs.readFileSync(filePath, 'utf-8')
      htmlContent = await marked(rawMarkdown)
      selectedStats = files.find((f) => f.name === selectedFile)
    } catch (err: any) {
      htmlContent = `<p class="text-rose-500 font-medium">Lỗi đọc nội dung file: ${err.message}</p>`
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      {/* Page Header */}
      <div className="mb-6 border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Nhật ký & Báo cáo dự án (Project Reports)
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Đọc trực tiếp các tệp tin báo cáo, hướng dẫn tích hợp và nhật ký phát triển từ thư mục <code className="bg-muted px-1.5 py-0.5 rounded font-mono">/doc</code>.
        </p>
      </div>

      {errorMsg ? (
        <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 p-4 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground text-xs">
          <FileText className="h-8 w-8 mb-2 opacity-55" />
          <span>Không tìm thấy tệp tin Markdown (.md) nào trong thư mục /doc.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar: List of available report files */}
          <div className="md:col-span-1 space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2 select-none">
              Danh sách báo cáo
            </span>
            <div className="flex flex-col gap-1.5">
              {files.map((f) => {
                const isActive = f.name === selectedFile
                return (
                  <Link
                    key={f.name}
                    href={`/lms/reports?file=${f.name}`}
                    className={`flex items-start gap-2.5 rounded-lg border p-3 text-left transition-all hover:bg-muted/50 ${
                      isActive
                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                        : 'border-border bg-card text-foreground'
                    }`}
                  >
                    <FileText className={`h-4 w-4 shrink-0 mt-0.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold leading-snug">
                        {f.name.replace('.md', '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <HardDrive className="h-2.5 w-2.5" />
                          {f.size}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Main Area: Render parsed HTML content */}
          <div className="md:col-span-3">
            <Card className="border-border overflow-hidden bg-card shadow-none">
              {/* Document Header Stats */}
              {selectedStats && (
                <div className="bg-muted/20 px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-4 select-none">
                  <div>
                    <span className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                      doc/{selectedStats.name}
                    </span>
                    <h2 className="text-sm font-semibold text-foreground mt-1.5">
                      {selectedStats.name.replace('.md', '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </h2>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Cập nhật: {formatDate(selectedStats.mtime)}
                    </span>
                    <Separator orientation="vertical" className="h-3.5" />
                    <span className="flex items-center gap-1">
                      <HardDrive className="h-3 w-3" />
                      Dung lượng: {selectedStats.size}
                    </span>
                  </div>
                </div>
              )}

              {/* Parsed Markdown HTML Container */}
              <div className="p-6">
                <article
                  className="prose dark:prose-invert max-w-none text-foreground/90 text-sm leading-relaxed
                    prose-headings:font-bold prose-headings:text-foreground prose-h1:text-xl prose-h2:text-base prose-h3:text-sm prose-h4:text-xs
                    prose-p:my-2 prose-ul:list-disc prose-ul:pl-5 prose-li:my-0.5 prose-strong:text-foreground prose-code:text-primary
                    prose-code:bg-muted prose-code:px-1 prose-code:py-0.2 prose-code:rounded prose-pre:bg-zinc-950 prose-pre:p-4 prose-pre:rounded-lg
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

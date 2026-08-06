'use client'

import { useState } from 'react'
import { ArrowLeft, Save, Eye, Edit2, Sparkles, BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LessonRichEditor } from '@/features/lms/components/editor/LessonRichEditor'
import { CodePlayground } from '@/features/lms/components/lesson-player/CodePlayground'

// Decode utility to cleanly preview code blocks
function decodeHtmlEntities(str: string) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

function parseHtmlWithPlaygrounds(html: string) {
  const parts = [];
  const regex = /<pre[^>]*><code>([\s\S]*?)<\/code><\/pre>/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'html',
        content: html.substring(lastIndex, match.index),
      });
    }

    // Clean up code block matching
    const rawCode = match[1];
    const cleanCode = decodeHtmlEntities(rawCode)
      .replace(/<[^>]*>/g, '') // remove HTML tags if any
      .trim();

    parts.push({
      type: 'code',
      code: cleanCode,
    });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < html.length) {
    parts.push({
      type: 'html',
      content: html.substring(lastIndex),
    });
  }

  return parts;
}

// Sample templates for quick teaching creation demo
const OBJECTS_TEMPLATE = `<h3>Chương: Objects - Cơ bản về đối tượng</h3>
<p>Trong JavaScript, đối tượng (Object) được sử dụng để lưu trữ các bộ sưu tập có khóa của nhiều dữ liệu khác nhau và các thực thể phức tạp hơn.</p>
<p>Hãy thử tạo một đối tượng người dùng đơn giản chứa thông tin <code>name</code> và <code>age</code>:</p>
<pre><code>let user = {
  name: "Nguyễn Văn A",
  age: 20
};

console.log("Tên của user là:", user.name);
console.log("Tuổi của user là:", user.age);
</code></pre>
<p>Chúng ta có thể thêm các thuộc tính mới hoặc xóa bỏ các thuộc tính bất kỳ lúc nào bằng từ khóa <code>delete</code>.</p>`;

const FUNCTIONS_TEMPLATE = `<h3>Chương: Functions - Hàm trong JS</h3>
<p>Hàm là các khối mã nguồn chính được thiết kế để thực hiện một tác vụ cụ thể, có thể tái sử dụng nhiều lần.</p>
<p>Dưới đây là một hàm kiểm tra tuổi để cấp quyền truy cập:</p>
<pre><code>function checkAge(age) {
  if (age >= 18) {
    return true;
  } else {
    return confirm("Bạn đã được phụ huynh đồng ý chưa?");
  }
}

let age = 20;
if (checkAge(age)) {
  alert("Truy cập được phép!");
} else {
  alert("Truy cập bị từ chối!");
}
</code></pre>`;

export default function LessonCreatePage() {
  const router = useRouter()
  const [title, setTitle] = useState('Objects: the basics')
  const [duration, setDuration] = useState('15:00')
  const [type, setType] = useState<'document' | 'video' | 'quiz'>('document')
  const [videoUrl, setVideoUrl] = useState('')
  const [content, setContent] = useState(OBJECTS_TEMPLATE)
  const [previewMode, setPreviewMode] = useState(false)
  const [savedData, setSavedData] = useState<any>(null)

  const handleLoadTemplate = (templateHtml: string, name: string) => {
    setContent(templateHtml)
    setTitle(name)
  }

  const handleSave = () => {
    const payload = {
      title,
      duration,
      type,
      content: type === 'document' ? content : '',
      videoUrl: type === 'video' ? videoUrl : '',
    }
    setSavedData(payload)
    // Clear save notice after 3 seconds
    setTimeout(() => setSavedData(null), 3000)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      {/* Header bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Quay lại LMS
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Tạo bài học mới
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className="h-9 gap-1.5 cursor-pointer text-xs"
          >
            {previewMode ? (
              <>
                <Edit2 className="h-3.5 w-3.5" />
                Chỉnh sửa
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                Xem trước (Preview)
              </>
            )}
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            className="h-9 gap-1.5 cursor-pointer text-xs font-semibold"
          >
            <Save className="h-3.5 w-3.5" />
            Lưu bài học
          </Button>
        </div>
      </div>

      {/* Save success banner */}
      {savedData && (
        <div className="mb-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="font-semibold">Lưu thành công!</span> Dữ liệu bài học đã được mô phỏng lưu vào bộ nhớ tạm:
          <pre className="mt-2 overflow-x-auto rounded bg-zinc-950 p-2 font-mono text-[10px] text-zinc-300">
            {JSON.stringify(savedData, null, 2)}
          </pre>
        </div>
      )}

      {/* Main editor area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form & Editor (Spans 2 cols when editing, 1 col when split screen is active) */}
        <div className={previewMode ? 'lg:col-span-1 space-y-5' : 'lg:col-span-2 space-y-5'}>
          {/* Metadata Section */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Thông tin bài học</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="lesson-title" className="text-xs font-medium text-muted-foreground">Tiêu đề bài học</label>
                <input
                  id="lesson-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="lesson-duration" className="text-xs font-medium text-muted-foreground">Thời lượng (phút:giây)</label>
                <input
                  id="lesson-duration"
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ví dụ: 15:00"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Định dạng bài học</label>
              <div className="flex gap-2">
                {(['document', 'video', 'quiz'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 rounded-lg border py-2 text-xs font-medium capitalize transition-all cursor-pointer ${type === t ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-background text-muted-foreground hover:bg-muted/50'}`}
                  >
                    {t === 'document' ? 'Bài đọc (Text)' : t === 'video' ? 'Bài giảng Video' : 'Trắc nghiệm (Quiz)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Template loader */}
            {type === 'document' && (
              <div className="pt-2">
                <span className="text-[11px] font-medium text-muted-foreground block mb-2">Tải nhanh bài đọc mẫu:</span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => handleLoadTemplate(OBJECTS_TEMPLATE, 'Objects: the basics')}
                    className="h-7 text-[10px] gap-1 cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    Chương Objects
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => handleLoadTemplate(FUNCTIONS_TEMPLATE, 'JavaScript Functions')}
                    className="h-7 text-[10px] gap-1 cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3 text-cyan-500" />
                    Chương Functions
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Editor Input Area */}
          {type === 'document' ? (
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground block">Nội dung văn bản & code block</span>
              <LessonRichEditor content={content} onChange={setContent} />
              <span className="text-[10px] text-muted-foreground block">
                * Mẹo: Nhấn nút <strong>Terminal</strong> trên thanh công cụ để chèn các khối Code. Lớp hiển thị bài học sẽ tự động biến các khối này thành <strong>Interactive Playground</strong> tương tác trực tiếp!
              </span>
            </div>
          ) : type === 'video' ? (
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Liên kết Video</h3>
              <div className="space-y-1.5">
                <label htmlFor="video-url" className="text-xs font-medium text-muted-foreground">Đường dẫn Video giảng dạy (YouTube/Vimeo/Direct MP4)</label>
                <input
                  id="video-url"
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 text-center text-xs text-muted-foreground">
              Vui lòng chuyển tiếp sang trang cài đặt câu hỏi Quiz khi kết xuất dữ liệu này.
            </div>
          )}
        </div>

        {/* Right Column: Live Viewport Student Preview (Visible when previewMode is active) */}
        {previewMode && (
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-medium text-muted-foreground block flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 text-primary" />
              Giao diện xem trước của Học viên (Live Student Viewport)
            </span>

            <div className="bg-card border border-border rounded-xl p-6 min-h-[450px] shadow-sm max-w-none">
              <div className="border-b border-border pb-3 mb-4 flex items-center justify-between">
                <h2 className="text-foreground text-lg font-bold">{title || 'Tiêu đề bài học'}</h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">
                  {duration}
                </span>
              </div>

              {type === 'document' ? (
                <div className="space-y-4">
                  {parseHtmlWithPlaygrounds(content || '').map((part, index) => {
                    if (part.type === 'html') {
                      return (
                        <div
                          key={index}
                          className="text-foreground/90 space-y-4 text-sm leading-relaxed"
                          style={{ fontSize: 'var(--lms-reader-font-size, 16px)' }}
                          dangerouslySetInnerHTML={{ __html: part.content || '' }}
                        />
                      );
                    } else {
                      return (
                        <CodePlayground key={index} initialCode={part.code || ''} />
                      );
                    }
                  })}
                </div>
              ) : type === 'video' ? (
                <div className="aspect-video bg-zinc-950 rounded-lg flex items-center justify-center text-xs text-zinc-400">
                  Video: {videoUrl || 'Chưa cung cấp đường dẫn video'}
                </div>
              ) : (
                <div className="bg-muted/10 border border-dashed border-border rounded-lg p-8 text-center text-xs text-muted-foreground">
                  Giao diện trắc nghiệm sẽ tải tại đây.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

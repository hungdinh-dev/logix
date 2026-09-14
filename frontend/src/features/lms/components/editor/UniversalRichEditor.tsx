'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Terminal,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  FileCode,
  Sparkles,
  Eye,
  Edit3,
  Code2,
  Plus,
  Image as ImageIcon,
  Upload,
  Link2,
  Undo,
  Redo,
  Check,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MarkdownLessonViewer } from '../viewer/MarkdownLessonViewer'
import { markdownToHtml, htmlToMarkdown } from './markdown-converter'

export interface UniversalRichEditorProps {
  readonly value: string
  readonly onChange: (markdown: string) => void
  readonly placeholder?: string
  readonly minHeight?: string
  readonly title?: string
}

export function UniversalRichEditor({
  value = '',
  onChange,
  placeholder = 'Bắt đầu soạn thảo nội dung bài học hoặc dùng thanh công cụ để chèn ảnh, code, terminal...',
  minHeight = '360px',
  title,
}: UniversalRichEditorProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'preview' | 'raw'>('visual')
  const [currentMarkdown, setCurrentMarkdown] = useState<string>(value)

  // Modals state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false)
  const [codeLanguage, setCodeLanguage] = useState('typescript')
  const [codeFilename, setCodeFilename] = useState('')
  const [codeSnippet, setCodeSnippet] = useState('')

  const [isTerminalModalOpen, setIsTerminalModalOpen] = useState(false)
  const [terminalTitle, setTerminalTitle] = useState('bash ~ terminal')
  const [terminalCommands, setTerminalCommands] = useState('$ npm run dev\n✓ Ready in 840ms')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize Tiptap WYSIWYG Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'rounded-xl bg-[#0e131f] text-zinc-100 p-4 font-mono text-xs my-4 border border-zinc-800 shadow-md',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-amber-500 bg-amber-500/5 px-4 py-2 my-3 rounded-r-lg text-foreground/90 italic font-medium',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-6 my-3 space-y-1.5',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-6 my-3 space-y-1.5',
          },
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-4 border shadow-sm object-cover mx-auto block hover:ring-2 hover:ring-primary/40 transition-all',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: markdownToHtml(value),
    editorProps: {
      attributes: {
        class:
          'focus:outline-none min-h-[300px] px-5 py-4 bg-transparent text-foreground prose prose-neutral dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed',
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML()
      const md = htmlToMarkdown(html)
      setCurrentMarkdown(md)
      onChange(md)
    },
  })

  // Synchronize when external value changes
  useEffect(() => {
    if (editor && value !== currentMarkdown) {
      const targetHtml = markdownToHtml(value)
      if (editor.getHTML() !== targetHtml) {
        editor.commands.setContent(targetHtml)
        setCurrentMarkdown(value)
      }
    }
  }, [value, editor, currentMarkdown])

  // ==========================================
  // IMAGE INSERTION HANDLERS
  // ==========================================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImageAlt(file.name.replace(/\.[^/.]+$/, ''))
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInsertImageSubmit = () => {
    if (!editor) return

    const src = imagePreview || imageUrl
    if (!src) return

    editor.chain().focus().setImage({ src, alt: imageAlt || 'Lesson Image' }).run()

    // Reset modal
    setIsImageModalOpen(false)
    setImageUrl('')
    setImageAlt('')
    setImageFile(null)
    setImagePreview('')
  }

  // ==========================================
  // CODE & TERMINAL INSERTION HANDLERS
  // ==========================================
  const handleInsertCodeSubmit = () => {
    if (!editor) return

    const meta = codeFilename ? `${codeLanguage}:${codeFilename}` : codeLanguage
    const cleanSnippet = codeSnippet.trim() || '// Đoạn code mẫu'

    // Insert code block into editor
    editor
      .chain()
      .focus()
      .insertContent(
        `<pre data-filename="${codeFilename}"><code class="language-${codeLanguage}">${cleanSnippet}</code></pre><p></p>`
      )
      .run()

    setIsCodeModalOpen(false)
    setCodeSnippet('')
    setCodeFilename('')
  }

  const handleInsertTerminalSubmit = () => {
    if (!editor) return

    const title = terminalTitle.trim() || 'bash ~ terminal'
    const commands = terminalCommands.trim() || '$ npm run dev'

    // Insert mock terminal block into editor
    editor
      .chain()
      .focus()
      .insertContent(
        `<pre data-title="${title}"><code class="language-terminal">${commands}</code></pre><p></p>`
      )
      .run()

    setIsTerminalModalOpen(false)
    setTerminalCommands('$ npm run dev\n✓ Ready in 840ms')
  }

  const handleSeniorCallout = () => {
    if (!editor) return
    editor
      .chain()
      .focus()
      .insertContent(
        `<blockquote><strong>Tóm lại một câu tầm Senior:</strong> Nhập ghi chú then chốt giúp nhân viên/học viên ghi nhớ nhanh...</blockquote><p></p>`
      )
      .run()
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-xs flex flex-col transition-all focus-within:ring-1 focus-within:ring-primary/20">
      {/* 1. TOP TOOLBAR (WORD / NOTION LIKE) */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-muted/40 border-b border-border select-none">
        {/* Formatting Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Text Styling (B, I, Strike, Code) */}
          <div className="flex items-center gap-0.5 bg-background p-0.5 rounded-lg border shadow-2xs">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!editor}
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`h-7 w-7 cursor-pointer ${
                editor?.isActive('bold')
                  ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="In đậm (Bold - Ctrl+B)"
            >
              <Bold className="h-3.5 w-3.5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!editor}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`h-7 w-7 cursor-pointer ${
                editor?.isActive('italic')
                  ? 'bg-primary text-primary-foreground italic shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="In nghiêng (Italic - Ctrl+I)"
            >
              <Italic className="h-3.5 w-3.5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!editor}
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={`h-7 w-7 cursor-pointer ${
                editor?.isActive('strike')
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Gạch ngang chữ"
            >
              <Strikethrough className="h-3.5 w-3.5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!editor}
              onClick={() => editor?.chain().focus().toggleCode().run()}
              className={`h-7 w-7 font-mono text-xs cursor-pointer ${
                editor?.isActive('code')
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-rose-500 hover:text-rose-600 hover:bg-rose-500/10'
              }`}
              title="Inline Code (`setState`)"
            >
              <Code className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Heading Levels (H1, H2, H3) */}
          <div className="flex items-center gap-0.5 bg-background p-0.5 rounded-lg border shadow-2xs">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!editor}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`h-7 px-2 text-xs font-bold cursor-pointer ${
                editor?.isActive('heading', { level: 1 })
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Tiêu đề chính H1"
            >
              <Heading1 className="h-3.5 w-3.5 mr-0.5" /> H1
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!editor}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`h-7 px-2 text-xs font-semibold cursor-pointer ${
                editor?.isActive('heading', { level: 2 })
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Tiêu đề phụ H2"
            >
              <Heading2 className="h-3.5 w-3.5 mr-0.5" /> H2
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!editor}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`h-7 px-2 text-xs font-medium cursor-pointer ${
                editor?.isActive('heading', { level: 3 })
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Tiêu đề nhỏ H3"
            >
              <Heading3 className="h-3.5 w-3.5 mr-0.5" /> H3
            </Button>
          </div>

          {/* Lists & Quotes */}
          <div className="flex items-center gap-0.5 bg-background p-0.5 rounded-lg border shadow-2xs">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!editor}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`h-7 w-7 cursor-pointer ${
                editor?.isActive('bulletList')
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Danh sách gạch đầu dòng"
            >
              <List className="h-3.5 w-3.5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!editor}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`h-7 w-7 cursor-pointer ${
                editor?.isActive('orderedList')
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Danh sách số thứ tự (1, 2, 3)"
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!editor}
              onClick={handleSeniorCallout}
              className={`h-7 w-7 cursor-pointer ${
                editor?.isActive('blockquote')
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Khối ghi chú / Trích dẫn (Senior Callout)"
            >
              <Quote className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Special Insertion Buttons: Image, Code, Terminal */}
          <div className="flex items-center gap-1.5 ml-1">
            {/* 1. CHÈN ẢNH (BLOG / MEDIA) */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsImageModalOpen(true)}
              className="h-7 px-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/50 cursor-pointer gap-1.5 shadow-2xs"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              + Chèn Ảnh
            </Button>

            {/* 2. KHUNG CODE */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCodeModalOpen(true)}
              className="h-7 px-2.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 cursor-pointer gap-1.5 shadow-2xs"
            >
              <FileCode className="h-3.5 w-3.5" />
              + Khung Code
            </Button>

            {/* 3. TERMINAL MAC */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsTerminalModalOpen(true)}
              className="h-7 px-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 cursor-pointer gap-1.5 shadow-2xs"
            >
              <Terminal className="h-3.5 w-3.5" />
              + Terminal Mac
            </Button>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center rounded-lg border bg-background p-0.5 text-xs shadow-2xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Edit3 className="h-3 w-3" />
            <span>Soạn thảo (Word)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye className="h-3 w-3" />
            <span>Xem trước</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('raw')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'raw'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Xem chuỗi Markdown (.md) ngầm"
          >
            <Code2 className="h-3 w-3" />
            <span>.MD</span>
          </button>
        </div>
      </div>

      {/* 2. EDITOR CANVAS */}
      <div className="p-2" style={{ minHeight }}>
        {/* A. WYSIWYG TIPTAP CANVAS (100% Visual like Word/Notion) */}
        <div className={activeTab === 'visual' ? 'block' : 'hidden'}>
          <EditorContent editor={editor} className="min-h-[320px] focus:outline-none" />
        </div>

        {/* B. STUDENT LIVE PREVIEW */}
        {activeTab === 'preview' && (
          <div className="rounded-xl border bg-muted/10 p-6 min-h-[340px]">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/60">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Mô phỏng hiển thị Học Viên (Live Student Experience)
                </span>
                <span className="text-[11px] text-muted-foreground">Chuẩn typography, ảnh &amp; code</span>
              </div>
              <MarkdownLessonViewer content={currentMarkdown} />
            </div>
          </div>
        )}

        {/* C. RAW MARKDOWN CODE (FOR TECH USERS / OBSIDIAN SYNC) */}
        {activeTab === 'raw' && (
          <div className="space-y-2 p-3">
            <div className="text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Chuỗi Markdown (.md) tự động tạo để lưu trong DB PostgreSQL:</span>
              <span className="font-mono text-[10px]">{currentMarkdown.length} ký tự</span>
            </div>
            <Textarea
              value={currentMarkdown}
              onChange={(e) => {
                const md = e.target.value
                setCurrentMarkdown(md)
                onChange(md)
                if (editor) {
                  editor.commands.setContent(markdownToHtml(md))
                }
              }}
              rows={14}
              className="w-full font-mono text-xs text-muted-foreground bg-muted/20 border rounded-lg"
            />
          </div>
        )}
      </div>

      {/* 3. FOOTER INFO */}
      <div className="px-4 py-2 bg-muted/20 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground select-none">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Trực quan WYSIWYG: Tự động lưu chuỗi Markdown (.md) gọn nhẹ</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
            className="hover:text-foreground disabled:opacity-30 flex items-center gap-1 cursor-pointer"
            title="Hoàn tác (Ctrl+Z)"
          >
            <Undo className="w-3 h-3" />
            <span>Undo</span>
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
            className="hover:text-foreground disabled:opacity-30 flex items-center gap-1 cursor-pointer"
            title="Làm lại (Ctrl+Y)"
          >
            <Redo className="w-3 h-3" />
            <span>Redo</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL 1: CHÈN HÌNH ẢNH (BLOG / MEDIA)      */}
      {/* ========================================== */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-rose-500" />
              <span>Chèn Hình Ảnh Vào Bài Giảng</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tải ảnh trực tiếp từ máy tính của bạn hoặc dán đường dẫn ảnh từ Internet.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid grid-cols-2 mb-3">
              <TabsTrigger value="upload" className="text-xs gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                Tải ảnh từ máy tính
              </TabsTrigger>
              <TabsTrigger value="url" className="text-xs gap-1.5">
                <Link2 className="w-3.5 h-3.5" />
                Dán đường dẫn (URL)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-3.5">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/60 hover:bg-muted/30 transition-all bg-muted/10"
              >
                {imagePreview ? (
                  <div className="relative max-h-44 overflow-hidden rounded-lg border">
                    <img src={imagePreview} alt="Preview" className="max-h-44 object-contain" />
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-foreground">
                      Bấm vào đây để chọn ảnh từ thiết bị
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Hỗ trợ PNG, JPG, GIF, WebP (Tối đa 5MB)
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Chú thích ảnh (Alt text)</Label>
                <Input
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Ví dụ: Sơ đồ kiến trúc Virtual DOM"
                  className="text-xs h-8"
                />
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Đường dẫn ảnh (Image URL)</Label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.png"
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Chú thích ảnh</Label>
                <Input
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Ví dụ: Giao diện vận hành hệ thống"
                  className="text-xs h-8"
                />
              </div>

              {imageUrl && (
                <div className="max-h-36 overflow-hidden rounded-lg border p-1 bg-muted/20">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-h-32 object-contain mx-auto rounded"
                    onError={() => console.warn('Image preview failed')}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsImageModalOpen(false)}
              className="text-xs"
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!imagePreview && !imageUrl}
              onClick={handleInsertImageSubmit}
              className="text-xs bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Chèn Ảnh Vào Bài
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================== */}
      {/* MODAL 2: CHÈN KHUNG CODE NGUỒN (IDE)       */}
      {/* ========================================== */}
      <Dialog open={isCodeModalOpen} onOpenChange={setIsCodeModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <FileCode className="h-5 w-5 text-indigo-600" />
              <span>Chèn Khối Mã Nguồn (Code Block)</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tạo khung code có hiển thị tên file, đánh số dòng và nút sao chép chuyên nghiệp.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Ngôn ngữ lập trình</Label>
                <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue placeholder="Chọn ngôn ngữ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="typescript">TypeScript / TSX</SelectItem>
                    <SelectItem value="javascript">JavaScript / JSX</SelectItem>
                    <SelectItem value="html">HTML / CSS</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="sql">SQL / PostgreSQL</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csharp">C# (.NET)</SelectItem>
                    <SelectItem value="bash">Shell / Bash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Tên file (Tùy chọn)</Label>
                <Input
                  value={codeFilename}
                  onChange={(e) => setCodeFilename(e.target.value)}
                  placeholder="Ví dụ: App.tsx, schema.prisma"
                  className="text-xs h-8"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Đoạn code nguồn</Label>
              <Textarea
                rows={8}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="Dán đoạn code của bạn vào đây..."
                className="font-mono text-xs leading-relaxed"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCodeModalOpen(false)}
              className="text-xs"
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleInsertCodeSubmit}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Chèn Vào Bài Giảng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================== */}
      {/* MODAL 3: CHÈN CỬA SỔ TERMINAL MAC          */}
      {/* ========================================== */}
      <Dialog open={isTerminalModalOpen} onOpenChange={setIsTerminalModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Terminal className="h-5 w-5 text-emerald-600" />
              <span>Chèn Cửa Sổ Terminal macOS / Linux</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Mô phỏng giao diện dòng lệnh với 3 nút tròn màu sắc và câu lệnh $ prompt.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tiêu đề Terminal</Label>
              <Input
                value={terminalTitle}
                onChange={(e) => setTerminalTitle(e.target.value)}
                placeholder="Ví dụ: bash ~ /my-app, terminal"
                className="text-xs h-8 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Các câu lệnh và kết quả</Label>
                <span className="text-[10px] text-muted-foreground">
                  Bắt đầu bằng $ để bôi đậm câu lệnh
                </span>
              </div>
              <Textarea
                rows={6}
                value={terminalCommands}
                onChange={(e) => setTerminalCommands(e.target.value)}
                placeholder="$ pnpm run build&#10;✓ Compiled successfully in 842ms"
                className="font-mono text-xs leading-relaxed"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsTerminalModalOpen(false)}
              className="text-xs"
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleInsertTerminalSubmit}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Chèn Cửa Sổ Terminal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UniversalRichEditor

'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Terminal,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Undo,
  Redo,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

interface LessonRichEditorProps {
  readonly content: string;
  readonly onChange: (html: string) => void;
}

export function LessonRichEditor({ content, onChange }: LessonRichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-zinc-950 text-zinc-100 p-4 font-mono text-xs rounded-lg my-2 border border-zinc-800',
          },
        },
      }),
    ],
    content: content,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[300px] px-4 py-3 bg-card text-foreground prose dark:prose-invert max-w-none text-sm leading-relaxed',
      },
    },
  })

  // Synchronize content if changed from outside (e.g. template selection)
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return (
      <div className="h-[350px] w-full rounded-lg border border-border bg-muted/10 animate-pulse flex items-center justify-center text-xs text-muted-foreground">
        Loading editor...
      </div>
    )
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run()
  const toggleItalic = () => editor.chain().focus().toggleItalic().run()
  const toggleStrike = () => editor.chain().focus().toggleStrike().run()
  const toggleCode = () => editor.chain().focus().toggleCode().run()
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run()
  const toggleHeading1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run()
  const toggleHeading2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run()
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run()
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run()
  const undo = () => editor.chain().focus().undo().run()
  const redo = () => editor.chain().focus().redo().run()

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card flex flex-col min-h-[360px] focus-within:ring-1 focus-within:ring-primary/20">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-muted/30 border-b border-border items-center shrink-0">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={toggleBold}
          className={`h-8 w-8 cursor-pointer ${editor.isActive('bold') ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={toggleItalic}
          className={`h-8 w-8 cursor-pointer ${editor.isActive('italic') ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={toggleStrike}
          className={`h-8 w-8 cursor-pointer ${editor.isActive('strike') ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
          title="Strike"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <div className="h-4 w-[1px] bg-border mx-1" />

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={toggleCode}
          className={`h-8 w-8 cursor-pointer ${editor.isActive('code') ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={toggleCodeBlock}
          className={`h-8 w-8 cursor-pointer ${editor.isActive('codeBlock') ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
          title="Code Block"
        >
          <Terminal className="h-4 w-4" />
        </Button>

        <div className="h-4 w-[1px] bg-border mx-1" />

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={toggleHeading1}
          className={`h-8 w-8 cursor-pointer ${editor.isActive('heading', { level: 1 }) ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={toggleHeading2}
          className={`h-8 w-8 cursor-pointer ${editor.isActive('heading', { level: 2 }) ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <div className="h-4 w-[1px] bg-border mx-1" />

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={toggleBulletList}
          className={`h-8 w-8 cursor-pointer ${editor.isActive('bulletList') ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={toggleOrderedList}
          className={`h-8 w-8 cursor-pointer ${editor.isActive('orderedList') ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="h-4 w-[1px] bg-border mx-1 flex-1" />

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={undo}
          disabled={!editor.can().undo()}
          className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={redo}
          disabled={!editor.can().redo()}
          className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto max-h-[400px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

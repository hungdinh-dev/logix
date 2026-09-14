'use client'

import React, { useState } from 'react'
import {
  Copy,
  Check,
  Terminal as TerminalIcon,
  FileCode,
  Info,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react'

// ==========================================
// 1. MOCK TERMINAL WINDOW (macOS 3 Dots + Copy)
// ==========================================
export function MockTerminalFrame({
  title = 'bash ~ terminal',
  content,
}: {
  title?: string
  content: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = content.trim().split('\n')

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-zinc-800 bg-[#0c1017] shadow-xl font-mono text-xs text-zinc-200">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#161b22] border-b border-zinc-800/80 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block shadow-xs" />
          </div>
          <span className="text-[11px] text-zinc-400 font-medium ml-2 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-zinc-500" />
            {title}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-100 px-2 py-1 rounded bg-zinc-800/60 hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Sao chép câu lệnh"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
        </button>
      </div>

      {/* Terminal Content */}
      <div className="p-4 overflow-x-auto space-y-1.5 leading-relaxed font-mono">
        {lines.map((line, idx) => {
          const isCommand = line.trim().startsWith('$') || line.trim().startsWith('>')
          const cmdContent = line.replace(/^[\$>]\s*/, '')
          return (
            <div key={idx} className="flex gap-2.5 items-start">
              {isCommand ? (
                <>
                  <span className="text-emerald-400 select-none font-bold shrink-0">$</span>
                  <span className="text-zinc-100 font-semibold">{cmdContent}</span>
                </>
              ) : (
                <>
                  <span className="text-zinc-600 select-none shrink-0 w-2.5 text-center">›</span>
                  <span className="text-zinc-400">{line}</span>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ==========================================
// 2. IDE CODE WINDOW (Syntax Highlight + Filename)
// ==========================================
export function CodeWindowFrame({
  filename,
  language = 'typescript',
  code,
}: {
  filename?: string
  language?: string
  code: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.trim().split('\n')

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-zinc-800 bg-[#0e131f] shadow-xl text-xs font-mono">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#181e2e] border-b border-zinc-800/80 select-none">
        <div className="flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[11px] font-semibold text-zinc-200">
            {filename || (language ? `${language.toUpperCase()} Snippet` : 'Code')}
          </span>
          {language && (
            <span className="text-[10px] text-zinc-400 uppercase bg-zinc-800/80 px-1.5 py-0.5 rounded">
              {language}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-100 px-2 py-1 rounded bg-zinc-800/60 hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Sao chép mã nguồn"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
        </button>
      </div>

      {/* Code Lines with Line Numbers */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-zinc-800/20 transition-colors leading-6">
                <td className="w-8 select-none pr-3 text-right text-zinc-600 text-[11px] align-top font-mono">
                  {idx + 1}
                </td>
                <td className="pl-2 font-mono whitespace-pre text-zinc-200 text-xs align-top">
                  {formatSyntaxHighlight(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Simple client-side lightweight syntax tokenizer for JSX/TS/JS/SQL/HTML
function formatSyntaxHighlight(line: string): React.ReactNode {
  // If comment
  if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
    return <span className="text-zinc-500 italic">{line}</span>
  }

  // Basic regex tokenizer for keywords, strings, types
  const keywords = ['import', 'export', 'default', 'function', 'const', 'let', 'var', 'return', 'from', 'if', 'else', 'for', 'while', 'async', 'await', 'type', 'interface', 'class', 'extends', 'new', 'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'JOIN']
  
  const tokens = line.split(/(\s+|[(),={}<>;:[\]'"`])/g)
  
  return tokens.map((token, i) => {
    if (keywords.includes(token)) {
      return <span key={i} className="text-purple-400 font-semibold">{token}</span>
    }
    if (/^["'].*["']$/.test(token) || token.startsWith('"') || token.startsWith("'")) {
      return <span key={i} className="text-emerald-400">{token}</span>
    }
    if (/^[0-9]+$/.test(token)) {
      return <span key={i} className="text-amber-400">{token}</span>
    }
    if (['useState', 'useEffect', 'useMemo', 'useCallback', 'setState'].includes(token)) {
      return <span key={i} className="text-cyan-400 font-semibold">{token}</span>
    }
    return <span key={i}>{token}</span>
  })
}

// ==========================================
// 3. CALLOUT / SENIOR QUOTE BOX
// ==========================================
export function SeniorCalloutBox({ children, variant = 'quote' }: { children: React.ReactNode; variant?: 'quote' | 'note' | 'warning' | 'tip' }) {
  if (variant === 'quote') {
    return (
      <div className="my-5 pl-4 border-l-[3px] border-zinc-300 dark:border-zinc-200 bg-muted/20 dark:bg-muted/10 py-3 pr-4 rounded-r-lg">
        <div className="text-sm leading-relaxed text-foreground/95">
          {children}
        </div>
      </div>
    )
  }

  if (variant === 'warning') {
    return (
      <div className="my-4 rounded-lg border-l-4 border-amber-500 bg-amber-500/10 p-3.5 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="flex-1 leading-relaxed">{children}</div>
      </div>
    )
  }

  if (variant === 'tip') {
    return (
      <div className="my-4 rounded-lg border-l-4 border-emerald-500 bg-emerald-500/10 p-3.5 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
        <Lightbulb className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <div className="flex-1 leading-relaxed">{children}</div>
      </div>
    )
  }

  return (
    <div className="my-4 rounded-lg border-l-4 border-indigo-500 bg-indigo-500/10 p-3.5 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
      <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
      <div className="flex-1 leading-relaxed">{children}</div>
    </div>
  )
}

// ==========================================
// 4. INLINE PARSER & RENDERER (Supports Markdown Text)
// ==========================================
export function parseInlineText(text: string): React.ReactNode {
  // Replace inline bold, italic, and code badges
  // e.g. **bold**, *italic*, `code`
  const parts: React.ReactNode[] = []

  // Regex for **bold**, *italic*, `code`
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g
  let match
  let lastIndex = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }

    const matchedStr = match[0]
    if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-foreground">
          {matchedStr.slice(2, -2)}
        </strong>
      )
    } else if (matchedStr.startsWith('*') && matchedStr.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic">
          {matchedStr.slice(1, -1)}
        </em>
      )
    } else if (matchedStr.startsWith('`') && matchedStr.endsWith('`')) {
      const codeVal = matchedStr.slice(1, -1)
      parts.push(
        <span
          key={match.index}
          className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded mx-0.5 bg-rose-500/15 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-500/20 inline-block align-middle"
        >
          {codeVal}
        </span>
      )
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

// ==========================================
// 5. MAIN COMPONENT: MarkdownLessonViewer
// ==========================================
export interface MarkdownLessonViewerProps {
  readonly content?: string | null
  readonly className?: string
}

export function MarkdownLessonViewer({ content, className = '' }: MarkdownLessonViewerProps) {
  if (!content || !content.trim()) {
    return (
      <div className="text-muted-foreground text-sm italic py-4">
        Chưa có nội dung bài học.
      </div>
    )
  }

  const rawText = content.trim()

  // Parse markdown blocks (Code blocks, Headings, Lists, Quotes, Paragraphs)
  const blocks: React.ReactNode[] = []
  const lines = rawText.split('\n')
  let i = 0

  while (i < lines.length) {
    const currentLine = lines[i]

    // 1. CODE BLOCK OR TERMINAL BLOCK (```lang:filename or ```terminal)
    if (currentLine.trim().startsWith('```')) {
      const meta = currentLine.trim().replace(/^```/, '').trim()
      let isTerminal = false
      let language = 'typescript'
      let filename = ''

      if (
        meta.toLowerCase().startsWith('terminal') ||
        meta.toLowerCase().startsWith('bash') ||
        meta.toLowerCase().startsWith('shell') ||
        meta.toLowerCase().startsWith('sh')
      ) {
        isTerminal = true
        filename = meta.includes(':') ? meta.split(':')[1].trim() : 'terminal — bash'
      } else if (meta.includes(':')) {
        const [langPart, filePart] = meta.split(':')
        language = langPart.trim()
        filename = filePart.trim()
      } else if (meta) {
        language = meta
      }

      // Collect code lines until closing ```
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // Skip closing ```

      const codeContent = codeLines.join('\n')

      if (isTerminal) {
        blocks.push(
          <MockTerminalFrame key={`term-${i}`} title={filename || 'bash ~ terminal'} content={codeContent} />
        )
      } else {
        blocks.push(
          <CodeWindowFrame
            key={`code-${i}`}
            filename={filename}
            language={language}
            code={codeContent}
          />
        )
      }
      continue
    }

    // 2. HEADINGS (# H1, ## H2, ### H3)
    if (currentLine.startsWith('# ')) {
      blocks.push(
        <h1 key={i} className="text-2xl font-bold text-foreground mt-6 mb-3 tracking-tight">
          {parseInlineText(currentLine.replace(/^#\s+/, ''))}
        </h1>
      )
      i++
      continue
    }
    if (currentLine.startsWith('## ')) {
      blocks.push(
        <h2 key={i} className="text-xl font-bold text-foreground mt-5 mb-2.5 tracking-tight">
          {parseInlineText(currentLine.replace(/^##\s+/, ''))}
        </h2>
      )
      i++
      continue
    }
    if (currentLine.startsWith('### ')) {
      blocks.push(
        <h3 key={i} className="text-lg font-semibold text-foreground mt-4 mb-2 tracking-tight">
          {parseInlineText(currentLine.replace(/^###\s+/, ''))}
        </h3>
      )
      i++
      continue
    }

    // 3. SENIOR QUOTE / CALLOUTS (Lines starting with >)
    if (currentLine.startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      const quoteText = quoteLines.join('\n')
      blocks.push(
        <SeniorCalloutBox key={`quote-${i}`} variant="quote">
          {parseInlineText(quoteText)}
        </SeniorCalloutBox>
      )
      continue
    }

    // 4. ORDERED / NUMBERED LIST (1. , 2. )
    if (/^\d+\.\s/.test(currentLine.trim())) {
      const listItems: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''))
        i++
      }
      blocks.push(
        <ol key={`ol-${i}`} className="my-3 space-y-2.5 list-none pl-0 text-sm leading-relaxed text-foreground/90">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="font-semibold text-foreground/80 shrink-0 select-none">
                {idx + 1}.
              </span>
              <span className="flex-1">{parseInlineText(item)}</span>
            </li>
          ))}
        </ol>
      )
      continue
    }

    // 5. BULLET LIST (- or * )
    if (/^[-*]\s/.test(currentLine.trim())) {
      const listItems: string[] = []
      while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-*]\s+/, ''))
        i++
      }
      blocks.push(
        <ul key={`ul-${i}`} className="my-3 space-y-2 list-disc pl-5 text-sm leading-relaxed text-foreground/90">
          {listItems.map((item, idx) => (
            <li key={idx} className="pl-1">
              {parseInlineText(item)}
            </li>
          ))}
        </ul>
      )
      continue
    }

    // 6. IMAGE ( ![alt](src) )
    const imgMatch = currentLine.trim().match(/^!\[(.*?)\]\((.*?)\)$/)
    if (imgMatch) {
      const altText = imgMatch[1] || 'Hình ảnh bài học'
      const imgSrc = imgMatch[2]
      blocks.push(
        <div key={`img-${i}`} className="my-5 space-y-1.5">
          <div className="overflow-hidden rounded-xl border border-border/80 bg-muted/20 shadow-md">
            <img
              src={imgSrc}
              alt={altText}
              className="max-h-[500px] w-full object-contain mx-auto rounded-lg"
              loading="lazy"
            />
          </div>
          {altText && altText !== 'image' && altText !== 'Lesson Image' && (
            <p className="text-center text-xs text-muted-foreground italic">
              📷 {altText}
            </p>
          )}
        </div>
      )
      i++
      continue
    }

    // 7. EMPTY LINE
    if (!currentLine.trim()) {
      i++
      continue
    }

    // 8. REGULAR PARAGRAPH
    blocks.push(
      <p key={i} className="my-2.5 text-sm sm:text-base leading-relaxed text-foreground/90">
        {parseInlineText(currentLine)}
      </p>
    )
    i++
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {blocks}
    </div>
  )
}

export default MarkdownLessonViewer

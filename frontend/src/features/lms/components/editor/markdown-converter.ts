import { marked } from 'marked'

/**
 * Convert Markdown text to HTML for Tiptap editor consumption.
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown || !markdown.trim()) return '<p></p>'
  
  // If it's already HTML (e.g. contains <p>, <div>, <h1> tags), return as is
  if (/^<[a-z][\s\S]*>/i.test(markdown.trim())) {
    return markdown
  }

  try {
    const html = marked.parse(markdown, { async: false }) as string
    return html || '<p></p>'
  } catch (err) {
    console.error('Error converting markdown to html:', err)
    return `<p>${markdown}</p>`
  }
}

/**
 * Convert HTML from Tiptap editor back into clean, lightweight Markdown (.md).
 */
export function htmlToMarkdown(html: string): string {
  if (!html || !html.trim()) return ''

  if (typeof window === 'undefined') {
    return html
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  return convertNodeToMarkdown(doc.body).trim()
}

function convertNodeToMarkdown(node: Node): string {
  let result = ''

  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      result += child.textContent || ''
      return
    }

    if (child.nodeType !== Node.ELEMENT_NODE) return

    const el = child as HTMLElement
    const tagName = el.tagName.toLowerCase()

    switch (tagName) {
      case 'h1':
        result += `\n# ${getInlineText(el)}\n\n`
        break
      case 'h2':
        result += `\n## ${getInlineText(el)}\n\n`
        break
      case 'h3':
        result += `\n### ${getInlineText(el)}\n\n`
        break
      case 'h4':
      case 'h5':
      case 'h6':
        result += `\n### ${getInlineText(el)}\n\n`
        break
      case 'p': {
        const text = getInlineText(el)
        if (text.trim()) {
          result += `${text}\n\n`
        }
        break
      }
      case 'strong':
      case 'b':
        result += `**${getInlineText(el)}**`
        break
      case 'em':
      case 'i':
        result += `*${getInlineText(el)}*`
        break
      case 's':
      case 'strike':
      case 'del':
        result += `~~${getInlineText(el)}~~`
        break
      case 'code':
        if (el.parentElement?.tagName.toLowerCase() !== 'pre') {
          result += `\`${el.textContent || ''}\``
        }
        break
      case 'pre': {
        const codeEl = el.querySelector('code') || el
        const className = codeEl.getAttribute('class') || ''
        const dataFilename = el.getAttribute('data-filename') || codeEl.getAttribute('data-filename') || ''
        const dataTitle = el.getAttribute('data-title') || codeEl.getAttribute('data-title') || ''
        
        let lang = 'typescript'
        const match = className.match(/language-(\w+)/)
        if (match) {
          lang = match[1]
        }

        let meta = lang
        if (dataTitle) {
          meta = `terminal:${dataTitle}`
        } else if (dataFilename) {
          meta = `${lang}:${dataFilename}`
        }

        const rawCode = codeEl.textContent || ''
        result += `\n\`\`\`${meta}\n${rawCode.trim()}\n\`\`\`\n\n`
        break
      }
      case 'blockquote': {
        const quoteText = getInlineText(el).trim()
        result += `\n> ${quoteText.split('\n').join('\n> ')}\n\n`
        break
      }
      case 'ul': {
        el.querySelectorAll(':scope > li').forEach((li) => {
          result += `- ${getInlineText(li as HTMLElement)}\n`
        })
        result += '\n'
        break
      }
      case 'ol': {
        let count = 1
        el.querySelectorAll(':scope > li').forEach((li) => {
          result += `${count}. ${getInlineText(li as HTMLElement)}\n`
          count++
        })
        result += '\n'
        break
      }
      case 'img': {
        const src = el.getAttribute('src') || ''
        const alt = el.getAttribute('alt') || 'image'
        result += `\n![${alt}](${src})\n\n`
        break
      }
      case 'hr':
        result += `\n---\n\n`
        break
      case 'br':
        result += `\n`
        break
      default:
        result += convertNodeToMarkdown(el)
        break
    }
  })

  return result
}

function getInlineText(el: HTMLElement): string {
  let text = ''
  el.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      text += child.textContent || ''
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const childEl = child as HTMLElement
      const tag = childEl.tagName.toLowerCase()

      if (tag === 'strong' || tag === 'b') {
        text += `**${getInlineText(childEl)}**`
      } else if (tag === 'em' || tag === 'i') {
        text += `*${getInlineText(childEl)}*`
      } else if (tag === 'code') {
        text += `\`${childEl.textContent || ''}\``
      } else if (tag === 'img') {
        const src = childEl.getAttribute('src') || ''
        const alt = childEl.getAttribute('alt') || 'image'
        text += `![${alt}](${src})`
      } else {
        text += getInlineText(childEl)
      }
    }
  })
  return text
}

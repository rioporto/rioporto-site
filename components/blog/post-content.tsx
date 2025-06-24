"use client"

import { useEffect, useRef } from "react"
import { marked } from "marked"

interface BlogPostContentProps {
  content: string
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function renderContent() {
      // Configurar marked para renderização segura
      marked.setOptions({
        gfm: true,
        breaks: true,
        pedantic: false
      })

      if (contentRef.current && content) {
        // Renderizar Markdown
        const htmlContent = await marked(content)
        contentRef.current.innerHTML = htmlContent
      
      // Adicionar classes Tailwind aos elementos
      const elements = contentRef.current.querySelectorAll('*')
      elements.forEach(el => {
        const tagName = el.tagName.toLowerCase()
        
        switch(tagName) {
          case 'h1':
            el.className = 'text-4xl font-bold mt-8 mb-4'
            break
          case 'h2':
            el.className = 'text-3xl font-bold mt-8 mb-4'
            break
          case 'h3':
            el.className = 'text-2xl font-bold mt-6 mb-3'
            break
          case 'h4':
            el.className = 'text-xl font-bold mt-6 mb-3'
            break
          case 'p':
            el.className = 'mb-6 leading-relaxed'
            break
          case 'ul':
            el.className = 'list-disc pl-6 mb-6 space-y-2'
            break
          case 'ol':
            el.className = 'list-decimal pl-6 mb-6 space-y-2'
            break
          case 'li':
            el.className = 'leading-relaxed'
            break
          case 'blockquote':
            el.className = 'border-l-4 border-primary pl-4 my-6 italic text-muted-foreground'
            break
          case 'code':
            if (el.parentElement?.tagName !== 'PRE') {
              el.className = 'bg-muted px-1.5 py-0.5 rounded text-sm font-mono'
            }
            break
          case 'pre':
            el.className = 'bg-muted p-4 rounded-lg overflow-x-auto mb-6'
            const code = el.querySelector('code')
            if (code) {
              code.className = 'text-sm font-mono'
            }
            break
          case 'table':
            el.className = 'w-full border-collapse mb-6'
            break
          case 'th':
            el.className = 'border border-border px-4 py-2 text-left font-bold bg-muted'
            break
          case 'td':
            el.className = 'border border-border px-4 py-2'
            break
          case 'a':
            el.className = 'text-primary hover:underline'
            el.setAttribute('target', '_blank')
            el.setAttribute('rel', 'noopener noreferrer')
            break
          case 'img':
            el.className = 'rounded-lg my-6 max-w-full h-auto'
            break
          case 'hr':
            el.className = 'my-8 border-border'
            break
          case 'strong':
            el.className = 'font-bold'
            break
          case 'em':
            el.className = 'italic'
            break
        }
      })
      }
    }
    
    renderContent()
  }, [content])

  return (
    <div 
      ref={contentRef}
      className="prose prose-lg dark:prose-invert max-w-none"
    />
  )
}
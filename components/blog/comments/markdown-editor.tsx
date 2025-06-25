'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

// Função simples de markdown para demonstração
// Em produção, use uma biblioteca como react-markdown
function parseSimpleMarkdown(text: string): string {
  return text
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-3 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-3">$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener">$1</a>')
    // Line breaks
    .replace(/\n/g, '<br />')
    // Code inline
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
    // Lists
    .replace(/^\* (.+)$/gim, '<li class="ml-4">• $1</li>')
    .replace(/^\- (.+)$/gim, '<li class="ml-4">• $1</li>')
    .replace(/^\d+\. (.+)$/gim, '<li class="ml-4">$1</li>');
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const parsedContent = parseSimpleMarkdown(content);
  
  return (
    <div 
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert",
        "text-sm whitespace-pre-wrap",
        className
      )}
      dangerouslySetInnerHTML={{ __html: parsedContent }}
    />
  );
}

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  maxLength?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
  maxLength = 5000
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'write' | 'preview')}>
      <div className="border rounded-md">
        <TabsList className="w-full justify-start rounded-b-none border-b bg-muted/50">
          <TabsTrigger value="write" className="gap-2">
            <Edit3 className="h-4 w-4" />
            Escrever
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="h-4 w-4" />
            Visualizar
          </TabsTrigger>
          <span className="ml-auto mr-3 text-xs text-muted-foreground">
            {value.length}/{maxLength}
          </span>
        </TabsList>
        
        <TabsContent value="write" className="m-0">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            maxLength={maxLength}
            className={cn(
              "w-full resize-none border-0 bg-transparent p-3",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-0",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
          <div className="border-t bg-muted/50 px-3 py-2">
            <p className="text-xs text-muted-foreground">
              Suporta <strong>**negrito**</strong>, <em>*itálico*</em>, 
              <code className="bg-muted px-1">`código`</code> e 
              [links](url)
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="m-0 min-h-[120px] p-3">
          {value.trim() ? (
            <MarkdownPreview content={value} />
          ) : (
            <p className="text-muted-foreground">Nada para visualizar</p>
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
}
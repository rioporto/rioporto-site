'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, X } from 'lucide-react';

interface CommentEditFormProps {
  commentId: string;
  initialContent: string;
  onSuccess: (newContent: string) => void;
  onCancel: () => void;
}

export function CommentEditForm({ 
  commentId, 
  initialContent, 
  onSuccess, 
  onCancel 
}: CommentEditFormProps) {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('O comentário não pode estar vazio');
      return;
    }

    if (content.trim() === initialContent.trim()) {
      onCancel();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao editar comentário');
      }

      onSuccess(content.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao editar comentário');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
        rows={4}
        className="resize-none"
      />
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {content.length}/5000 caracteres
        </p>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="mr-1 h-4 w-4" />
            Cancelar
          </Button>
          
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-1 h-4 w-4" />
                Salvar
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
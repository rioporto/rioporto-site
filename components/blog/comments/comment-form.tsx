'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, User, Mail } from 'lucide-react';
import { MarkdownEditor } from './markdown-editor';
import { ReCaptcha } from './recaptcha';
import { useAuth } from '@/contexts/auth-context';
import { CreateCommentDTO } from '@/types/comments';

interface CommentFormProps {
  postSlug: string;
  parentId?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CommentForm({ 
  postSlug, 
  parentId = null, 
  onSuccess,
  onCancel 
}: CommentFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Campos do formulário
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validação básica
    if (!content.trim()) {
      setError('Por favor, escreva um comentário');
      return;
    }

    if (!user) {
      if (!authorName.trim() || !authorEmail.trim()) {
        setError('Nome e email são obrigatórios para comentários anônimos');
        return;
      }
      
      if (!recaptchaToken && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        setError('Por favor, complete a verificação do reCAPTCHA');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const commentData: CreateCommentDTO = {
        post_slug: postSlug,
        content: content.trim(),
        parent_id: parentId,
        ...(user ? {} : {
          author_name: authorName.trim(),
          author_email: authorEmail.trim(),
          recaptcha_token: recaptchaToken,
        }),
      };

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar comentário');
      }

      // Limpar formulário
      setContent('');
      setAuthorName('');
      setAuthorEmail('');
      setRecaptchaToken(null);
      
      // Mostrar mensagem de sucesso
      setSuccessMessage(data.message || 'Comentário enviado com sucesso!');
      
      // Callback de sucesso
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar comentário');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campos para usuários não autenticados */}
      {!user && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              <User className="w-4 h-4 inline mr-1" />
              Nome
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              disabled={isSubmitting}
              required={!user}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">
              <Mail className="w-4 h-4 inline mr-1" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              disabled={isSubmitting}
              required={!user}
            />
          </div>
        </div>
      )}

      {/* Campo de comentário */}
      <div className="space-y-2">
        <Label htmlFor="comment">
          Comentário
        </Label>
        <MarkdownEditor
          value={content}
          onChange={setContent}
          placeholder={parentId ? "Escreva sua resposta..." : "Compartilhe sua opinião..."}
          disabled={isSubmitting}
          rows={parentId ? 3 : 4}
        />
      </div>

      {/* Mensagens de erro/sucesso */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {successMessage && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* reCAPTCHA para usuários anônimos */}
      {!user && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <div className="space-y-2">
          <Label>Verificação de segurança</Label>
          <ReCaptcha
            siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onVerify={(token) => setRecaptchaToken(token)}
            onError={() => setError('Erro ao carregar reCAPTCHA')}
            onExpired={() => {
              setRecaptchaToken(null);
              setError('reCAPTCHA expirou. Por favor, complete novamente.');
            }}
          />
        </div>
      )}

      {/* Informação sobre moderação */}
      {!user && (
        <p className="text-sm text-muted-foreground">
          Comentários anônimos passam por moderação antes de serem publicados.
        </p>
      )}

      {/* Botões */}
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {parentId ? 'Responder' : 'Comentar'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
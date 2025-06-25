'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, TrendingUp, Clock, History } from 'lucide-react';
import { BlogCommentsResponse } from '@/types/comments';
import { CommentItem } from './comment-item';

interface CommentListProps {
  postSlug: string;
  onCommentUpdate?: () => void;
}

export function CommentList({ postSlug, onCommentUpdate }: CommentListProps) {
  const [comments, setComments] = useState<BlogCommentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Função para buscar comentários
  const fetchComments = async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (!append) setIsLoading(true);
      else setIsLoadingMore(true);

      const params = new URLSearchParams({
        post_slug: postSlug,
        page: pageNum.toString(),
        per_page: '20',
        sort: sortBy,
      });

      const response = await fetch(`/api/comments?${params}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar comentários');
      }

      const data: BlogCommentsResponse = await response.json();

      if (append && comments) {
        // Adicionar novos comentários aos existentes
        setComments({
          ...data,
          comments: [...comments.comments, ...data.comments],
        });
      } else {
        setComments(data);
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar comentários');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Buscar comentários quando componente montar ou mudar ordenação
  useEffect(() => {
    setPage(1);
    fetchComments(1);
  }, [postSlug, sortBy]);

  // Recarregar comentários quando houver atualização
  useEffect(() => {
    if (onCommentUpdate) {
      fetchComments(page);
    }
  }, [onCommentUpdate]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage, true);
  };

  const getSortIcon = (sort: string) => {
    switch (sort) {
      case 'newest':
        return <Clock className="w-4 h-4" />;
      case 'oldest':
        return <History className="w-4 h-4" />;
      case 'popular':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-8 w-48" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => fetchComments()}>Tentar novamente</Button>
      </div>
    );
  }

  if (!comments || comments.comments.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">Seja o primeiro a comentar!</p>
        <p className="text-sm text-muted-foreground">
          Compartilhe sua opinião sobre este artigo.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header com contagem e ordenação */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {comments.total} {comments.total === 1 ? 'Comentário' : 'Comentários'}
        </h3>
        
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              {getSortIcon(sortBy)}
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Mais recentes
              </div>
            </SelectItem>
            <SelectItem value="oldest">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Mais antigos
              </div>
            </SelectItem>
            <SelectItem value="popular">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Mais populares
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de comentários */}
      <div className="space-y-6">
        {comments.comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postSlug={postSlug}
            onReplySuccess={() => fetchComments(page)}
            onUpdate={() => fetchComments(page)}
          />
        ))}
      </div>

      {/* Botão carregar mais */}
      {comments.has_more && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Carregando...' : 'Carregar mais comentários'}
          </Button>
        </div>
      )}
    </div>
  );
}
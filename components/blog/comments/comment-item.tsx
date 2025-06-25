'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  MoreVertical,
  Flag,
  Edit,
  Trash
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BlogComment } from '@/types/comments';
import { useAuth } from '@/contexts/auth-context';
import { formatRelativeTime, generateAvatar } from '@/lib/comments/utils';
import { CommentForm } from './comment-form';
import { CommentEditForm } from './comment-edit-form';
import { cn } from '@/lib/utils';

interface CommentItemProps {
  comment: BlogComment;
  postSlug: string;
  depth?: number;
  onReplySuccess?: () => void;
  onUpdate?: () => void;
}

export function CommentItem({ 
  comment, 
  postSlug,
  depth = 0,
  onReplySuccess,
  onUpdate
}: CommentItemProps) {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isLiking, setIsLiking] = useState(false);
  const [localLikes, setLocalLikes] = useState(comment.likes_count);
  const [localDislikes, setLocalDislikes] = useState(comment.dislikes_count);
  const [userReaction, setUserReaction] = useState(comment.user_reaction);

  const isAuthor = user?.id === comment.user_id;
  const canReply = depth < 3; // Limitar profundidade de respostas

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      const response = await fetch(`/api/comments/${comment.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reaction_type: type }),
      });

      if (response.ok) {
        // Atualizar contadores localmente
        if (userReaction === type) {
          // Removendo reação
          setUserReaction(null);
          if (type === 'like') {
            setLocalLikes(prev => prev - 1);
          } else {
            setLocalDislikes(prev => prev - 1);
          }
        } else if (userReaction) {
          // Mudando de reação
          if (userReaction === 'like') {
            setLocalLikes(prev => prev - 1);
            setLocalDislikes(prev => prev + 1);
          } else {
            setLocalDislikes(prev => prev - 1);
            setLocalLikes(prev => prev + 1);
          }
          setUserReaction(type);
        } else {
          // Nova reação
          setUserReaction(type);
          if (type === 'like') {
            setLocalLikes(prev => prev + 1);
          } else {
            setLocalDislikes(prev => prev + 1);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao reagir:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleReport = async () => {
    const reason = prompt('Por que você está reportando este comentário?');
    if (!reason) return;

    try {
      const response = await fetch(`/api/comments/${comment.id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reason: 'other', 
          description: reason 
        }),
      });

      if (response.ok) {
        alert('Comentário reportado. Obrigado!');
      }
    } catch (error) {
      console.error('Erro ao reportar:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar este comentário?')) return;

    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: 'DELETE',
      });

      if (response.ok && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  return (
    <div className={cn("flex gap-3", depth > 0 && "ml-12")}>
      {/* Avatar */}
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage 
          src={comment.avatar_url || generateAvatar(comment.display_name, comment.display_email)} 
          alt={comment.display_name} 
        />
        <AvatarFallback>
          {comment.display_name?.slice(0, 2).toUpperCase() || 'AN'}
        </AvatarFallback>
      </Avatar>

      {/* Conteúdo */}
      <div className="flex-1 space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">
              {comment.display_name || 'Anônimo'}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(comment.created_at)}
            </span>
            {comment.status === 'pending' && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                Aguardando moderação
              </span>
            )}
          </div>

          {/* Menu de ações */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthor && (
                <>
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete}>
                    <Trash className="mr-2 h-4 w-4" />
                    Deletar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={handleReport}>
                <Flag className="mr-2 h-4 w-4" />
                Reportar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Conteúdo do comentário */}
        {isEditing ? (
          <CommentEditForm
            commentId={comment.id}
            initialContent={editedContent}
            onSuccess={(newContent) => {
              setEditedContent(newContent);
              setIsEditing(false);
              if (onUpdate) onUpdate();
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <p className="text-sm whitespace-pre-wrap">{editedContent}</p>
        )}

        {/* Ações */}
        <div className="flex items-center gap-4">
          {/* Likes/Dislikes */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-2",
                userReaction === 'like' && "text-primary"
              )}
              onClick={() => handleReaction('like')}
              disabled={isLiking}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span className="text-xs">{localLikes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-2",
                userReaction === 'dislike' && "text-red-500"
              )}
              onClick={() => handleReaction('dislike')}
              disabled={isLiking}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              <span className="text-xs">{localDislikes}</span>
            </Button>
          </div>

          {/* Responder */}
          {canReply && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              <span className="text-xs">Responder</span>
            </Button>
          )}
        </div>

        {/* Formulário de resposta */}
        {showReplyForm && (
          <div className="mt-4">
            <CommentForm
              postSlug={postSlug}
              parentId={comment.id}
              onSuccess={() => {
                setShowReplyForm(false);
                if (onReplySuccess) onReplySuccess();
              }}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}

        {/* Respostas */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postSlug={postSlug}
                depth={depth + 1}
                onReplySuccess={onReplySuccess}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
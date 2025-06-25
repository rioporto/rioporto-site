// types/comments.ts
// Sistema de Comentários - Tipos TypeScript

export interface BlogComment {
  id: string;
  post_slug: string;
  user_id: string | null;
  author_name: string | null;
  author_email: string | null;
  content: string;
  parent_id: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  likes_count: number;
  dislikes_count: number;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  
  // Campos virtuais da view
  display_name?: string;
  display_email?: string;
  avatar_url?: string | null;
  replies_count?: number;
  
  // Para o frontend
  replies?: BlogComment[];
  user_reaction?: 'like' | 'dislike' | null;
}

export interface BlogCommentReaction {
  id: string;
  comment_id: string;
  user_id: string | null;
  ip_address: string | null;
  reaction_type: 'like' | 'dislike';
  created_at: string;
}

export interface BlogCommentReport {
  id: string;
  comment_id: string;
  reporter_id: string | null;
  reporter_ip: string | null;
  reason: 'spam' | 'offensive' | 'harassment' | 'misinformation' | 'other';
  description: string | null;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface BlogBlockedWord {
  id: string;
  word: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface BlogBannedIP {
  id: string;
  ip_address: string;
  reason: string | null;
  banned_by: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface BlogPostCommentStats {
  post_slug: string;
  total_comments: number;
  unique_commenters: number;
  avg_likes: number;
  last_comment_at: string;
}

// DTOs para criação/atualização
export interface CreateCommentDTO {
  post_slug: string;
  content: string;
  parent_id?: string | null;
  author_name?: string | null;
  author_email?: string | null;
  recaptcha_token?: string | null; // Para comentários anônimos
}

export interface UpdateCommentDTO {
  content?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'spam';
}

export interface CreateReactionDTO {
  comment_id: string;
  reaction_type: 'like' | 'dislike';
}

export interface CreateReportDTO {
  comment_id: string;
  reason: 'spam' | 'offensive' | 'harassment' | 'misinformation' | 'other';
  description?: string;
}

// Tipos para respostas da API
export interface BlogCommentWithReplies extends BlogComment {
  replies: BlogComment[];
  user_reaction?: 'like' | 'dislike' | null;
}

export interface BlogCommentsResponse {
  comments: BlogCommentWithReplies[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

export interface BlogCommentModerationItem extends BlogComment {
  reports: BlogCommentReport[];
  reporter_details?: {
    email: string;
    name: string;
  }[];
}

// Configurações do sistema
export interface CommentSettings {
  moderation_enabled: boolean;
  auto_approve_authenticated: boolean;
  require_email_verification: boolean;
  enable_recaptcha: boolean;
  max_depth: number; // Profundidade máxima de respostas aninhadas
  comments_per_page: number;
}

// Tipos para o painel administrativo
export interface CommentFilter {
  status?: 'pending' | 'approved' | 'rejected' | 'spam' | 'all';
  post_slug?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
  has_reports?: boolean;
  search?: string;
}

export interface BulkAction {
  action: 'approve' | 'reject' | 'delete' | 'mark_spam';
  comment_ids: string[];
  reason?: string;
}
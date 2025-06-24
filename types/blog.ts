// Tipos para o sistema de Blog
export interface BlogAuthor {
  id: string
  slug: string
  name: string
  bio: string | null
  avatar_url: string | null
  role: string | null
  email: string | null
  created_at: string
  updated_at: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  created_at: string
  updated_at: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  featured_image_url: string | null
  category_id: string | null
  author_id: string | null
  featured: boolean
  published: boolean
  published_at: string | null
  read_time: number | null
  views: number
  meta_description: string | null
  meta_keywords: string[] | null
  created_at: string
  updated_at: string
  // Relações (quando usando joins)
  author?: BlogAuthor
  category?: BlogCategory
  tags?: BlogTag[]
}

export interface BlogPostWithRelations extends BlogPost {
  author_name: string | null
  author_slug: string | null
  author_avatar: string | null
  category_name: string | null
  category_slug: string | null
  tags?: BlogTag[]
}

export interface BlogComment {
  id: string
  post_id: string
  user_id: string
  parent_id: string | null
  content: string
  approved: boolean
  created_at: string
  updated_at: string
  // Relações
  user?: {
    id: string
    name: string | null
    email: string | null
  }
  replies?: BlogComment[]
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name: string | null
  subscribed: boolean
  verified: boolean
  verification_token: string | null
  categories: string[] | null
  created_at: string
  updated_at: string
}

export interface PostAnalytics {
  id: string
  post_id: string
  user_id: string | null
  session_id: string | null
  ip_address: string | null
  user_agent: string | null
  referrer: string | null
  time_spent: number | null
  created_at: string
}

export interface CategoryStats {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  post_count: number
  published_count: number
}

// Tipos para requests/responses
export interface CreateCommentRequest {
  post_id: string
  content: string
  parent_id?: string
}

export interface SubscribeNewsletterRequest {
  email: string
  name?: string
  categories?: string[]
}

export interface BlogFilters {
  category?: string
  tag?: string
  author?: string
  search?: string
  featured?: boolean
  page?: number
  limit?: number
}

export interface BlogPostsResponse {
  posts: BlogPostWithRelations[]
  total: number
  page: number
  totalPages: number
}

// Tipos para analytics
export interface PostViewRequest {
  post_id: string
  session_id?: string
  referrer?: string
}

export interface BlogStats {
  totalPosts: number
  totalViews: number
  totalComments: number
  totalSubscribers: number
  postsByCategory: {
    category: string
    count: number
    percentage: number
  }[]
  popularPosts: {
    id: string
    title: string
    views: number
  }[]
}

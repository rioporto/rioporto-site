import { createClient } from '@/lib/supabase/client'
import { 
  BlogPost, 
  BlogPostWithRelations, 
  BlogFilters, 
  BlogPostsResponse, 
  BlogCategory,
  BlogTag,
  BlogAuthor,
  BlogComment,
  CreateCommentRequest,
  SubscribeNewsletterRequest,
  PostViewRequest,
  BlogStats
} from '@/types/blog'

// =====================================================
// POSTS
// =====================================================

export async function getBlogPosts(filters: BlogFilters = {}): Promise<BlogPostsResponse> {
  try {
    const supabase = createClient()
    const { 
      category, 
      tag, 
      author, 
      search, 
      featured, 
      page = 1, 
      limit = 10 
    } = filters
    
    const offset = (page - 1) * limit

    let query = supabase
      .from('published_posts')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (category) {
      query = query.eq('category_slug', category)
    }
    
    if (featured !== undefined) {
      query = query.eq('featured', featured)
    }
    
    if (author) {
      query = query.eq('author_slug', author)
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
    }
    
    if (tag) {
      // Para filtrar por tag, precisamos fazer uma query diferente
      const { data: tagData } = await supabase
        .from('tags')
        .select('id')
        .eq('slug', tag)
        .single()
      
      if (tagData) {
        const { data: postIds } = await supabase
          .from('post_tags')
          .select('post_id')
          .eq('tag_id', tagData.id)
        
        if (postIds && postIds.length > 0) {
          query = query.in('id', postIds.map(p => p.post_id))
        }
      }
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching blog posts:', error)
      throw error
    }

    // Garantir que sempre retornamos um array
    const posts = Array.isArray(data) ? data : []

    return {
      posts: posts,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error in getBlogPosts:', error)
    // Retornar estrutura vazia em caso de erro
    return {
      posts: [],
      total: 0,
      page: filters.page || 1,
      totalPages: 0
    }
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPostWithRelations | null> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('published_posts')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching post:', error)
      return null
    }

    if (!data) {
      return null
    }

    // Incrementar views (não esperar pela resposta)
    supabase.rpc('increment_post_views', { post_id_param: data.id }).then(() => {
      console.log('View incremented')
    }).catch(error => {
      console.error('Error incrementing views:', error)
    })

    return data
  } catch (error) {
    console.error('Error in getPostBySlug:', error)
    return null
  }
}

export async function getFeaturedPosts(limit: number = 3): Promise<BlogPostWithRelations[]> {
  try {
    const { posts } = await getBlogPosts({ featured: true, limit })
    return posts
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

export async function getRelatedPosts(postId: string, limit: number = 3): Promise<BlogPostWithRelations[]> {
  try {
    const supabase = createClient()
    
    const { data } = await supabase
      .from('related_posts')
      .select(`
        related_post:blog_posts!related_post_id(
          *,
          author:authors(*),
          category:categories(*)
        )
      `)
      .eq('post_id', postId)
      .limit(limit)

    if (!data || !Array.isArray(data)) return []

    return data.map(item => item.related_post).filter(Boolean)
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

// =====================================================
// CATEGORIAS E TAGS
// =====================================================

export async function getCategories(): Promise<BlogCategory[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getCategories:', error)
    return []
  }
}

export async function getCategoryStats() {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('category_stats')
      .select('*')
      .order('published_count', { ascending: false })

    if (error) {
      console.error('Error fetching category stats:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getCategoryStats:', error)
    return []
  }
}

export async function getTags(): Promise<BlogTag[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching tags:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getTags:', error)
    return []
  }
}

export async function getPopularTags(limit: number = 10): Promise<BlogTag[]> {
  try {
    const supabase = createClient()
    
    // Query para pegar as tags mais usadas
    const { data, error } = await supabase
      .from('tags')
      .select(`
        *,
        post_tags!inner(count)
      `)
      .order('post_tags.count', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching popular tags:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getPopularTags:', error)
    return []
  }
}

// =====================================================
// AUTORES
// =====================================================

export async function getAuthors(): Promise<BlogAuthor[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching authors:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getAuthors:', error)
    return []
  }
}

export async function getAuthorBySlug(slug: string): Promise<BlogAuthor | null> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching author:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getAuthorBySlug:', error)
    return null
  }
}

// =====================================================
// COMENTÁRIOS
// =====================================================

export async function getPostComments(postId: string): Promise<BlogComment[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:profiles!comments_user_id_fkey(
          id,
          name,
          email
        )
      `)
      .eq('post_id', postId)
      .eq('approved', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching comments:', error)
      return []
    }

    // Organizar comentários em hierarquia (replies)
    const comments = data || []
    const commentMap = new Map()
    const rootComments: BlogComment[] = []

    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] })
    })

    comments.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id)
        if (parent) {
          parent.replies.push(commentMap.get(comment.id))
        }
      } else {
        rootComments.push(commentMap.get(comment.id))
      }
    })

    return rootComments
  } catch (error) {
    console.error('Error in getPostComments:', error)
    return []
  }
}

export async function createComment(data: CreateCommentRequest): Promise<BlogComment | null> {
  try {
    const supabase = createClient()
    
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      throw new Error('User must be authenticated to comment')
    }

    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        post_id: data.post_id,
        user_id: user.user.id,
        parent_id: data.parent_id,
        content: data.content,
        approved: false // Comentários precisam ser aprovados
      })
      .select(`
        *,
        user:profiles!comments_user_id_fkey(
          id,
          name,
          email
        )
      `)
      .single()

    if (error) {
      console.error('Error creating comment:', error)
      throw error
    }

    return comment
  } catch (error) {
    console.error('Error in createComment:', error)
    throw error
  }
}

// =====================================================
// NEWSLETTER
// =====================================================

export async function subscribeNewsletter(data: SubscribeNewsletterRequest): Promise<boolean> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: data.email,
        name: data.name,
        categories: data.categories,
        verification_token: crypto.randomUUID()
      })

    if (error) {
      if (error.code === '23505') { // Duplicate email
        console.error('Email already subscribed')
      } else {
        console.error('Error subscribing to newsletter:', error)
      }
      return false
    }

    // TODO: Enviar email de verificação

    return true
  } catch (error) {
    console.error('Error in subscribeNewsletter:', error)
    return false
  }
}

// =====================================================
// ANALYTICS
// =====================================================

export async function trackPostView(data: PostViewRequest): Promise<void> {
  try {
    const supabase = createClient()
    
    const { data: user } = await supabase.auth.getUser()
    
    await supabase
      .from('post_analytics')
      .insert({
        post_id: data.post_id,
        user_id: user.user?.id,
        session_id: data.session_id,
        referrer: data.referrer,
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null
      })
  } catch (error) {
    console.error('Error tracking post view:', error)
  }
}

export async function getBlogStats(): Promise<BlogStats | null> {
  try {
    const supabase = createClient()
    
    // Total de posts
    const { count: totalPosts } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('published', true)

    // Total de views
    const { data: viewsData } = await supabase
      .from('blog_posts')
      .select('views')
      .eq('published', true)
    
    const totalViews = viewsData?.reduce((sum, post) => sum + (post.views || 0), 0) || 0

    // Total de comentários aprovados
    const { count: totalComments } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('approved', true)

    // Total de inscritos na newsletter
    const { count: totalSubscribers } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('subscribed', true)

    // Posts por categoria
    const { data: categoryStats } = await supabase
      .from('category_stats')
      .select('*')

    const postsByCategory = categoryStats?.map(cat => ({
      category: cat.name,
      count: cat.published_count,
      percentage: totalPosts ? (cat.published_count / totalPosts) * 100 : 0
    })) || []

    // Posts mais populares
    const { data: popularPostsData } = await supabase
      .from('blog_posts')
      .select('id, title, views')
      .eq('published', true)
      .order('views', { ascending: false })
      .limit(5)

    const popularPosts = popularPostsData || []

    return {
      totalPosts: totalPosts || 0,
      totalViews,
      totalComments: totalComments || 0,
      totalSubscribers: totalSubscribers || 0,
      postsByCategory,
      popularPosts
    }
  } catch (error) {
    console.error('Error fetching blog stats:', error)
    return null
  }
}

// =====================================================
// BUSCA
// =====================================================

export async function searchPosts(query: string, limit: number = 10): Promise<BlogPostWithRelations[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('published_posts')
      .select('*')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error searching posts:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in searchPosts:', error)
    return []
  }
}
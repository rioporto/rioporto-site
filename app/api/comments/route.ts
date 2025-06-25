// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CreateCommentDTO, BlogCommentsResponse } from '@/types/comments';
import { headers } from 'next/headers';
import { z } from 'zod';
import { checkAndSendNotifications } from '@/lib/comments/notifications';
import { verifyRecaptcha } from '@/lib/comments/utils';

// Schema de validação para criar comentário
const createCommentSchema = z.object({
  post_slug: z.string().min(1),
  content: z.string().min(3).max(5000),
  parent_id: z.string().uuid().nullable().optional(),
  author_name: z.string().min(2).max(100).optional(),
  author_email: z.string().email().optional(),
  recaptcha_token: z.string().optional(),
});

// GET /api/comments - Listar comentários
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const post_slug = searchParams.get('post_slug');
  const page = parseInt(searchParams.get('page') || '1');
  const per_page = parseInt(searchParams.get('per_page') || '20');
  const sort = searchParams.get('sort') || 'newest';

  if (!post_slug) {
    return NextResponse.json(
      { error: 'post_slug é obrigatório' },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  
  try {
    // Calcular offset
    const offset = (page - 1) * per_page;
    
    // Query base para comentários aprovados
    let query = supabase
      .from('blog_comments_with_author')
      .select('*', { count: 'exact' })
      .eq('post_slug', post_slug)
      .eq('status', 'approved')
      .is('parent_id', null); // Apenas comentários raiz

    // Aplicar ordenação
    switch (sort) {
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'popular':
        query = query.order('likes_count', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Aplicar paginação
    query = query.range(offset, offset + per_page - 1);

    const { data: comments, error, count } = await query;

    if (error) {
      console.error('Erro ao buscar comentários:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar comentários' },
        { status: 500 }
      );
    }

    // Buscar respostas para cada comentário
    if (comments && comments.length > 0) {
      const commentIds = comments.map(c => c.id);
      
      const { data: replies } = await supabase
        .from('comments_with_author')
        .select('*')
        .in('parent_id', commentIds)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      // Organizar respostas por parent_id
      const repliesByParent = replies?.reduce((acc, reply) => {
        if (!acc[reply.parent_id]) {
          acc[reply.parent_id] = [];
        }
        acc[reply.parent_id].push(reply);
        return acc;
      }, {} as Record<string, any[]>) || {};

      // Adicionar respostas aos comentários
      comments.forEach(comment => {
        comment.replies = repliesByParent[comment.id] || [];
      });
    }

    // Verificar reações do usuário (se autenticado)
    const { data: { user } } = await supabase.auth.getUser();
    if (user && comments) {
      const commentIds = comments.flatMap(c => [
        c.id,
        ...(c.replies?.map((r: any) => r.id) || [])
      ]);

      const { data: reactions } = await supabase
        .from('blog_comment_reactions')
        .select('comment_id, reaction_type')
        .in('comment_id', commentIds)
        .eq('user_id', user.id);

      const reactionMap = reactions?.reduce((acc, r) => {
        acc[r.comment_id] = r.reaction_type;
        return acc;
      }, {} as Record<string, string>) || {};

      // Adicionar reações aos comentários
      comments.forEach(comment => {
        comment.user_reaction = reactionMap[comment.id] || null;
        if (comment.replies) {
          comment.replies.forEach((reply: any) => {
            reply.user_reaction = reactionMap[reply.id] || null;
          });
        }
      });
    }

    const response: BlogCommentsResponse = {
      comments: comments || [],
      total: count || 0,
      page,
      per_page,
      has_more: count ? offset + per_page < count : false,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao processar comentários:', error);
    return NextResponse.json(
      { error: 'Erro ao processar comentários' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Criar comentário
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados
    const validationResult = createCommentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const supabase = await createClient();
    
    // Obter IP e user agent
    const headersList = await headers();
    const ip_address = headersList.get('x-forwarded-for')?.split(',')[0] || 
                      headersList.get('x-real-ip') || 
                      'unknown';
    const user_agent = headersList.get('user-agent') || 'unknown';

    // Verificar se o IP está banido
    const { data: bannedIp } = await supabase
      .from('blog_banned_ips')
      .select('id')
      .eq('ip_address', ip_address)
      .or('expires_at.is.null,expires_at.gt.now()')
      .single();

    if (bannedIp) {
      return NextResponse.json(
        { error: 'Você foi banido de comentar' },
        { status: 403 }
      );
    }

    // Verificar usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();

    // Para comentários anônimos, verificar reCAPTCHA
    if (!user && data.recaptcha_token) {
      const isValidCaptcha = await verifyRecaptcha(data.recaptcha_token);
      if (!isValidCaptcha) {
        return NextResponse.json(
          { error: 'Falha na verificação do reCAPTCHA' },
          { status: 400 }
        );
      }
    }

    // Verificar conteúdo contra palavras bloqueadas
    const { data: blockedWords } = await supabase
      .from('blog_blocked_words')
      .select('word, severity');

    const contentLower = data.content.toLowerCase();
    const foundBlockedWords = blockedWords?.filter(bw => 
      contentLower.includes(bw.word.toLowerCase())
    ) || [];

    // Se encontrou palavras de alta severidade, marcar como spam
    const hasHighSeverityWords = foundBlockedWords.some(w => w.severity === 'high');
    const status = hasHighSeverityWords ? 'spam' : 
                  (user ? 'approved' : 'pending'); // Auto-aprovar usuários autenticados

    // Criar comentário
    const commentData = {
      post_slug: data.post_slug,
      content: data.content,
      parent_id: data.parent_id || null,
      user_id: user?.id || null,
      author_name: user ? null : data.author_name,
      author_email: user ? null : data.author_email,
      status,
      ip_address,
      user_agent,
      published_at: status === 'approved' ? new Date().toISOString() : null,
    };

    const { data: newComment, error } = await supabase
      .from('blog_comments')
      .insert(commentData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar comentário:', error);
      return NextResponse.json(
        { error: 'Erro ao criar comentário' },
        { status: 500 }
      );
    }

    // Se aprovado automaticamente, buscar dados completos
    if (status === 'approved') {
      const { data: fullComment } = await supabase
        .from('comments_with_author')
        .select('*')
        .eq('id', newComment.id)
        .single();

      // Enviar notificações se for uma resposta
      if (newComment.parent_id) {
        // Buscar título do post para a notificação
        const { data: post } = await supabase
          .from('blog_posts')
          .select('title')
          .eq('slug', data.post_slug)
          .single();
        
        if (post) {
          await checkAndSendNotifications(
            newComment,
            post.title
          );
        }
      }

      return NextResponse.json({
        comment: fullComment || newComment,
        message: 'Comentário publicado com sucesso!',
      });
    }

    return NextResponse.json({
      comment: newComment,
      message: 'Comentário enviado para moderação. Será publicado após aprovação.',
    });
  } catch (error) {
    console.error('Erro ao criar comentário:', error);
    return NextResponse.json(
      { error: 'Erro ao processar comentário' },
      { status: 500 }
    );
  }
}
// app/api/comments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Schema de validação para atualizar comentário
const updateCommentSchema = z.object({
  content: z.string().min(3).max(5000).optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'spam']).optional(),
});

// GET /api/comments/[id] - Buscar comentário específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  
  const { data: comment, error } = await supabase
    .from('blog_comments_with_author')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !comment) {
    return NextResponse.json(
      { error: 'Comentário não encontrado' },
      { status: 404 }
    );
  }

  // Buscar respostas
  const { data: replies } = await supabase
    .from('blog_comments_with_author')
    .select('*')
    .eq('parent_id', params.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: true });

  comment.replies = replies || [];

  return NextResponse.json(comment);
}

// PUT /api/comments/[id] - Atualizar comentário
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validar dados
    const validationResult = updateCommentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const updates = validationResult.data;
    const supabase = await createClient();
    
    // Verificar permissões
    const { data: { user } } = await supabase.auth.getUser();
    
    // Buscar comentário original
    const { data: originalComment } = await supabase
      .from('blog_comments')
      .select('user_id, status')
      .eq('id', params.id)
      .single();

    if (!originalComment) {
      return NextResponse.json(
        { error: 'Comentário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se é o autor (para editar conteúdo)
    if (updates.content && (!user || user.id !== originalComment.user_id)) {
      return NextResponse.json(
        { error: 'Você não tem permissão para editar este comentário' },
        { status: 403 }
      );
    }

    // Para mudança de status, verificar se é admin
    if (updates.status && updates.status !== originalComment.status) {
      // TODO: Implementar verificação de admin
      // const isAdmin = await checkIfUserIsAdmin(user?.id);
      // if (!isAdmin) {
      //   return NextResponse.json(
      //     { error: 'Apenas administradores podem mudar o status' },
      //     { status: 403 }
      //   );
      // }
    }

    // Se aprovando o comentário, definir published_at
    const updateData: any = { ...updates };
    if (updates.status === 'approved' && originalComment.status !== 'approved') {
      updateData.published_at = new Date().toISOString();
    }

    // Atualizar comentário
    const { data: updatedComment, error } = await supabase
      .from('blog_comments')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar comentário:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar comentário' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      comment: updatedComment,
      message: 'Comentário atualizado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao atualizar comentário:', error);
    return NextResponse.json(
      { error: 'Erro ao processar atualização' },
      { status: 500 }
    );
  }
}

// DELETE /api/comments/[id] - Deletar comentário
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Verificar permissões
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      );
    }

    // Buscar comentário
    const { data: comment } = await supabase
      .from('blog_comments')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (!comment) {
      return NextResponse.json(
        { error: 'Comentário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se é o autor ou admin
    if (user.id !== comment.user_id) {
      // TODO: Implementar verificação de admin
      // const isAdmin = await checkIfUserIsAdmin(user.id);
      // if (!isAdmin) {
        return NextResponse.json(
          { error: 'Você não tem permissão para deletar este comentário' },
          { status: 403 }
        );
      // }
    }

    // Deletar comentário (respostas serão deletadas em cascata)
    const { error } = await supabase
      .from('blog_comments')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Erro ao deletar comentário:', error);
      return NextResponse.json(
        { error: 'Erro ao deletar comentário' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Comentário deletado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar comentário:', error);
    return NextResponse.json(
      { error: 'Erro ao processar exclusão' },
      { status: 500 }
    );
  }
}
// app/api/comments/[id]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { z } from 'zod';

// Schema de validação
const reactionSchema = z.object({
  reaction_type: z.enum(['like', 'dislike']),
});

// POST /api/comments/[id]/like - Adicionar/atualizar reação
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validar dados
    const validationResult = reactionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { reaction_type } = validationResult.data;
    const supabase = await createClient();
    
    // Obter IP
    const headersList = await headers();
    const ip_address = headersList.get('x-forwarded-for')?.split(',')[0] || 
                      headersList.get('x-real-ip') || 
                      'unknown';

    // Verificar se o comentário existe
    const { data: comment } = await supabase
      .from('blog_comments')
      .select('id')
      .eq('id', params.id)
      .single();

    if (!comment) {
      return NextResponse.json(
        { error: 'Comentário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar usuário
    const { data: { user } } = await supabase.auth.getUser();

    // Buscar reação existente
    let existingReactionQuery = supabase
      .from('blog_comment_reactions')
      .select('id, reaction_type')
      .eq('comment_id', params.id);

    if (user) {
      existingReactionQuery = existingReactionQuery.eq('user_id', user.id);
    } else {
      existingReactionQuery = existingReactionQuery.eq('ip_address', ip_address);
    }

    const { data: existingReaction } = await existingReactionQuery.single();

    // Se já existe uma reação
    if (existingReaction) {
      // Se é a mesma reação, remover (toggle)
      if (existingReaction.reaction_type === reaction_type) {
        const { error } = await supabase
          .from('blog_comment_reactions')
          .delete()
          .eq('id', existingReaction.id);

        if (error) {
          console.error('Erro ao remover reação:', error);
          return NextResponse.json(
            { error: 'Erro ao remover reação' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          message: 'Reação removida',
          reaction: null,
        });
      } else {
        // Atualizar para nova reação
        const { data: updatedReaction, error } = await supabase
          .from('blog_comment_reactions')
          .update({ reaction_type })
          .eq('id', existingReaction.id)
          .select()
          .single();

        if (error) {
          console.error('Erro ao atualizar reação:', error);
          return NextResponse.json(
            { error: 'Erro ao atualizar reação' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          message: 'Reação atualizada',
          reaction: updatedReaction,
        });
      }
    }

    // Criar nova reação
    const reactionData = {
      comment_id: params.id,
      user_id: user?.id || null,
      ip_address: user ? null : ip_address,
      reaction_type,
    };

    const { data: newReaction, error } = await supabase
      .from('blog_comment_reactions')
      .insert(reactionData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar reação:', error);
      return NextResponse.json(
        { error: 'Erro ao criar reação' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Reação adicionada',
      reaction: newReaction,
    });
  } catch (error) {
    console.error('Erro ao processar reação:', error);
    return NextResponse.json(
      { error: 'Erro ao processar reação' },
      { status: 500 }
    );
  }
}

// DELETE /api/comments/[id]/like - Remover reação
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Obter IP
    const headersList = await headers();
    const ip_address = headersList.get('x-forwarded-for')?.split(',')[0] || 
                      headersList.get('x-real-ip') || 
                      'unknown';

    // Verificar usuário
    const { data: { user } } = await supabase.auth.getUser();

    // Remover reação
    let deleteQuery = supabase
      .from('blog_comment_reactions')
      .delete()
      .eq('comment_id', params.id);

    if (user) {
      deleteQuery = deleteQuery.eq('user_id', user.id);
    } else {
      deleteQuery = deleteQuery.eq('ip_address', ip_address);
    }

    const { error } = await deleteQuery;

    if (error) {
      console.error('Erro ao remover reação:', error);
      return NextResponse.json(
        { error: 'Erro ao remover reação' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Reação removida com sucesso',
    });
  } catch (error) {
    console.error('Erro ao remover reação:', error);
    return NextResponse.json(
      { error: 'Erro ao processar remoção' },
      { status: 500 }
    );
  }
}
// app/api/comments/[id]/report/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { z } from 'zod';

// Schema de validação
const reportSchema = z.object({
  reason: z.enum(['spam', 'offensive', 'harassment', 'misinformation', 'other']),
  description: z.string().max(500).optional(),
});

// POST /api/comments/[id]/report - Reportar comentário
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validar dados
    const validationResult = reportSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { reason, description } = validationResult.data;
    const supabase = await createClient();
    
    // Obter IP
    const headersList = await headers();
    const ip_address = headersList.get('x-forwarded-for')?.split(',')[0] || 
                      headersList.get('x-real-ip') || 
                      'unknown';

    // Verificar se o comentário existe
    const { data: comment } = await supabase
      .from('blog_comments')
      .select('id, status')
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

    // Verificar se já foi reportado pelo mesmo usuário/IP
    let existingReportQuery = supabase
      .from('blog_comment_reports')
      .select('id')
      .eq('comment_id', params.id)
      .eq('status', 'pending');

    if (user) {
      existingReportQuery = existingReportQuery.eq('reporter_id', user.id);
    } else {
      existingReportQuery = existingReportQuery.eq('reporter_ip', ip_address);
    }

    const { data: existingReport } = await existingReportQuery.single();

    if (existingReport) {
      return NextResponse.json(
        { error: 'Você já reportou este comentário' },
        { status: 400 }
      );
    }

    // Criar report
    const reportData = {
      comment_id: params.id,
      reporter_id: user?.id || null,
      reporter_ip: user ? null : ip_address,
      reason,
      description: description || null,
    };

    const { data: newReport, error } = await supabase
      .from('blog_comment_reports')
      .insert(reportData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar report:', error);
      return NextResponse.json(
        { error: 'Erro ao reportar comentário' },
        { status: 500 }
      );
    }

    // Se for spam ou offensive com múltiplos reports, marcar comentário para revisão
    if (reason === 'spam' || reason === 'offensive') {
      const { count } = await supabase
        .from('blog_comment_reports')
        .select('*', { count: 'exact', head: true })
        .eq('comment_id', params.id)
        .in('reason', ['spam', 'offensive']);

      // Se tem 3 ou mais reports, mudar status para pending
      if (count && count >= 3 && comment.status === 'approved') {
        await supabase
          .from('blog_comments')
          .update({ status: 'pending' })
          .eq('id', params.id);
      }
    }

    return NextResponse.json({
      message: 'Comentário reportado com sucesso. Obrigado por ajudar a manter nossa comunidade segura.',
      report: newReport,
    });
  } catch (error) {
    console.error('Erro ao reportar comentário:', error);
    return NextResponse.json(
      { error: 'Erro ao processar report' },
      { status: 500 }
    );
  }
}

// GET /api/comments/[id]/report - Listar reports do comentário (admin)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // TODO: Verificar se é admin
    // const { data: { user } } = await supabase.auth.getUser();
    // const isAdmin = await checkIfUserIsAdmin(user?.id);
    // if (!isAdmin) {
    //   return NextResponse.json(
    //     { error: 'Acesso negado' },
    //     { status: 403 }
    //   );
    // }

    const { data: reports, error } = await supabase
      .from('blog_comment_reports')
      .select(`
        *,
        reporter:reporter_id(email)
      `)
      .eq('comment_id', params.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar reports:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar reports' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reports: reports || [],
      total: reports?.length || 0,
    });
  } catch (error) {
    console.error('Erro ao buscar reports:', error);
    return NextResponse.json(
      { error: 'Erro ao processar busca' },
      { status: 500 }
    );
  }
}
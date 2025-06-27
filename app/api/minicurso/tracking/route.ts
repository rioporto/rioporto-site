import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface TrackingData {
  token: string;
  activity_type: 'page_view' | 'audio_play' | 'audio_complete' | 'course_complete';
  page_id?: string;
  duration_seconds?: number;
  metadata?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const body: TrackingData = await request.json();
    const { token, activity_type, page_id, duration_seconds, metadata } = body;

    if (!token || !activity_type) {
      return NextResponse.json(
        { error: 'Token e tipo de atividade são obrigatórios' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Verificar se o token é válido
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id')
      .eq('access_token', token)
      .gte('token_expires_at', new Date().toISOString())
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }

    // Registrar a atividade
    const { error: activityError } = await supabase
      .from('minicurso_activities')
      .insert({
        lead_id: lead.id,
        activity_type,
        page_id,
        duration_seconds,
        metadata,
        created_at: new Date().toISOString()
      });

    if (activityError) {
      throw activityError;
    }

    // Atualizar estatísticas do lead
    if (activity_type === 'page_view') {
      await updateLeadProgress(supabase, lead.id, page_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao registrar atividade:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}

async function updateLeadProgress(supabase: any, leadId: string, pageId?: string) {
  // Buscar todas as atividades do lead
  const { data: activities } = await supabase
    .from('minicurso_activities')
    .select('page_id')
    .eq('lead_id', leadId)
    .eq('activity_type', 'page_view');

  if (activities) {
    // Calcular progresso (assumindo 9 páginas total)
    const uniquePages = new Set(activities.map((a: any) => a.page_id));
    const progress = Math.round((uniquePages.size / 9) * 100);

    // Atualizar progresso no lead
    await supabase
      .from('leads')
      .update({ 
        course_progress: progress,
        last_page_viewed: pageId,
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId);
  }
}

// GET - Obter progresso do lead
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Buscar lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, course_progress, last_page_viewed')
      .eq('access_token', token)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Buscar atividades detalhadas
    const { data: activities } = await supabase
      .from('minicurso_activities')
      .select('*')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: false });

    // Calcular estatísticas
    const stats = {
      progress: lead.course_progress || 0,
      lastPageViewed: lead.last_page_viewed,
      totalTimeSpent: activities?.reduce((acc: number, act: any) => 
        acc + (act.duration_seconds || 0), 0) || 0,
      pagesViewed: new Set(activities?.filter((a: any) => 
        a.activity_type === 'page_view').map((a: any) => a.page_id)).size,
      audioPlays: activities?.filter((a: any) => 
        a.activity_type === 'audio_play').length || 0,
      lastActivity: activities?.[0]?.created_at
    };

    return NextResponse.json({ 
      success: true,
      stats,
      activities: activities?.slice(0, 10) // Últimas 10 atividades
    });
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}
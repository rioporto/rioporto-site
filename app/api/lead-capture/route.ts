import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CreateLeadDTO } from '@/types/lead-capture';
import { headers } from 'next/headers';
import { z } from 'zod';

// Schema de validação
const createLeadSchema = z.object({
  full_name: z.string().min(3, 'Nome muito curto').max(255),
  email: z.string().email('Email inválido'),
  whatsapp: z.string().regex(/^\d{10,11}$/, 'WhatsApp inválido'),
  experience_level: z.enum(['iniciante', 'intermediario', 'avancado']).optional(),
  interest: z.enum(['comprar', 'vender', 'ambos']).optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Limpar WhatsApp (remover formatação)
    body.whatsapp = body.whatsapp?.replace(/\D/g, '');
    
    // Validar dados
    const validationResult = createLeadSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const supabase = await createClient();
    
    // Obter informações da requisição
    const headersList = await headers();
    const ip_address = headersList.get('x-forwarded-for')?.split(',')[0] || 
                      headersList.get('x-real-ip') || 
                      'unknown';
    const user_agent = headersList.get('user-agent') || 'unknown';
    const referrer = headersList.get('referer') || undefined;

    // Verificar se o email já existe
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id, lead_score')
      .eq('email', data.email)
      .single();

    if (existingLead) {
      // Atualizar lead existente
      const { error: updateError } = await supabase
        .from('leads')
        .update({
          full_name: data.full_name,
          whatsapp: data.whatsapp,
          experience_level: data.experience_level,
          interest: data.interest,
          lead_score: existingLead.lead_score + 10, // Aumentar score
          last_interaction_at: new Date().toISOString(),
          ebook_downloaded: true,
          ebook_downloaded_at: new Date().toISOString(),
        })
        .eq('id', existingLead.id);

      if (updateError) {
        console.error('Erro ao atualizar lead:', updateError);
        return NextResponse.json(
          { error: 'Erro ao processar solicitação' },
          { status: 500 }
        );
      }

      // Registrar evento
      await supabase.from('lead_events').insert({
        lead_id: existingLead.id,
        event_type: 'ebook_redownloaded',
        event_data: { source: 'lead_capture_modal' },
        ip_address,
        user_agent,
      });

      return NextResponse.json({
        success: true,
        message: 'E-book enviado para seu email!',
        lead_id: existingLead.id,
        is_new: false,
      });
    }

    // Criar novo lead
    const leadData = {
      ...data,
      lead_source: 'ebook',
      referrer_url: referrer,
      landing_page: referrer?.split('?')[0], // URL sem query params
      ip_address,
      ebook_downloaded: true,
      ebook_downloaded_at: new Date().toISOString(),
    };

    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single();

    if (insertError) {
      console.error('Erro ao criar lead:', insertError);
      
      // Se for erro de email duplicado
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Este email já está cadastrado' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Erro ao processar solicitação' },
        { status: 500 }
      );
    }

    // Registrar evento de download
    await supabase.from('lead_events').insert({
      lead_id: newLead.id,
      event_type: 'ebook_downloaded',
      event_data: { source: 'lead_capture_modal' },
      ip_address,
      user_agent,
    });

    // TODO: Enviar email com o e-book
    // await sendEbookEmail(newLead);

    // TODO: Adicionar à fila do WhatsApp
    // await addToWhatsAppQueue(newLead);

    return NextResponse.json({
      success: true,
      message: 'E-book enviado! Verifique seu email.',
      lead_id: newLead.id,
      is_new: true,
    });
  } catch (error) {
    console.error('Erro ao processar lead:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}

// GET - Obter estatísticas (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verificar se é admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !['johnnyhelder@gmail.com', 'admin@rioporto.com'].includes(user.email || '')) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar estatísticas
    const { data: stats } = await supabase
      .from('lead_stats')
      .select('*')
      .single();

    return NextResponse.json(stats || {
      total_leads: 0,
      days_active: 0,
      verified_emails: 0,
      with_whatsapp: 0,
      downloads: 0,
      avg_lead_score: 0,
      leads_today: 0,
      leads_week: 0,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
}
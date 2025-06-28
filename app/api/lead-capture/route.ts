// app/api/lead-capture/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import crypto from 'crypto';

// Schema de validação adaptado para o minicurso
const createLeadSchema = z.object({
  name: z.string().min(3, 'Nome muito curto').max(255),
  email: z.string().email('Email inválido'),
  whatsapp: z.string().optional(),
  lead_source: z.string().optional(),
  source: z.string().optional() // Para compatibilidade com o formulário
});

// Função para gerar token único
function generateAccessToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: NextRequest) {
  console.log('=== INÍCIO DO PROCESSAMENTO DE LEAD ===');
  
  try {
    const body = await request.json();
    console.log('Body recebido:', JSON.stringify(body, null, 2));
    
    // Limpar WhatsApp (remover formatação) se fornecido
    if (body.whatsapp) {
      body.whatsapp = body.whatsapp.replace(/\D/g, '');
    }
    
    // Validar dados
    const validationResult = createLeadSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Erro de validação:', validationResult.error.errors);
      return NextResponse.json(
        { error: 'Dados inválidos', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    console.log('Dados validados:', data);
    
    const supabase = createClient();
    
    // Obter informações da requisição
    const headersList = headers();
    const ip_address = headersList.get('x-forwarded-for')?.split(',')[0] || 
                      headersList.get('x-real-ip') || 
                      'unknown';
    const user_agent = headersList.get('user-agent') || 'unknown';

    // Verificar se o email já existe
    console.log('Verificando se email já existe:', data.email);
    const { data: existingLead, error: searchError } = await supabase
      .from('leads')
      .select('id, access_token, token_expires_at, minicurso_access_count, whatsapp')
      .eq('email', data.email)
      .single();

    if (searchError && searchError.code !== 'PGRST116') {
      console.error('Erro ao buscar lead:', searchError);
    }

    let leadId: string;
    let accessToken: string;

    if (existingLead) {
      console.log('Lead existente encontrado:', existingLead.id);
      // Lead já existe
      leadId = existingLead.id;
      
      // Verificar se o token ainda é válido
      const tokenExpired = existingLead.token_expires_at && 
        new Date(existingLead.token_expires_at) < new Date();
      
      if (!existingLead.access_token || tokenExpired) {
        console.log('Gerando novo token (expirado ou inexistente)');
        // Gerar novo token
        accessToken = generateAccessToken();
        const tokenExpiresAt = new Date();
        tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 30); // 30 dias

        const { error: updateError } = await supabase
          .from('leads')
          .update({
            name: data.name,
            whatsapp: data.whatsapp || existingLead.whatsapp,
            access_token: accessToken,
            token_expires_at: tokenExpiresAt.toISOString(),
            minicurso_access_count: (existingLead.minicurso_access_count || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingLead.id);

        if (updateError) {
          console.error('Erro ao atualizar lead:', updateError);
          return NextResponse.json(
            { error: 'Erro ao processar solicitação', details: updateError },
            { status: 500 }
          );
        }
      } else {
        console.log('Usando token existente');
        // Usar token existente
        accessToken = existingLead.access_token;
        
        // Apenas atualizar contador de acesso
        await supabase
          .from('leads')
          .update({
            minicurso_access_count: (existingLead.minicurso_access_count || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingLead.id);
      }

      // Registrar evento
      console.log('Registrando evento de re-acesso');
      await supabase.from('lead_events').insert({
        lead_id: existingLead.id,
        event_type: 'minicurso_reaccess',
        event_data: { 
          source: data.source || data.lead_source || 'curso-p2p-landing',
          ip_address,
          user_agent
        },
        ip_address,
        user_agent,
      });

    } else {
      console.log('Criando novo lead');
      // Criar novo lead
      accessToken = generateAccessToken();
      const tokenExpiresAt = new Date();
      tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 30); // 30 dias

      const leadData = {
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp || null,
        lead_source: data.source || data.lead_source || 'curso-p2p-landing',
        access_token: accessToken,
        token_expires_at: tokenExpiresAt.toISOString(),
        minicurso_access_count: 1,
        course_progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Dados do novo lead:', JSON.stringify(leadData, null, 2));

      const { data: newLead, error: insertError } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao criar lead:', JSON.stringify(insertError, null, 2));
        
        // Se for erro de email duplicado
        if (insertError.code === '23505') {
          return NextResponse.json(
            { error: 'Este email já está cadastrado' },
            { status: 400 }
          );
        }
        
        return NextResponse.json(
          { error: 'Erro ao processar solicitação', details: insertError },
          { status: 500 }
        );
      }

      if (!newLead) {
        console.error('Lead criado mas não retornado');
        return NextResponse.json(
          { error: 'Erro ao processar solicitação' },
          { status: 500 }
        );
      }

      console.log('Novo lead criado com sucesso:', newLead.id);
      leadId = newLead.id;

      // Registrar evento de primeiro acesso
      console.log('Registrando evento de primeiro acesso');
      await supabase.from('lead_events').insert({
        lead_id: newLead.id,
        event_type: 'minicurso_first_access',
        event_data: { 
          source: data.lead_source || 'curso-p2p-landing',
          ip_address,
          user_agent
        },
        ip_address,
        user_agent,
      });
    }

    // Enviar email com link de acesso
    console.log('Tentando enviar email...');
    try {
      const emailUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/lead-capture/send-email`;
      console.log('URL do email:', emailUrl);
      
      const response = await fetch(emailUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          email: data.email,
          name: data.name,
          accessToken
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro ao enviar email:', response.status, errorText);
      } else {
        console.log('Email enviado com sucesso');
      }
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      // Não falhar a requisição se o email falhar
    }

    console.log('=== PROCESSAMENTO CONCLUÍDO COM SUCESSO ===');
    
    // Se for do minicurso grátis, incluir o token na resposta
    const isMinicursoGratis = data.source === 'minicurso-gratis';
    
    return NextResponse.json({
      success: true,
      message: 'Acesso liberado com sucesso!',
      ...(isMinicursoGratis && { token: accessToken }), // Incluir token apenas para minicurso-gratis
      accessToken,
      leadId,
    });

  } catch (error) {
    console.error('=== ERRO GERAL NO PROCESSAMENTO ===');
    console.error('Erro:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { 
        error: 'Erro ao processar solicitação',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// GET - Verificar token de acesso
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data: lead, error } = await supabase
      .from('leads')
      .select('id, name, email, token_expires_at, course_progress')
      .eq('access_token', token)
      .single();

    if (error || !lead) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Verificar se o token expirou
    if (lead.token_expires_at && new Date(lead.token_expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Token expirado' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      lead: {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        progress: lead.course_progress || 0
      }
    });

  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar token' },
      { status: 500 }
    );
  }
}

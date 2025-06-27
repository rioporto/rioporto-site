import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail, emailTemplates } from '@/lib/email';
import crypto from 'crypto';

// POST - Criar novo lead do minicurso
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, whatsapp } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Verificar se o email já existe
    const { data: existingLead } = await supabase
      .from('leads')
      .select('*')
      .eq('email', email)
      .single();

    let lead;
    let token;

    if (existingLead) {
      // Se já existe, gerar novo token
      token = crypto.randomBytes(32).toString('hex');
      const tokenExpiresAt = new Date();
      tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 30); // 30 dias

      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        .update({
          access_token: token,
          token_expires_at: tokenExpiresAt.toISOString(),
          minicurso_access_count: (existingLead.minicurso_access_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingLead.id)
        .select()
        .single();

      if (updateError) throw updateError;
      lead = updatedLead;
    } else {
      // Criar novo lead
      token = crypto.randomBytes(32).toString('hex');
      const tokenExpiresAt = new Date();
      tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 30); // 30 dias

      const { data: newLead, error: insertError } = await supabase
        .from('leads')
        .insert({
          name,
          email,
          whatsapp: whatsapp?.replace(/\D/g, ''),
          lead_source: 'minicurso',
          access_token: token,
          token_expires_at: tokenExpiresAt.toISOString(),
          minicurso_access_count: 1
        })
        .select()
        .single();

      if (insertError) throw insertError;
      lead = newLead;
    }

    // Construir link de acesso
    const accessLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://rioporto.com'}/minicurso?token=${token}`;

    // Enviar email
    const emailTemplate = emailTemplates.welcomeMiniCourse(name, accessLink);
    const emailResult = await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    });

    if (!emailResult.success) {
      console.error('Erro ao enviar email:', emailResult.error);
      // Não retornar erro para o usuário, pois o lead foi criado com sucesso
    }

    // Registrar evento
    await supabase.from('lead_events').insert({
      lead_id: lead.id,
      event_type: 'minicurso_access_granted',
      event_data: { email_sent: emailResult.success }
    });

    return NextResponse.json({
      success: true,
      message: 'Acesso enviado para seu email!',
      accessLink // Em dev, retornar o link direto também
    });
  } catch (error) {
    console.error('Erro ao processar solicitação:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}

// GET - Verificar acesso ao minicurso
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

    // Buscar lead pelo token
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('access_token', token)
      .gte('token_expires_at', new Date().toISOString())
      .single();

    if (error || !lead) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }

    // Registrar acesso
    await supabase.from('lead_events').insert({
      lead_id: lead.id,
      event_type: 'minicurso_accessed'
    });

    return NextResponse.json({
      success: true,
      lead: {
        id: lead.id,
        name: lead.name,
        email: lead.email
      }
    });
  } catch (error) {
    console.error('Erro ao verificar acesso:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar acesso' },
      { status: 500 }
    );
  }
}
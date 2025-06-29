import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    // Verificar se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || user.email !== email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar ou criar lead para o usuário logado
    const { data: existingLead } = await supabase
      .from('leads')
      .select('*')
      .eq('email', email)
      .single();

    let token;

    if (existingLead && existingLead.access_token) {
      token = existingLead.access_token;
    } else {
      // Gerar novo token
      token = crypto.randomBytes(32).toString('hex');
      const tokenExpiresAt = new Date();
      tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 30); // 30 dias

      if (existingLead) {
        // Atualizar lead existente
        await supabase
          .from('leads')
          .update({
            access_token: token,
            token_expires_at: tokenExpiresAt.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingLead.id);
      } else {
        // Criar novo lead
        await supabase
          .from('leads')
          .insert({
            name: user.user_metadata?.name || 'Usuário',
            email: email,
            lead_source: 'curso-gratis-logado',
            access_token: token,
            token_expires_at: tokenExpiresAt.toISOString(),
            minicurso_access_count: 1
          });
      }
    }

    // Gerar URL de download
    const downloadUrl = `/api/minicurso/download?token=${token}`;

    return NextResponse.json({
      success: true,
      downloadUrl
    });
  } catch (error) {
    console.error('Erro ao gerar link de download:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar link' },
      { status: 500 }
    );
  }
}
// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Formatar número de telefone para formato internacional
function formatPhoneNumber(phone: string): string {
  const numbers = phone.replace(/\D/g, '');
  if (!numbers.startsWith('55')) {
    return `+55${numbers}`;
  }
  return `+${numbers}`;
}

export async function POST(req: NextRequest) {
  try {
    const { phone, code, userId } = await req.json();
    
    if (!phone || !code) {
      return NextResponse.json(
        { error: 'Telefone e código são obrigatórios' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const formattedPhone = formatPhoneNumber(phone);
    
    // Buscar OTP válido
    const { data: otp, error: otpError } = await supabase
      .from('phone_verifications')
      .select('*')
      .eq('phone', formattedPhone)
      .eq('code', code.trim())
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (otpError || !otp) {
      // Incrementar tentativas para o telefone
      await supabase.rpc('increment_otp_attempts', { 
        phone_param: formattedPhone 
      });
      
      return NextResponse.json(
        { error: 'Código inválido ou expirado' },
        { status: 400 }
      );
    }
    
    // Verificar número máximo de tentativas
    if (otp.attempts >= 5) {
      return NextResponse.json(
        { error: 'Número máximo de tentativas excedido. Solicite um novo código.' },
        { status: 429 }
      );
    }
    
    // Marcar OTP como verificado
    const { error: updateOtpError } = await supabase
      .from('phone_verifications')
      .update({ 
        verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('id', otp.id);
    
    if (updateOtpError) {
      console.error('Erro ao atualizar OTP:', updateOtpError);
      return NextResponse.json(
        { error: 'Erro ao processar verificação' },
        { status: 500 }
      );
    }
    
    // Se tem userId, atualizar o perfil do usuário
    if (userId || otp.user_id) {
      const targetUserId = userId || otp.user_id;
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          phone: formattedPhone,
          phone_verified: true,
          phone_verified_at: new Date().toISOString()
        })
        .eq('id', targetUserId);
      
      if (profileError) {
        console.error('Erro ao atualizar perfil:', profileError);
        // Não retornar erro, pois a verificação foi bem sucedida
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Telefone verificado com sucesso',
      phone: formattedPhone
    });
    
  } catch (error) {
    console.error('Erro na API verify-otp:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função RPC para incrementar tentativas (adicionar na migração SQL)
/*
CREATE OR REPLACE FUNCTION increment_otp_attempts(phone_param TEXT)
RETURNS void AS $$
BEGIN
  UPDATE phone_verifications
  SET attempts = attempts + 1
  WHERE phone = phone_param
    AND verified = false
    AND expires_at > NOW()
  ORDER BY created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
*/
// app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Função para gerar código OTP de 6 dígitos
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { phone, userId } = await req.json();
    
    if (!phone) {
      return NextResponse.json(
        { error: 'Telefone é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    // Por enquanto, vamos apenas salvar o telefone sem verificar
    // Em desenvolvimento, mostrar o código
    // Em produção, você pode implementar SMS quando estiver pronto
    
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expira em 10 minutos
    
    // Salvar OTP no banco
    const { error: insertError } = await supabase
      .from('phone_verifications')
      .insert({
        phone: phone,
        code: otp,
        user_id: userId || null,
        expires_at: expiresAt.toISOString(),
      });
    
    if (insertError) {
      console.error('Erro ao salvar OTP:', insertError);
      return NextResponse.json(
        { error: 'Erro ao processar solicitação' },
        { status: 500 }
      );
    }
    
    // POR ENQUANTO: Enviar código por EMAIL ao invés de SMS
    if (userId) {
      const { data: user } = await supabase.auth.admin.getUserById(userId);
      
      if (user?.user?.email) {
        try {
          await resend.emails.send({
            from: 'Rio Porto P2P <noreply@rioporto.com>',
            to: user.user.email,
            subject: 'Código de verificação do WhatsApp',
            html: `
              <h2>Código de verificação</h2>
              <p>Seu código de verificação do WhatsApp é:</p>
              <h1 style="font-size: 32px; letter-spacing: 8px;">${otp}</h1>
              <p>Este código expira em 10 minutos.</p>
              <p><small>Se você não solicitou este código, ignore este email.</small></p>
            `
          });
        } catch (emailError) {
          console.error('Erro ao enviar email:', emailError);
        }
      }
    }
    
    // Em desenvolvimento, sempre retornar o código
    return NextResponse.json({
      success: true,
      message: 'Código enviado com sucesso',
      ...(process.env.NODE_ENV === 'development' && { otp }),
    });
    
  } catch (error) {
    console.error('Erro na API send-otp:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
// app/api/auth/send-verification/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Função para gerar código de 6 dígitos
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Formatar número para WhatsApp
function formatPhoneNumber(phone: string): string {
  const numbers = phone.replace(/\D/g, '');
  if (!numbers.startsWith('55')) {
    return `55${numbers}`;
  }
  return numbers;
}

export async function POST(req: NextRequest) {
  try {
    const { phone, userId, email } = await req.json();
    
    if (!phone) {
      return NextResponse.json(
        { error: 'WhatsApp é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const formattedPhone = formatPhoneNumber(phone);
    
    // Verificar se já existe código válido
    const { data: existingCode } = await supabase
      .from('phone_verifications')
      .select('*')
      .eq('phone', formattedPhone)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    // Se existe código recente, não criar novo
    if (existingCode && new Date(existingCode.created_at) > new Date(Date.now() - 60000)) {
      return NextResponse.json({
        success: true,
        message: 'Código já enviado. Verifique seu email.',
        method: 'email'
      });
    }
    
    // Gerar novo código
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
    
    // Salvar código no banco
    const { error: insertError } = await supabase
      .from('phone_verifications')
      .insert({
        phone: formattedPhone,
        code: code,
        user_id: userId || null,
        expires_at: expiresAt.toISOString(),
      });
    
    if (insertError) {
      console.error('Erro ao salvar código:', insertError);
      return NextResponse.json(
        { error: 'Erro ao processar solicitação' },
        { status: 500 }
      );
    }
    
    // FUTURO: Quando WhatsApp Business API estiver disponível
    // Descomentar este bloco:
    /*
    if (process.env.WHATSAPP_API_TOKEN) {
      try {
        await sendWhatsAppMessage(formattedPhone, code);
        return NextResponse.json({
          success: true,
          message: 'Código enviado para seu WhatsApp',
          method: 'whatsapp'
        });
      } catch (error) {
        console.error('Erro ao enviar WhatsApp:', error);
      }
    }
    */
    
    // POR ENQUANTO: Enviar por email
    if (email) {
      try {
        await resend.emails.send({
          from: 'Rio Porto P2P <noreply@rioporto.com>',
          to: email,
          subject: 'Código de verificação do WhatsApp',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #004aad; color: white; padding: 20px; text-align: center; }
                .code-box { 
                  background: #f4f4f4; 
                  border: 2px dashed #004aad; 
                  padding: 20px; 
                  margin: 20px 0; 
                  text-align: center;
                  border-radius: 8px;
                }
                .code { 
                  font-size: 32px; 
                  font-weight: bold; 
                  letter-spacing: 8px; 
                  color: #004aad;
                }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Verificação de WhatsApp</h1>
                </div>
                
                <p>Olá!</p>
                
                <p>Você solicitou a verificação do seu número de WhatsApp na Rio Porto P2P.</p>
                
                <div class="code-box">
                  <p>Seu código de verificação é:</p>
                  <div class="code">${code}</div>
                  <p><small>Válido por 30 minutos</small></p>
                </div>
                
                <p><strong>WhatsApp informado:</strong> ${phone}</p>
                
                <p>Digite este código na página de verificação para confirmar seu número.</p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                
                <p><strong>🔒 Segurança:</strong></p>
                <ul>
                  <li>Nunca compartilhe este código com ninguém</li>
                  <li>Nossa equipe nunca pedirá este código por telefone</li>
                  <li>Se você não solicitou, ignore este email</li>
                </ul>
                
                <div class="footer">
                  <p>© 2025 Rio Porto P2P - Negociação segura de Bitcoin</p>
                </div>
              </div>
            </body>
            </html>
          `
        });
        
        console.log(`Código ${code} enviado por email para verificar WhatsApp ${formattedPhone}`);
        
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        return NextResponse.json(
          { error: 'Erro ao enviar código por email' },
          { status: 500 }
        );
      }
    }
    
    // Em desenvolvimento, retornar o código
    return NextResponse.json({
      success: true,
      message: 'Código enviado para seu email',
      method: 'email',
      ...(process.env.NODE_ENV === 'development' && { code }),
    });
    
  } catch (error) {
    console.error('Erro na API send-verification:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// FUTURO: Função para enviar via WhatsApp Business API
/*
async function sendWhatsAppMessage(phone: string, code: string) {
  const response = await fetch(`https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: 'verification_code', // Precisa criar este template
        language: { code: 'pt_BR' },
        components: [{
          type: 'body',
          parameters: [{
            type: 'text',
            text: code
          }]
        }]
      }
    })
  });
  
  if (!response.ok) {
    throw new Error('Falha ao enviar WhatsApp');
  }
}
*/
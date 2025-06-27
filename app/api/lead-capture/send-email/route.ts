import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Template de email HTML
function getEmailTemplate(name: string, accessLink: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seu Acesso ao Manual P2P</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 0;
        }
        .header {
            background: linear-gradient(135deg, #004aad 0%, #002d6b 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 40px 30px;
        }
        .button {
            display: inline-block;
            background-color: #004aad;
            color: white !important;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .button:hover {
            background-color: #002d6b;
        }
        .footer {
            background-color: #f8f8f8;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
        }
        .highlight {
            background-color: #fff3cd;
            padding: 15px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
        }
        .benefits {
            background-color: #f0f8ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .benefits li {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Manual P2P: Negocie Bitcoin como um Profissional</h1>
        </div>
        
        <div class="content">
            <p>Olá <strong>${name}</strong>!</p>
            
            <p>Parabéns! Seu acesso ao <strong>Manual P2P</strong> foi liberado com sucesso.</p>
            
            <p>Você está prestes a descobrir os segredos do mercado P2P de Bitcoin e aprender a negociar com segurança e privacidade total.</p>
            
            <div class="highlight">
                <strong>🎙️ NOVIDADE:</strong> Cada página do manual conta com narração em áudio para facilitar seu aprendizado!
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${accessLink}" class="button">
                    Acessar Manual P2P Agora
                </a>
            </div>
            
            <div class="benefits">
                <h3>O que você vai aprender:</h3>
                <ul>
                    <li>✅ Como funciona o P2P na prática</li>
                    <li>✅ Vantagens sobre as corretoras tradicionais</li>
                    <li>✅ Segurança e autocustódia de Bitcoin</li>
                    <li>✅ Como evitar golpes e fraudes</li>
                    <li>✅ Aspectos legais e fiscais no Brasil</li>
                    <li>✅ A vantagem Rio Porto P2P</li>
                </ul>
            </div>
            
            <p><strong>Importante:</strong> Este link é válido por 30 dias. Salve este email para acessar quando quiser.</p>
            
            <p>Se tiver qualquer dúvida, estamos aqui para ajudar!</p>
            
            <p>
                Abraços,<br>
                <strong>Equipe Rio Porto P2P</strong>
            </p>
        </div>
        
        <div class="footer">
            <p>© 2025 Rio Porto P2P. Todos os direitos reservados.</p>
            <p>
                <a href="https://rioporto.com" style="color: #004aad;">rioporto.com</a> | 
                <a href="mailto:contato@rioporto.com" style="color: #004aad;">contato@rioporto.com</a>
            </p>
            <p style="font-size: 12px; margin-top: 20px;">
                Você recebeu este email porque se cadastrou para receber o Manual P2P.<br>
                Não compartilhamos seus dados com terceiros.
            </p>
        </div>
    </div>
</body>
</html>
  `;
}

// Template de email em texto puro
function getEmailTextTemplate(name: string, accessLink: string): string {
  return `
Olá ${name}!

Parabéns! Seu acesso ao Manual P2P foi liberado com sucesso.

Você está prestes a descobrir os segredos do mercado P2P de Bitcoin e aprender a negociar com segurança e privacidade total.

🎙️ NOVIDADE: Cada página do manual conta com narração em áudio para facilitar seu aprendizado!

Acesse agora: ${accessLink}

O que você vai aprender:
- Como funciona o P2P na prática
- Vantagens sobre as corretoras tradicionais
- Segurança e autocustódia de Bitcoin
- Como evitar golpes e fraudes
- Aspectos legais e fiscais no Brasil
- A vantagem Rio Porto P2P

Importante: Este link é válido por 30 dias. Salve este email para acessar quando quiser.

Se tiver qualquer dúvida, estamos aqui para ajudar!

Abraços,
Equipe Rio Porto P2P

© 2025 Rio Porto P2P. Todos os direitos reservados.
rioporto.com | contato@rioporto.com
  `;
}

export async function POST(request: NextRequest) {
  try {
    const { leadId } = await request.json();
    
    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID não fornecido' }, { status: 400 });
    }

    const supabase = createClient();

    // Buscar informações do lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 });
    }

    // Gerar link de acesso
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rioporto.com';
    const accessLink = `${baseUrl}/minicurso?token=${lead.access_token}`;

    // Aqui você deve integrar com seu serviço de email preferido
    // Opções: SendGrid, Resend, AWS SES, etc.
    
    // Exemplo com Resend (recomendado):
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const { data, error } = await resend.emails.send({
      from: 'Rio Porto P2P <noreply@rioporto.com>',
      to: [lead.email],
      subject: '🎯 Seu acesso ao Manual P2P foi liberado!',
      html: getEmailTemplate(lead.full_name, accessLink),
      text: getEmailTextTemplate(lead.full_name, accessLink),
    });
    */

    // Por enquanto, vamos simular o envio
    console.log('Email seria enviado para:', lead.email);
    console.log('Link de acesso:', accessLink);

    // Atualizar lead com data de envio do email
    await supabase
      .from('leads')
      .update({ 
        email_sent_at: new Date().toISOString(),
        email_sent: true 
      })
      .eq('id', leadId);

    return NextResponse.json({ 
      success: true, 
      message: 'Email enviado com sucesso',
      accessLink // Remover em produção
    });

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return NextResponse.json({ 
      error: 'Erro ao processar solicitação' 
    }, { status: 500 });
  }
}
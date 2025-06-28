// app/api/lead-capture/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

// Template de email HTML
function getEmailTemplate(name: string, accessLink: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seu Acesso ao Manual P2P</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 0;
        }
        .header {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
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
            background-color: #f97316;
            color: white !important;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 18px;
            margin: 20px 0;
            text-align: center;
            transition: all 0.3s ease;
        }
        .button:hover {
            background-color: #ea580c;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }
        .footer {
            background-color: #f8f8f8;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
        }
        .highlight {
            background-color: #fff7ed;
            padding: 20px;
            border-left: 4px solid #f97316;
            margin: 20px 0;
            border-radius: 4px;
        }
        .benefits {
            background-color: #f0f9ff;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            border: 1px solid #e0f2fe;
        }
        .benefits li {
            margin-bottom: 12px;
            color: #1e40af;
        }
        .timer {
            background-color: #fef3c7;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
            border: 1px solid #fcd34d;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
            }
            .content {
                padding: 20px !important;
            }
            .header {
                padding: 30px 20px !important;
            }
            .header h1 {
                font-size: 24px !important;
            }
            .button {
                display: block !important;
                width: 100% !important;
            }
        }
    </style>
</head>
<body>
    <div style="display:none;max-height:0;overflow:hidden;">
        🎯 Seu acesso ao Manual P2P está liberado! Aprenda a negociar Bitcoin com segurança total.
    </div>
    
    <div class="container">
        <div class="header">
            <h1>🚀 Manual P2P: Negocie Bitcoin como um Profissional</h1>
        </div>
        
        <div class="content">
            <p style="font-size: 18px;">Olá <strong>${name}</strong>!</p>
            
            <p style="font-size: 16px;">Parabéns! Você acaba de dar o primeiro passo para dominar a arte da negociação P2P de Bitcoin.</p>
            
            <p>Seu acesso ao <strong>Manual P2P</strong> foi liberado com sucesso e está pronto para você começar agora mesmo.</p>
            
            <div class="highlight">
                <strong>🎥 NOVIDADE EXCLUSIVA:</strong> Cada capítulo do manual conta com uma vídeo aula para facilitar seu aprendizado! Você pode ler e assistir, absorvendo o conhecimento de forma completa.
            </div>
            
            <div style="text-align: center; margin: 35px 0;">
                <a href="${accessLink}" class="button" style="color: white;">
                    Acessar Meu Manual P2P Agora →
                </a>
            </div>
            
            <div class="benefits">
                <h3 style="color: #1e40af; margin-top: 0;">O que você vai descobrir:</h3>
                <ul style="padding-left: 20px;">
                    <li><strong>Capítulo 1:</strong> Como funciona o P2P na prática (e por que é revolucionário)</li>
                    <li><strong>Capítulo 2:</strong> Vantagens que as corretoras não querem que você saiba</li>
                    <li><strong>Capítulo 3:</strong> Segurança total - Proteja-se de golpes e fraudes</li>
                    <li><strong>Capítulo 4:</strong> Como precificar e negociar como profissional</li>
                    <li><strong>Capítulo 5:</strong> Aspectos legais e fiscais no Brasil (atualizado 2025)</li>
                    <li><strong>Capítulo 6:</strong> A vantagem exclusiva Rio Porto P2P</li>
                </ul>
            </div>
            
            <div class="timer">
                <p style="margin: 0; font-size: 16px;"><strong>⏰ Acesso válido por 30 dias</strong></p>
                <p style="margin: 5px 0 0 0; font-size: 14px;">Salve este email para acessar quando quiser</p>
            </div>
            
            <p style="font-size: 16px; margin-top: 30px;">
                <strong>Dica de ouro:</strong> Reserve 45 minutos do seu tempo e complete o manual de uma vez. 
                O conhecimento que você vai adquirir pode economizar milhares de reais em taxas desnecessárias.
            </p>
            
            <p>Qualquer dúvida, responda este email que teremos prazer em ajudar!</p>
            
            <p style="margin-top: 30px;">
                Um forte abraço,<br>
                <strong>Johnny Helder</strong><br>
                <em>Fundador - Rio Porto P2P</em>
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
                <a href="${accessLink}" class="button" style="color: white;">
                    Começar Agora →
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Rio Porto P2P</strong> - Negociação P2P com Segurança e Privacidade</p>
            <p>
                <a href="https://rioporto.com" style="color: #f97316; text-decoration: none;">rioporto.com</a> | 
                <a href="mailto:contato@rioporto.com" style="color: #f97316; text-decoration: none;">contato@rioporto.com</a>
            </p>
            <p style="font-size: 12px; margin-top: 20px; color: #999;">
                Você recebeu este email porque se cadastrou para receber o Manual P2P em nosso site.<br>
                Respeitamos sua privacidade e não compartilhamos seus dados com terceiros.
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

Parabéns! Você acaba de dar o primeiro passo para dominar a arte da negociação P2P de Bitcoin.

Seu acesso ao Manual P2P foi liberado com sucesso e está pronto para você começar agora mesmo.

🎥 NOVIDADE EXCLUSIVA: Cada capítulo do manual conta com uma vídeo aula para facilitar seu aprendizado! 
Você pode ler e assistir, absorvendo o conhecimento de forma completa.

➡️ Acesse agora: ${accessLink}

O que você vai descobrir:

Capítulo 1: Como funciona o P2P na prática (e por que é revolucionário)
Capítulo 2: Vantagens que as corretoras não querem que você saiba
Capítulo 3: Segurança total - Proteja-se de golpes e fraudes
Capítulo 4: Como precificar e negociar como profissional
Capítulo 5: Aspectos legais e fiscais no Brasil (atualizado 2025)
Capítulo 6: A vantagem exclusiva Rio Porto P2P

⏰ IMPORTANTE: Este link é válido por 30 dias. Salve este email para acessar quando quiser.

Dica de ouro: Reserve 45 minutos do seu tempo e complete o manual de uma vez. 
O conhecimento que você vai adquirir pode economizar milhares de reais em taxas desnecessárias.

Qualquer dúvida, responda este email que teremos prazer em ajudar!

Um forte abraço,
Johnny Helder
Fundador - Rio Porto P2P

--
Rio Porto P2P - Negociação P2P com Segurança e Privacidade
rioporto.com | contato@rioporto.com

Você recebeu este email porque se cadastrou para receber o Manual P2P em nosso site.
Respeitamos sua privacidade e não compartilhamos seus dados com terceiros.
  `;
}

export async function POST(request: NextRequest) {
  try {
    const { leadId, email, name, accessToken } = await request.json();
    
    // Se não tiver leadId, mas tiver os outros dados, é envio direto
    const leadEmail = email || null;
    const leadName = name || 'Aluno';
    
    if (!leadId && !email) {
      return NextResponse.json({ error: 'Dados insuficientes' }, { status: 400 });
    }

    const supabase = createClient();
    let lead = null;

    // Se tiver leadId, buscar no banco
    if (leadId) {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 });
      }
      
      lead = data;
    }

    // Determinar dados para o email
    const finalEmail = leadEmail || lead?.email;
    const finalName = leadName || lead?.name || lead?.full_name || 'Aluno';
    const finalToken = accessToken || lead?.access_token;

    if (!finalEmail || !finalToken) {
      return NextResponse.json({ error: 'Dados incompletos para envio' }, { status: 400 });
    }

    // Gerar link de acesso
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rioporto.com';
    const accessLink = `${baseUrl}/minicurso?token=${finalToken}`;

    // ===== CONFIGURAÇÃO DO SERVIÇO DE EMAIL =====
    // Descomente o bloco do serviço que você escolher:

    // Enviar email com Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Manual P2P <noreply@rioporto.com>',
      to: [finalEmail],
      subject: '🎯 Seu acesso ao Manual P2P foi liberado!',
      html: getEmailTemplate(finalName, accessLink),
      text: getEmailTextTemplate(finalName, accessLink),
    });

    if (error) {
      console.error('Erro Resend:', error);
      throw new Error('Falha ao enviar email');
    }

    // OPÇÃO 2: SendGrid
    /*
    import sgMail from '@sendgrid/mail';
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    
    const msg = {
      to: finalEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@rioporto.com',
      subject: '🎯 Seu acesso ao Manual P2P foi liberado!',
      text: getEmailTextTemplate(finalName, accessLink),
      html: getEmailTemplate(finalName, accessLink),
    };
    
    await sgMail.send(msg);
    */

    // OPÇÃO 3: Amazon SES
    /*
    import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
    
    const client = new SESClient({ 
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    });
    
    const command = new SendEmailCommand({
      Source: process.env.SES_FROM_EMAIL || "noreply@rioporto.com",
      Destination: { ToAddresses: [finalEmail] },
      Message: {
        Subject: { Data: "🎯 Seu acesso ao Manual P2P foi liberado!" },
        Body: {
          Text: { Data: getEmailTextTemplate(finalName, accessLink) },
          Html: { Data: getEmailTemplate(finalName, accessLink) },
        },
      },
    });
    
    await client.send(command);
    */

    // ===== FIM DA CONFIGURAÇÃO =====

    // Por enquanto, vamos simular o envio
    console.log('===== EMAIL SERIA ENVIADO =====');
    console.log('Para:', finalEmail);
    console.log('Nome:', finalName);
    console.log('Link:', accessLink);
    console.log('===============================');

    // Atualizar lead com data de envio (se tiver leadId)
    if (leadId) {
      await supabase
        .from('leads')
        .update({ 
          email_sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email enviado com sucesso',
      // Remover estas linhas em produção:
      preview: {
        to: finalEmail,
        accessLink,
        note: 'Configure um serviço de email para envio real'
      }
    });

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return NextResponse.json({ 
      error: 'Erro ao processar solicitação',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

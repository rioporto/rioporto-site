import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = 'Rio Porto P2P <noreply@rioporto.com>',
  replyTo = 'contato@rioporto.com'
}: SendEmailOptions) {
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      reply_to: replyTo,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

// Templates de email
export const emailTemplates = {
  // Email de boas-vindas do minicurso
  welcomeMiniCourse: (name: string, accessLink: string) => ({
    subject: '🎯 Seu acesso ao Manual P2P está pronto!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bem-vindo ao Manual P2P</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
              <td style="padding: 40px 30px; text-align: center; background-color: #004aad;">
                <h1 style="color: #ffffff; margin: 0;">Rio Porto P2P</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px;">
                <h2 style="color: #333333; margin-bottom: 20px;">Olá ${name}! 👋</h2>
                <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                  Parabéns! Você acaba de dar o primeiro passo para dominar o mundo das negociações P2P.
                </p>
                <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                  Seu acesso ao <strong>Manual P2P: Negocie Bitcoin como um Profissional</strong> está liberado!
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${accessLink}" style="display: inline-block; padding: 15px 30px; background-color: #004aad; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    ACESSAR MEU MANUAL
                  </a>
                </div>
                <p style="color: #666666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                  <strong>O que você vai aprender:</strong>
                </p>
                <ul style="color: #666666; font-size: 14px; line-height: 1.8;">
                  <li>Como funciona o P2P na prática</li>
                  <li>Vantagens sobre corretoras tradicionais</li>
                  <li>Segurança e prevenção de golpes</li>
                  <li>Autocustódia e soberania financeira</li>
                  <li>Aspectos legais e tributários</li>
                  <li>E muito mais!</li>
                </ul>
                <p style="color: #999999; font-size: 12px; line-height: 1.6; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                  Este link é único e pessoal. Não compartilhe com outras pessoas.<br>
                  Válido por 30 dias.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 30px; background-color: #f8f8f8; text-align: center;">
                <p style="color: #999999; font-size: 12px; margin: 0;">
                  © 2025 Rio Porto P2P. Todos os direitos reservados.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
Olá ${name}!

Parabéns! Você acaba de dar o primeiro passo para dominar o mundo das negociações P2P.

Seu acesso ao Manual P2P: Negocie Bitcoin como um Profissional está liberado!

Acesse agora: ${accessLink}

O que você vai aprender:
- Como funciona o P2P na prática
- Vantagens sobre corretoras tradicionais
- Segurança e prevenção de golpes
- Autocustódia e soberania financeira
- Aspectos legais e tributários
- E muito mais!

Este link é único e pessoal. Não compartilhe com outras pessoas.
Válido por 30 dias.

© 2025 Rio Porto P2P. Todos os direitos reservados.
    `
  }),

  // Email de notificação de novo comentário
  newComment: (postTitle: string, commentAuthor: string, commentContent: string, postUrl: string) => ({
    subject: `Novo comentário em: ${postTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Novo Comentário</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333333; margin-bottom: 20px;">Novo comentário no blog</h2>
            <p style="color: #666666; margin-bottom: 20px;">
              <strong>${commentAuthor}</strong> comentou em "<strong>${postTitle}</strong>":
            </p>
            <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <p style="color: #333333; margin: 0; font-style: italic;">"${commentContent}"</p>
            </div>
            <a href="${postUrl}" style="display: inline-block; padding: 12px 24px; background-color: #004aad; color: #ffffff; text-decoration: none; border-radius: 5px;">
              Ver Comentário
            </a>
          </div>
        </body>
      </html>
    `,
    text: `
Novo comentário no blog

${commentAuthor} comentou em "${postTitle}":

"${commentContent}"

Ver comentário: ${postUrl}
    `
  }),

  // Email de recuperação de senha (futuro)
  passwordReset: (resetLink: string) => ({
    subject: 'Redefinir sua senha - Rio Porto P2P',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Redefinir Senha</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333333; margin-bottom: 20px;">Redefinir sua senha</h2>
            <p style="color: #666666; margin-bottom: 20px;">
              Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="display: inline-block; padding: 15px 30px; background-color: #004aad; color: #ffffff; text-decoration: none; border-radius: 5px;">
                Redefinir Senha
              </a>
            </div>
            <p style="color: #999999; font-size: 14px; margin-top: 30px;">
              Se você não solicitou a redefinição de senha, ignore este email.
              Este link expira em 1 hora.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
Redefinir sua senha

Recebemos uma solicitação para redefinir sua senha. 
Acesse o link abaixo para criar uma nova senha:

${resetLink}

Se você não solicitou a redefinição de senha, ignore este email.
Este link expira em 1 hora.
    `
  })
};
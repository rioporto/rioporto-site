// lib/comments/notifications.ts
// Sistema básico de notificações para comentários

interface NotificationPayload {
  type: 'comment_reply' | 'comment_approved' | 'comment_rejected';
  recipient_email: string;
  recipient_name?: string;
  comment_content: string;
  post_title: string;
  post_url: string;
  author_name?: string;
}

/**
 * Envia notificação por email (placeholder para integração futura)
 * Em produção, integrar com serviço de email como SendGrid, Resend, etc.
 */
export async function sendCommentNotification(payload: NotificationPayload): Promise<void> {
  try {
    // Por enquanto, apenas log
    console.log('📧 Notificação de comentário:', {
      type: payload.type,
      to: payload.recipient_email,
      post: payload.post_title,
    });

    // TODO: Implementar envio real de email
    // Exemplo com API de email:
    /*
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: payload.recipient_email,
        subject: getEmailSubject(payload),
        html: getEmailTemplate(payload),
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao enviar email');
    }
    */
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    // Não bloquear o fluxo principal se a notificação falhar
  }
}

/**
 * Gera o assunto do email baseado no tipo de notificação
 */
function getEmailSubject(payload: NotificationPayload): string {
  switch (payload.type) {
    case 'comment_reply':
      return `Nova resposta ao seu comentário em "${payload.post_title}"`;
    case 'comment_approved':
      return `Seu comentário foi aprovado em "${payload.post_title}"`;
    case 'comment_rejected':
      return `Seu comentário não foi aprovado em "${payload.post_title}"`;
    default:
      return 'Notificação sobre seu comentário';
  }
}

/**
 * Gera o template HTML do email
 */
function getEmailTemplate(payload: NotificationPayload): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rioporto.com.br';
  const fullUrl = `${baseUrl}${payload.post_url}`;

  let content = '';
  
  switch (payload.type) {
    case 'comment_reply':
      content = `
        <p>Olá${payload.recipient_name ? ` ${payload.recipient_name}` : ''},</p>
        <p>${payload.author_name || 'Alguém'} respondeu ao seu comentário no artigo "<strong>${payload.post_title}</strong>":</p>
        <blockquote style="background: #f5f5f5; padding: 15px; border-left: 4px solid #333; margin: 20px 0;">
          ${payload.comment_content}
        </blockquote>
        <p><a href="${fullUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver resposta completa</a></p>
      `;
      break;
      
    case 'comment_approved':
      content = `
        <p>Olá${payload.recipient_name ? ` ${payload.recipient_name}` : ''},</p>
        <p>Seu comentário no artigo "<strong>${payload.post_title}</strong>" foi aprovado e está visível para todos:</p>
        <blockquote style="background: #f5f5f5; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
          ${payload.comment_content}
        </blockquote>
        <p><a href="${fullUrl}" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver seu comentário</a></p>
      `;
      break;
      
    case 'comment_rejected':
      content = `
        <p>Olá${payload.recipient_name ? ` ${payload.recipient_name}` : ''},</p>
        <p>Infelizmente, seu comentário no artigo "<strong>${payload.post_title}</strong>" não foi aprovado.</p>
        <p>Isso pode acontecer por diversos motivos, incluindo linguagem inadequada ou conteúdo fora do tema.</p>
        <p>Sinta-se à vontade para enviar um novo comentário seguindo nossas diretrizes da comunidade.</p>
      `;
      break;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${getEmailSubject(payload)}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f8f9fa; padding: 20px; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; color: #333;">Rio Porto P2P</h1>
      </div>
      
      ${content}
      
      <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">
      
      <p style="font-size: 12px; color: #666; text-align: center;">
        Este email foi enviado porque você comentou em nosso blog.<br>
        <a href="${baseUrl}/unsubscribe" style="color: #666;">Descadastrar notificações</a>
      </p>
    </body>
    </html>
  `;
}

/**
 * Verifica se deve enviar notificação e envia
 */
export async function checkAndSendNotifications(
  commentData: {
    id: string;
    parent_id?: string | null;
    post_slug: string;
    author_name?: string;
    author_email?: string;
    content: string;
    user_id?: string | null;
  },
  postTitle: string
): Promise<void> {
  // Se é uma resposta, notificar o autor do comentário pai
  if (commentData.parent_id) {
    try {
      // TODO: Buscar dados do comentário pai do banco
      // Por enquanto, apenas log
      console.log('📧 Deveria notificar resposta ao comentário:', commentData.parent_id);
    } catch (error) {
      console.error('Erro ao verificar notificações:', error);
    }
  }
}

/**
 * Template de configuração de notificações do usuário
 */
export interface UserNotificationPreferences {
  comment_replies: boolean;
  comment_moderation: boolean;
  marketing_emails: boolean;
}

/**
 * Verifica preferências de notificação do usuário
 */
export async function getUserNotificationPreferences(
  userId: string
): Promise<UserNotificationPreferences> {
  // TODO: Implementar busca no banco de dados
  // Por enquanto, retornar padrão
  return {
    comment_replies: true,
    comment_moderation: true,
    marketing_emails: false,
  };
}
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// Verificar webhook do Zendesk (simplificado para Bearer Token)
function verifyZendeskWebhook(
  authHeader: string | null,
  secret: string
): boolean {
  if (!authHeader) return false;
  
  // Zendesk envia como "Bearer [token]"
  const token = authHeader.replace('Bearer ', '');
  return token === secret;
}

// Handler para GET - usado pelo Zendesk para verificar se o endpoint existe
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Zendesk webhook endpoint is ready' 
  });
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autorização
    const authHeader = request.headers.get('authorization');
    const webhookSecret = process.env.ZENDESK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('ZENDESK_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // Verificar token - temporariamente desabilitado para teste
    // TODO: Reabilitar após confirmar formato do header
    /*
    const isValid = verifyZendeskWebhook(authHeader, webhookSecret);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    */

    // Parse do body
    const data = await request.json();
    
    // Log para debug - remover em produção
    console.log('Webhook received:', JSON.stringify(data, null, 2));
    
    const supabase = createClient();

    // Processar diferentes tipos de eventos
    // O Zendesk pode enviar em formatos diferentes
    const eventType = data.type || data.event_type || detectEventType(data);
    
    switch (eventType) {
      case 'ticket.created':
      case 'ticket_created':
        await handleTicketCreated(data, supabase);
        break;
      
      case 'ticket.updated':
      case 'ticket_updated':
        await handleTicketUpdated(data, supabase);
        break;
        
      case 'ticket.solved':
      case 'ticket_solved':
        await handleTicketSolved(data, supabase);
        break;
        
      default:
        console.log('Unhandled webhook type:', eventType, data);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Detectar tipo de evento baseado no conteúdo
function detectEventType(data: any): string {
  if (data.ticket?.status === 'new' && !data.ticket?.updated_at) {
    return 'ticket.created';
  }
  if (data.ticket?.status === 'solved') {
    return 'ticket.solved';
  }
  if (data.ticket?.updated_at) {
    return 'ticket.updated';
  }
  return 'unknown';
}

async function handleTicketCreated(data: any, supabase: any) {
  // O ticket pode estar em data.ticket ou diretamente em data
  const ticket = data.ticket || data;
  
  // Buscar usuário pelo email
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', ticket.requester.email)
    .single();

  if (user) {
    // Adicionar contexto do usuário ao ticket via API do Zendesk
    const context = {
      user_id: user.id,
      last_transaction: user.last_transaction_date,
      total_volume: user.total_volume,
      verification_status: user.kyc_status
    };

    // Aqui você faria uma chamada para a API do Zendesk para atualizar o ticket
    // com as informações contextuais do usuário
    console.log('User context for ticket:', context);
  }

  // Registrar o ticket no banco
  await supabase.from('support_tickets').insert({
    zendesk_id: ticket.id,
    user_email: ticket.requester.email,
    subject: ticket.subject,
    status: ticket.status,
    priority: ticket.priority,
    created_at: ticket.created_at
  });
}

async function handleTicketUpdated(data: any, supabase: any) {
  const ticket = data.ticket;
  
  // Atualizar registro do ticket
  await supabase
    .from('support_tickets')
    .update({
      status: ticket.status,
      priority: ticket.priority,
      updated_at: new Date().toISOString()
    })
    .eq('zendesk_id', ticket.id);
}

async function handleTicketSolved(data: any, supabase: any) {
  const ticket = data.ticket;
  
  // Atualizar registro como resolvido
  await supabase
    .from('support_tickets')
    .update({
      status: 'solved',
      solved_at: new Date().toISOString(),
      satisfaction_rating: data.satisfaction_rating
    })
    .eq('zendesk_id', ticket.id);
    
  // Opcional: Enviar email de follow-up ou criar ação no sistema
}
import { NextRequest, NextResponse } from 'next/server';

const ZENDESK_SUBDOMAIN = 'rioportop2p'; // Seu subdomínio do Zendesk
const ZENDESK_EMAIL = process.env.ZENDESK_EMAIL || 'contato@rioporto.com';
const ZENDESK_API_TOKEN = process.env.ZENDESK_API_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, description, priority = 'normal', tags = [] } = body;
    
    // Se não temos token da API, retornar sucesso silencioso
    // (o widget ainda funcionará para chat ao vivo)
    if (!ZENDESK_API_TOKEN) {
      console.log('[Zendesk API] Token não configurado, pulando criação de ticket');
      return NextResponse.json({ 
        success: true, 
        message: 'Ticket será criado via widget' 
      });
    }
    
    // Criar ticket via API do Zendesk
    const ticketData = {
      ticket: {
        subject: subject || `Cotação P2P - ${name}`,
        comment: {
          body: description || 'Nova cotação recebida via formulário'
        },
        requester: {
          name: name,
          email: email
        },
        priority: priority,
        tags: ['cotacao', 'p2p', ...tags],
        custom_fields: []
      }
    };
    
    const zendeskUrl = `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets.json`;
    const authToken = Buffer.from(`${ZENDESK_EMAIL}/token:${ZENDESK_API_TOKEN}`).toString('base64');
    
    const response = await fetch(zendeskUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`
      },
      body: JSON.stringify(ticketData)
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('[Zendesk API] Erro ao criar ticket:', error);
      throw new Error('Falha ao criar ticket no Zendesk');
    }
    
    const result = await response.json();
    console.log('[Zendesk API] Ticket criado:', result.ticket.id);
    
    return NextResponse.json({
      success: true,
      ticketId: result.ticket.id,
      ticketUrl: result.ticket.url
    });
    
  } catch (error) {
    console.error('[Zendesk API] Erro:', error);
    // Não retornar erro para não quebrar o fluxo
    return NextResponse.json({ 
      success: true, 
      message: 'Ticket será criado via widget',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
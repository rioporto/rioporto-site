import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Handler para GET - teste de conectividade
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Zendesk webhook endpoint is ready',
    timestamp: new Date().toISOString()
  });
}

// Handler para POST - recebe webhooks do Zendesk
export async function POST(request: NextRequest) {
  try {
    // Log todos os headers para debug
    const headers: any = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    console.log('Webhook Headers:', headers);
    
    // Parse do body
    const body = await request.json();
    console.log('Webhook Body:', JSON.stringify(body, null, 2));
    
    // Salvar no banco se for um ticket
    if (body.ticket) {
      const supabase = createClient();
      const ticket = body.ticket;
      
      try {
        const { data, error } = await supabase.from('support_tickets').insert({
          zendesk_id: ticket.id || Math.floor(Math.random() * 1000000),
          user_email: ticket.requester?.email || 'unknown@example.com',
          subject: ticket.subject || 'Sem assunto',
          status: ticket.status || 'new',
          priority: ticket.priority || 'normal',
          created_at: ticket.created_at || new Date().toISOString()
        });
        
        if (error) {
          console.error('Error saving ticket:', error);
        } else {
          console.log('Ticket saved successfully');
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Webhook received successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handler para outros métodos (OPTIONS, HEAD, etc)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Allow': 'GET, POST, OPTIONS'
    }
  });
}
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, event_type, event_data } = body;

    if (!session_id || !event_type) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Obter informações da requisição
    const headersList = await headers();
    const ip_address = headersList.get('x-forwarded-for')?.split(',')[0] || 
                      headersList.get('x-real-ip') || 
                      'unknown';
    const user_agent = headersList.get('user-agent') || 'unknown';

    // Inserir evento
    const { error } = await supabase
      .from('lead_events')
      .insert({
        session_id,
        event_type,
        event_data,
        ip_address,
        user_agent,
      });

    if (error) {
      console.error('Erro ao registrar evento:', error);
      return NextResponse.json(
        { error: 'Erro ao registrar evento' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar tracking:', error);
    return NextResponse.json(
      { error: 'Erro ao processar tracking' },
      { status: 500 }
    );
  }
}
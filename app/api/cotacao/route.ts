// app/api/cotacao/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  console.log('API Cotação: Iniciando processamento...');
  
  try {
    // Parse do body
    const body = await request.json();
    console.log('API Cotação: Body recebido:', JSON.stringify(body, null, 2));
    
    // Validações básicas manuais
    if (!body.tipo || !body.valorBRL || !body.valorCripto || !body.nome || !body.email) {
      console.error('API Cotação: Campos obrigatórios faltando');
      return NextResponse.json(
        { error: 'Campos obrigatórios: tipo, valorBRL, valorCripto, nome, email' },
        { status: 400 }
      );
    }
    
    // Conectar ao Supabase
    console.log('API Cotação: Conectando ao Supabase...');
    const supabase = createClient();
    
    // Verificar usuário (opcional)
    const { data: { user } } = await supabase.auth.getUser();
    console.log('API Cotação: Usuário:', user?.id || 'não autenticado');
    
    // Preparar dados para inserir
    const dadosInsert = {
      user_id: user?.id || null,
      type: body.tipo,
      crypto: body.moeda === 'btc' ? 'BTC' : body.moeda.toUpperCase(),
      amount: parseFloat(body.valorCripto),
      brl_value: parseFloat(body.valorBRL),
      fee: parseFloat(body.valorBRL) * 0.025,
      total: parseFloat(body.valorBRL) * 1.025,
      phone_number: body.telefone || '+55',
      valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      nome: body.nome,
      email: body.email,
      telefone: body.telefone || null,
      wallet: body.wallet || null,
      observacoes: body.observacoes || null,
      metadata: {
        crypto_name: body.cryptoName || body.moeda,
        price_at_time: body.price || 0,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('API Cotação: Dados para inserir:', JSON.stringify(dadosInsert, null, 2));
    
    // Salvar no banco
    const { data: cotacao, error: dbError } = await supabase
      .from('quotations')
      .insert(dadosInsert)
      .select()
      .single();
    
    if (dbError) {
      console.error('API Cotação: Erro do banco:', dbError);
      console.error('API Cotação: Detalhes:', JSON.stringify(dbError, null, 2));
      return NextResponse.json(
        { 
          error: 'Erro ao salvar no banco de dados',
          details: dbError.message,
          code: dbError.code
        },
        { status: 500 }
      );
    }
    
    console.log('API Cotação: Sucesso! ID:', cotacao?.id);
    
    return NextResponse.json(
      { 
        success: true,
        id: cotacao?.id,
        message: 'Cotação enviada com sucesso!'
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('API Cotação: Erro não tratado:', error);
    console.error('API Cotação: Stack:', error instanceof Error ? error.stack : 'no stack');
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        type: error instanceof Error ? error.constructor.name : typeof error
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Método não permitido' },
    { status: 405 }
  );
}

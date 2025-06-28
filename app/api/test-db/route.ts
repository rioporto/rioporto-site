// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  console.log('Test DB: Iniciando...');
  
  try {
    // Verificar variáveis de ambiente
    console.log('Test DB: SUPABASE_URL existe?', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Test DB: SUPABASE_ANON_KEY existe?', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // Criar cliente
    console.log('Test DB: Criando cliente Supabase...');
    const supabase = createClient();
    
    // Testar conexão
    console.log('Test DB: Testando conexão...');
    const { data, error } = await supabase
      .from('quotations')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Test DB: Erro:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error
      }, { status: 500 });
    }
    
    console.log('Test DB: Sucesso!');
    return NextResponse.json({
      success: true,
      message: 'Conexão com banco OK!',
      data
    });
    
  } catch (error) {
    console.error('Test DB: Erro não tratado:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      type: error instanceof Error ? error.constructor.name : typeof error
    }, { status: 500 });
  }
}

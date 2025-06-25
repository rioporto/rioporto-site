import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    
    // Teste 1: Verificar conexão
    const { data: testConnection, error: connError } = await supabase
      .from('blog_comments')
      .select('count')
      .limit(1);
      
    if (connError) {
      return NextResponse.json({
        error: 'Erro de conexão',
        details: connError.message,
        code: connError.code
      }, { status: 500 });
    }
    
    // Teste 2: Tentar inserir
    const testData = {
      post_slug: body.post_slug || 'test-slug',
      content: body.content || 'Teste de comentário',
      author_name: body.author_name || 'Teste',
      author_email: body.author_email || 'teste@teste.com',
      status: 'pending',
      ip_address: '127.0.0.1',
      user_agent: 'Test'
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from('blog_comments')
      .insert(testData)
      .select()
      .single();
      
    if (insertError) {
      return NextResponse.json({
        error: 'Erro ao inserir',
        details: insertError.message,
        code: insertError.code,
        hint: insertError.hint,
        testData
      }, { status: 500 });
    }
    
    // Se chegou aqui, funcionou
    // Deletar o teste
    if (insertResult) {
      await supabase
        .from('blog_comments')
        .delete()
        .eq('id', insertResult.id);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Teste passou! O problema deve estar em outro lugar.',
      testedData: testData
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Erro não tratado',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
// app/api/cotacao/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Schema de validação com Zod (OWASP - Input Validation)
const cotacaoSchema = z.object({
  tipo: z.enum(['compra', 'venda']),
  moeda: z.string().min(1).max(10),
  cryptoName: z.string().min(1).max(100),
  valorBRL: z.string().regex(/^\d+(\.\d{0,2})?$/, 'Valor inválido'),
  valorCripto: z.string().regex(/^\d+(\.\d{0,8})?$/, 'Valor inválido'),
  nome: z.string().min(3).max(100),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional().default(''),
  wallet: z.string().max(200).optional(),
  observacoes: z.string().max(500).optional(),
  price: z.number().positive()
});

// Rate limiting simples (OWASP - API Security)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = requestCounts.get(ip);
  
  if (!limit || now > limit.resetTime) {
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + 60000 // Reset após 1 minuto
    });
    return true;
  }
  
  if (limit.count >= 5) { // Máximo 5 requisições por minuto
    return false;
  }
  
  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Muitas requisições. Tente novamente em 1 minuto.' },
        { status: 429 }
      );
    }

    // Parse e validação dos dados
    const body = await request.json();
    
    // Validação com Zod
    const validatedData = cotacaoSchema.parse(body);
    
    // Sanitização adicional (OWASP - XSS Prevention)
    const sanitizedData = {
      ...validatedData,
      nome: validatedData.nome.trim().replace(/<[^>]*>/g, ''),
      observacoes: validatedData.observacoes?.trim().replace(/<[^>]*>/g, '')
    };

    // Conectar ao Supabase
    const supabase = createClient();

    // Verificar se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();

    // Salvar cotação no banco
    const { data: cotacao, error: dbError } = await supabase
      .from('quotations')
      .insert({
        user_id: user?.id || null,
        type: sanitizedData.tipo, // mudou de 'tipo' para 'type'
        crypto: sanitizedData.moeda.toUpperCase(), // mudou de 'moeda' para 'crypto' - uppercase
        amount: parseFloat(sanitizedData.valorCripto), // valor em crypto
        brl_value: parseFloat(sanitizedData.valorBRL), // valor em BRL
        fee: parseFloat(sanitizedData.valorBRL) * 0.025, // taxa padrão 2.5%
        total: parseFloat(sanitizedData.valorBRL) * 1.025, // total com taxa
        phone_number: sanitizedData.telefone || '+55', // campo obrigatório - mínimo +55
        valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // válido por 24h
        status: 'pending',
        nome: sanitizedData.nome,
        email: sanitizedData.email,
        telefone: sanitizedData.telefone || null,
        wallet: sanitizedData.wallet || null,
        observacoes: sanitizedData.observacoes || null,
        metadata: {
          crypto_name: sanitizedData.cryptoName,
          price_at_time: sanitizedData.price,
          ip_address: ip,
          user_agent: request.headers.get('user-agent') || 'unknown'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Erro ao salvar cotação:', dbError);
      throw new Error('Erro ao salvar cotação no banco de dados');
    }

    // Log de auditoria (OWASP - Logging)
    console.log('Nova cotação recebida:', {
      id: cotacao.id,
      tipo: cotacao.type,
      email: cotacao.email,
      timestamp: new Date().toISOString()
    });

    // Resposta de sucesso
    return NextResponse.json(
      { 
        success: true, 
        id: cotacao.id,
        message: 'Cotação enviada com sucesso!' 
      },
      { 
        status: 200,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        }
      }
    );

  } catch (error) {
    console.error('Erro detalhado na API de cotação:', error);
    console.error('Tipo do erro:', error instanceof Error ? error.constructor.name : typeof error);
    if (error instanceof Error) {
      console.error('Mensagem:', error.message);
      console.error('Stack:', error.stack);
    }
    
    // Tratamento de erros de validação
    if (error instanceof z.ZodError) {
      console.error('Erros de validação:', error.errors);
      return NextResponse.json(
        { 
          error: 'Dados inválidos', 
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    // Erro genérico (não expor detalhes internos)
    return NextResponse.json(
      { error: 'Erro ao processar cotação. Tente novamente.' },
      { status: 500 }
    );
  }
}

// Método GET não permitido
export async function GET() {
  return NextResponse.json(
    { error: 'Método não permitido' },
    { status: 405 }
  );
}

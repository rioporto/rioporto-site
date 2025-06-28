# 🔐 SNIPPETS DE CÓDIGO SEGURO - RIO PORTO P2P

## 1. Validação com Zod (Input Validation)

```typescript
import { z } from 'zod';

// Schema de validação para formulários
const formSchema = z.object({
  nome: z.string()
    .min(3, 'Nome muito curto')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome inválido'),
  
  email: z.string()
    .email('Email inválido')
    .toLowerCase(),
  
  telefone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Telefone inválido')
    .optional(),
  
  valor: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Valor inválido'),
  
  observacoes: z.string()
    .max(500, 'Texto muito longo')
    .optional()
});

// Uso:
const validatedData = formSchema.parse(requestBody);
```

## 2. Rate Limiting Simples

```typescript
// Rate limiter em memória
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

// Uso em API route:
const ip = request.headers.get('x-forwarded-for') || 'unknown';
if (!checkRateLimit(ip)) {
  return NextResponse.json(
    { error: 'Too many requests' },
    { status: 429 }
  );
}
```

## 3. Sanitização XSS

```typescript
// Função para sanitizar HTML
function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Remover tags HTML completamente
function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

// Uso:
const sanitizedText = stripHtmlTags(userInput);
```

## 4. Headers de Segurança

```typescript
// Em API routes Next.js
export async function POST(request: Request) {
  // ... lógica da API
  
  return NextResponse.json(
    { data: result },
    { 
      status: 200,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': "default-src 'self'",
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    }
  );
}
```

## 5. Validação de WhatsApp

```typescript
// Validar e formatar número WhatsApp brasileiro
function validarWhatsApp(numero: string): { valido: boolean; formatado: string } {
  // Remove tudo que não é número
  const limpo = numero.replace(/\D/g, '');
  
  // Padrões aceitos:
  // 5521999999999 (com código país)
  // 21999999999 (sem código país)
  // 999999999 (só o número)
  
  let formatado = limpo;
  
  // Adiciona código do Brasil se não tiver
  if (!formatado.startsWith('55')) {
    formatado = '55' + formatado;
  }
  
  // Valida comprimento (55 + 2 DDD + 8 ou 9 dígitos)
  const valido = /^55\d{10,11}$/.test(formatado);
  
  return { valido, formatado };
}
```

## 6. Logging Seguro

```typescript
// Logger que não expõe dados sensíveis
function logSeguro(acao: string, dados: any) {
  const dadosLimpos = {
    timestamp: new Date().toISOString(),
    acao,
    // Oculta dados sensíveis
    email: dados.email ? dados.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : undefined,
    telefone: dados.telefone ? dados.telefone.replace(/(\d{3})(\d+)(\d{2})/, '$1***$3') : undefined,
    // Mantém outros dados não sensíveis
    tipo: dados.tipo,
    status: dados.status,
    id: dados.id
  };
  
  console.log('[AUDIT]', JSON.stringify(dadosLimpos));
}
```

## 7. Supabase com RLS

```typescript
// Cliente Supabase seguro com RLS
import { createClient } from '@supabase/supabase-js';

// Sempre use anon key no cliente
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Query segura com RLS
const { data, error } = await supabase
  .from('quotations')
  .select('*')
  .eq('user_id', user.id) // RLS garante acesso apenas aos próprios dados
  .order('created_at', { ascending: false });
```

## 8. Variáveis de Ambiente

```typescript
// Validar variáveis de ambiente na inicialização
function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'WHATSAPP_ACCESS_TOKEN',
    'RESEND_API_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}

// Chamar no início da aplicação
validateEnv();
```

## 9. CORS Seguro

```typescript
// Configurar CORS em API routes
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? 'https://rioporto-site.vercel.app' 
    : 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Handle preflight
if (request.method === 'OPTIONS') {
  return new Response(null, { status: 200, headers: corsHeaders });
}
```

## 10. Tratamento de Erros

```typescript
// Nunca expor detalhes internos de erro
try {
  // ... código que pode falhar
} catch (error) {
  // Log completo internamente
  console.error('Erro detalhado:', error);
  
  // Resposta genérica ao cliente
  return NextResponse.json(
    { 
      error: 'Ocorreu um erro ao processar sua solicitação',
      code: 'INTERNAL_ERROR'
    },
    { status: 500 }
  );
}
```

---

**Lembre-se**: Segurança é um processo contínuo. Sempre:
- Valide todas as entradas
- Sanitize todas as saídas
- Use HTTPS sempre
- Mantenha dependências atualizadas
- Faça auditorias regulares
- Implemente logs adequados
- Teste seus controles de segurança

# 🛡️ Sistema de Tratamento de Erros - Rio Porto P2P

## 📋 Visão Geral

O sistema de tratamento de erros foi implementado para fornecer uma experiência consistente e profissional em toda a aplicação. Ele inclui:

- ✅ Tipos de erro customizados
- ✅ Logger centralizado
- ✅ Error Boundaries para React
- ✅ Handlers para API e Cliente
- ✅ Hooks customizados
- ✅ Páginas de erro específicas
- ✅ Retry logic e timeout
- ✅ Mensagens user-friendly

## 🚀 Como Usar

### 1. Em API Routes

```typescript
import { handleApiError, ValidationError, AuthenticationError } from '@/lib/errors'

export async function POST(request: NextRequest) {
  try {
    // Validação
    if (!data.email) {
      throw new ValidationError('Email é obrigatório', { 
        email: 'Campo obrigatório' 
      })
    }

    // Lógica da API...
    
  } catch (error) {
    return handleApiError(error, request.url)
  }
}
```

### 2. Em Componentes Client

```typescript
import { useError } from '@/hooks/use-error'

export function MyComponent() {
  const { error, isError, handleError, clearError } = useError()
  
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data')
      if (!response.ok) throw new Error('Falha ao buscar dados')
      // ...
    } catch (err) {
      handleError(err)
    }
  }
  
  if (isError) {
    return <div>Erro: {error?.message}</div>
  }
  
  // ...
}
```

### 3. Em Formulários

```typescript
import { useFormError } from '@/hooks/use-error'

export function MyForm() {
  const { fieldErrors, handleError, clearFieldError } = useFormError()
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw error
      }
    } catch (err) {
      handleError(err)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="email"
        onChange={() => clearFieldError('email')}
      />
      {fieldErrors.email && (
        <span className="text-red-500">{fieldErrors.email}</span>
      )}
    </form>
  )
}
```

### 4. Com Retry Logic

```typescript
import { withRetry } from '@/lib/errors'

const fetchWithRetry = async () => {
  return withRetry(
    async () => {
      const response = await fetch('/api/data')
      if (!response.ok) throw new Error('Failed')
      return response.json()
    },
    {
      maxAttempts: 3,
      delay: 1000,
      backoff: true,
      onRetry: (attempt, error) => {
        console.log(`Tentativa ${attempt} falhou:`, error)
      }
    }
  )
}
```

### 5. Com Timeout

```typescript
import { withTimeout } from '@/lib/errors'

const fetchWithTimeout = async () => {
  return withTimeout(
    async () => {
      const response = await fetch('/api/slow-endpoint')
      return response.json()
    },
    5000 // 5 segundos
  )
}
```

### 6. Error Boundary

```typescript
import { ErrorBoundary } from '@/components/errors/error-boundary'

export function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  )
}
```

## 📊 Tipos de Erro

### Erros Pré-definidos

- `AuthenticationError` - Erro de autenticação (401)
- `ValidationError` - Erro de validação (400)
- `NotFoundError` - Recurso não encontrado (404)
- `DatabaseError` - Erro de banco de dados (500)
- `NetworkError` - Erro de rede (503)
- `RateLimitError` - Limite de requisições (429)
- `BusinessError` - Erro de regra de negócio (400)

### Criar Erro Customizado

```typescript
import { CustomError, ErrorCode } from '@/lib/errors'

// Criar novo código de erro
throw new CustomError(
  ErrorCode.BUSINESS_ERROR,
  'Saldo insuficiente para realizar a operação',
  400,
  { requiredBalance: 100, currentBalance: 50 }
)
```

## 📝 Logger

### Níveis de Log

- `ERROR` - Erros críticos
- `WARN` - Avisos importantes
- `INFO` - Informações gerais
- `DEBUG` - Debug (apenas desenvolvimento)

### Uso do Logger

```typescript
import { logger } from '@/lib/errors'

// Log de erro
logger.error('Falha ao processar pagamento', error, {
  userId: user.id,
  amount: 100,
  paymentMethod: 'pix'
})

// Log de warning
logger.warn('Taxa de conversão baixa', {
  rate: 0.02,
  expected: 0.05
})

// Log de info
logger.info('Usuário realizou login', {
  userId: user.id,
  ip: request.ip
})
```

## 🎯 Melhores Práticas

### 1. Sempre use erros tipados

```typescript
// ❌ Evite
throw new Error('Usuário não encontrado')

// ✅ Prefira
throw new NotFoundError('Usuário não encontrado')
```

### 2. Forneça contexto nos erros

```typescript
// ❌ Evite
throw new ValidationError('Campo inválido')

// ✅ Prefira
throw new ValidationError('Email inválido', {
  field: 'email',
  value: userInput,
  pattern: 'email@example.com'
})
```

### 3. Use o logger para rastreamento

```typescript
try {
  await processPayment(order)
} catch (error) {
  // Log com contexto
  logger.error('Falha no pagamento', error, {
    orderId: order.id,
    amount: order.total,
    userId: user.id
  })
  
  // Re-throw com mensagem user-friendly
  throw new BusinessError('Não foi possível processar seu pagamento')
}
```

### 4. Trate erros no nível apropriado

```typescript
// Em componentes - mostre UI de erro
if (error) {
  return <ErrorDisplay error={error} />
}

// Em APIs - retorne resposta estruturada
catch (error) {
  return handleApiError(error)
}

// Em páginas - use error.tsx
// O Next.js automaticamente renderiza error.tsx
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Para habilitar logs detalhados
NODE_ENV=development

# Para integração com Sentry (futuro)
SENTRY_DSN=your-sentry-dsn
```

### Integração com Monitoring (Futuro)

O sistema está preparado para integração com ferramentas de monitoring como:
- Sentry
- LogRocket
- Datadog
- New Relic

## 📈 Monitoramento

### Acessar logs em desenvolvimento

```typescript
import { logger } from '@/lib/errors'

// Ver últimos 50 erros
const errors = logger.getLogs('error', 50)

// Ver todos os logs
const allLogs = logger.getLogs()

// Limpar logs
logger.clearLogs()
```

## 🎉 Conclusão

Com este sistema de tratamento de erros, o Rio Porto P2P agora possui:

- ✅ Experiência consistente de erro
- ✅ Rastreamento completo de problemas
- ✅ Mensagens amigáveis ao usuário
- ✅ Facilidade de debugging
- ✅ Preparado para produção

**Sprint 1 - Status: 100% Completo! 🚀**
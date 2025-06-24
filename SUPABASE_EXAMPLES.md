# 📚 Exemplos Práticos - Supabase no RIO PORTO P2P

## 1. Autenticação

### Login com Email/Senha
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@email.com',
  password: 'senha123'
})

if (error) {
  console.error('Erro no login:', error.message)
} else {
  console.log('Usuário logado:', data.user)
}
```

### Cadastro
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'novo@email.com',
  password: 'senha123',
  options: {
    data: {
      name: 'João Silva',
      phone: '+55 21 99999-9999'
    }
  }
})
```

### Logout
```typescript
const { error } = await supabase.auth.signOut()
```

### Recuperar Sessão
```typescript
const { data: { session } } = await supabase.auth.getSession()
if (session) {
  console.log('Usuário autenticado:', session.user)
}
```

## 2. Perfis de Usuário

### Buscar Perfil
```typescript
const { data: profile, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single()
```

### Atualizar Perfil
```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({
    name: 'Novo Nome',
    phone: '+55 21 88888-8888'
  })
  .eq('id', userId)
```

### Buscar Perfis por Nível
```typescript
const { data: premiumUsers } = await supabase
  .from('profiles')
  .select('*')
  .eq('level', '3')
  .eq('kyc_status', 'approved')
```

## 3. Transações

### Criar Nova Transação
```typescript
const { data, error } = await supabase
  .from('transactions')
  .insert({
    user_id: userId,
    type: 'buy',
    crypto_currency: 'Bitcoin (BTC)',
    crypto_amount: 0.001,
    brl_amount: 250.00,
    exchange_rate: 250000.00,
    commission_rate: 0.035,
    commission_amount: 8.75,
    wallet_address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    status: 'pending',
    notes: 'Primeira compra'
  })
  .select()
  .single()
```

### Buscar Transações do Usuário
```typescript
const { data: transactions } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(10)
```

### Buscar com Paginação
```typescript
const pageSize = 20
const page = 1

const { data, count } = await supabase
  .from('transactions')
  .select('*', { count: 'exact' })
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .range((page - 1) * pageSize, page * pageSize - 1)
```

### Atualizar Status da Transação
```typescript
const { data, error } = await supabase
  .from('transactions')
  .update({ status: 'completed' })
  .eq('id', transactionId)
  .eq('user_id', userId) // Segurança extra
```

## 4. KYC - Documentos

### Upload de Documento
```typescript
// 1. Upload do arquivo
const file = event.target.files[0]
const fileExt = file.name.split('.').pop()
const fileName = `${userId}/${Date.now()}.${fileExt}`

const { data: uploadData, error: uploadError } = await supabase.storage
  .from('kyc-documents')
  .upload(fileName, file)

// 2. Salvar referência no banco
if (!uploadError) {
  const { data: urlData } = supabase.storage
    .from('kyc-documents')
    .getPublicUrl(fileName)

  const { data, error } = await supabase
    .from('kyc_documents')
    .insert({
      user_id: userId,
      document_type: 'rg',
      file_url: urlData.publicUrl,
      file_name: file.name
    })
}
```

### Buscar Documentos do Usuário
```typescript
const { data: documents } = await supabase
  .from('kyc_documents')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

## 5. Queries Avançadas

### Join entre Tabelas
```typescript
// Buscar transações com dados do perfil
const { data } = await supabase
  .from('transactions')
  .select(`
    *,
    profiles:user_id (
      name,
      email,
      level
    )
  `)
  .eq('status', 'pending')
```

### Agregações
```typescript
// Total de transações por usuário
const { data } = await supabase
  .from('transactions')
  .select('user_id, brl_amount.sum()')
  .eq('user_id', userId)
  .eq('status', 'completed')
```

### Filtros Complexos
```typescript
// Transações grandes dos últimos 30 dias
const thirtyDaysAgo = new Date()
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

const { data } = await supabase
  .from('transactions')
  .select('*')
  .gte('brl_amount', 50000)
  .gte('created_at', thirtyDaysAgo.toISOString())
  .in('status', ['completed', 'processing'])
```

## 6. Realtime (Websockets)

### Escutar Mudanças em Transações
```typescript
// Subscrever a mudanças
const subscription = supabase
  .channel('transactions-channel')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'transactions',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Mudança detectada:', payload)
      // Atualizar UI
    }
  )
  .subscribe()

// Cancelar subscrição
subscription.unsubscribe()
```

### Notificações em Tempo Real
```typescript
// Escutar novas transações aprovadas
supabase
  .channel('approved-transactions')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'transactions',
      filter: 'status=eq.completed'
    },
    (payload) => {
      if (payload.new.user_id === userId) {
        toast.success('Sua transação foi aprovada!')
      }
    }
  )
  .subscribe()
```

## 7. Hooks Customizados

### useProfile Hook
```typescript
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useProfile(userId: string) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (!error) setProfile(data)
      setLoading(false)
    }

    if (userId) fetchProfile()
  }, [userId])

  return { profile, loading }
}
```

### useTransactions Hook
```typescript
export function useTransactions(userId: string) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Buscar inicial
    fetchTransactions()

    // Subscrever a mudanças
    const subscription = supabase
      .channel('user-transactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchTransactions()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  async function fetchTransactions() {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (data) setTransactions(data)
    setLoading(false)
  }

  return { transactions, loading, refetch: fetchTransactions }
}
```

## 8. Segurança e Boas Práticas

### Validação no Cliente
```typescript
// Sempre valide antes de enviar
const validateTransaction = (data: TransactionInput) => {
  if (data.brl_amount <= 0) {
    throw new Error('Valor deve ser maior que zero')
  }
  if (data.brl_amount > 100000 && !userProfile.kyc_approved) {
    throw new Error('KYC necessário para valores acima de R$ 100.000')
  }
  // ... mais validações
}
```

### Rate Limiting
```typescript
// Implementar rate limiting no cliente
const rateLimiter = {
  attempts: 0,
  resetTime: Date.now() + 60000, // 1 minuto

  canAttempt() {
    if (Date.now() > this.resetTime) {
      this.attempts = 0
      this.resetTime = Date.now() + 60000
    }
    return this.attempts < 5
  },

  recordAttempt() {
    this.attempts++
  }
}

// Usar antes de chamadas
if (!rateLimiter.canAttempt()) {
  toast.error('Muitas tentativas. Aguarde um momento.')
  return
}
rateLimiter.recordAttempt()
```

### Tratamento de Erros
```typescript
// Wrapper para chamadas Supabase
async function supabaseCall<T>(
  fn: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  try {
    const { data, error } = await fn()
    
    if (error) {
      // Log para debugging
      console.error('Supabase error:', error)
      
      // Mensagens amigáveis
      if (error.code === 'PGRST116') {
        throw new Error('Registro não encontrado')
      }
      if (error.code === '23505') {
        throw new Error('Este registro já existe')
      }
      
      throw new Error(error.message || 'Erro ao processar solicitação')
    }
    
    return data as T
  } catch (error: any) {
    toast.error(error.message)
    throw error
  }
}

// Uso
const profile = await supabaseCall(() =>
  supabase.from('profiles').select('*').eq('id', userId).single()
)
```

## 9. Testes

### Mock do Supabase para Testes
```typescript
// __mocks__/supabase.ts
export const createClient = jest.fn(() => ({
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => ({
          data: mockProfile,
          error: null
        }))
      }))
    })),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }))
}))
```

## 10. Performance

### Cache com React Query
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Hook otimizado
export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Mutation com invalidação de cache
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ userId, data }) => {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId)
      
      if (error) throw error
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries(['profile', userId])
    }
  })
}
```

## 🎯 Próximos Passos

1. Implementar autenticação 2FA
2. Adicionar logs de auditoria
3. Implementar webhooks para notificações
4. Configurar backups automáticos
5. Monitorar performance com Supabase Dashboard
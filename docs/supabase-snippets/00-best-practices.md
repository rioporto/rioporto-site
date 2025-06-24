# Melhores Práticas Supabase + Next.js 14 - Evitando Loading Infinito

## 1. Problemas Comuns que Causam Loading Infinito

### 1.1. AuthContext mal configurado
- useEffect com dependências incorretas
- Estado de loading que nunca é definido como false
- Promises não tratadas corretamente
- Loops infinitos ao carregar perfil

### 1.2. Middleware incorreto
- Não retornar o supabaseResponse corretamente
- Não usar auth.getUser() no middleware
- Configuração incorreta do matcher

### 1.3. Mistura de padrões Server/Client
- Usar createClient incorretamente
- Não sincronizar cookies entre server e client
- Usar getSession() ao invés de getUser() no servidor

## 2. Soluções Recomendadas

### 2.1. AuthContext Simplificado
```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### 2.2. Layout Platform Correto
```typescript
// app/(platform)/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return <>{children}</>
}
```

### 2.3. Middleware Correto
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => 
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        }
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
```

## 3. Checklist de Debug

1. **Verificar Console**
   - Procurar por erros de promise não tratadas
   - Verificar se há loops infinitos nos logs
   - Ver se o loading muda de true para false

2. **Verificar Network**
   - Requisições repetidas infinitamente
   - Requests travados ou pendentes
   - Erros de CORS ou autenticação

3. **Verificar Supabase Dashboard**
   - Políticas RLS estão corretas?
   - Tabela profiles existe e está acessível?
   - Logs de erro no dashboard

4. **Testar em Modo Incógnito**
   - Descartar problemas com extensões
   - Limpar cookies e localStorage

## 4. Solução Rápida para Admin Comments

Se precisar fazer funcionar AGORA, crie uma página standalone:

```typescript
// app/admin-standalone/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'

export default function AdminStandalone() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          redirect('/login')
          return
        }

        // Check if admin
        const adminEmails = ['johnnyhelder@gmail.com']
        setIsAdmin(adminEmails.includes(user.email || ''))
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!isAdmin) {
    return <div>Acesso negado</div>
  }

  // Resto do código do admin
  return <div>Admin Panel</div>
}
```

## 5. Padrão Recomendado para o Projeto

### Para páginas públicas:
- Use Server Components
- Não precisa de AuthContext

### Para páginas autenticadas:
- Use Server Components com verificação no layout
- Client Components apenas quando necessário (interatividade)
- Evite AuthContext complexo se não for necessário

### Para operações de auth:
- Use Server Actions quando possível
- Client-side auth apenas para interações imediatas
- Sempre use router.refresh() após mudanças de auth

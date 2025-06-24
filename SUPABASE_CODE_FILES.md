# 📁 Arquivos para Implementação Supabase

## 1. `/lib/supabase/client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

## 2. `/lib/supabase/server.ts`

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

## 3. `/contexts/auth-context.tsx` (Atualizado para Supabase)

```typescript
"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import toast from 'react-hot-toast'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string, phone?: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      }
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && data) {
      setProfile(data)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Login realizado com sucesso!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (
    email: string,
    password: string,
    name?: string,
    phone?: string
  ) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }, // Metadados do usuário
        },
      })

      if (error) throw error

      // Atualizar perfil com nome e telefone
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ name, phone })
          .eq('id', data.user.id)

        if (profileError) {
          console.error('Erro ao atualizar perfil:', profileError)
        }
      }

      toast.success('Conta criada com sucesso! Verifique seu email.')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      setProfile(null)
      toast.success('Logout realizado com sucesso!')
      router.push('/')
    } catch (error) {
      toast.error('Erro ao fazer logout')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)

      if (error) throw error

      await loadProfile(user.id)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar perfil')
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

## 4. `/app/(marketing)/cotacao/page.tsx` (Ajuste para usar profile)

Onde estava:
```typescript
nome: user?.name || "",
email: user?.email || "",
telefone: user?.phone || "",
```

Mude para:
```typescript
nome: profile?.name || "",
email: profile?.email || "",
telefone: profile?.phone || "",
```

E onde estava:
```typescript
const { user } = useAuth()
```

Mude para:
```typescript
const { user, profile } = useAuth()
```

## 5. `/components/layout/header.tsx` (Ajuste para usar profile)

Onde estava:
```typescript
const { user, signOut } = useAuth()
```

Mude para:
```typescript
const { user, profile, signOut } = useAuth()
```

E ajuste as referências de `user.name` para `profile?.name` e `user.email` para `profile?.email`.

## 6. `/app/(platform)/dashboard/page.tsx` (Ajuste para usar profile)

```typescript
"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Shield, 
  BookOpen, 
  TrendingUp, 
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, profile } = useAuth()

  const getKycStatusIcon = () => {
    switch (profile?.kyc_status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const getKycStatusText = () => {
    switch (profile?.kyc_status) {
      case 'approved':
        return 'Verificado'
      case 'rejected':
        return 'Rejeitado'
      default:
        return 'Pendente'
    }
  }

  const getUserLevelText = () => {
    switch (profile?.level) {
      case '3':
        return 'Premium'
      case '2':
        return 'Intermediário'
      default:
        return 'Básico'
    }
  }

  const getUserLevelLimit = () => {
    switch (profile?.level) {
      case '3':
        return 'R$ 50.000'
      case '2':
        return 'R$ 50.000'
      default:
        return 'R$ 4.999'
    }
  }

  // Resto do componente permanece igual, apenas trocando user por profile onde apropriado
}
```

## 7. `/api/cotacao/route.ts` (Criar transação no Supabase)

```typescript
import { NextResponse } from "next/server"
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()
    
    // Verificar usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const {
      tipo,
      cryptoName,
      valorBRL,
      valorCripto,
      price,
      wallet,
      observacoes,
    } = body

    // Calcular comissão
    const brlAmount = parseFloat(valorBRL)
    const getCommissionRate = (value: number) => {
      if (value <= 4999) return 0.035
      if (value <= 50000) return 0.025
      if (value <= 100000) return 0.015
      return 0.01
    }
    
    const commissionRate = getCommissionRate(brlAmount)
    const commissionAmount = brlAmount * commissionRate

    // Criar transação
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: tipo === 'compra' ? 'buy' : 'sell',
        crypto_currency: cryptoName,
        crypto_amount: parseFloat(valorCripto),
        brl_amount: brlAmount,
        exchange_rate: price,
        commission_rate: commissionRate,
        commission_amount: commissionAmount,
        wallet_address: wallet,
        notes: observacoes,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar transação:', error)
      return NextResponse.json(
        { error: "Erro ao processar cotação" },
        { status: 500 }
      )
    }

    // Aqui você pode adicionar lógica para enviar email/notificação

    return NextResponse.json({
      success: true,
      transaction,
    })
  } catch (error) {
    console.error("Erro na API de cotação:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
```

## 8. `/middleware.ts` (Atualizado)

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Verificar autenticação para rotas protegidas
  const url = new URL(request.url)
  const isProtectedRoute = url.pathname.startsWith('/dashboard') || 
                          url.pathname.startsWith('/perfil') || 
                          url.pathname.startsWith('/transacoes')

  if (isProtectedRoute) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## 🚀 Comandos de Instalação

```bash
# Instalar dependências do Supabase
npm install @supabase/supabase-js @supabase/ssr @supabase/auth-helpers-nextjs

# Instalar types do Supabase (opcional mas recomendado)
npm install --save-dev @types/node
```

## 📝 Checklist de Migração

1. [ ] Configurar projeto no Supabase
2. [ ] Executar SQLs das tabelas
3. [ ] Configurar .env.local
4. [ ] Instalar dependências
5. [ ] Criar `/lib/supabase/client.ts`
6. [ ] Criar `/lib/supabase/server.ts`
7. [ ] Criar `/types/supabase.ts`
8. [ ] Atualizar `/contexts/auth-context.tsx`
9. [ ] Atualizar `/middleware.ts`
10. [ ] Ajustar componentes para usar `profile`
11. [ ] Remover APIs mock de auth
12. [ ] Testar fluxo completo

## 🎉 Pronto!

Após seguir estes passos, seu sistema estará integrado com o Supabase!
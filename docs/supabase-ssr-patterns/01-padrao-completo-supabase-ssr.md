# 🔐 Padrões Supabase SSR para Next.js 14+

## 📋 Visão Geral

Este documento contém os padrões CORRETOS e ATUALIZADOS para usar Supabase com Next.js 14+, usando o pacote `@supabase/ssr` ao invés dos pacotes deprecated `@supabase/auth-helpers-nextjs`.

## ⚠️ IMPORTANTE: Pacotes Corretos

### ✅ USE ESTES:
```json
{
  "dependencies": {
    "@supabase/ssr": "^0.6.1",
    "@supabase/supabase-js": "^2.50.0"
  }
}
```

### ❌ NÃO USE ESTES (DEPRECATED):
- `@supabase/auth-helpers-nextjs`
- `@supabase/auth-helpers-react`
- `@supabase/auth-helpers-shared`

## 🎯 Estrutura de Arquivos Recomendada

```
projeto/
├── lib/
│   └── supabase/
│       ├── client.ts      # Cliente para componentes client-side
│       ├── server.ts      # Cliente para server components/actions
│       └── middleware.ts  # Utility para middleware
├── middleware.ts          # Middleware principal
└── app/
    ├── (auth)/
    │   ├── login/
    │   │   ├── page.tsx
    │   │   └── actions.ts
    │   └── signup/
    └── (protected)/
        └── dashboard/
```

## 📝 1. Cliente para Browser (Client Components)

### `lib/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Uso em Client Component:
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function ClientComponent() {
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return <div>{user ? `Olá ${user.email}` : 'Não autenticado'}</div>
}
```

## 📝 2. Cliente para Server (Server Components/Actions)

### `lib/supabase/server.ts`
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        }
      }
    }
  )
}
```

### Uso em Server Component:
```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return <h1>Olá {user.email}</h1>
}
```

## 📝 3. Middleware para Autenticação

### `middleware.ts`
```typescript
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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  // IMPORTANTE: Não adicione lógica entre createServerClient e getUser()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirecionar se não autenticado
  if (!user && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANTE: Sempre retorne supabaseResponse
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
```

## 📝 4. Server Actions para Auth

### `app/(auth)/login/actions.ts`
```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

### `app/(auth)/login/page.tsx`
```typescript
import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
  )
}
```

## 🔍 5. Verificando Autenticação

### Em Server Component:
```typescript
import { createClient } from '@/lib/supabase/server'

export default async function Component() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return <div>Não autenticado</div>
  }
  
  return <div>Autenticado como {user.email}</div>
}
```

### Em Client Component:
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function Component() {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    const supabase = createClient()
    
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
    
    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })
    
    return () => subscription.unsubscribe()
  }, [])
  
  return <div>{user ? `Autenticado: ${user.email}` : 'Não autenticado'}</div>
}
```

## ⚠️ Erros Comuns e Soluções

### 1. "createClient expects 0 arguments"
**Problema:** Usando a versão antiga da função
**Solução:** Use `createClient()` sem argumentos

### 2. Session desincronizada
**Problema:** Não retornar `supabaseResponse` no middleware
**Solução:** SEMPRE retorne o `supabaseResponse` original

### 3. Cookies não sendo salvos
**Problema:** Try/catch no `setAll` sem re-throw
**Solução:** Use o padrão mostrado acima com try/catch vazio

### 4. Loading infinito
**Problema:** Lógica complexa entre `createServerClient` e `getUser()`
**Solução:** Chame `getUser()` imediatamente após criar o cliente

## 📚 Referências

- [Documentação Oficial Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Migration Guide](https://supabase.com/docs/guides/auth/server-side/migrating-to-ssr-package)
- [Next.js App Router](https://nextjs.org/docs/app)

---

**Última atualização:** 24/06/2025
**Versão:** 1.0.0

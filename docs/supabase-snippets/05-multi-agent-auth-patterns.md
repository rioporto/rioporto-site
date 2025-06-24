# 🔐 Padrões Avançados de Autenticação com Múltiplos Agentes - Next.js 14 + Supabase

## 📋 Visão Geral

Este documento apresenta padrões escaláveis para implementar autenticação com múltiplos agentes (Admin, Usuário, Convidado) usando Next.js 14 App Router e Supabase.

## 1. Arquitetura de Agentes

### 1.1. Estrutura de Diretórios com Route Groups
```
app/
├── (auth)/                    # Grupo para páginas de autenticação
│   ├── login/
│   ├── cadastro/
│   └── recuperar-senha/
├── (public)/                  # Grupo para páginas públicas
│   ├── page.tsx              # Home
│   ├── sobre/
│   └── blog/
├── (user)/                    # Grupo para usuários autenticados
│   ├── layout.tsx            # Layout com verificação de auth
│   ├── dashboard/
│   └── perfil/
├── (admin)/                   # Grupo para administradores
│   ├── layout.tsx            # Layout com verificação de admin
│   ├── painel/
│   └── usuarios/
└── api/
    ├── auth/
    └── admin/
```

### 1.2. Middleware Inteligente com Roles
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Definir rotas e suas permissões
const ROUTE_PERMISSIONS = {
  '/admin': ['admin', 'super_admin'],
  '/dashboard': ['user', 'admin', 'super_admin'],
  '/api/admin': ['admin', 'super_admin'],
} as const

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        }
      }
    }
  )

  // Get user and profile
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    // Get user role from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    // Check route permissions
    for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
      if (request.nextUrl.pathname.startsWith(route)) {
        if (!profile || !allowedRoles.includes(profile.role)) {
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
      }
    }
  } else {
    // Redirect unauthenticated users from protected routes
    const protectedPaths = ['/dashboard', '/admin', '/api/admin']
    const isProtectedPath = protectedPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    )
    
    if (isProtectedPath) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
```

## 2. Layouts com Verificação de Roles

### 2.1. Layout Admin
```typescript
// app/(admin)/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const ADMIN_ROLES = ['admin', 'super_admin']

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Check user role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!profile || !ADMIN_ROLES.includes(profile.role)) {
    redirect('/unauthorized')
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main>{children}</main>
    </div>
  )
}
```

### 2.2. Layout User
```typescript
// app/(user)/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="user-layout">
      <UserHeader />
      <main>{children}</main>
    </div>
  )
}
```

## 3. Context API Escalável

### 3.1. Auth Context com Múltiplos Agentes
```typescript
// contexts/multi-agent-auth-context.tsx
"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'

export type UserRole = 'guest' | 'user' | 'admin' | 'super_admin'

interface Profile {
  id: string
  role: UserRole
  name?: string
  permissions?: string[]
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  role: UserRole
  hasPermission: (permission: string) => boolean
  isAdmin: () => boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Permission mappings
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  guest: ['view_public'],
  user: ['view_public', 'view_user_content', 'edit_own_profile'],
  admin: ['view_public', 'view_user_content', 'edit_own_profile', 'manage_users', 'manage_content'],
  super_admin: ['*'], // All permissions
}

export function MultiAgentAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const role = profile?.role || 'guest'

  const hasPermission = (permission: string): boolean => {
    if (role === 'super_admin') return true
    return ROLE_PERMISSIONS[role]?.includes(permission) || false
  }

  const isAdmin = (): boolean => {
    return ['admin', 'super_admin'].includes(role)
  }

  useEffect(() => {
    let mounted = true

    async function initializeAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session && mounted) {
          setSession(session)
          setUser(session.user)
          
          // Load profile with role
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (profile) {
            setProfile(profile)
          }
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        if (event === 'SIGNED_OUT') {
          setSession(null)
          setUser(null)
          setProfile(null)
        } else if (session) {
          setSession(session)
          setUser(session.user)
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (profile) setProfile(profile)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        role,
        hasPermission,
        isAdmin,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within MultiAgentAuthProvider')
  }
  return context
}
```

## 4. Componentes com Verificação de Permissões

### 4.1. Protected Component
```typescript
// components/auth/protected.tsx
"use client"

import { useAuth } from '@/contexts/multi-agent-auth-context'
import { ReactNode } from 'react'

interface ProtectedProps {
  children: ReactNode
  permission?: string
  role?: string[]
  fallback?: ReactNode
}

export function Protected({ 
  children, 
  permission, 
  role, 
  fallback = null 
}: ProtectedProps) {
  const { hasPermission, role: userRole } = useAuth()
  
  // Check permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>
  }
  
  // Check role
  if (role && !role.includes(userRole)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Usage example:
// <Protected permission="manage_users">
//   <AdminPanel />
// </Protected>
```

### 4.2. Role-Based Navigation
```typescript
// components/navigation/role-nav.tsx
"use client"

import { useAuth } from '@/contexts/multi-agent-auth-context'
import Link from 'next/link'

export function RoleBasedNav() {
  const { role, isAdmin } = useAuth()
  
  return (
    <nav>
      <Link href="/">Home</Link>
      
      {role !== 'guest' && (
        <Link href="/dashboard">Dashboard</Link>
      )}
      
      {isAdmin() && (
        <>
          <Link href="/admin">Admin Panel</Link>
          <Link href="/admin/users">Manage Users</Link>
        </>
      )}
      
      {role === 'super_admin' && (
        <Link href="/admin/system">System Settings</Link>
      )}
    </nav>
  )
}
```

## 5. Server Actions com Verificação

### 5.1. Admin Server Actions
```typescript
// app/actions/admin.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    throw new Error('Forbidden')
  }
  
  return { user, profile }
}

export async function deleteUser(userId: string) {
  await verifyAdmin()
  
  const supabase = await createClient()
  const { error } = await supabase.auth.admin.deleteUser(userId)
  
  if (error) throw error
  
  revalidatePath('/admin/users')
}

export async function updateUserRole(userId: string, newRole: string) {
  const { profile } = await verifyAdmin()
  
  // Only super_admin can change roles
  if (profile.role !== 'super_admin') {
    throw new Error('Only super admins can change user roles')
  }
  
  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)
  
  if (error) throw error
  
  revalidatePath('/admin/users')
}
```

## 6. Parallel Routes para Modais

### 6.1. Estrutura com Modais
```
app/
├── @auth/                     # Parallel route para modais de auth
│   ├── (.)login/
│   │   └── page.tsx          # Modal de login
│   ├── (.)cadastro/
│   │   └── page.tsx          # Modal de cadastro
│   └── default.tsx           # Return null
├── login/
│   └── page.tsx              # Página completa de login
└── layout.tsx                # Layout principal
```

### 6.2. Layout com Parallel Routes
```typescript
// app/layout.tsx
export default function RootLayout({
  children,
  auth,
}: {
  children: React.ReactNode
  auth: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        {auth}
      </body>
    </html>
  )
}
```

## 7. Intercepting Routes para Admin

### 7.1. Quick Actions Modal
```typescript
// app/@admin/(.)quick-action/page.tsx
import { Modal } from '@/components/ui/modal'
import { QuickActions } from '@/components/admin/quick-actions'

export default function QuickActionModal() {
  return (
    <Modal>
      <QuickActions />
    </Modal>
  )
}
```

## 8. Database Schema para Roles

### 8.1. SQL Schema
```sql
-- Enum for roles
CREATE TYPE user_role AS ENUM ('guest', 'user', 'admin', 'super_admin');

-- Update profiles table
ALTER TABLE profiles 
ADD COLUMN role user_role DEFAULT 'user',
ADD COLUMN permissions text[] DEFAULT '{}';

-- Create permissions table
CREATE TABLE permissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create role_permissions junction table
CREATE TABLE role_permissions (
  role user_role NOT NULL,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role, permission_id)
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );
```

## 9. Testing Multi-Agent Auth

### 9.1. Test Page
```typescript
// app/test-multi-agent/page.tsx
"use client"

import { useAuth } from '@/contexts/multi-agent-auth-context'
import { Card } from '@/components/ui/card'

export default function TestMultiAgent() {
  const { user, role, hasPermission, isAdmin } = useAuth()
  
  const testPermissions = [
    'view_public',
    'view_user_content',
    'edit_own_profile',
    'manage_users',
    'manage_content',
  ]
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Multi-Agent Auth Test</h1>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Current User</h2>
        <div className="space-y-2">
          <p>Email: {user?.email || 'Not logged in'}</p>
          <p>Role: <span className="font-bold">{role}</span></p>
          <p>Is Admin: {isAdmin() ? 'Yes' : 'No'}</p>
        </div>
      </Card>
      
      <Card className="p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Permissions</h2>
        <div className="space-y-2">
          {testPermissions.map(perm => (
            <div key={perm} className="flex items-center gap-2">
              <span className={hasPermission(perm) ? 'text-green-600' : 'text-red-600'}>
                {hasPermission(perm) ? '✓' : '✗'}
              </span>
              <span>{perm}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
```

## 10. Best Practices

### 10.1. Segurança
1. **Sempre verificar no servidor** - Nunca confie apenas em verificações client-side
2. **Use RLS no Supabase** - Adicione políticas de segurança no banco
3. **Princípio do menor privilégio** - Dê apenas as permissões necessárias
4. **Audit logs** - Registre ações administrativas

### 10.2. Performance
1. **Cache de permissões** - Evite verificações repetidas
2. **Lazy loading** - Carregue componentes admin apenas quando necessário
3. **Static generation** - Use ISR para páginas que não mudam frequentemente

### 10.3. UX
1. **Loading states claros** - Sempre mostre feedback durante verificações
2. **Mensagens de erro úteis** - Explique por que o acesso foi negado
3. **Redirecionamentos inteligentes** - Leve o usuário ao lugar certo após login

## 11. Exemplo Completo: Admin Dashboard

```typescript
// app/(admin)/painel/page.tsx
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminStats } from '@/components/admin/stats'
import { RecentActivity } from '@/components/admin/activity'
import { QuickActions } from '@/components/admin/quick-actions'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  
  // Get admin stats
  const [
    { count: totalUsers },
    { count: totalPosts },
    { count: pendingComments }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('comments').select('*', { count: 'exact', head: true }).eq('approved', false)
  ])
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <AdminStats 
        totalUsers={totalUsers || 0}
        totalPosts={totalPosts || 0}
        pendingComments={pendingComments || 0}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div>Loading activity...</div>}>
          <RecentActivity />
        </Suspense>
        
        <QuickActions />
      </div>
    </div>
  )
}
```

## Conclusão

Este sistema de autenticação multi-agente fornece:
- 🔒 Segurança robusta com verificações em múltiplas camadas
- 🚀 Performance otimizada com Server Components
- 🎯 Controle granular de permissões
- 📱 UX consistente em todos os dispositivos
- 🔧 Fácil manutenção e extensibilidade

Para implementar, comece com o middleware e layouts, depois adicione o Context API e componentes conforme necessário.

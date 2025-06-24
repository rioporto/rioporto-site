# 🚀 Guia de Configuração Supabase - RIO PORTO P2P

## 📋 Índice
1. [Criar Conta e Projeto](#1-criar-conta-e-projeto)
2. [Configurar Tabelas](#2-configurar-tabelas)
3. [Configurar Autenticação](#3-configurar-autenticação)
4. [Políticas de Segurança (RLS)](#4-políticas-de-segurança-rls)
5. [Configurar no Next.js](#5-configurar-no-nextjs)
6. [Migrar Código](#6-migrar-código)

---

## 1. Criar Conta e Projeto

### Passo 1: Acessar Supabase
1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub (recomendado) ou email

### Passo 2: Criar Novo Projeto
1. Clique em "New project"
2. Preencha:
   - **Project name**: `rioporto-p2p`
   - **Database Password**: (gere uma senha forte e GUARDE!)
   - **Region**: `South America (São Paulo)` para menor latência
   - **Pricing Plan**: `Free` (início)
3. Clique em "Create new project"
4. Aguarde a criação (pode levar 2-3 minutos)

### Passo 3: Anotar Credenciais
No dashboard do projeto, vá em **Settings > API** e anote:
- **Project URL**: `https://xxxxx.supabase.co`
- **Anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Service role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (MANTER SECRETO!)

---

## 2. Configurar Tabelas

### Passo 1: Acessar SQL Editor
1. No menu lateral, clique em **SQL Editor**
2. Clique em **New query**

### Passo 2: Criar Tabela de Perfis
Cole e execute este SQL:

```sql
-- Criar enum para status KYC
CREATE TYPE kyc_status AS ENUM ('pending', 'approved', 'rejected');

-- Criar enum para níveis de usuário
CREATE TYPE user_level AS ENUM ('1', '2', '3');

-- Criar tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  level user_level DEFAULT '1',
  kyc_status kyc_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Criar função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para novos usuários
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Passo 3: Criar Tabela de Transações
Execute este SQL:

```sql
-- Criar enum para tipo de transação
CREATE TYPE transaction_type AS ENUM ('buy', 'sell');

-- Criar enum para status da transação
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'cancelled');

-- Criar tabela de transações
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type transaction_type NOT NULL,
  crypto_currency TEXT NOT NULL,
  crypto_amount DECIMAL(20, 8) NOT NULL,
  brl_amount DECIMAL(15, 2) NOT NULL,
  exchange_rate DECIMAL(15, 2) NOT NULL,
  commission_rate DECIMAL(5, 4) NOT NULL,
  commission_amount DECIMAL(15, 2) NOT NULL,
  wallet_address TEXT,
  status transaction_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Criar índices para performance
CREATE INDEX transactions_user_id_idx ON transactions(user_id);
CREATE INDEX transactions_status_idx ON transactions(status);
CREATE INDEX transactions_created_at_idx ON transactions(created_at DESC);
```

### Passo 4: Criar Tabela de Documentos KYC
Execute este SQL:

```sql
-- Criar enum para tipo de documento
CREATE TYPE document_type AS ENUM ('rg', 'cnh', 'passport', 'proof_of_residence', 'selfie');

-- Criar tabela de documentos KYC
CREATE TABLE kyc_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  document_type document_type NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice
CREATE INDEX kyc_documents_user_id_idx ON kyc_documents(user_id);
```

---

## 3. Configurar Autenticação

### Passo 1: Configurar Providers
1. Vá em **Authentication > Providers**
2. Mantenha **Email** habilitado
3. Configure:
   - **Confirm email**: Desabilitado (por enquanto)
   - **Secure email change**: Habilitado
   - **Secure password change**: Habilitado

### Passo 2: Configurar Templates de Email
1. Vá em **Authentication > Email Templates**
2. Personalize os templates em português

### Passo 3: Configurar URL de Redirecionamento
1. Vá em **Authentication > URL Configuration**
2. Adicione:
   - Site URL: `http://localhost:3000` (desenvolvimento)
   - Redirect URLs: 
     - `http://localhost:3000/*`
     - `https://rioporto.com/*` (quando em produção)

---

## 4. Políticas de Segurança (RLS)

### Passo 1: Habilitar RLS
Execute este SQL:

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
```

### Passo 2: Criar Políticas para Profiles
Execute este SQL:

```sql
-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Permitir que o sistema crie perfis
CREATE POLICY "Enable insert for authentication" ON profiles
  FOR INSERT WITH CHECK (true);
```

### Passo 3: Criar Políticas para Transactions
Execute este SQL:

```sql
-- Usuários podem ver suas próprias transações
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem criar suas próprias transações
CREATE POLICY "Users can create own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Apenas admins podem atualizar transações
-- (Implementar função is_admin() quando necessário)
```

### Passo 4: Criar Políticas para KYC Documents
Execute este SQL:

```sql
-- Usuários podem ver seus próprios documentos
CREATE POLICY "Users can view own documents" ON kyc_documents
  FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem fazer upload de seus documentos
CREATE POLICY "Users can upload own documents" ON kyc_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## 5. Configurar no Next.js

### Passo 1: Instalar Dependências
No terminal, execute:

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### Passo 2: Criar Arquivo .env.local
Crie o arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Passo 3: Criar Cliente Supabase
Crie o arquivo `/lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Passo 4: Criar Cliente Servidor
Crie o arquivo `/lib/supabase/server.ts`:

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
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

### Passo 5: Criar Tipos TypeScript
Crie o arquivo `/types/supabase.ts`:

```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          level: '1' | '2' | '3'
          kyc_status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          phone?: string | null
          level?: '1' | '2' | '3'
          kyc_status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          phone?: string | null
          level?: '1' | '2' | '3'
          kyc_status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string | null
          type: 'buy' | 'sell'
          crypto_currency: string
          crypto_amount: number
          brl_amount: number
          exchange_rate: number
          commission_rate: number
          commission_amount: number
          wallet_address: string | null
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          type: 'buy' | 'sell'
          crypto_currency: string
          crypto_amount: number
          brl_amount: number
          exchange_rate: number
          commission_rate: number
          commission_amount: number
          wallet_address?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: 'buy' | 'sell'
          crypto_currency?: string
          crypto_amount?: number
          brl_amount?: number
          exchange_rate?: number
          commission_rate?: number
          commission_amount?: number
          wallet_address?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
```

---

## 6. Migrar Código

### Passo 1: Atualizar Auth Context
Atualize `/contexts/auth-context.tsx` para usar Supabase:

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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
      throw error
    }

    toast.success('Login realizado com sucesso!')
    router.push('/dashboard')
  }

  const signUp = async (
    email: string,
    password: string,
    name?: string,
    phone?: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // Metadados do usuário
      },
    })

    if (error) {
      toast.error(error.message)
      throw error
    }

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

    toast.success('Conta criada com sucesso!')
    router.push('/dashboard')
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Erro ao fazer logout')
      return
    }

    setUser(null)
    setProfile(null)
    toast.success('Logout realizado com sucesso!')
    router.push('/')
  }

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id)

    if (error) {
      toast.error('Erro ao atualizar perfil')
      throw error
    }

    await loadProfile(user.id)
    toast.success('Perfil atualizado com sucesso!')
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

### Passo 2: Remover APIs Mock
1. Delete `/app/api/auth/login/route.ts`
2. Delete `/app/api/auth/register/route.ts`

### Passo 3: Atualizar Middleware
Atualize `/middleware.ts` para verificar sessão:

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

  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

## 🎯 Checklist de Implementação

- [ ] Criar conta no Supabase
- [ ] Criar projeto
- [ ] Anotar credenciais
- [ ] Executar SQLs das tabelas
- [ ] Configurar autenticação
- [ ] Configurar RLS
- [ ] Instalar dependências
- [ ] Criar arquivo .env.local
- [ ] Criar clientes Supabase
- [ ] Criar tipos TypeScript
- [ ] Migrar auth-context.tsx
- [ ] Remover APIs mock
- [ ] Atualizar middleware
- [ ] Testar login/cadastro
- [ ] Testar dashboard

---

## 🚨 Notas Importantes

1. **Segurança**: NUNCA exponha a `SUPABASE_SERVICE_ROLE_KEY` no frontend
2. **RLS**: Sempre teste as políticas de segurança
3. **Tipos**: Use os tipos TypeScript para type safety
4. **Desenvolvimento**: Use o dashboard do Supabase para debug
5. **Produção**: Configure domínio customizado e SSL

---

## 📞 Suporte

- Documentação: [https://supabase.com/docs](https://supabase.com/docs)
- Discord: [https://discord.supabase.com](https://discord.supabase.com)
- GitHub: [https://github.com/supabase/supabase](https://github.com/supabase/supabase)

---

## 🎉 Próximos Passos

Após configurar o Supabase:
1. Implementar upload de arquivos para KYC
2. Criar dashboard administrativo
3. Implementar notificações em tempo real
4. Adicionar autenticação 2FA
5. Configurar backups automáticos

Boa sorte com a implementação! 🚀
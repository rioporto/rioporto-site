# 🎯 Tipos TypeScript para Supabase no Next.js

## 📋 Gerando Tipos Automaticamente

### 1. Instalar Supabase CLI:
```bash
npm install -g supabase
```

### 2. Gerar tipos do seu projeto:
```bash
npx supabase gen types typescript --project-id "seu-project-id" > types/supabase.ts
```

## 📝 Estrutura de Tipos Recomendada

### `types/supabase.ts` (gerado automaticamente)
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
          created_at: string
          updated_at: string
          email: string | null
          name: string | null
          avatar_url: string | null
          bio: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email?: string | null
          name?: string | null
          avatar_url?: string | null
          bio?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string | null
          name?: string | null
          avatar_url?: string | null
          bio?: string | null
        }
      }
      // ... outras tabelas
    }
    Views: {
      // ... views
    }
    Functions: {
      // ... functions
    }
    Enums: {
      // ... enums
    }
  }
}
```

### `types/app.ts` (tipos customizados da aplicação)
```typescript
import { Database } from './supabase'

// Tipos base das tabelas
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// Tipos com relações
export interface UserProfile extends Profile {
  // Adicione campos customizados aqui se necessário
}

// Tipos para comentários SEM avatar_url
export interface BlogComment {
  id: string
  post_id: string
  user_id: string
  parent_id: string | null
  content: string
  approved: boolean
  created_at: string
  updated_at: string
  // Relação com usuário - APENAS campos que existem
  user?: {
    id: string
    name: string | null
    email: string | null
    // NÃO incluir avatar_url se não existe na tabela profiles
  }
  replies?: BlogComment[]
}

// Tipos para respostas da API
export interface ApiResponse<T> {
  data: T | null
  error: Error | null
}

// Tipos para formulários
export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData extends LoginFormData {
  name?: string
}
```

## 🔧 Usando Tipos com Supabase Client

### Cliente Tipado:
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

### Queries Tipadas:
```typescript
import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/types/app'

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  
  return data
}
```

## ⚠️ Problemas Comuns com Tipos

### 1. Propriedade não existe no tipo
**Problema:** Tentando acessar `avatar_url` em um tipo que não tem
```typescript
// ❌ ERRADO
<AvatarImage src={comment.user?.avatar_url || ""} />
```

**Solução:** Verificar o tipo real ou usar string vazia
```typescript
// ✅ CORRETO
<AvatarImage src="" /> // Se avatar_url não existe no banco
// ou
<AvatarImage src={profile?.avatar_url || ""} /> // Se existe
```

### 2. Tipos de Insert/Update
**Problema:** Confundir tipos Row com Insert/Update
```typescript
// ❌ ERRADO
const profile: Profile = {
  name: "João" // Erro: faltam campos obrigatórios
}
```

**Solução:** Usar o tipo correto
```typescript
// ✅ CORRETO
const profileUpdate: ProfileUpdate = {
  name: "João" // OK: apenas campos que você quer atualizar
}
```

### 3. Relações não tipadas
**Problema:** Joins retornam any
```typescript
// ❌ Sem tipos
const { data } = await supabase
  .from('comments')
  .select('*, user:profiles(*)')
```

**Solução:** Criar tipo específico
```typescript
// ✅ Com tipos
interface CommentWithUser {
  id: string
  content: string
  user: Profile
}

const { data } = await supabase
  .from('comments')
  .select('*, user:profiles(*)')
  .returns<CommentWithUser[]>()
```

## 📚 Helpers de Tipos Úteis

### 1. Tipo para tabelas com timestamps:
```typescript
interface Timestamps {
  created_at: string
  updated_at: string
}

export interface ProfileWithTimestamps extends Profile, Timestamps {}
```

### 2. Tipo para respostas paginadas:
```typescript
export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}
```

### 3. Tipo para erros customizados:
```typescript
export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'SupabaseError'
  }
}
```

## 🎯 Boas Práticas

1. **Sempre gere tipos após mudanças no banco**
2. **Use tipos específicos, não `any`**
3. **Crie interfaces para relações complexas**
4. **Valide dados antes de tipar**
5. **Use type guards quando necessário**

### Type Guard exemplo:
```typescript
function isProfile(obj: any): obj is Profile {
  return obj && typeof obj.id === 'string' && typeof obj.email === 'string'
}

// Uso
if (isProfile(data)) {
  // TypeScript sabe que data é Profile aqui
}
```

## 🔍 Script para Atualizar Tipos

### `package.json`:
```json
{
  "scripts": {
    "types:generate": "supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > types/supabase.ts",
    "types:check": "tsc --noEmit"
  }
}
```

---

**Última atualização:** 24/06/2025
**Versão:** 1.0.0

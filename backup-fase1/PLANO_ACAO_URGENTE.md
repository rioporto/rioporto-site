# 🆘 PLANO DE AÇÃO - RESOLVER LOADING INFINITO

## Opção 1: Correção Rápida (Recomendada)

```typescript
// Em contexts/auth-context.tsx
// Comente TODA a função loadProfile:

// const loadProfile = async (userId: string) => {
//   ...
// }

// E onde ela é chamada:
// await loadProfile(session.user.id) 

// Deixe profile sempre como null por enquanto
```

## Opção 2: Criar Admin Sem AuthContext

1. Crie `/app/admin-simple/page.tsx`:
```typescript
"use client"
import { createClient } from "@/lib/supabase/client"

export default function AdminSimple() {
  // Faça auth direto aqui, sem usar context
  const supabase = createClient()
  // ... resto do código
}
```

2. Não use o layout (platform)
3. Gerencie auth localmente

## Opção 3: Debug Profundo

1. No Supabase Dashboard:
   - Verifique se existe tabela `profiles`
   - Verifique políticas RLS
   - Veja se há registros para o usuário

2. Adicione logs em auth-context.tsx:
```typescript
console.log('Iniciando loadProfile...')
console.log('Query:', query)
console.log('Resultado:', data)
console.log('Erro:', error)
```

## 🎯 Objetivo

Fazer `/admin/comments` funcionar HOJE, mesmo que temporariamente sem o sistema de perfis.

---

**ESCOLHA UMA OPÇÃO E EXECUTE!**

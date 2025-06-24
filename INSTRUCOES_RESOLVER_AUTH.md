# 🚨 INSTRUÇÕES PARA RESOLVER BUGS DE AUTH - PRÓXIMO DEV

## Contexto
O sistema de autenticação está com 2 bugs críticos que não consegui resolver completamente:
1. Botão "Sair" não desloga o usuário
2. Dashboard fica em loading infinito após sair e tentar voltar

## Passos para Debugar

### 1. Use a Página de Debug
```
http://localhost:3000/debug
```
- Compare estado do Context vs Sessão direta do Supabase
- Use "Forçar Logout" se necessário

### 2. Verifique no Console do Navegador
```javascript
// Ver cookies do Supabase
document.cookie

// Ver localStorage
localStorage.getItem('supabase.auth.token')

// Testar logout direto
const { createClient } = await import('@/lib/supabase/client')
const supabase = createClient()
await supabase.auth.signOut()
```

### 3. Possíveis Soluções a Testar

#### Opção A: Problema de Cookies
```typescript
// No auth-context.tsx, adicionar:
const signOut = async () => {
  // Limpar todos os cookies manualmente
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  
  // Resto do código...
}
```

#### Opção B: Problema de Cache do Next.js
```typescript
// No platform layout, adicionar:
export const dynamic = 'force-dynamic'
export const revalidate = 0
```

#### Opção C: Refazer com Server Components
- Migrar auth-context para Server Components
- Usar cookies() do Next.js
- Implementar Server Actions

### 4. Verificar Configurações Supabase

No dashboard do Supabase:
1. Settings > Auth > Cookies
2. Verificar domínio e configurações
3. Testar com/sem "Secure cookies"

### 5. Alternativa: Implementar do Zero

Se nada funcionar, considere:
1. Remover auth-context atual
2. Usar exemplo oficial: https://github.com/supabase/auth-helpers
3. Implementar com Server Components + Server Actions

## Arquivos Relevantes

- `/contexts/auth-context.tsx` - Lógica principal
- `/app/(platform)/layout.tsx` - Proteção de rotas
- `/middleware.ts` - Atualização de sessão
- `/app/debug/page.tsx` - Ferramenta de debug

## Logs de Tentativas

1. ✅ Criada instância única do Supabase
2. ✅ Adicionado flag mounted
3. ✅ Simplificado middleware
4. ✅ Criada página de debug
5. ❌ Problema persiste

## Contato para Dúvidas

Se precisar de contexto adicional sobre o projeto:
- Ver `RIOPORTO_CLAUDE_RULES.md`
- Todo histórico está documentado

---

Boa sorte! 🍀
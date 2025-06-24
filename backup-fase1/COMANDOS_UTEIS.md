# 🚀 COMANDOS ÚTEIS - RIO PORTO P2P

## 📋 Desenvolvimento Local

### Iniciar desenvolvimento:
```bash
npm run dev
# ou
npm run clean:dev  # limpa cache e inicia
```

### Verificar tipos TypeScript:
```bash
npm run type-check
```

### Build local para teste:
```bash
npm run build
# ou
rm -rf .next && npm run build  # com limpeza de cache
```

## 🔧 Manutenção

### Gerar tipos do Supabase:
```bash
# Substitua YOUR_PROJECT_ID pelo ID real do projeto
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
```

### Limpar caches:
```bash
rm -rf .next node_modules/.cache
```

### Reinstalar dependências:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📤 Deploy

### Git push rápido:
```bash
git add .
git commit -m "sua mensagem"
git push
```

### Deploy com teste:
```bash
# Testa build localmente primeiro
npm run build && git add . && git commit -m "deploy: descrição" && git push
```

## 🗄️ Banco de Dados

### Acessar Supabase Dashboard:
1. https://app.supabase.com
2. Selecione seu projeto
3. Use o SQL Editor para queries

### Queries úteis:
```sql
-- Ver todos os usuários
SELECT * FROM auth.users;

-- Ver perfis
SELECT * FROM profiles;

-- Ver comentários pendentes
SELECT * FROM comments WHERE approved = false;

-- Contar transações por usuário
SELECT user_id, COUNT(*) as total 
FROM transactions 
GROUP BY user_id 
ORDER BY total DESC;
```

## 🔒 Segurança

### Verificar RLS em tabelas:
```sql
-- Ver status de RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Ver políticas de uma tabela
SELECT * FROM pg_policies 
WHERE tablename = 'sua_tabela';
```

### Testar como usuário específico:
```sql
-- Definir usuário para teste
SET request.jwt.claim.sub = 'uuid-do-usuario';
SET ROLE authenticated;

-- Fazer queries
SELECT * FROM profiles;

-- Voltar ao admin
SET ROLE postgres;
```

## 🐛 Debug

### Logs do Vercel:
```bash
vercel logs
# ou acesse: https://vercel.com/rioporto/rioporto-site/logs
```

### Inspecionar build do Vercel:
```bash
vercel build --debug
```

### Variáveis de ambiente locais:
```bash
# Criar .env.local com:
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
```

## 📚 Documentação

### Ordem de leitura recomendada:
1. `/docs/supabase-ssr-patterns/01-padrao-completo-supabase-ssr.md`
2. `/docs/supabase-ssr-patterns/02-tipos-typescript-supabase.md`
3. `/docs/supabase-ssr-patterns/03-rls-politicas-seguranca.md`

### Referências externas:
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

## ⚡ Atalhos VSCode

### Extensões recomendadas:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma (para sintaxe SQL)
- GitLens

### Snippets úteis:
```json
// .vscode/snippets.code-snippets
{
  "Supabase Server Client": {
    "prefix": "supaserver",
    "body": [
      "import { createClient } from '@/lib/supabase/server'",
      "",
      "const supabase = await createClient()",
      "const { data: { user } } = await supabase.auth.getUser()",
      "",
      "if (!user) {",
      "  redirect('/login')",
      "}"
    ]
  },
  "Supabase Client Component": {
    "prefix": "supaclient",
    "body": [
      "'use client'",
      "",
      "import { createClient } from '@/lib/supabase/client'",
      "import { useEffect, useState } from 'react'",
      "",
      "export default function Component() {",
      "  const [user, setUser] = useState(null)",
      "  const supabase = createClient()",
      "",
      "  useEffect(() => {",
      "    supabase.auth.getUser().then(({ data: { user } }) => {",
      "      setUser(user)",
      "    })",
      "  }, [])",
      "",
      "  return <div>{user ? user.email : 'Not authenticated'}</div>",
      "}"
    ]
  }
}
```

---

**Última atualização:** 24/06/2025
**Boa sorte com o desenvolvimento!** 🚀

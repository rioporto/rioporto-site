# 🐛 Debug do Sistema de Comentários

## Passos para debugar o erro:

### 1. Execute o SQL no Supabase:
```sql
-- Arquivo: fix_rls_policies.sql
```

### 2. Teste via Console do Browser:

```javascript
// Teste 1: Verificar se a API de teste funciona
fetch('/api/comments/test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    post_slug: 'teste',
    content: 'Teste debug',
    author_name: 'Debug User',
    author_email: 'debug@test.com'
  })
}).then(r => r.json()).then(console.log)

// Teste 2: Tentar comentário normal
fetch('/api/comments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    post_slug: 'bitcoin-para-iniciantes',
    content: 'Teste de comentário',
    author_name: 'Teste Nome',
    author_email: 'teste@email.com',
    parent_id: null
  })
}).then(r => r.json()).then(console.log)
```

### 3. Possíveis causas do erro:

1. **RLS (Row Level Security)** - Política não permite INSERT anônimo
2. **Colunas faltando** - Alguma coluna obrigatória não está sendo preenchida
3. **Trigger com erro** - O trigger de contadores pode estar falhando
4. **Constraint violation** - Alguma validação no banco está falhando

### 4. Solução temporária (desabilitar RLS):

```sql
-- CUIDADO: Só para teste!
ALTER TABLE blog_comments DISABLE ROW LEVEL SECURITY;

-- Depois de testar, reabilitar:
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
```

### 5. Verificar logs do Supabase:

1. Acesse: https://app.supabase.com/project/ncxilaqbmlituutruqqs
2. Vá em: Settings → Logs → API logs
3. Filtre por erros recentes

## Deploy das correções:

```bash
npm run type-check
npm run build
git add -A
git commit -m "fix: adiciona debug para erro de comentários anônimos"
git push origin main
```
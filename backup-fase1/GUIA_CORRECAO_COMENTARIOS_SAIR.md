# 🔧 GUIA DE CORREÇÃO - Comentários e Botão Sair

## 📋 Resumo dos Problemas e Soluções

### 1. **Erro nos Comentários do Blog**
- **Problema**: O sistema esperava um campo `full_name` que não existe na tabela `profiles`
- **Solução**: Ajustamos o código para usar o campo `name` existente

### 2. **Botão SAIR não funcionando**
- **Problema**: Duplicação de lógica entre header e auth-context
- **Solução**: Simplificamos para usar apenas a função do contexto

## 🚀 Passos para Aplicar as Correções

### Passo 1: Executar Script SQL no Supabase

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **SQL Editor**
4. Clique em **New Query**
5. Copie e cole o conteúdo do arquivo: `supabase_fix_comments_simple.sql`
6. Clique em **Run**

### Passo 2: Verificar o Código (Já Atualizado)

Os seguintes arquivos foram atualizados:
- ✅ `/components/blog/comments.tsx` - Usando campo `name` em vez de `full_name`
- ✅ `/lib/blog/api.ts` - API ajustada para buscar campo correto
- ✅ `/types/blog.ts` - Tipos atualizados
- ✅ `/components/layout/header.tsx` - Simplificado para usar contexto

### Passo 3: Testar as Correções

#### Teste de Comentários:
1. Faça login no site
2. Acesse qualquer artigo do blog
3. Verifique se seu perfil tem nome preenchido (aparecerá um alerta se não tiver)
4. Digite um comentário e clique em "Enviar Comentário"
5. Deve aparecer mensagem de sucesso

#### Teste do Botão Sair:
1. Faça login no site
2. Clique no menu do usuário (canto superior direito)
3. Clique em "Sair"
4. Deve aparecer "Saindo..." e depois redirecionar para home

### Passo 4: Verificações no Supabase

Execute estas queries no SQL Editor para diagnóstico:

```sql
-- Ver usuários sem nome
SELECT id, email, name, phone 
FROM profiles 
WHERE name IS NULL OR name = '';

-- Ver comentários pendentes
SELECT c.*, p.name as user_name 
FROM comments c
JOIN profiles p ON c.user_id = p.id
WHERE c.approved = false 
ORDER BY c.created_at DESC;

-- Aprovar um comentário específico
UPDATE comments 
SET approved = true 
WHERE id = 'ID_DO_COMENTARIO';
```

## 🐛 Troubleshooting

### Se os comentários ainda não funcionarem:

1. **Verifique o perfil do usuário**:
   - Vá para `/perfil` ou `/dashboard`
   - Certifique-se de que o campo "Nome" está preenchido
   - Salve as alterações

2. **Limpe o cache do navegador**:
   - Pressione Ctrl+Shift+Delete
   - Ou use modo anônimo/incógnito

3. **Verifique o console do navegador** (F12):
   - Procure por erros vermelhos
   - Especialmente erros de "permission denied"

### Se o botão Sair ainda não funcionar:

1. **Force o logout manualmente**:
   ```javascript
   // No console do navegador (F12)
   localStorage.clear()
   sessionStorage.clear()
   location.reload()
   ```

2. **Verifique se há erros no console** quando clica em Sair

## ✅ Checklist Final

- [ ] Script SQL executado no Supabase
- [ ] Perfil do usuário tem nome preenchido
- [ ] Consegue enviar comentários
- [ ] Botão Sair funciona corretamente
- [ ] Não há erros no console do navegador

## 📝 Notas Importantes

1. **Moderação de Comentários**: Todos os comentários começam como `approved = false` e precisam ser aprovados manualmente no banco de dados

2. **Cache**: Se houver problemas persistentes, sempre tente limpar o cache do navegador primeiro

3. **Perfil Completo**: O sistema exige que o usuário tenha um nome no perfil para poder comentar

---

**Após aplicar todas as correções, reinicie o servidor de desenvolvimento:**

```bash
npm run dev
```

Se ainda houver problemas, verifique os logs do Supabase em:
Dashboard > Logs > API Logs

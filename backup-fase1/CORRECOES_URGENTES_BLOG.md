# 🔧 CORREÇÕES URGENTES - BLOG RIO PORTO

## 1. **Executar Script SQL no Supabase**

### Passo 1: Acesse o Supabase
1. Entre em: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá para **SQL Editor**

### Passo 2: Execute o Script de Correção
1. Clique em "New Query"
2. Copie TODO o conteúdo do arquivo: `supabase_fix_comments_policies.sql`
3. Cole no editor
4. Clique em "Run"

## 2. **Testar Comentários**

### Teste 1: Verificar Perfil
1. Faça login no site
2. Vá para `/perfil` ou `/dashboard`
3. Verifique se tem nome completo preenchido
4. Se não tiver, preencha e salve

### Teste 2: Enviar Comentário
1. Acesse qualquer artigo
2. Role até a seção de comentários
3. Digite um comentário
4. Clique em "Enviar Comentário"
5. Deve aparecer mensagem de sucesso

### Teste 3: Verificar no Supabase
```sql
-- Ver comentários pendentes
SELECT * FROM comments WHERE approved = false ORDER BY created_at DESC;

-- Aprovar um comentário
UPDATE comments SET approved = true WHERE id = 'ID_DO_COMENTARIO';
```

## 3. **Testar Botão Sair**

1. Faça login no site
2. Clique no menu do usuário (canto superior direito)
3. Clique em "Sair"
4. Deve aparecer "Saindo..." e depois redirecionar para home

## 4. **Debug do Edge Browser**

Se o Edge continuar com problemas:

1. Acesse: `http://localhost:3000/debug-blog`
2. Veja qual teste falha
3. Abra o Console (F12) e procure por erros
4. Tente limpar cache: Ctrl+Shift+Delete

## 5. **Verificações no Supabase**

Execute estas queries para diagnóstico:

```sql
-- Ver usuários sem nome completo
SELECT id, email, name, full_name 
FROM profiles 
WHERE full_name IS NULL OR full_name = '';

-- Ver políticas de comentários
SELECT policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'comments';

-- Testar inserção manual
INSERT INTO comments (post_id, user_id, content, approved)
VALUES (
  (SELECT id FROM blog_posts LIMIT 1),
  auth.uid(),
  'Teste manual',
  false
);
```

## 📌 **Problemas Comuns e Soluções**

### "Erro ao enviar comentário"
- **Causa**: Perfil sem `full_name` ou políticas RLS
- **Solução**: Execute o script SQL e complete o perfil

### "Botão Sair não funciona"
- **Causa**: Cache do navegador ou estado travado
- **Solução**: Limpar localStorage/cookies ou usar modo anônimo

### "Edge não carrega artigos"
- **Causa**: Incompatibilidade com promises ou fetch
- **Solução**: Atualizar Edge ou usar outro navegador

## 🚨 **Se Nada Funcionar**

1. **Resetar Auth Completo**:
```javascript
// No console do navegador (F12)
localStorage.clear()
sessionStorage.clear()
location.reload()
```

2. **Verificar Logs do Supabase**:
- Dashboard > Logs > Auth Logs
- Procurar por erros de autenticação

3. **Modo Debug**:
- Adicione `?debug=true` na URL
- Ex: `http://localhost:3000/blog?debug=true`

---

**Após executar todas as correções, teste novamente e me avise os resultados!**

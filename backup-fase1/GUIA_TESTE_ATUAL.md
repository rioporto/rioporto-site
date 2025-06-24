# 🔧 GUIA DE TESTE - Comentários e Logout

## 📋 Status Atual

1. **Perfil está completo** ✅
2. **Políticas RLS configuradas** ✅
3. **Código atualizado** ✅

## 🧪 Testes para Fazer Agora

### 1. **Teste de Comentários**

Acesse a página de teste:
```
http://localhost:3000/test-comment
```

1. **Clique em "Verificar Permissões"**
   - Deve mostrar seus dados e se tem permissão

2. **Clique em "Testar Inserção Direta"**
   - Se funcionar, o problema está no componente
   - Se falhar, mostrará o erro específico

### 2. **Teste Manual de Comentário no Supabase**

Execute no SQL Editor:

```sql
-- Verificar seu user_id
SELECT auth.uid();

-- Tentar inserir comentário manualmente
INSERT INTO comments (post_id, user_id, content, approved)
VALUES (
  (SELECT id FROM blog_posts LIMIT 1),
  auth.uid(),
  'Teste manual do SQL Editor',
  false
);

-- Ver se foi inserido
SELECT * FROM comments WHERE user_id = auth.uid() ORDER BY created_at DESC;
```

### 3. **Teste do Botão SAIR**

**Opção A - Limpar Tudo Manualmente:**
```javascript
// No console (F12), execute:
localStorage.clear();
sessionStorage.clear();
window.location.href = '/';
```

**Opção B - Usar a Página de Debug:**
```
http://localhost:3000/debug-auth
```
Clique em "Limpar TODO Storage"

## 🔍 Diagnóstico

### Se o comentário não funciona:
1. Verifique o erro exato em `/test-comment`
2. Veja o console do navegador (F12) para erros
3. Teste o SQL manual acima

### Se o logout não funciona:
1. Use o método manual (localStorage.clear())
2. Verifique se há erros no console
3. Tente em uma aba anônima/privada

## 💡 Soluções Rápidas

### Para Comentários:
```sql
-- Verificar se existe a política de INSERT
SELECT * FROM pg_policies 
WHERE tablename = 'comments' 
AND cmd = 'INSERT';

-- Se não existir, criar novamente:
CREATE POLICY "Inserir comentários simples" ON comments
FOR INSERT
TO authenticated
WITH CHECK (true);
```

### Para Logout:
```javascript
// Função de logout forçado
function forceLogout() {
  // Limpar tudo
  localStorage.clear();
  sessionStorage.clear();
  document.cookie.split(";").forEach(c => {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  // Redirecionar
  window.location.href = '/';
}

// Executar
forceLogout();
```

## 📱 URLs de Teste

- **Teste de Comentário:** `/test-comment`
- **Debug de Auth:** `/debug-auth`
- **Perfil:** `/perfil`
- **Artigo para testar:** `/blog/o-que-e-bitcoin-guia-completo-iniciantes`

## 🚨 Se Nada Funcionar

1. **Pare o servidor** (Ctrl+C)
2. **Limpe o cache do Next.js:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **No Supabase, recrie as políticas:**
   ```sql
   -- Dropar todas as políticas
   DROP POLICY IF EXISTS "Ver comentários aprovados" ON comments;
   DROP POLICY IF EXISTS "Criar comentários" ON comments;
   DROP POLICY IF EXISTS "Ver próprios comentários" ON comments;
   DROP POLICY IF EXISTS "Atualizar próprios comentários" ON comments;
   DROP POLICY IF EXISTS "Deletar próprios comentários" ON comments;
   
   -- Criar política super permissiva para teste
   CREATE POLICY "Permitir tudo para autenticados" ON comments
   FOR ALL
   TO authenticated
   USING (true)
   WITH CHECK (true);
   ```

---

**Compartilhe os resultados dos testes acima para análise!**

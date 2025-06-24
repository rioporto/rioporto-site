# 🚨 SOLUÇÕES PARA O PROBLEMA DO LOGOUT

## 🔧 Opções Disponíveis

### 1. **Logout de Emergência** (RECOMENDADO)
Acesse: `http://localhost:3000/emergency-logout`

Esta página oferece 3 métodos diferentes:
- Logout via API Route
- Logout via Página
- Força Bruta (limpa tudo manualmente)

### 2. **Logout Manual via Console**
Abra o console (F12) e execute:
```javascript
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "")
    .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
});
window.location.replace('/');
```

### 3. **URLs de Logout Diretas**
- API Route: `http://localhost:3000/api/logout`
- Página de Logout: `http://localhost:3000/logout`

## 📋 Para Aprovar Comentários

Execute no Supabase SQL Editor:
```sql
-- Ver comentários pendentes com IDs
SELECT 
    c.id,
    c.content,
    c.created_at,
    p.name as author_name
FROM comments c
LEFT JOIN profiles p ON c.user_id = p.id
WHERE c.approved = false
ORDER BY c.created_at DESC;

-- Copie o ID do comentário e substitua abaixo
UPDATE comments SET approved = true WHERE id = 'COLE_O_ID_AQUI';
```

## 🔄 Arquivos Criados/Modificados

1. **Nova API Route** (`/api/logout/route.ts`)
   - Faz logout no servidor
   - Limpa cookies do servidor

2. **Página de Logout Melhorada** (`/logout/page.tsx`)
   - Limpeza mais agressiva
   - Fallback visual

3. **Página de Emergência** (`/emergency-logout/page.tsx`)
   - Múltiplas opções de logout
   - Instruções detalhadas

4. **Header Atualizado**
   - Usa API route em vez de página

## ⚡ Solução Rápida

Se nada funcionar, use a **Página de Emergência**:
```
http://localhost:3000/emergency-logout
```

E clique em **"Forçar Logout Completo"**

## 💡 Por que o logout pode falhar?

1. **Cache do navegador** - Limpe com Ctrl+Shift+Delete
2. **Cookies persistentes** - Use modo anônimo/privado
3. **Service Workers** - Desregistre em DevTools > Application
4. **Extensões do navegador** - Teste com extensões desativadas

---

**Use o arquivo `manage_comments.sql` para gerenciar comentários facilmente!**

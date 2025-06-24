# 🚨 SOLUÇÕES RÁPIDAS - Comentários e Logout

## 1. **Problema: Comentários não funcionam**

### Solução A - Script de Emergência:
Execute no Supabase SQL Editor:
```sql
-- arquivo: supabase_emergency_comments.sql
```
Este script cria políticas super permissivas para teste.

### Solução B - Teste Direto:
1. Acesse: `http://localhost:3000/test-comment`
2. Clique em "Verificar Permissões"
3. Clique em "Testar Inserção Direta"
4. Veja o erro específico

## 2. **Problema: Botão SAIR não funciona**

### Solução Imediata:
No console do navegador (F12), execute:
```javascript
localStorage.clear(); sessionStorage.clear(); location.href='/';
```

### Solução Alternativa:
1. Acesse: `http://localhost:3000/debug-auth`
2. Clique em "Limpar TODO Storage"

## 3. **Arquivos Modificados**

- ✅ `lib/blog/api.ts` - Corrigido join com profiles
- ✅ `contexts/auth-context.tsx` - Logout simplificado
- ✅ `components/layout/header.tsx` - Logout direto

## 4. **Comandos Úteis**

```bash
# Reiniciar servidor
Ctrl+C
rm -rf .next
npm run dev

# Limpar cache do navegador
Ctrl+Shift+Delete
```

## 5. **URLs de Teste**

- `/test-comment` - Testar comentários isoladamente
- `/debug-auth` - Debug de autenticação
- `/perfil` - Verificar dados do perfil

---

**Se ainda tiver problemas, execute o script de emergência e teste novamente!**

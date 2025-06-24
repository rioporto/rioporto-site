# ✅ URLS CORRETAS DO SISTEMA

## 🎯 Para acessar o Admin de Comentários:

### URL Correta:
```
http://localhost:3000/admin/comments
```

### Como chegar lá:

1. **Faça login** com o email admin:
   ```
   Email: johnnyhelder@gmail.com
   ```

2. **Opção A - Via Dashboard:**
   - Acesse: http://localhost:3000/dashboard
   - Clique no botão "Moderar Comentários"

3. **Opção B - Direto:**
   - Acesse: http://localhost:3000/admin/comments

## ❌ URLs que NÃO existem:
- ~~`/blog/admin/comments`~~ ❌
- ~~`/blog/admin`~~ ❌

## ✅ Todas as URLs do Sistema:

### Públicas:
- `/` - Home
- `/blog` - Lista de artigos
- `/blog/[slug]` - Artigo individual
- `/login` - Login
- `/cadastro` - Cadastro
- `/sobre` - Sobre
- `/servicos` - Serviços
- `/contato` - Contato
- `/cotacao` - Cotação P2P

### Autenticadas (precisa login):
- `/dashboard` - Painel do usuário
- `/perfil` - Editar perfil
- `/transacoes` - Histórico
- `/admin/comments` - **Moderar comentários (só admins)**

### Especiais:
- `/logout` - Fazer logout
- `/emergency-logout` - Logout de emergência
- `/debug-auth` - Debug de autenticação

## 🔐 Admins autorizados:
- `johnnyhelder@gmail.com`
- `admin@rioporto.com`

---

**Acesse: http://localhost:3000/admin/comments** ✅

Se der 404, verifique se:
1. Está logado
2. É um email admin
3. O servidor está rodando (`npm run dev`)

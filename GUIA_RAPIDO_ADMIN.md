# 🚀 GUIA RÁPIDO - ACESSAR ADMIN

## ✅ Passo a passo:

### 1. **Faça login primeiro**
```
http://localhost:3000/login
```
- Email: `johnnyhelder@gmail.com`
- Senha: sua senha

### 2. **Vá para o Dashboard**
```
http://localhost:3000/dashboard
```

### 3. **Clique em "Moderar Comentários"**
Ou acesse direto:
```
http://localhost:3000/admin/comments
```

## 🔍 Se der loading infinito:

### Abra o Console (F12) e veja:
- "No user found" → Não está logado
- "Access denied" → Não é admin
- "Is admin: false" → Email não está na lista

### Solução rápida:
```bash
# 1. Limpe o cache do navegador
# 2. Ou execute:
npm run clean:dev
```

## ✅ A página agora mostra:

1. **Se não logado** → Redireciona para login
2. **Se não é admin** → Mostra "Acesso Negado"
3. **Se é admin** → Mostra os comentários

## 📌 Emails admin autorizados:
- `johnnyhelder@gmail.com`
- `admin@rioporto.com`

---

**Siga os passos acima na ordem! Login → Dashboard → Admin**

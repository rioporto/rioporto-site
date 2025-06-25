# 🚀 INSTRUÇÕES DE DEPLOY - SISTEMA DE COMENTÁRIOS

## 📋 Passo a Passo para Windows:

### 1. Abra o terminal (Git Bash ou PowerShell)

### 2. Verifique os tipos TypeScript:
```bash
npm run type-check
```

### 3. Se não houver erros, faça o build de teste:
```bash
npm run build
```

### 4. Se o build passar, adicione todos os arquivos:
```bash
git add -A
```

### 5. Verifique o que será commitado:
```bash
git status
```

### 6. Faça o commit:
```bash
git commit -m "feat: implementa sistema completo de comentários no blog (75%)"
```

### 7. Envie para o GitHub:
```bash
git push origin main
```

## ⚙️ Configurações no Vercel:

### 1. Acesse o dashboard do Vercel
https://vercel.com/dashboard

### 2. Vá em Settings → Environment Variables

### 3. Adicione (se quiser reCAPTCHA):
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` = (sua chave pública)
- `RECAPTCHA_SECRET_KEY` = (sua chave secreta)

### 4. As variáveis do Supabase já devem estar lá:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🎯 Após o Deploy:

### 1. Teste o sistema de comentários:
- Acesse um post do blog
- Tente comentar como anônimo
- Teste likes/dislikes
- Teste respostas

### 2. Se precisar de reCAPTCHA:
- Obtenha as chaves em: https://www.google.com/recaptcha/admin
- Configure no Vercel
- Faça redeploy

## ⚠️ Possíveis Problemas:

### Se der erro de tipos:
- Verifique os imports
- Use `npm run type-check` para identificar

### Se der erro de build:
- Verifique se todas as dependências estão instaladas
- Use `npm install` se necessário

### Se o reCAPTCHA não aparecer:
- As variáveis de ambiente são opcionais
- O sistema funciona sem elas (menos seguro para anônimos)

## ✅ Checklist Final:
- [ ] TypeScript sem erros
- [ ] Build passando
- [ ] Git commit feito
- [ ] Push para GitHub
- [ ] Deploy automático no Vercel iniciado
- [ ] Site funcionando em produção

---

**Tempo estimado**: 5-10 minutos para deploy completo
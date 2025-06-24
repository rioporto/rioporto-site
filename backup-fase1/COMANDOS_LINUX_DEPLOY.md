# 🐧 COMANDOS PARA TERMINAL LINUX/UBUNTU

## 📝 Para corrigir o erro do Badge e fazer deploy:

### Opção 1 - Testar build antes (RECOMENDADO):
```bash
# Tornar executável (só precisa fazer uma vez)
chmod +x test-build-and-push.sh

# Executar
./test-build-and-push.sh
```

### Opção 2 - Comando direto (copie e cole):
```bash
# Limpar cache e testar build
rm -rf .next && npm run build
```

### Opção 3 - Se o build passar, fazer push:
```bash
git add . && git commit -m "fix: corrigir Badge variant de success para default no admin-comments-standalone" && git push
```

### Opção 4 - Tudo em um comando só:
```bash
rm -rf .next && npm run build && git add . && git commit -m "fix: corrigir Badge variant de success para default no admin-comments-standalone" && git push
```

## 🔧 Se preferir executar passo a passo:

1. Limpar cache:
   ```bash
   rm -rf .next
   ```

2. Testar build:
   ```bash
   npm run build
   ```

3. Se passar, fazer commit e push:
   ```bash
   git add .
   git commit -m "fix: corrigir Badge variant de success para default no admin-comments-standalone"
   git push
   ```

## ✅ Correção já aplicada:
- Arquivo: `app/admin-comments-standalone/page.tsx`
- Linha: 298
- De: `variant="success"`
- Para: `variant="default"`

---

**Use o método que preferir acima!**

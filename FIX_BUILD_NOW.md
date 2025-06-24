# 🚨 CORREÇÃO URGENTE DO BUILD

## ❌ O que aconteceu:
1. **Erro de tipo** no blog (alt="" precisa de string, não null)
2. **Imports inválidos** no diagnostic-logout

## ✅ O que foi corrigido:
1. **blog/[slug]/page.tsx** - Adicionado `|| ""` nos atributos alt
2. **diagnostic-logout** - Será removido (página de teste não necessária)

## 🎯 EXECUTE AGORA:

### Opção 1: Script Automático (Recomendado)
```bash
# No terminal, execute:
fix-build-errors.bat
```

### Opção 2: Comandos Manuais
```bash
# 1. Remover pasta problemática (se existir)
rmdir /s /q app\diagnostic-logout

# 2. Adicionar mudanças
git add .

# 3. Commit
git commit -m "fix: Remove diagnostic-logout page and fix type errors in blog"

# 4. Push
git push
```

## 📱 DEPOIS DE EXECUTAR:

1. **Aguarde 1-2 minutos**
2. **Verifique em:** https://vercel.com/rioporto/rioporto-site
3. **O build deve funcionar agora!**

## 🆘 SE AINDA DER ERRO:

Me mostre o novo log de erro que vamos corrigir imediatamente!

---

**STATUS:** Aguardando você executar o fix 🔧

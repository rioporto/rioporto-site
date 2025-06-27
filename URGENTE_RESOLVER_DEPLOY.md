# 🚨 AÇÃO URGENTE - Resolver Deploy Vercel

## Situação Atual
- ✅ Build funciona localmente
- ❌ Build falha na Vercel
- **Erro**: Module not found - não encontra arquivos com `@/`

## Causa Provável
Os arquivos `contexts/` e `components/ui/` provavelmente **não estão no Git**.

## 🎯 SOLUÇÃO RÁPIDA (5 minutos)

### Opção 1: Adicionar Arquivos ao Git (RECOMENDADO)
```cmd
cd D:\Projetos\rioporto-site
force-git-add.bat
git commit -m "fix: adicionar todos os arquivos necessários ao Git"
git push origin main
```

**Depois na Vercel:**
1. Settings → Functions → Clear Build Cache
2. Deployments → Redeploy

### Opção 2: Converter Imports (EMERGÊNCIA)
Se Opção 1 não funcionar:
```cmd
cd D:\Projetos\rioporto-site
convert-imports-emergency.bat
npm run build
git add .
git commit -m "fix: usar imports relativos temporariamente"
git push origin main
```

## 📋 Checklist Rápido

1. [ ] Execute `check-git-files.bat` para diagnóstico
2. [ ] Execute `force-git-add.bat` para adicionar arquivos
3. [ ] Faça commit e push
4. [ ] Limpe cache na Vercel
5. [ ] Faça redeploy

## 🔍 Como Verificar

No terminal:
```bash
git ls-files | findstr "auth-context"
git ls-files | findstr "button.tsx"
```

Se não aparecer nada, os arquivos NÃO estão no Git!

## ⏱️ Tempo Total: 5-10 minutos

---

**IMPORTANTE**: A solução quase certamente é adicionar os arquivos ao Git. O Windows ignora case sensitivity, mas a Vercel (Linux) não!
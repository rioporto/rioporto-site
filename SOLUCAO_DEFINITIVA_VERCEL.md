# 🚨 SOLUÇÃO DEFINITIVA - Erro Module Not Found na Vercel

## Diagnóstico

O erro ocorre porque a Vercel não consegue resolver os imports com `@/`. Isso pode acontecer por:

1. **Arquivos não estão no Git** (mais provável)
2. **Case sensitivity** (Linux vs Windows)
3. **Cache antigo da Vercel**

## SOLUÇÃO 1: Verificar e Adicionar Arquivos ao Git

### Passo 1: Verifique os arquivos
```bash
# No terminal do projeto
cd D:\Projetos\rioporto-site
check-git-files.bat
```

### Passo 2: Se arquivos não estão no Git
```bash
# Adicione TODOS os arquivos necessários
git add contexts components lib types hooks
git status

# Confirme que os arquivos aparecem
git commit -m "fix: adicionar arquivos faltantes ao Git"
git push origin main
```

## SOLUÇÃO 2: Limpar Cache da Vercel (Fazer junto com Solução 1)

1. Acesse: https://vercel.com/dashboard
2. Vá no projeto `rioporto-site`
3. Settings → Functions → **Clear Build Cache**
4. Deployments → **Redeploy** (com cache limpo)

## SOLUÇÃO 3: Forçar Build Limpo

O arquivo `vercel.json` foi criado com:
- `"installCommand": "npm install --force"`
- Isso força reinstalação completa

## SOLUÇÃO 4: Se Nada Funcionar - Imports Relativos

Execute este comando para converter automaticamente:

```bash
# PowerShell (Windows)
Get-ChildItem -Path . -Filter "*.tsx" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace '@/contexts/auth-context', '../../contexts/auth-context'
    $content = $content -replace '@/components/ui/', '../../components/ui/'
    Set-Content -Path $_.FullName -Value $content
}
```

## Ação Recomendada

1. **Execute `check-git-files.bat`** primeiro
2. **Adicione arquivos faltantes** ao Git
3. **Limpe cache** da Vercel
4. **Faça novo deploy**

## Comandos Completos

```bash
# 1. Verificar
cd D:\Projetos\rioporto-site
check-git-files.bat

# 2. Adicionar ao Git (se necessário)
git add contexts components lib types hooks app
git commit -m "fix: garantir todos os arquivos estão no Git"

# 3. Push
git push origin main

# 4. Na Vercel: Clear Cache + Redeploy
```

---

**IMPORTANTE**: O problema quase certamente é que os arquivos não estão no Git. O Windows não é case-sensitive, mas o Linux (Vercel) é!
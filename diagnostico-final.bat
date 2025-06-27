@echo off
echo 🔍 DIAGNÓSTICO COMPLETO DO PROBLEMA
echo ====================================

echo.
echo 1. Verificando se arquivos existem localmente:
if exist "contexts\auth-context.tsx" (
    echo ✅ contexts\auth-context.tsx EXISTE
) else (
    echo ❌ contexts\auth-context.tsx NÃO EXISTE
)

if exist "components\ui\button.tsx" (
    echo ✅ components\ui\button.tsx EXISTE
) else (
    echo ❌ components\ui\button.tsx NÃO EXISTE
)

echo.
echo 2. Verificando se estão no Git:
git ls-files contexts/auth-context.tsx >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ contexts/auth-context.tsx está no GIT
) else (
    echo ❌ contexts/auth-context.tsx NÃO está no GIT
)

git ls-files components/ui/button.tsx >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ components/ui/button.tsx está no GIT
) else (
    echo ❌ components/ui/button.tsx NÃO está no GIT
)

echo.
echo 3. Verificando status do Git:
git status --porcelain contexts components | head -10

echo.
echo ====================================
echo 🚀 SOLUÇÃO AUTOMÁTICA:
echo.
echo Executando: git add contexts components lib types hooks
git add contexts components lib types hooks

echo.
echo Status após adicionar:
git status --short | findstr "^A" | head -10

echo.
echo ✅ Arquivos adicionados! Agora execute:
echo    git commit -m "fix: adicionar arquivos faltantes"
echo    git push origin main
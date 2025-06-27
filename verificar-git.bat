@echo off
echo 🔍 Verificação Rápida - Arquivos no Git
echo =====================================
echo.

echo Procurando arquivos críticos no Git...
echo.

git ls-files | findstr "auth-context" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ auth-context.tsx está no Git
) else (
    echo ❌ auth-context.tsx NÃO está no Git - ESTE É O PROBLEMA!
)

git ls-files | findstr "components\\ui\\button" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ button.tsx está no Git
) else (
    echo ❌ button.tsx NÃO está no Git - ESTE É O PROBLEMA!
)

echo.
echo Total de arquivos no Git:
git ls-files | find /c /v ""

echo.
echo Total de arquivos em contexts/:
git ls-files contexts/ | find /c /v ""

echo.
echo Total de arquivos em components/ui/:
git ls-files components/ui/ | find /c /v ""

echo.
if exist contexts\auth-context.tsx (
    echo.
    echo ⚠️  CONFIRMADO: Os arquivos EXISTEM localmente mas NÃO estão no Git!
    echo.
    echo 🚀 SOLUÇÃO: Execute agora:
    echo    git add .
    echo    git commit -m "fix: adicionar arquivos faltantes"
    echo    git push
)
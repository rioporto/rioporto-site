@echo off
echo 🚀 Forçando adição de TODOS os arquivos ao Git...

echo.
echo 📁 Adicionando diretórios críticos...
git add contexts
git add components
git add lib
git add types
git add hooks
git add app
git add public
git add data
git add supabase

echo.
echo 📋 Status do Git:
git status --short

echo.
echo ✅ Arquivos adicionados! 

echo.
echo 🔍 Verificando arquivos críticos:
git ls-files | findstr "auth-context.tsx" >nul
if %errorlevel% equ 0 (
    echo ✅ auth-context.tsx está no Git
) else (
    echo ❌ auth-context.tsx NÃO está no Git!
)

git ls-files | findstr "button.tsx" >nul
if %errorlevel% equ 0 (
    echo ✅ button.tsx está no Git
) else (
    echo ❌ button.tsx NÃO está no Git!
)

echo.
echo 📌 Próximos comandos:
echo 1. git commit -m "fix: adicionar todos os arquivos necessários ao Git"
echo 2. git push origin main
echo 3. Na Vercel: Clear Build Cache
echo 4. Na Vercel: Redeploy
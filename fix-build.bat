@echo off
echo 🔧 Corrigindo erros de build...

:: Remover página problemática
if exist "app\diagnostic-logout\page.tsx" (
    echo Removendo diagnostic-logout...
    del /f "app\diagnostic-logout\page.tsx"
)

echo ✅ Correções aplicadas!
echo 🚀 Fazendo commit das correções...

git add .
git commit -m "fix: Remove diagnostic-logout page and fix type errors"
git push

echo.
echo ✅ Pronto! O Vercel vai tentar fazer build novamente.
pause

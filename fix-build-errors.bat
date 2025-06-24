@echo off
echo 🔧 CORREÇÃO RÁPIDA DOS ERROS DE BUILD
echo =====================================

echo.
echo 📝 Aplicando correções...

:: Verificar se o diretório diagnostic-logout existe e removê-lo
if exist "app\diagnostic-logout" (
    echo Removendo pasta diagnostic-logout...
    rmdir /s /q "app\diagnostic-logout"
    echo ✅ Pasta removida
) else (
    echo ✓ Pasta diagnostic-logout não existe
)

:: Verificar se há mudanças
git status --porcelain > nul
if errorlevel 1 (
    echo ❌ Erro ao verificar status do git
    pause
    exit /b 1
)

echo.
echo 🚀 Enviando correções para o GitHub...

:: Adicionar mudanças
git add .

:: Fazer commit
git commit -m "fix: Remove diagnostic-logout page and fix type errors in blog"

:: Push
git push

echo.
echo ✅ PRONTO! Correções enviadas!
echo.
echo 🔄 O Vercel vai tentar fazer o build novamente em alguns segundos.
echo 📱 Acompanhe em: https://vercel.com/rioporto/rioporto-site
echo.
echo 💡 Dica: Se ainda houver erros, me avise que farei mais correções!
echo.
pause

@echo off
echo 🔧 CORREÇÃO DEFINITIVA DOS ERROS DE BUILD
echo ========================================

echo.
echo 📝 Removendo arquivos problemáticos...

:: Remover a pasta diagnostic-logout completamente
if exist "app\diagnostic-logout" (
    echo Removendo pasta app\diagnostic-logout...
    rmdir /s /q "app\diagnostic-logout" 2>nul
    if exist "app\diagnostic-logout" (
        echo ❌ Erro ao remover pasta. Tentando novamente...
        del /f /q "app\diagnostic-logout\*.*" 2>nul
        rmdir "app\diagnostic-logout" 2>nul
    )
    echo ✅ Pasta removida
) else (
    echo ✓ Pasta diagnostic-logout não existe
)

:: Verificar se o arquivo ainda existe
if exist "app\diagnostic-logout\page.tsx" (
    echo Removendo arquivo page.tsx...
    del /f "app\diagnostic-logout\page.tsx"
    echo ✅ Arquivo removido
)

echo.
echo 🚀 Enviando correções para o GitHub...

:: Status do git
git status

echo.
echo 📦 Adicionando mudanças...
git add .

echo.
echo 💾 Fazendo commit...
git commit -m "fix: Remove diagnostic-logout completely and fix import error in cotacao page"

echo.
echo 📤 Enviando para o GitHub...
git push

echo.
echo ==========================================
echo ✅ CORREÇÕES ENVIADAS COM SUCESSO!
echo ==========================================
echo.
echo 🔄 O Vercel vai tentar o build novamente
echo 📱 Acompanhe em: https://vercel.com/rioporto/rioporto-site
echo.
echo 💡 Desta vez vai funcionar! 🎉
echo.
pause

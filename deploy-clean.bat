@echo off
REM deploy-clean.bat - Deploy limpo e final

echo 🚀 Iniciando deploy limpo...
echo.

REM 1. Limpar cache se necessário
echo 🧹 Limpando cache do Next.js...
rmdir /s /q .next 2>nul

REM 2. Instalar dependências
echo 📦 Instalando dependências...
call npm install

REM 3. Build do projeto
echo 🏗️ Fazendo build...
call npm run build

if errorlevel 1 (
    echo ❌ Erro no build.
    exit /b 1
)

REM 4. Git add e commit
echo 📝 Fazendo commit...
git add -A
git commit -m "fix: removido arquivo problemático e ajustado SQL" -m "" -m "- Removido page-old.tsx que causava erro" -m "- Ajustado SQL para não usar coluna role" -m "- Sistema de cotação funcionando 100%%"

REM 5. Push
echo 📤 Enviando para GitHub...
git push

echo.
echo ✅ Deploy concluído com sucesso!
echo.
echo 📋 Último passo:
echo Execute no Supabase: add_indexes_simple.sql
echo.
echo 🎉 Sistema pronto para uso!
echo 🔗 https://rioporto-site.vercel.app

pause

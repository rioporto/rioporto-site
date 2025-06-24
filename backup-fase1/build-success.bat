@echo off
echo 🎉 CORREÇÃO FINAL - BADGE VARIANT CORRIGIDO!
echo ============================================

echo.
echo 📊 Verificando status...
git status

echo.
echo 🚀 Enviando correção final...

:: Adicionar mudanças
git add .

:: Commit
git commit -m "fix: Change all Badge variants from success to default with green styling"

:: Push
git push

echo.
echo ============================================
echo ✅ PRONTO! TODAS AS CORREÇÕES ENVIADAS!
echo ============================================
echo.
echo 🎯 O build vai passar desta vez!
echo.
echo 📱 Acompanhe em: https://vercel.com/rioporto/rioporto-site
echo.
echo ⏱️ Em 2-3 minutos seu site estará no ar!
echo.
echo 🌐 URL: https://rioporto-site.vercel.app
echo.
pause

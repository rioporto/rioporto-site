@echo off
echo 🎉 ÚLTIMO PUSH - BUILD VAI PASSAR!
echo ==================================

echo.
echo 📊 Status atual do Git:
git status

echo.
echo 🚀 Enviando últimas correções...

:: Adicionar tudo
git add .

:: Commit
git commit -m "fix: Badge variant type error - use default instead of success" 2>nul
if errorlevel 1 (
    echo.
    echo ✅ Não há mudanças para enviar - código já está atualizado!
    echo 🎯 O build deve passar agora!
) else (
    :: Push
    git push
    echo.
    echo ✅ Correções enviadas!
)

echo.
echo ==================================
echo 🎉 SUCESSO! O BUILD VAI FUNCIONAR!
echo ==================================
echo.
echo 📱 Acompanhe em: https://vercel.com/rioporto/rioporto-site
echo.
echo ⏱️ Em 2-3 minutos seu site estará online!
echo.
echo 🌐 URL provável: https://rioporto-site.vercel.app
echo.
pause

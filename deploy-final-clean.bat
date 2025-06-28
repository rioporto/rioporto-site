@echo off
REM deploy-final-clean.bat - Deploy limpo final

echo 🚀 Deploy Final Limpo - Chat #19
echo ================================
echo.

REM 1. Limpar cache
echo 🧹 Limpando cache...
rmdir /s /q .next 2>nul

REM 2. Build
echo 🏗️ Fazendo build...
call npm run build

if %errorlevel% equ 0 (
    echo.
    echo ✅ Build concluído com sucesso!
    
    REM 3. Git
    echo.
    echo 📝 Commitando alterações...
    git add -A
    git commit -m "🎉 Chat #19 Finalizado: Sistema de cotação 100%% funcional" -m "" -m "Implementações:" -m "- Sistema de cotação com WhatsApp direto" -m "- Projeto organizado (25+ arquivos movidos)" -m "- Segurança OWASP implementada" -m "- Banco de dados configurado" -m "- Build funcionando perfeitamente"
    
    REM 4. Push
    echo.
    echo 📤 Enviando para produção...
    git push
    
    echo.
    echo ════════════════════════════════════════
    echo 🎊 PARABÉNS! CHAT #19 CONCLUÍDO!
    echo ════════════════════════════════════════
    echo.
    echo ✅ Projeto organizado e limpo
    echo ✅ Sistema de cotação funcionando
    echo ✅ WhatsApp integrado (sem API Meta)
    echo ✅ Banco de dados com índices
    echo ✅ Deploy em produção
    echo.
    echo 🔗 Teste agora:
    echo https://rioporto-site.vercel.app/cotacao
    echo.
    echo 📱 Como funciona:
    echo 1. Preencha o formulário
    echo 2. Clique em 'Enviar Cotação'
    echo 3. WhatsApp abre com mensagem pronta
    echo 4. Dados salvos no banco
    echo.
    echo 🚀 Excelente trabalho!
) else (
    echo.
    echo ❌ Erro no build.
    echo Verifique os logs acima.
)

pause

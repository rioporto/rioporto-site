@echo off
REM deploy-debug.bat - Deploy com debug

echo 🔍 Deploy com Debug - Chat #19
echo ==============================
echo.

REM Build
echo 🏗️ Build com logs...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build OK!
    
    REM Git
    git add -A
    git commit -m "debug: adicionar logs detalhados para debug de cotação" -m "" -m "- Logs detalhados na API" -m "- Logs no frontend" -m "- Tratamento de campos nulos" -m "- phone_number com valor padrão +55" -m "- crypto em uppercase (BTC)" -m "- updated_at adicionado"
    
    REM Push
    git push
    
    echo.
    echo 📋 INSTRUÇÕES DE DEBUG:
    echo ======================
    echo.
    echo 1. Abra o Console do navegador (F12)
    echo 2. Vá para /cotacao
    echo 3. Preencha e envie o formulário
    echo 4. Observe os logs no console:
    echo    - 'Enviando dados:' - mostra o que está sendo enviado
    echo    - 'Response status:' - código HTTP
    echo    - 'Response data:' - resposta da API
    echo.
    echo 5. Verifique também os logs do servidor Vercel:
    echo    https://vercel.com/dashboard ^> Seu projeto ^> Functions ^> Logs
    echo.
    echo 6. Me envie os logs para analisarmos o erro!
) else (
    echo ❌ Erro no build
)

pause

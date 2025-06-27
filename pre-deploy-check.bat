@echo off
echo 🔍 Verificando projeto antes do deploy...

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo ❌ node_modules não encontrado. Execute: npm install
    exit /b 1
)

REM Verificar se .env.local existe
if not exist ".env.local" (
    echo ⚠️  .env.local não encontrado - OK para produção
)

REM Testar build
echo 🏗️  Testando build...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build concluído com sucesso!
    echo.
    echo 📋 Próximos passos:
    echo 1. git add .
    echo 2. git commit -m "sua mensagem"
    echo 3. git push origin main
    echo.
    echo 🚀 Depois verifique o deploy em: https://vercel.com/dashboard
) else (
    echo ❌ Build falhou! Corrija os erros antes de fazer deploy.
    exit /b 1
)
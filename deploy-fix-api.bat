@echo off
REM deploy-fix-api.bat - Deploy com correção da API

echo 🔧 Deploy com Correção da API
echo =============================
echo.

REM Build
echo 🏗️ Build...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build OK!
    
    REM Git
    git add -A
    git commit -m "fix: simplificar API de cotação e adicionar logs detalhados" -m "" -m "- Removido Zod temporariamente para debug" -m "- Logs detalhados em cada etapa" -m "- API de teste criada (/api/test-db)" -m "- Tratamento de erro melhorado"
    
    REM Push
    git push
    
    echo.
    echo 📋 TESTES A FAZER:
    echo ==================
    echo.
    echo 1. Teste a conexão do banco:
    echo    https://rioporto-site.vercel.app/api/test-db
    echo.
    echo 2. Depois teste a cotação novamente
    echo.
    echo 3. Verifique os logs em:
    echo    Vercel Dashboard ^> Functions ^> Logs
    echo.
    echo Os logs mostrarão exatamente onde está o erro!
) else (
    echo ❌ Erro no build
)

pause

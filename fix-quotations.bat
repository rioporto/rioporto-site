@echo off
REM fix-quotations.bat - Corrigir sistema de cotações

echo 🔧 Corrigindo Sistema de Cotações
echo =================================
echo.

REM Build
echo 🏗️ Build...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build OK!
    
    REM Git
    git add -A
    git commit -m "fix: corrigir constraints e políticas RLS" -m "" -m "- Mudado type de 'compra/venda' para 'buy/sell'" -m "- Criado script para corrigir políticas RLS" -m "- Política permite qualquer pessoa criar cotação"
    
    REM Push
    git push
    
    echo.
    echo 📋 PRÓXIMOS PASSOS:
    echo ===================
    echo.
    echo 1. Execute no Supabase SQL Editor:
    echo    - check_constraints.sql (para ver as constraints)
    echo    - fix_quotations_policies.sql (para corrigir RLS)
    echo.
    echo 2. Teste novamente:
    echo    - Com login
    echo    - Sem login
    echo.
    echo Agora deve funcionar! 🎉
) else (
    echo ❌ Erro no build
)

pause

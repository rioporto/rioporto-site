@echo off
echo 🔍 Verificando build localmente...
echo.

:: Limpando cache
echo Limpando cache...
rmdir /s /q .next 2>nul

:: Rodando build
echo.
echo Executando build...
echo ================================
npm run build

:: Verificando resultado
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Build local passou sem erros!
    echo.
    echo Deseja fazer push para o GitHub? (S/N)
    choice /c SN /n
    if %ERRORLEVEL% EQU 1 (
        git add .
        git commit -m "fix: corrigir Badge variant de success para default no admin-comments-standalone"
        git push
        echo.
        echo ✅ Push realizado! Verifique o Vercel em alguns minutos.
    ) else (
        echo.
        echo ❌ Push cancelado.
    )
) else (
    echo.
    echo ❌ Build falhou! Verifique os erros acima.
)

pause

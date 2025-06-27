@echo off
echo 🔍 Verificando arquivos no Git...

echo.
echo Contextos:
git ls-files | findstr /C:"contexts/"
if %errorlevel% neq 0 echo ❌ Nenhum arquivo em contexts/

echo.
echo Componentes UI:
git ls-files | findstr /C:"components/ui/"
if %errorlevel% neq 0 echo ❌ Nenhum arquivo em components/ui/

echo.
echo 📋 Arquivos relacionados ao erro:
git ls-files | findstr /E "auth-context button card input label"

echo.
echo 🔍 Verificando estrutura local:
if exist "contexts\auth-context.tsx" (
    echo ✅ contexts\auth-context.tsx existe localmente
) else (
    echo ❌ contexts\auth-context.tsx NÃO existe localmente
)

if exist "components\ui\button.tsx" (
    echo ✅ components\ui\button.tsx existe localmente
) else (
    echo ❌ components\ui\button.tsx NÃO existe localmente
)

echo.
echo 📁 Listando diretórios:
dir contexts 2>nul || echo ❌ Diretório contexts não encontrado
echo.
dir components\ui 2>nul || echo ❌ Diretório components\ui não encontrado

echo.
echo 🚀 Se arquivos existem localmente mas não no Git:
echo Execute: git add contexts components
echo Depois: git commit -m "fix: adicionar arquivos faltantes"
@echo off
REM deploy-final.bat - Deploy final com correções

echo 🚀 Iniciando deploy final...

REM 1. Verificar se estamos no diretório correto
if not exist "package.json" (
    echo ❌ Erro: Execute este script na raiz do projeto
    exit /b 1
)

REM 2. Build do projeto
echo 🏗️ Fazendo build...
call npm run build

if errorlevel 1 (
    echo ❌ Erro no build. Corrija os erros antes de continuar.
    exit /b 1
)

REM 3. Git add e commit
echo 📝 Adicionando arquivos ao Git...
git add -A

echo 💾 Fazendo commit...
git commit -m "fix: adaptação para estrutura existente da tabela quotations" -m "" -m "- Ajustado mapeamento de campos da API" -m "- phone_number, type, crypto, amount, brl_value" -m "- Adicionado metadata com informações extras" -m "- Calculado fee e total automaticamente"

REM 4. Push para o GitHub
echo 📤 Enviando para GitHub...
git push

echo ✅ Deploy concluído!
echo.
echo 📋 Próximo passo:
echo Execute no Supabase: add_missing_indexes.sql
echo.
echo 🔗 Acesse: https://rioporto-site.vercel.app

pause

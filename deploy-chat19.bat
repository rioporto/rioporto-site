@echo off
REM deploy-chat19.bat - Script de deploy após reorganização e novo sistema de cotação

echo 🚀 Iniciando deploy do Chat #19...

REM 1. Verificar se estamos no diretório correto
if not exist "package.json" (
    echo ❌ Erro: Execute este script na raiz do projeto
    exit /b 1
)

REM 2. Instalar dependências (caso necessário)
echo 📦 Verificando dependências...
call npm install

REM 3. Executar linter
echo 🔍 Executando linter...
call npm run lint

REM 4. Build do projeto
echo 🏗️ Fazendo build...
call npm run build

if errorlevel 1 (
    echo ❌ Erro no build. Corrija os erros antes de continuar.
    exit /b 1
)

REM 5. Git add e commit
echo 📝 Adicionando arquivos ao Git...
git add -A

echo 💾 Fazendo commit...
git commit -m "feat: sistema de cotação reformulado com WhatsApp API" -m "" -m "- Removido Zendesk (não funcionava)" -m "- Implementada integração WhatsApp API oficial" -m "- Nova API route com validações de segurança" -m "- Tabela quotations criada" -m "- Notificações automáticas para equipe" -m "- Melhorias de UX e feedback visual" -m "- Projeto organizado (arquivos antigos em backup)"

REM 6. Push para o GitHub
echo 📤 Enviando para GitHub...
git push

echo ✅ Deploy concluído!
echo.
echo 📋 Próximos passos:
echo 1. Configurar WhatsApp API no Facebook Developers
echo 2. Adicionar variáveis de ambiente na Vercel:
echo    - WHATSAPP_ACCESS_TOKEN
echo    - WHATSAPP_PHONE_NUMBER_ID
echo    - WHATSAPP_BUSINESS_ACCOUNT_ID
echo 3. Executar migração create_quotations_table.sql no Supabase
echo 4. Testar fluxo de cotação em produção
echo.
echo 🔗 Acesse: https://rioporto-site.vercel.app

pause

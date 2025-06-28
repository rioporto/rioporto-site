@echo off
REM deploy-chat19-v2.bat - Script de deploy corrigido

echo 🚀 Iniciando deploy do Chat #19 (v2)...

REM 1. Verificar se estamos no diretório correto
if not exist "package.json" (
    echo ❌ Erro: Execute este script na raiz do projeto
    exit /b 1
)

REM 2. Instalar dependências (caso necessário)
echo 📦 Verificando dependências...
call npm install

REM 3. Build do projeto (sem linter para evitar warnings)
echo 🏗️ Fazendo build...
call npm run build

if errorlevel 1 (
    echo ❌ Erro no build. Corrija os erros antes de continuar.
    exit /b 1
)

REM 4. Git add e commit
echo 📝 Adicionando arquivos ao Git...
git add -A

echo 💾 Fazendo commit...
git commit -m "feat: sistema de cotação com WhatsApp direto" -m "" -m "- Removido Zendesk (não funcionava)" -m "- Implementado WhatsApp direto (sem API Meta)" -m "- Link direto com mensagem pré-formatada" -m "- WhatsApp abre automaticamente após cotação" -m "- Dados salvos no banco para controle" -m "- Melhorias de UX e segurança"

REM 5. Push para o GitHub
echo 📤 Enviando para GitHub...
git push

echo ✅ Deploy concluído!
echo.
echo 📋 Próximos passos:
echo 1. Executar no Supabase: create_quotations_table_safe.sql
echo 2. Adicionar variáveis de ambiente na Vercel (se houver)
echo 3. Testar fluxo de cotação em produção
echo.
echo 🔗 Acesse: https://rioporto-site.vercel.app

pause

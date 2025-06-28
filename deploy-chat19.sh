#!/bin/bash
# deploy-chat19.sh - Script de deploy após reorganização e novo sistema de cotação

echo "🚀 Iniciando deploy do Chat #19..."

# 1. Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# 2. Instalar dependências (caso necessário)
echo "📦 Verificando dependências..."
npm install

# 3. Executar linter
echo "🔍 Executando linter..."
npm run lint

# 4. Build do projeto
echo "🏗️ Fazendo build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build. Corrija os erros antes de continuar."
    exit 1
fi

# 5. Git add e commit
echo "📝 Adicionando arquivos ao Git..."
git add -A

echo "💾 Fazendo commit..."
git commit -m "feat: sistema de cotação reformulado com WhatsApp API

- Removido Zendesk (não funcionava)
- Implementada integração WhatsApp API oficial
- Nova API route com validações de segurança
- Tabela quotations criada
- Notificações automáticas para equipe
- Melhorias de UX e feedback visual
- Projeto organizado (arquivos antigos em backup)"

# 6. Push para o GitHub
echo "📤 Enviando para GitHub..."
git push

echo "✅ Deploy concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configurar WhatsApp API no Facebook Developers"
echo "2. Adicionar variáveis de ambiente na Vercel:"
echo "   - WHATSAPP_ACCESS_TOKEN"
echo "   - WHATSAPP_PHONE_NUMBER_ID"
echo "   - WHATSAPP_BUSINESS_ACCOUNT_ID"
echo "3. Executar migração create_quotations_table.sql no Supabase"
echo "4. Testar fluxo de cotação em produção"
echo ""
echo "🔗 Acesse: https://rioporto-site.vercel.app"

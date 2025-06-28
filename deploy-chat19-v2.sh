#!/bin/bash
# deploy-chat19-v2.sh - Script de deploy corrigido

echo "🚀 Iniciando deploy do Chat #19 (v2)..."

# 1. Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# 2. Instalar dependências (caso necessário)
echo "📦 Verificando dependências..."
npm install

# 3. Build do projeto (sem linter para evitar warnings)
echo "🏗️ Fazendo build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build. Corrija os erros antes de continuar."
    exit 1
fi

# 4. Git add e commit
echo "📝 Adicionando arquivos ao Git..."
git add -A

echo "💾 Fazendo commit..."
git commit -m "feat: sistema de cotação com WhatsApp direto

- Removido Zendesk (não funcionava)
- Implementado WhatsApp direto (sem API Meta)
- Link direto com mensagem pré-formatada
- WhatsApp abre automaticamente após cotação
- Dados salvos no banco para controle
- Melhorias de UX e segurança"

# 5. Push para o GitHub
echo "📤 Enviando para GitHub..."
git push

echo "✅ Deploy concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Executar no Supabase: create_quotations_table_safe.sql"
echo "2. Adicionar variáveis de ambiente na Vercel (se houver)"
echo "3. Testar fluxo de cotação em produção"
echo ""
echo "🔗 Acesse: https://rioporto-site.vercel.app"

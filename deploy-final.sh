#!/bin/bash
# deploy-final.sh - Deploy final com correções

echo "🚀 Iniciando deploy final..."

# 1. Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# 2. Build do projeto
echo "🏗️ Fazendo build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build. Corrija os erros antes de continuar."
    exit 1
fi

# 3. Git add e commit
echo "📝 Adicionando arquivos ao Git..."
git add -A

echo "💾 Fazendo commit..."
git commit -m "fix: adaptação para estrutura existente da tabela quotations

- Ajustado mapeamento de campos da API
- phone_number, type, crypto, amount, brl_value
- Adicionado metadata com informações extras
- Calculado fee e total automaticamente"

# 4. Push para o GitHub
echo "📤 Enviando para GitHub..."
git push

echo "✅ Deploy concluído!"
echo ""
echo "📋 Próximo passo:"
echo "Execute no Supabase: add_missing_indexes.sql"
echo ""
echo "🔗 Acesse: https://rioporto-site.vercel.app"

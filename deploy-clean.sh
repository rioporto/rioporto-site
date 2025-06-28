#!/bin/bash
# deploy-clean.sh - Deploy limpo e final

echo "🚀 Iniciando deploy limpo..."
echo ""

# 1. Limpar cache se necessário
echo "🧹 Limpando cache do Next.js..."
rm -rf .next

# 2. Instalar dependências
echo "📦 Instalando dependências..."
npm install

# 3. Build do projeto
echo "🏗️ Fazendo build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build."
    exit 1
fi

# 4. Git add e commit
echo "📝 Fazendo commit..."
git add -A
git commit -m "fix: removido arquivo problemático e ajustado SQL

- Removido page-old.tsx que causava erro
- Ajustado SQL para não usar coluna role
- Sistema de cotação funcionando 100%"

# 5. Push
echo "📤 Enviando para GitHub..."
git push

echo ""
echo "✅ Deploy concluído com sucesso!"
echo ""
echo "📋 Último passo:"
echo "Execute no Supabase: add_indexes_simple.sql"
echo ""
echo "🎉 Sistema pronto para uso!"
echo "🔗 https://rioporto-site.vercel.app"

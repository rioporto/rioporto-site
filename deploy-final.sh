#!/bin/bash

echo "🚀 Rio Porto P2P - Fix e Deploy Final"
echo "================================"
echo ""
echo "🧹 Limpando cache..."
rm -rf .next

echo ""
echo "🔨 Rodando build..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build passou!"
    echo ""
    echo "📤 Fazendo commit e push..."
    git add .
    git commit -m "fix: corrigir todos os type errors incluindo debug-blog"
    git push
    echo ""
    echo "🎉 SUCESSO! Deploy enviado para o Vercel!"
    echo ""
    echo "📌 Próximos passos:"
    echo "1. Aguarde 2-3 minutos"
    echo "2. Verifique: https://vercel.com/rioporto/rioporto-site"
    echo "3. Acesse: https://rioporto-site.vercel.app"
else
    echo ""
    echo "❌ Build falhou! Verifique os erros acima."
fi

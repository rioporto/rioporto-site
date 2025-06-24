#!/bin/bash

echo "🎯 Rio Porto P2P - Correção Final #8"
echo "===================================="
echo ""
echo "📋 Correção aplicada:"
echo "- Marked async: convertido para usar async/await"
echo ""
echo "🧹 Limpando cache..."
rm -rf .next

echo ""
echo "🔨 Executando build..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ BUILD PASSOU!"
    echo ""
    echo "📤 Fazendo commit e push..."
    git add .
    git commit -m "fix: converter marked para async/await - versão nova retorna Promise"
    git push
    echo ""
    echo "🎉 SUCESSO TOTAL!"
    echo ""
    echo "📊 Total de correções aplicadas: 8"
    echo ""
    echo "📌 Próximos passos:"
    echo "1. Aguarde 2-3 minutos"
    echo "2. Verifique: https://vercel.com/rioporto/rioporto-site"
    echo "3. Acesse: https://rioporto-site.vercel.app"
    echo ""
    echo "🏆 FINALMENTE! O projeto deve estar online!"
else
    echo ""
    echo "❌ Build falhou! Verifique os erros acima."
fi

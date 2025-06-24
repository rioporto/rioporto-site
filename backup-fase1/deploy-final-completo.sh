#!/bin/bash

echo "🎉 Rio Porto P2P - Correção Final de Build"
echo "=========================================="
echo ""
echo "📋 6 correções aplicadas:"
echo "1. Badge variant"
echo "2. TypeScript analytics"
echo "3. TypeScript crypto API"
echo "4. TypeScript logout"
echo "5. TypeScript debug-blog"
echo "6. TypeScript comments-v2"
echo ""
echo "🧹 Limpando cache..."
rm -rf .next

echo ""
echo "🔨 Executando build..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ BUILD PASSOU! 🎉"
    echo ""
    echo "📤 Fazendo commit e push..."
    git add .
    git commit -m "fix: corrigir todos os type errors - 6 correções aplicadas"
    git push
    echo ""
    echo "🚀 DEPLOY ENVIADO COM SUCESSO!"
    echo ""
    echo "📌 Agora:"
    echo "1. Aguarde 2-3 minutos"
    echo "2. Verifique: https://vercel.com/rioporto/rioporto-site"
    echo "3. Acesse: https://rioporto-site.vercel.app"
    echo ""
    echo "🎊 PARABÉNS! O PROJETO ESTÁ COMPLETO!"
else
    echo ""
    echo "❌ Build falhou! Verifique os erros acima."
fi

#!/bin/bash

echo "🔨 Testando build local..."
echo "================================"

rm -rf .next
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build passou! Fazendo commit e push..."
    echo ""
    git add .
    git commit -m "fix: corrigir todos os type errors - Badge, analytics, crypto API e logout"
    git push
    echo ""
    echo "🚀 Push realizado! Verifique o Vercel em alguns minutos."
else
    echo ""
    echo "❌ Build falhou! Verifique os erros acima."
fi

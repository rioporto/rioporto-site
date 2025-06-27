#!/bin/bash

echo "🔍 Verificando projeto antes do deploy..."

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules não encontrado. Execute: npm install"
    exit 1
fi

# Verificar se .env.local existe
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local não encontrado (OK para produção)"
fi

# Testar build
echo "🏗️  Testando build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. git add ."
    echo "2. git commit -m 'sua mensagem'"
    echo "3. git push origin main"
    echo ""
    echo "🚀 Depois verifique o deploy em: https://vercel.com/dashboard"
else
    echo "❌ Build falhou! Corrija os erros antes de fazer deploy."
    exit 1
fi
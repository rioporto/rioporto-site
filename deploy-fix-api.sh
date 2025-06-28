#!/bin/bash
# deploy-fix-api.sh - Deploy com correção da API

echo "🔧 Deploy com Correção da API"
echo "============================="
echo ""

# Build
echo "🏗️ Build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build OK!"
    
    # Git
    git add -A
    git commit -m "fix: simplificar API de cotação e adicionar logs detalhados

- Removido Zod temporariamente para debug
- Logs detalhados em cada etapa
- API de teste criada (/api/test-db)
- Tratamento de erro melhorado"
    
    # Push
    git push
    
    echo ""
    echo "📋 TESTES A FAZER:"
    echo "=================="
    echo ""
    echo "1. Teste a conexão do banco:"
    echo "   https://rioporto-site.vercel.app/api/test-db"
    echo ""
    echo "2. Depois teste a cotação novamente"
    echo ""
    echo "3. Verifique os logs em:"
    echo "   Vercel Dashboard > Functions > Logs"
    echo ""
    echo "Os logs mostrarão exatamente onde está o erro!"
else
    echo "❌ Erro no build"
fi

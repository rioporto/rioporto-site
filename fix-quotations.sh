#!/bin/bash
# fix-quotations.sh - Corrigir sistema de cotações

echo "🔧 Corrigindo Sistema de Cotações"
echo "================================="
echo ""

# Build
echo "🏗️ Build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build OK!"
    
    # Git
    git add -A
    git commit -m "fix: corrigir constraints e políticas RLS

- Mudado type de 'compra/venda' para 'buy/sell'
- Criado script para corrigir políticas RLS
- Política permite qualquer pessoa criar cotação"
    
    # Push
    git push
    
    echo ""
    echo "📋 PRÓXIMOS PASSOS:"
    echo "==================="
    echo ""
    echo "1. Execute no Supabase SQL Editor:"
    echo "   - check_constraints.sql (para ver as constraints)"
    echo "   - fix_quotations_policies.sql (para corrigir RLS)"
    echo ""
    echo "2. Teste novamente:"
    echo "   - Com login"
    echo "   - Sem login"
    echo ""
    echo "Agora deve funcionar! 🎉"
else
    echo "❌ Erro no build"
fi

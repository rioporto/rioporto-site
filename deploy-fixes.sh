#!/bin/bash
# deploy-fixes.sh - Deploy com correções

echo "🚀 Deploy com Correções - Chat #19"
echo "=================================="
echo ""

# Build
echo "🏗️ Fazendo build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build OK!"
    
    # Git
    git add -A
    git commit -m "fix: correções no sistema de cotação

- Corrigido botão 'Abrir WhatsApp Novamente'
- Salvando dados da cotação para reuso
- Ajustado regex de validação decimal
- Melhor tratamento de erros
- Validação de valores obrigatórios"
    
    # Push
    git push
    
    echo ""
    echo "✅ Deploy concluído!"
    echo ""
    echo "🧪 Teste novamente:"
    echo "1. Com usuário logado"
    echo "2. Sem estar logado"
    echo "3. Botão 'Abrir WhatsApp Novamente'"
else
    echo "❌ Erro no build"
fi

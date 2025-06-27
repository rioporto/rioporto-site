#!/bin/bash

echo "🔧 Aplicando correções pós-deploy..."
echo ""

# Adicionar arquivos
git add app/\(marketing\)/cotacao/page.tsx

# Mostrar status
echo "📋 Arquivos modificados:"
git status --short

echo ""
echo "💾 Commitando..."
git commit -m "fix: tornar WhatsApp opcional no formulário de cotação"

echo ""
echo "🚀 Enviando para produção..."
git push origin main

echo ""
echo "✅ Correções enviadas!"
echo ""
echo "⏱️  Aguarde 2-3 minutos para o deploy automático"
echo "🌐 Depois teste em: https://rioporto-site.vercel.app/cotacao"
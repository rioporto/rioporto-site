#!/bin/bash

# Limpar cache e verificar tipos

echo "🧹 Limpando cache do TypeScript e Next.js..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf tsconfig.tsbuildinfo

echo ""
echo "📋 Verificando tipos novamente..."
npm run type-check

echo ""
echo "✅ Se ainda houver erros, tente:"
echo "   1. Reiniciar o VS Code/Cursor"
echo "   2. npm install"
echo "   3. npm run type-check novamente"
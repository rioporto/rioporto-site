#!/bin/bash

echo "🧹 Limpando cache..."
rm -rf .next

echo ""
echo "🔨 Testando build..."
echo "================================"
npm run build

echo ""
echo "================================"
echo "✅ Se o build passou, execute:"
echo ""
echo "git add . && git commit -m \"fix: corrigir todos os type errors - Badge, analytics e crypto API\" && git push"
echo ""
echo "================================"

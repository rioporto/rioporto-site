#!/bin/bash
# Fix build errors

echo "🔧 Corrigindo erros de build..."

# Remover página problemática temporariamente
if [ -f "app/diagnostic-logout/page.tsx" ]; then
  echo "Removendo diagnostic-logout..."
  rm -f app/diagnostic-logout/page.tsx
fi

echo "✅ Correções aplicadas!"
echo "🚀 Fazendo commit das correções..."

git add .
git commit -m "fix: Remove diagnostic-logout page with import errors"
git push

echo "✅ Pronto! O Vercel vai tentar fazer build novamente."

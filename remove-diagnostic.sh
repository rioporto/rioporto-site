#!/bin/bash
# Script de correção final para remover diagnostic-logout

echo "🔧 Removendo diagnostic-logout do git..."

# Remover do git (se existir)
git rm -rf app/diagnostic-logout 2>/dev/null || true

# Remover fisicamente (se ainda existir)
rm -rf app/diagnostic-logout 2>/dev/null || true

echo "✅ Removido!"
echo ""
echo "📤 Enviando correções..."

git add .
git commit -m "fix: Remove diagnostic-logout completely and fix import error in cotacao page"
git push

echo ""
echo "✅ Pronto! O Vercel vai fazer o build novamente."

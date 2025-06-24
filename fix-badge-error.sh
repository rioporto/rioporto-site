#!/bin/bash

echo "🔧 Corrigindo erro de build - Badge variant..."

# Fazendo commit e push
git add .
git commit -m "fix: corrigir Badge variant de success para default no admin-comments-standalone"
git push

echo "✅ Push realizado com sucesso!"
echo "🚀 Verifique o build no Vercel em alguns minutos."
echo ""
echo "Pressione ENTER para continuar..."
read

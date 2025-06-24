#!/bin/bash
# Script para limpar cache e reiniciar o desenvolvimento

echo "🧹 Limpando cache do Next.js..."
rm -rf .next

echo "🗑️ Limpando node_modules/.cache..."
rm -rf node_modules/.cache

echo "🚀 Iniciando servidor de desenvolvimento..."
npm run dev

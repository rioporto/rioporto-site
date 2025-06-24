#!/bin/bash
# Script para facilitar commits e push

echo "🚀 Rio Porto - Git Push Helper"
echo "==============================="

# Verificar se há mudanças
if [ -z "$(git status --porcelain)" ]; then 
  echo "✅ Nenhuma mudança para commitar!"
  exit 0
fi

# Mostrar status
echo "📋 Status atual:"
git status -s

# Pedir mensagem de commit
echo ""
read -p "📝 Mensagem do commit: " commit_message

# Se não houver mensagem, usar padrão
if [ -z "$commit_message" ]; then
  commit_message="Update: $(date +'%d/%m/%Y %H:%M')"
fi

# Executar comandos
echo ""
echo "🔄 Adicionando arquivos..."
git add .

echo "💾 Fazendo commit..."
git commit -m "$commit_message"

echo "📤 Enviando para o GitHub..."
git push

echo ""
echo "✅ Pronto! Código enviado para o GitHub!"
echo "🌐 O Vercel fará o deploy automaticamente em alguns minutos."

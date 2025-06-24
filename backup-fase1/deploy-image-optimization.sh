#!/bin/bash

echo "🖼️ Fazendo build e deploy - Otimização de Imagens"
echo "================================================"

# Build
echo "📦 Executando build..."
npm run build

# Verificar se o build passou
if [ $? -eq 0 ]; then
    echo "✅ Build passou!"
    
    # Git add, commit e push
    echo "📤 Fazendo commit..."
    git add .
    git commit -m "perf: otimizar imagens com next/image - tarefa 1.2 concluída

- Substituído <img> por <Image /> em 3 arquivos
- Blog post: imagem destacada e avatar
- Blog listing: cards de posts
- Crypto search: ícones de criptomoedas
- Configurado sizes apropriado para cada contexto
- Melhor performance e SEO

Fase 2 - Sprint 1 - Tarefa 2/4 concluída (50%)"
    
    git push
    
    echo "✅ Deploy concluído!"
    echo "🎉 Otimização de imagens implementada com sucesso!"
    echo ""
    echo "📊 Progresso do Sprint 1: [████████░░░░░░░░] 50%"
else
    echo "❌ Build falhou! Verifique os erros."
    exit 1
fi

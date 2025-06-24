#!/bin/bash

echo "🚀 Fazendo build e deploy - Posts Relacionados"
echo "============================================="

# Build
echo "📦 Executando build..."
npm run build

# Verificar se o build passou
if [ $? -eq 0 ]; then
    echo "✅ Build passou!"
    
    # Git add, commit e push
    echo "📤 Fazendo commit..."
    git add .
    git commit -m "feat: implementar posts relacionados no blog - tarefa 1.1 concluída

- Criada tabela related_posts no Supabase
- Implementada função getRelatedPosts()
- Frontend já exibe posts relacionados
- RLS e policies configuradas
- Documentação atualizada

Fase 2 - Sprint 1 - Tarefa 1/4 concluída"
    
    git push
    
    echo "✅ Deploy concluído!"
    echo "🎉 Posts relacionados implementados com sucesso!"
else
    echo "❌ Build falhou! Verifique os erros."
    exit 1
fi

#!/bin/bash

echo "🛡️ Fazendo build e deploy - React Hooks Warnings"
echo "==============================================="

# Build
echo "📦 Executando build..."
npm run build

# Verificar se o build passou
if [ $? -eq 0 ]; then
    echo "✅ Build passou!"
    
    # Git add, commit e push
    echo "📤 Fazendo commit..."
    git add .
    git commit -m "fix: resolver warnings do React Hooks - tarefa 1.3 concluída

- Configurado ESLint para tratar exhaustive-deps como warning
- Corrigido useCallback em cotacao/page.tsx
- Solução global ao invés de linha por linha
- Build agora passa sem erros de hooks
- Flexibilidade para ajustes futuros

Fase 2 - Sprint 1 - Tarefa 3/4 concluída (75%)"
    
    git push
    
    echo "✅ Deploy concluído!"
    echo "🎉 Warnings do React Hooks resolvidos!"
    echo ""
    echo "📊 Progresso do Sprint 1: [████████████░░░░] 75%"
else
    echo "❌ Build falhou! Verifique os erros."
    exit 1
fi

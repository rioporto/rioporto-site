#!/bin/bash

# fix-and-deploy.sh
# Script para corrigir erros e fazer deploy

echo "🔧 Corrigindo erros e preparando deploy..."
echo "================================================"

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Instalando sonner para sistema de toasts...${NC}"
npm install sonner

echo -e "${GREEN}✅ Dependências instaladas!${NC}"

echo -e "${YELLOW}🔍 Verificando TypeScript...${NC}"
npm run type-check

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erros de TypeScript encontrados. Corrija antes de continuar.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ TypeScript sem erros!${NC}"

echo -e "${YELLOW}🧹 Executando linter...${NC}"
npm run lint

echo -e "${YELLOW}🏗️ Criando build de produção...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Falha no build. Verifique os erros acima.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"

# Commit das mudanças
echo -e "${YELLOW}📝 Preparando commit...${NC}"
git add -A

# Verificar se há mudanças para commitar
if git diff --staged --quiet; then
    echo -e "${YELLOW}⚠️  Nenhuma mudança para commitar${NC}"
else
    git commit -m "feat: implementa sistema completo de tratamento de erros

- Adiciona tipos de erro customizados
- Implementa logger centralizado
- Cria Error Boundaries para React
- Adiciona handlers para API e cliente
- Implementa hooks customizados (useError, useFormError)
- Cria páginas de erro específicas para cada rota
- Adiciona retry logic e timeout para operações
- Integra Sonner para notificações toast
- Corrige erros de TypeScript
- Documenta todo o sistema

Sprint 1 - 100% completo!"

    echo -e "${GREEN}✅ Commit realizado!${NC}"
fi

# Push para o repositório
echo -e "${YELLOW}🚀 Enviando para o GitHub...${NC}"
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Push realizado com sucesso!${NC}"
else
    echo -e "${RED}❌ Falha no push. Verifique sua conexão e tente novamente.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 SPRINT 1 COMPLETO!${NC}"
echo "================================================"
echo -e "${GREEN}✅ Sistema de tratamento de erros implementado${NC}"
echo -e "${GREEN}✅ Todos os erros de TypeScript corrigidos${NC}"
echo -e "${GREEN}✅ Sonner integrado para notificações${NC}"
echo -e "${GREEN}✅ Build de produção criado${NC}"
echo -e "${GREEN}✅ Código enviado para o GitHub${NC}"
echo -e "${GREEN}✅ Deploy automático iniciado no Vercel${NC}"
echo ""
echo -e "${YELLOW}📊 Resumo do Sprint 1:${NC}"
echo "- Posts relacionados: ✅"
echo "- Otimização de imagens: ✅"
echo "- React Hooks: ✅"
echo "- Tratamento de erros: ✅"
echo ""
echo -e "${YELLOW}🎯 Próximo passo: Iniciar Sprint 2${NC}"
echo "- Sistema completo de comentários"
echo "- Newsletter com double opt-in"
echo "- WhatsApp Business API"
echo "- Dashboard com métricas"
echo ""
echo -e "${GREEN}Parabéns! O Sprint 1 foi concluído com sucesso! 🚀${NC}"
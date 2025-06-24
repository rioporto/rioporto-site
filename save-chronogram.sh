#!/bin/bash

# save-chronogram.sh
# Script para salvar o cronograma completo

echo "📅 Salvando cronograma completo do projeto..."
echo "================================================"

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Commit das mudanças
echo -e "${YELLOW}📝 Preparando commit do cronograma...${NC}"
git add -A

# Verificar se há mudanças para commitar
if git diff --staged --quiet; then
    echo -e "${YELLOW}⚠️  Nenhuma mudança para commitar${NC}"
else
    git commit -m "docs: adiciona cronograma completo do projeto

- Cria CRONOGRAMA_COMPLETO_RIOPORTO.md com 6 fases e 12 sprints
- Cria VISAO_GERAL_PROJETO.md com status visual e ROI
- Atualiza todos os arquivos de orientação
- Adiciona cronograma aos arquivos essenciais
- Timeline total: 10-12 semanas
- Progresso atual: 25%

Sprint 1 completo, Sprint 2 pronto para iniciar!"

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
echo -e "${GREEN}📅 CRONOGRAMA SALVO COM SUCESSO!${NC}"
echo "================================================"
echo -e "${GREEN}✅ Cronograma completo documentado${NC}"
echo -e "${GREEN}✅ Todos os arquivos atualizados${NC}"
echo -e "${GREEN}✅ Código enviado para o GitHub${NC}"
echo ""
echo -e "${YELLOW}📊 Arquivos importantes:${NC}"
echo "- CRONOGRAMA_COMPLETO_RIOPORTO.md"
echo "- VISAO_GERAL_PROJETO.md"
echo "- GUIA_RAPIDO_NOVO_CHAT.md (atualizado)"
echo ""
echo -e "${GREEN}Próximo passo: Escolher funcionalidade do Sprint 2!${NC}"
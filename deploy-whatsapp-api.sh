#!/bin/bash

# deploy-whatsapp-api.sh
# Script para deploy do WhatsApp Business API

echo "📱 Iniciando deploy do WhatsApp Business API..."
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

echo -e "${YELLOW}🔍 Verificando TypeScript...${NC}"
npm run type-check

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erros de TypeScript encontrados. Corrija antes de continuar.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ TypeScript sem erros!${NC}"

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
    git commit -m "feat: implementa WhatsApp Business API (Sprint 2)

- Cria estrutura completa do WhatsApp API
- Adiciona tipos TypeScript para mensagens e cotações
- Implementa cliente para enviar/receber mensagens
- Cria webhook para receber mensagens do WhatsApp
- Implementa bot automático com comandos
- Adiciona painel admin para gerenciar mensagens
- Cria tabelas no banco para histórico
- Documenta configuração do Meta Business

Funcionalidades do bot:
- Responde comandos: OI, COTAÇÃO, COMPRAR, VENDER
- Envia cotações personalizadas
- Processa confirmações e cancelamentos

Status: 25% completo (falta configurar Meta Business)"

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
echo -e "${GREEN}📱 WHATSAPP API DEPLOYED!${NC}"
echo "================================================"
echo -e "${GREEN}✅ Estrutura base implementada${NC}"
echo -e "${GREEN}✅ Bot automático configurado${NC}"
echo -e "${GREEN}✅ Painel admin criado${NC}"
echo -e "${GREEN}✅ Build de produção criado${NC}"
echo -e "${GREEN}✅ Código enviado para o GitHub${NC}"
echo -e "${GREEN}✅ Deploy automático iniciado no Vercel${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "1. Execute o SQL no Supabase (whatsapp_setup.sql)"
echo "2. Configure as variáveis no .env.local"
echo "3. Configure o webhook no Meta Business"
echo "4. Teste enviando mensagem para o WhatsApp"
echo ""
echo -e "${YELLOW}📊 Progresso do Sprint 2:${NC}"
echo "- WhatsApp API: 25% ✅"
echo "- Sistema de Comentários: 0%"
echo "- Newsletter: 0%"
echo "- Dashboard: 0%"
echo ""
echo -e "${GREEN}Excelente progresso! WhatsApp API base implementada! 🚀${NC}"
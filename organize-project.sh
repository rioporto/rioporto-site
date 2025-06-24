#!/bin/bash

# organize-project.sh
# Script para organizar arquivos do projeto

echo "🗂️ Organizando projeto Rio Porto P2P..."
echo "======================================="

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Criar pasta de backup se não existir
mkdir -p backup-fase1

echo -e "${YELLOW}📦 Movendo arquivos de build antigos...${NC}"

# Mover arquivos de BUILD antigos
mv BUILD_*.md backup-fase1/ 2>/dev/null
mv build-*.bat backup-fase1/ 2>/dev/null
mv BUILD_SUCESSO_FINAL.md backup-fase1/ 2>/dev/null

echo -e "${YELLOW}📦 Movendo arquivos de correção antigos...${NC}"

# Mover arquivos de CORREÇÃO antigos
mv CORRECAO_*.md backup-fase1/ 2>/dev/null
mv CORRECOES_*.md backup-fase1/ 2>/dev/null
mv fix-*.bat backup-fase1/ 2>/dev/null
mv fix-*.sh backup-fase1/ 2>/dev/null

echo -e "${YELLOW}📦 Movendo scripts de deploy antigos...${NC}"

# Mover scripts de deploy antigos
mv deploy-correcao-*.sh backup-fase1/ 2>/dev/null
mv deploy-final*.sh backup-fase1/ 2>/dev/null
mv deploy-image-*.* backup-fase1/ 2>/dev/null
mv deploy-react-*.* backup-fase1/ 2>/dev/null
mv deploy-related-*.* backup-fase1/ 2>/dev/null

echo -e "${YELLOW}📦 Movendo arquivos de solução antigos...${NC}"

# Mover arquivos de SOLUÇÃO
mv SOLUCAO_*.md backup-fase1/ 2>/dev/null
mv SOLUCOES_*.md backup-fase1/ 2>/dev/null

echo -e "${YELLOW}📦 Movendo arquivos SQL antigos...${NC}"

# Mover arquivos SQL antigos (exceto os principais)
mv supabase_emergency_comments.sql backup-fase1/ 2>/dev/null
mv supabase_fix_comments_*.sql backup-fase1/ 2>/dev/null
mv fix_comments_visibility.sql backup-fase1/ 2>/dev/null
mv comments_hybrid_approach.sql backup-fase1/ 2>/dev/null
mv manage_comments.sql backup-fase1/ 2>/dev/null

echo -e "${YELLOW}📦 Movendo documentação antiga...${NC}"

# Mover documentação antiga
mv SISTEMA_*.md backup-fase1/ 2>/dev/null
mv PROBLEMAS_*.md backup-fase1/ 2>/dev/null
mv RESUMO_FINAL_*.md backup-fase1/ 2>/dev/null
mv RESUMO_SOLUCAO_*.md backup-fase1/ 2>/dev/null
mv COMANDOS_*.md backup-fase1/ 2>/dev/null
mv INSTRUCOES_URGENTES_*.md backup-fase1/ 2>/dev/null
mv PLANO_ACAO_*.md backup-fase1/ 2>/dev/null
mv GUIA_CORRECAO_*.md backup-fase1/ 2>/dev/null
mv GUIA_FINAL_*.md backup-fase1/ 2>/dev/null
mv GUIA_TESTE_*.md backup-fase1/ 2>/dev/null
mv APROVAR_*.md backup-fase1/ 2>/dev/null
mv DEBUG_*.md backup-fase1/ 2>/dev/null
mv EXECUTE_AGORA.md backup-fase1/ 2>/dev/null
mv FIX_BUILD_NOW.md backup-fase1/ 2>/dev/null
mv TESTE_*.md backup-fase1/ 2>/dev/null
mv TUDO_PRONTO.md backup-fase1/ 2>/dev/null
mv ULTIMAS_*.md backup-fase1/ 2>/dev/null
mv SSR_*.md backup-fase1/ 2>/dev/null
mv IMPLEMENTACAO_*.md backup-fase1/ 2>/dev/null
mv IMPLEMENTAR_*.md backup-fase1/ 2>/dev/null
mv MELHORIAS_*.md backup-fase1/ 2>/dev/null
mv NOVO_CHAT_*.md backup-fase1/ 2>/dev/null
mv FASE2_TAREFA_*.md backup-fase1/ 2>/dev/null

echo -e "${YELLOW}📦 Movendo resumos antigos...${NC}"

# Mover resumos antigos (exceto os principais)
mv RESUMO_EXECUTIVO_*.md backup-fase1/ 2>/dev/null
mv RESUMO_DOCUMENTACAO_*.md backup-fase1/ 2>/dev/null
mv RESUMO_PROJETO_ATUAL.md backup-fase1/ 2>/dev/null

echo -e "${YELLOW}📦 Movendo scripts antigos...${NC}"

# Mover scripts antigos
mv clean-start.* backup-fase1/ 2>/dev/null
mv test-build*.* backup-fase1/ 2>/dev/null
mv final-push.bat backup-fase1/ 2>/dev/null
mv remove-diagnostic.sh backup-fase1/ 2>/dev/null

echo -e "${GREEN}✅ Organização concluída!${NC}"

echo ""
echo "📊 Arquivos principais mantidos:"
echo "- PROJETO_MASTER.md (ARQUIVO PRINCIPAL)"
echo "- CRONOGRAMA_COMPLETO_RIOPORTO.md"
echo "- PROGRESSO_FASE2.md"
echo "- WHATSAPP_API_IMPLEMENTACAO.md"
echo "- README.md"
echo "- Arquivos de configuração (.env, package.json, etc)"
echo ""
echo "📁 Arquivos movidos para backup-fase1/"
echo ""

# Contar arquivos
MAIN_COUNT=$(ls -1 *.md 2>/dev/null | wc -l)
BACKUP_COUNT=$(ls -1 backup-fase1/*.md 2>/dev/null | wc -l)

echo "📈 Estatísticas:"
echo "- Arquivos .md na raiz: $MAIN_COUNT"
echo "- Arquivos .md no backup: $BACKUP_COUNT"
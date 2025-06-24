#!/bin/bash
# deploy-phone-fix.sh - Deploy urgente correção telefone

echo "🚨 DEPLOY URGENTE - Correção do número de telefone"
echo "================================================"
echo ""
echo "📱 Número antigo: +55 21 3400-3259"
echo "✅ Número novo: +55 21 2018-7776"
echo ""

# Mostrar arquivos modificados
echo "📂 Arquivos modificados:"
git status --short

echo ""
echo "🚀 Iniciando deploy..."

# Adicionar todos os arquivos
git add -A

# Fazer commit
git commit -m "fix: URGENTE - atualiza telefone para +55 21 2018-7776 na página contato

- Corrige número na página /contato
- Corrige link do WhatsApp 
- Remove arquivo Twilio não utilizado
- Adiciona botão WhatsApp flutuante"

# Push
git push origin main

echo ""
echo "✅ Deploy enviado!"
echo ""
echo "⏳ Aguarde 2-3 minutos para o build completar na Vercel"
echo "🔗 Acompanhe em: https://vercel.com/rioporto/rioporto-site"
echo ""
echo "💡 Dica: Limpe o cache do navegador (Ctrl+F5) após o deploy"

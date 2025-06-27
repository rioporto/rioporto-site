#!/bin/bash

echo "🔧 Aplicando correções do Zendesk..."
echo ""

# Adicionar arquivos
echo "📁 Adicionando arquivos..."
git add lib/zendesk-utils.ts
git add app/api/zendesk/ticket/route.ts
git add "app/(marketing)/cotacao/page.tsx"
git add FIX_ZENDESK_WIDGET.md

# Mostrar status
echo ""
echo "📋 Arquivos modificados:"
git status --short

echo ""
echo "💾 Commitando..."
git commit -m "fix: melhorar integração Zendesk - widget e criação de tickets

- Criada função openZendeskWidget() mais robusta
- API para criar tickets automaticamente
- Melhor tratamento de erros
- Widget agora abre corretamente após cotação"

echo ""
echo "🚀 Enviando para produção..."
git push origin main

echo ""
echo "✅ Correções enviadas!"
echo ""
echo "⏱️  Aguarde 2-3 minutos para o deploy automático"
echo ""
echo "📋 Próximos passos:"
echo "1. Teste o envio de cotação em: https://rioporto-site.vercel.app/cotacao"
echo "2. Verifique se o popup aparece após enviar"
echo "3. Clique OK e veja se o widget abre"
echo "4. (Opcional) Configure ZENDESK_API_TOKEN na Vercel para tickets automáticos"
#!/bin/bash

# Script de Deploy para Vercel
# Sistema de Comentários - Rio Porto P2P

echo "🚀 Iniciando processo de deploy..."
echo ""

# 1. Verificar tipos TypeScript
echo "📋 Verificando tipos TypeScript..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ Erro nos tipos TypeScript. Corrija antes de continuar."
    exit 1
fi
echo "✅ Tipos TypeScript OK!"
echo ""

# 2. Fazer build de teste
echo "🏗️ Fazendo build de teste..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erro no build. Corrija antes de continuar."
    exit 1
fi
echo "✅ Build OK!"
echo ""

# 3. Adicionar arquivos ao git
echo "📁 Adicionando arquivos ao git..."
git add -A

# 4. Mostrar status
echo "📊 Arquivos modificados:"
git status --short
echo ""

# 5. Fazer commit
echo "💾 Fazendo commit..."
git commit -m "feat: implementa sistema completo de comentários no blog (75%)

- Backend com 5 tabelas (prefixo blog_)
- APIs completas com RLS e moderação
- Frontend com componentes React
- Sistema de likes/dislikes funcional
- Respostas aninhadas até 3 níveis
- Editor Markdown com preview
- reCAPTCHA para usuários anônimos
- Base para notificações por email
- Faltando apenas painel admin

Progresso: Sistema 75% completo, projeto 33% total"

# 6. Push para GitHub
echo ""
echo "📤 Enviando para GitHub..."
git push origin main

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "🌐 O Vercel deve iniciar o deploy automaticamente."
echo "📱 Acompanhe em: https://vercel.com/dashboard"
echo ""
echo "⚠️ Lembre-se de configurar as variáveis de ambiente no Vercel:"
echo "   - NEXT_PUBLIC_RECAPTCHA_SITE_KEY"
echo "   - RECAPTCHA_SECRET_KEY"
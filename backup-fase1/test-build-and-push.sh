#!/bin/bash

echo "🔍 Verificando build localmente..."
echo ""

# Limpando cache
echo "Limpando cache..."
rm -rf .next 2>/dev/null

# Rodando build
echo ""
echo "Executando build..."
echo "================================"
npm run build

# Verificando resultado
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build local passou sem erros!"
    echo ""
    echo -n "Deseja fazer push para o GitHub? (s/n): "
    read resposta
    
    if [ "$resposta" = "s" ] || [ "$resposta" = "S" ]; then
        git add .
        git commit -m "fix: corrigir Badge variant de success para default no admin-comments-standalone"
        git push
        echo ""
        echo "✅ Push realizado! Verifique o Vercel em alguns minutos."
    else
        echo ""
        echo "❌ Push cancelado."
    fi
else
    echo ""
    echo "❌ Build falhou! Verifique os erros acima."
fi

echo ""
echo "Pressione ENTER para continuar..."
read

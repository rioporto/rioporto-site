#!/bin/bash

echo "🔍 Verificando arquivos no Git..."

# Verificar se os arquivos estão no Git
echo "Contextos:"
git ls-files | grep -E "contexts/" || echo "❌ Nenhum arquivo em contexts/"

echo -e "\nComponentes UI:"
git ls-files | grep -E "components/ui/" || echo "❌ Nenhum arquivo em components/ui/"

echo -e "\n📋 Arquivos relacionados ao erro:"
git ls-files | grep -E "(auth-context|button|card|input|label)"

echo -e "\n🔍 Verificando case sensitivity:"
# Verificar exatamente como estão os nomes
find . -name "auth-context*" -type f 2>/dev/null | grep -v node_modules
find ./components -name "button*" -type f 2>/dev/null | grep -v node_modules
find ./components -name "card*" -type f 2>/dev/null | grep -v node_modules

echo -e "\n📁 Estrutura de diretórios:"
ls -la contexts/ 2>/dev/null || echo "❌ Diretório contexts/ não encontrado"
ls -la components/ui/ 2>/dev/null || echo "❌ Diretório components/ui/ não encontrado"
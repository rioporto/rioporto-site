#!/bin/bash
# Script para fazer deploy das correções

echo "🚀 Iniciando deploy das correções..."

# Adicionar todas as mudanças
git add -A

# Commit com mensagem descritiva
git commit -m "fix: remove arquivo Twilio não utilizado e atualiza número de telefone

- Remove twilio-client.ts que estava causando erro de build
- Atualiza número de telefone para +55 21 2018-7776 em todo o projeto
- Mantém apenas a implementação oficial da API do WhatsApp (Meta)"

# Push para o repositório
git push origin main

echo "✅ Deploy concluído! Verifique o build na Vercel."

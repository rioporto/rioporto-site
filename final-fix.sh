#!/bin/bash
# final-fix.sh - Correção final

echo "🎯 Correção Final - Sistema de Cotações"
npm run build && git add -A && git commit -m "fix: melhorar tratamento de usuários anônimos

- Scripts SQL para corrigir RLS
- Opção de desabilitar RLS temporariamente
- Logs de autenticação na API" && git push

echo ""
echo "📋 EXECUTE NO SUPABASE:"
echo "1. fix_rls_anon.sql"
echo "   OU"
echo "2. disable_rls_quotations.sql (temporário)"
echo ""
echo "Depois teste novamente!"

#!/bin/bash
# quick-fix.sh - Deploy rápido

echo "🚀 Quick Fix Deploy"
npm run build && git add -A && git commit -m "fix: corrigir erro de map no frontend" && git push

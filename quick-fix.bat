@echo off
REM quick-fix.bat - Deploy rápido

echo 🚀 Quick Fix Deploy
call npm run build && git add -A && git commit -m "fix: corrigir erro de map no frontend" && git push
pause

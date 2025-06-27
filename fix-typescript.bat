@echo off
echo 🚀 Corrigindo erro TypeScript...
echo.

echo 📦 Limpando node_modules e package-lock...
rd /s /q node_modules 2>nul
del package-lock.json 2>nul

echo.
echo 🔄 Reinstalando dependências...
npm install

echo.
echo ✅ Dependências atualizadas!
echo.

echo 📋 Próximos comandos para executar:
echo.
echo git add package.json package-lock.json
echo git commit -m "fix: mover TypeScript e types para dependencies"
echo git push origin main
echo.
echo 🎉 Depois disso, o deploy deve funcionar!
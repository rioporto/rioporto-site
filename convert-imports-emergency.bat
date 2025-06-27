@echo off
echo 🔧 Convertendo imports @ para relativos...

echo.
echo ⚠️  AVISO: Esta é uma solução temporária!
echo.

REM Fazer backup primeiro
echo 📁 Criando backup...
xcopy /E /I /Y app app_backup >nul

echo.
echo 🔄 Convertendo arquivos...

REM PowerShell para fazer as substituições
powershell -Command "Get-ChildItem -Path app -Filter '*.tsx' -Recurse | ForEach-Object { $file = $_; $content = Get-Content $file.FullName -Raw; $depth = ($file.FullName.Split('\').Count - (Get-Location).Path.Split('\').Count - 1); $prefix = '../' * $depth; $content = $content -replace '@/contexts/', ($prefix + 'contexts/'); $content = $content -replace '@/components/', ($prefix + 'components/'); $content = $content -replace '@/lib/', ($prefix + 'lib/'); $content = $content -replace '@/hooks/', ($prefix + 'hooks/'); $content = $content -replace '@/types/', ($prefix + 'types/'); $content = $content -replace '@/data/', ($prefix + 'data/'); Set-Content -Path $file.FullName -Value $content -NoNewline }"

echo.
echo ✅ Conversão concluída!
echo.
echo 📌 Próximos passos:
echo 1. npm run build (testar localmente)
echo 2. git add .
echo 3. git commit -m "fix: converter imports para relativos temporariamente"
echo 4. git push origin main
echo.
echo 🔄 Para reverter: xcopy /E /I /Y app_backup app
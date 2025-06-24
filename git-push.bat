@echo off
echo 🚀 Rio Porto - Git Push Helper
echo ===============================

:: Verificar se há mudanças
git status --porcelain > temp.txt
set /p changes=<temp.txt
del temp.txt

if "%changes%"=="" (
    echo ✅ Nenhuma mudança para commitar!
    pause
    exit /b 0
)

:: Mostrar status
echo 📋 Status atual:
git status -s

:: Pedir mensagem de commit
echo.
set /p commit_message="📝 Mensagem do commit: "

:: Se não houver mensagem, usar padrão
if "%commit_message%"=="" (
    set commit_message=Update: %date% %time%
)

:: Executar comandos
echo.
echo 🔄 Adicionando arquivos...
git add .

echo 💾 Fazendo commit...
git commit -m "%commit_message%"

echo 📤 Enviando para o GitHub...
git push

echo.
echo ✅ Pronto! Código enviado para o GitHub!
echo 🌐 O Vercel fará o deploy automaticamente em alguns minutos.
pause

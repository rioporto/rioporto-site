@echo off
echo 🖼️ Fazendo build e deploy - Otimização de Imagens
echo ================================================

REM Build
echo 📦 Executando build...
call npm run build

REM Verificar se o build passou
if %errorlevel% equ 0 (
    echo ✅ Build passou!
    
    REM Git add, commit e push
    echo 📤 Fazendo commit...
    git add .
    git commit -m "perf: otimizar imagens com next/image - tarefa 1.2 concluída" -m "" -m "- Substituído img por Image em 3 arquivos" -m "- Blog post: imagem destacada e avatar" -m "- Blog listing: cards de posts" -m "- Crypto search: ícones de criptomoedas" -m "- Configurado sizes apropriado para cada contexto" -m "- Melhor performance e SEO" -m "" -m "Fase 2 - Sprint 1 - Tarefa 2/4 concluída (50%%)"
    
    git push
    
    echo ✅ Deploy concluído!
    echo 🎉 Otimização de imagens implementada com sucesso!
    echo.
    echo 📊 Progresso do Sprint 1: [████████░░░░░░░░] 50%%
) else (
    echo ❌ Build falhou! Verifique os erros.
    exit /b 1
)

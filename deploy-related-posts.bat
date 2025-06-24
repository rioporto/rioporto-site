@echo off
echo 🚀 Fazendo build e deploy - Posts Relacionados
echo =============================================

REM Build
echo 📦 Executando build...
call npm run build

REM Verificar se o build passou
if %errorlevel% equ 0 (
    echo ✅ Build passou!
    
    REM Git add, commit e push
    echo 📤 Fazendo commit...
    git add .
    git commit -m "feat: implementar posts relacionados no blog - tarefa 1.1 concluída" -m "- Criada tabela related_posts no Supabase" -m "- Implementada função getRelatedPosts()" -m "- Frontend já exibe posts relacionados" -m "- RLS e policies configuradas" -m "- Documentação atualizada" -m "" -m "Fase 2 - Sprint 1 - Tarefa 1/4 concluída"
    
    git push
    
    echo ✅ Deploy concluído!
    echo 🎉 Posts relacionados implementados com sucesso!
) else (
    echo ❌ Build falhou! Verifique os erros.
    exit /b 1
)

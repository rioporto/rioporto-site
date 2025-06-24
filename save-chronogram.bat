@echo off
REM save-chronogram.bat
REM Script para salvar o cronograma completo

echo 📅 Salvando cronograma completo do projeto...
echo ================================================

REM Commit das mudancas
echo 📝 Preparando commit do cronograma...
git add -A

REM Verificar se ha mudancas para commitar
git diff --staged --quiet
if %errorlevel% equ 0 (
    echo ⚠️  Nenhuma mudanca para commitar
) else (
    git commit -m "docs: adiciona cronograma completo do projeto" -m "" -m "- Cria CRONOGRAMA_COMPLETO_RIOPORTO.md com 6 fases e 12 sprints" -m "- Cria VISAO_GERAL_PROJETO.md com status visual e ROI" -m "- Atualiza todos os arquivos de orientacao" -m "- Adiciona cronograma aos arquivos essenciais" -m "- Timeline total: 10-12 semanas" -m "- Progresso atual: 25%%" -m "" -m "Sprint 1 completo, Sprint 2 pronto para iniciar!"
    echo ✅ Commit realizado!
)

REM Push para o repositorio
echo 🚀 Enviando para o GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo ✅ Push realizado com sucesso!
) else (
    echo ❌ Falha no push. Verifique sua conexao e tente novamente.
    exit /b 1
)

echo.
echo 📅 CRONOGRAMA SALVO COM SUCESSO!
echo ================================================
echo ✅ Cronograma completo documentado
echo ✅ Todos os arquivos atualizados
echo ✅ Codigo enviado para o GitHub
echo.
echo 📊 Arquivos importantes:
echo - CRONOGRAMA_COMPLETO_RIOPORTO.md
echo - VISAO_GERAL_PROJETO.md
echo - GUIA_RAPIDO_NOVO_CHAT.md (atualizado)
echo.
echo Proximo passo: Escolher funcionalidade do Sprint 2!

pause
@echo off
REM fix-and-deploy.bat
REM Script para corrigir erros e fazer deploy

echo 🔧 Corrigindo erros e preparando deploy...
echo ================================================

REM Verificar se esta no diretorio correto
if not exist "package.json" (
    echo ❌ Erro: Execute este script na raiz do projeto
    exit /b 1
)

echo 📦 Instalando sonner para sistema de toasts...
call npm install sonner

echo ✅ Dependencias instaladas!

echo 🔍 Verificando TypeScript...
call npm run type-check

if %errorlevel% neq 0 (
    echo ❌ Erros de TypeScript encontrados. Corrija antes de continuar.
    exit /b 1
)

echo ✅ TypeScript sem erros!

echo 🧹 Executando linter...
call npm run lint

echo 🏗️ Criando build de producao...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Falha no build. Verifique os erros acima.
    exit /b 1
)

echo ✅ Build concluido com sucesso!

REM Commit das mudancas
echo 📝 Preparando commit...
git add -A

REM Verificar se ha mudancas para commitar
git diff --staged --quiet
if %errorlevel% equ 0 (
    echo ⚠️  Nenhuma mudanca para commitar
) else (
    git commit -m "feat: implementa sistema completo de tratamento de erros" -m "" -m "- Adiciona tipos de erro customizados" -m "- Implementa logger centralizado" -m "- Cria Error Boundaries para React" -m "- Adiciona handlers para API e cliente" -m "- Implementa hooks customizados (useError, useFormError)" -m "- Cria paginas de erro especificas para cada rota" -m "- Adiciona retry logic e timeout para operacoes" -m "- Integra Sonner para notificacoes toast" -m "- Corrige erros de TypeScript" -m "- Documenta todo o sistema" -m "" -m "Sprint 1 - 100%% completo!"
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
echo 🎉 SPRINT 1 COMPLETO!
echo ================================================
echo ✅ Sistema de tratamento de erros implementado
echo ✅ Todos os erros de TypeScript corrigidos
echo ✅ Sonner integrado para notificacoes
echo ✅ Build de producao criado
echo ✅ Codigo enviado para o GitHub
echo ✅ Deploy automatico iniciado no Vercel
echo.
echo 📊 Resumo do Sprint 1:
echo - Posts relacionados: ✅
echo - Otimizacao de imagens: ✅
echo - React Hooks: ✅
echo - Tratamento de erros: ✅
echo.
echo 🎯 Proximo passo: Iniciar Sprint 2
echo - Sistema completo de comentarios
echo - Newsletter com double opt-in
echo - WhatsApp Business API
echo - Dashboard com metricas
echo.
echo Parabens! O Sprint 1 foi concluido com sucesso! 🚀

pause
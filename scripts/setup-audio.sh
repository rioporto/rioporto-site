#!/bin/bash
# Script para instalar dependências e gerar áudios

echo "🔧 Instalando Edge-TTS..."
pip install edge-tts

echo "📁 Criando diretório de áudio..."
mkdir -p ../public/audio/minicurso

echo "🎙️ Gerando áudios..."
python generate-audio.py

echo "✅ Concluído!"

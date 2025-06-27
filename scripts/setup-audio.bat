@echo off
REM Script para instalar dependências e gerar áudios no Windows

echo 🔧 Instalando Edge-TTS...
pip install edge-tts

echo 📁 Criando diretório de áudio...
if not exist "..\public\audio\minicurso" mkdir "..\public\audio\minicurso"

echo 🎙️ Gerando áudios...
python generate-audio.py

echo ✅ Concluído!
pause

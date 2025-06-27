# 🎙️ GUIA DE GERAÇÃO DE ÁUDIO PARA MINICURSO

## Opções de Text-to-Speech (TTS)

### 1. ElevenLabs (Recomendado) 🌟
**Prós**: Voz mais natural, suporta português brasileiro
**Contras**: Pago ($5-22/mês)
**Como usar**:
```bash
# Instalar CLI
npm install -g elevenlabs

# Gerar áudio
elevenlabs --api-key YOUR_KEY --voice "Adam" --text "Seu texto aqui" --output audio.mp3
```

### 2. Google Cloud Text-to-Speech
**Prós**: Boa qualidade, múltiplas vozes PT-BR
**Contras**: Precisa conta Google Cloud
**Código exemplo**:
```typescript
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();

const request = {
  input: {text: 'Texto para narrar'},
  voice: {languageCode: 'pt-BR', name: 'pt-BR-Wavenet-A'},
  audioConfig: {audioEncoding: 'MP3'},
};

const [response] = await client.synthesizeSpeech(request);
```

### 3. Azure Speech Services
**Prós**: Excelente qualidade, vozes neurais
**Contras**: Setup mais complexo
```bash
curl --location --request POST 'https://brazilsouth.tts.speech.microsoft.com/cognitiveservices/v1' \
--header 'Ocp-Apim-Subscription-Key: YOUR_KEY' \
--header 'Content-Type: application/ssml+xml' \
--header 'X-Microsoft-OutputFormat: audio-16khz-128kbitrate-mono-mp3' \
--data-raw '<speak version="1.0" xml:lang="pt-BR">
    <voice name="pt-BR-FranciscaNeural">
        Seu texto aqui
    </voice>
</speak>'
```

### 4. Edge-TTS (Gratuito) 🆓
**Prós**: Totalmente gratuito, usa vozes do Edge
**Contras**: Precisa Python
```bash
# Instalar
pip install edge-tts

# Gerar áudio
edge-tts --voice "pt-BR-Francisca" --text "Seu texto" --write-media "audio.mp3"
```

## Script para Gerar Todos os Áudios

```typescript
// scripts/generate-audio.ts
import { chapterAudios } from '../data/minicurso-audio';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

async function generateAudio(chapterId: string, text: string, outputPath: string) {
  // Usando edge-tts (gratuito)
  const command = `edge-tts --voice "pt-BR-Antonio" --text "${text}" --write-media "${outputPath}"`;
  
  try {
    await execAsync(command);
    console.log(`✅ Áudio gerado: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Erro ao gerar ${chapterId}:`, error);
  }
}

async function generateAllAudios() {
  // Criar diretório se não existir
  const audioDir = path.join(process.cwd(), 'public', 'audio', 'minicurso');
  await fs.mkdir(audioDir, { recursive: true });

  // Gerar cada áudio
  for (const [chapterId, audioData] of Object.entries(chapterAudios)) {
    const outputPath = path.join(audioDir, path.basename(audioData.audioUrl));
    await generateAudio(chapterId, audioData.transcript || '', outputPath);
    
    // Aguardar um pouco entre gerações para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Executar
generateAllAudios().then(() => {
  console.log('🎉 Todos os áudios foram gerados!');
}).catch(console.error);
```

## Textos para Narração

### 01-capa.mp3
```
Bem-vindo ao Manual P2P: Negocie Bitcoin como um Profissional. 
Este é o guia definitivo para você aprender a comprar ou vender Bitcoin 
com total segurança e privacidade. Sou Johnny Ferreira, especialista em 
Bitcoin e criptomoedas, e vou guiar você nesta jornada rumo à soberania 
financeira. Prepare-se para descobrir os segredos do mercado P2P e 
transformar sua forma de negociar criptomoedas.
```

### 02-introducao.mp3
```
Em 2008, um documento revolucionário intitulado "Bitcoin: Um Sistema de 
Dinheiro Eletrônico Peer-to-Peer" foi publicado por uma figura anônima 
conhecida como Satoshi Nakamoto. A visão era clara e poderosa: permitir 
que pagamentos online fossem enviados diretamente de uma parte para outra, 
sem a necessidade de passar por uma instituição financeira. Essa ideia de 
transação "ponto a ponto", ou P2P, é a alma do Bitcoin e o fundamento de 
uma nova era de soberania financeira. Hoje, você aprenderá a usar essa 
tecnologia revolucionária a seu favor.
```

[Continue com os outros capítulos...]

## Comandos Rápidos

### Gerar um áudio específico:
```bash
# Edge-TTS (gratuito)
edge-tts --voice "pt-BR-Antonio" --text "@cap1.txt" --write-media "03-cap1.mp3"

# ElevenLabs (pago)
elevenlabs --voice "Adam" --text "@cap1.txt" --output "03-cap1.mp3"
```

### Listar vozes disponíveis:
```bash
# Edge-TTS
edge-tts --list-voices | grep pt-BR

# Vozes recomendadas:
# Masculinas: pt-BR-Antonio, pt-BR-Julio
# Femininas: pt-BR-Francisca, pt-BR-Thalita
```

## Dicas de Produção

1. **Velocidade**: Use 1.0x para narração normal
2. **Pausas**: Adicione vírgulas para pausas curtas, pontos para pausas longas
3. **Ênfase**: Use MAIÚSCULAS para palavras importantes
4. **Qualidade**: Exporte em MP3 128kbps para balancear qualidade/tamanho
5. **Revisão**: Sempre ouça o áudio gerado antes de publicar

## Estrutura de Arquivos

```
public/
└── audio/
    └── minicurso/
        ├── 01-capa.mp3
        ├── 02-introducao.mp3
        ├── 03-cap1.mp3
        ├── 04-cap2.mp3
        ├── 05-cap3.mp3
        ├── 06-cap4.mp3
        ├── 07-cap5.mp3
        ├── 08-cap6.mp3
        └── 09-conclusao.mp3
```

## Alternativa: Gravação Manual

Se preferir gravar manualmente:
1. Use Audacity (gratuito)
2. Microfone USB de qualidade
3. Ambiente silencioso
4. Fale pausadamente
5. Edite respirações e ruídos

---

**Próximo passo**: Escolha o método e gere os 9 áudios do minicurso!
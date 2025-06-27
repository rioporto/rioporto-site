# 📚 MINICURSO INTERATIVO - DOCUMENTAÇÃO

**Última atualização**: 29/01/2025  
**Status**: 95% implementado

## 🎯 Visão Geral

O minicurso "Manual P2P: Negocie Bitcoin como um Profissional" é uma experiência educacional interativa online, inspirada no modelo do Canva, com narração em áudio para cada página.

## ✅ O que já está pronto

### 1. Conteúdo Completo
- 16 páginas de conteúdo educativo
- Textos profissionais sobre P2P
- Estrutura didática organizada

### 2. Sistema de Acesso
- Geração de token único por lead
- Validação de acesso temporário (30 dias)
- Rastreamento de atividades

### 3. Interface Online
- Visualizador responsivo
- Navegação entre páginas
- Menu lateral com sumário
- Indicador de progresso
- Design profissional

### 4. Integração com Lead Capture
- Modal atualizado
- Captura de dados completa
- Token gerado automaticamente

### 5. Player de Áudio
- Componente completo criado
- Controles de velocidade
- Skip forward/backward
- Volume e mudo
- Progress bar interativo
- Configurações persistentes

### 6. Sistema de Email
- Template HTML responsivo
- API route criada
- Integração com lead capture
- Guia de configuração completo

## 🔄 O que falta implementar

### 1. Gerar os Arquivos de Áudio
**Objetivo**: Cada página terá um áudio narrando o conteúdo

**Status**: Player implementado, falta apenas gerar os arquivos de áudio

**Opções para gerar áudio**:
1. **Edge-TTS** (gratuito): `edge-tts --voice "pt-BR-Antonio" --text "texto" --write-media "audio.mp3"`
2. **ElevenLabs** (pago, melhor qualidade)
3. **Google TTS** (precisa conta Google Cloud)
4. **Gravação manual** com Audacity

**Arquivos necessários** (9 total):
- 01-capa.mp3
- 02-introducao.mp3
- 03-cap1.mp3
- 04-cap2.mp3
- 05-cap3.mp3
- 06-cap4.mp3
- 07-cap5.mp3
- 08-cap6.mp3
- 09-conclusao.mp3

### 2. Configurar Serviço de Email
**Status**: Templates e API prontos, falta apenas configurar serviço

**Próximos passos**:
1. Escolher serviço (Resend recomendado)
2. Criar conta e verificar domínio
3. Adicionar API key ao .env.local
4. Descomentar código de envio em `/api/lead-capture/send-email/route.ts`

### 3. Analytics Detalhado
- Tempo gasto por página
- Taxa de conclusão
- Páginas mais revisitadas
- Feedback por página

## 🎨 Melhorias Futuras

### Interface Estilo Canva
1. **Editor Visual**: Destacar trechos importantes
2. **Animações**: Transições suaves entre páginas
3. **Interatividade**: Quizzes e exercícios
4. **Bookmarks**: Salvar páginas favoritas
5. **Modo Noturno**: Já implementado

### Gamificação
1. **Progresso Visual**: Barra de conclusão
2. **Badges**: Por completar capítulos
3. **Certificado**: Ao concluir 100%
4. **Ranking**: Melhores alunos

## 📊 Métricas de Sucesso

### KPIs Principais
- Taxa de abertura: >80%
- Taxa de conclusão: >60%
- Tempo médio: 45-60 min
- NPS: >8

### Tracking Implementado
```typescript
// Eventos rastreados
- minicurso_accessed
- page_viewed
- audio_played
- course_completed
- feedback_submitted
```

## 🔧 Configuração Técnica

### Banco de Dados
```sql
-- Tabela de atividades do minicurso
minicurso_activities:
- lead_id
- activity_type
- page_id
- duration_seconds
- created_at

-- Campos na tabela leads
- access_token
- token_expires_at
- last_accessed_at
- access_count
- completion_percentage
```

### API Endpoints
```typescript
GET  /api/minicurso?token=xxx     // Validar acesso
POST /api/minicurso/activity      // Registrar atividade
GET  /api/minicurso/progress      // Ver progresso
POST /api/minicurso/feedback      // Enviar feedback
```

## 🚀 Próximos Passos

1. **Prioridade Alta**:
   - Gravar/gerar áudios com IA
   - Implementar player de áudio
   - Configurar envio de email

2. **Prioridade Média**:
   - Analytics detalhado
   - Modo offline (PWA)
   - Versão mobile otimizada

3. **Prioridade Baixa**:
   - Animações avançadas
   - Sistema de notas
   - Compartilhamento social

---

**Responsável**: Johnny Helder  
**Prazo estimado**: 2-3 dias para áudio + email
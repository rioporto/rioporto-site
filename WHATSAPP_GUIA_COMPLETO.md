# 📱 GUIA COMPLETO - Configurar WhatsApp Business API

## 🔑 Onde Encontrar os Tokens do WhatsApp

### ⚠️ IMPORTANTE: 
Para usar o WhatsApp Business API, você precisa:
1. Uma conta no **Meta Business** (Facebook Business)
2. Um número de telefone que **NÃO** esteja usando WhatsApp pessoal
3. Verificação da sua empresa

---

## 📋 Passo a Passo Completo

### 1️⃣ Criar Conta Meta Business
1. Acesse: https://business.facebook.com
2. Clique em "Criar conta"
3. Preencha os dados da empresa

### 2️⃣ Configurar WhatsApp Business
1. No Meta Business, vá para: **Configurações > WhatsApp Business**
2. Clique em "Começar"
3. Escolha a opção **"API do WhatsApp Business"**

### 3️⃣ Criar App no Meta for Developers
1. Acesse: https://developers.facebook.com
2. Clique em "Meus Apps" > "Criar App"
3. Escolha "Business" como tipo
4. Configure:
   - Nome do App: "Rio Porto P2P WhatsApp"
   - Email de contato: seu email
   - Conta de negócios: Selecione a conta criada

### 4️⃣ Adicionar WhatsApp ao App
1. No painel do app, clique em "Adicionar produtos"
2. Encontre "WhatsApp" e clique em "Configurar"
3. Siga o assistente de configuração

### 5️⃣ Obter os Tokens

#### Access Token Temporário (Teste):
1. No painel do WhatsApp, vá para "Primeiros passos"
2. Em "Token de acesso temporário", clique em "Copiar"
3. **⚠️ Este token expira em 24h!**

#### Access Token Permanente:
1. Vá para "Configurações" > "Básico"
2. Copie o "ID do App" e "Chave Secreta do App"
3. Use esta URL no navegador:
```
https://graph.facebook.com/oauth/access_token?client_id=SEU_APP_ID&client_secret=SUA_CHAVE_SECRETA&grant_type=client_credentials
```
4. Copie o `access_token` da resposta

#### Phone Number ID:
1. No painel do WhatsApp
2. Seção "Números de telefone"
3. Copie o ID do número

### 6️⃣ Configurar Webhook
1. No painel do WhatsApp, vá para "Configuração"
2. Em "Webhook", clique em "Editar"
3. Configure:
   - **URL de callback**: `https://rioporto-site.vercel.app/api/whatsapp/webhook`
   - **Token de verificação**: `rioporto_verify_token_2025`
4. Inscreva-se nos campos:
   - ✅ messages
   - ✅ messaging_postbacks
   - ✅ messaging_optins
   - ✅ message_status

---

## 🆓 Alternativa GRATUITA: WhatsApp Business API (Sandbox)

### Para testar sem verificação:
1. Use o **WhatsApp Business API Sandbox**
2. Acesse: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
3. Ou use: https://www.whatsapp.com/business/api-sandbox

### Limitações do Sandbox:
- Apenas números pré-aprovados
- Mensagens têm prefixo de teste
- Limite de mensagens por dia

---

## 💰 Alternativa PAGA (Mais Fácil)

### Serviços que facilitam:

#### 1. Twilio WhatsApp
- Site: https://www.twilio.com/whatsapp
- Preço: ~$0.005 por mensagem
- Setup em 10 minutos
- Não precisa verificação Meta

#### 2. Chatpay (Brasileiro)
- Site: https://chatpay.com.br
- Preço: A partir de R$ 99/mês
- Suporte em português
- Integração fácil

#### 3. Z-API
- Site: https://z-api.io
- Preço: A partir de R$ 50/mês
- API simples
- Documentação em português

---

## 🚀 Configuração no .env.local

### Para Meta Business API:
```env
# WhatsApp Cloud API (Meta)
WHATSAPP_ACCESS_TOKEN="EAAxxxxxxxxxxxxxxxx"
WHATSAPP_PHONE_NUMBER_ID="123456789012345"
WHATSAPP_BUSINESS_ACCOUNT_ID="123456789012345"
WHATSAPP_VERIFY_TOKEN="rioporto_verify_token_2025"
```

### Para Twilio:
```env
# Twilio WhatsApp
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="xxxxxxxxxxxxxxxxxx"
TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"
WHATSAPP_VERIFY_TOKEN="rioporto_verify_token_2025"
```

---

## ⚡ Recomendação para Rio Porto P2P

### Para começar rápido:
1. **Use Twilio** - Mais fácil e rápido
2. **Ou Z-API** - Brasileiro e barato
3. **Depois** migre para Meta Business API oficial

### Por quê?
- Setup em minutos vs semanas
- Não precisa verificação de empresa
- Suporte melhor
- Pode testar hoje mesmo

---

## 📞 Precisa de Ajuda?

### Consultoria WhatsApp Business:
- Meta Partners: https://www.facebook.com/business/partner-directory
- Especialistas brasileiros em WhatsApp Business API

### Comunidades:
- WhatsApp Business API Developers (Facebook)
- Stack Overflow tag: whatsapp-business-api

---

**💡 Dica**: Comece com Twilio ou Z-API para testar, depois migre para a API oficial quando o volume justificar!
# 📱 GUIA COMPLETO - CONFIGURAÇÃO WHATSAPP BUSINESS API

## 🎯 Visão Geral

Este guia mostra como configurar a WhatsApp Business API oficial (Cloud API) para o Rio Porto P2P receber notificações automáticas de cotações.

## 📋 Pré-requisitos

1. **Conta Facebook Business** (ou criar uma)
2. **Número de telefone dedicado** (não pode estar em uso no WhatsApp comum)
3. **Cartão de crédito** (para verificação, não será cobrado no início)

## 🚀 Passo a Passo

### 1. Criar App no Facebook Developers

1. Acesse: https://developers.facebook.com
2. Clique em **"Meus Apps"** → **"Criar App"**
3. Selecione **"Negócios"** como tipo
4. Preencha:
   - Nome do App: `Rio Porto P2P API`
   - Email de contato: `johnnyhelder@gmail.com`
   - Conta de negócios: Selecione ou crie uma

### 2. Adicionar WhatsApp ao App

1. No dashboard do app, clique em **"Adicionar Produto"**
2. Encontre **"WhatsApp"** e clique em **"Configurar"**
3. Na próxima tela, clique em **"Começar"**

### 3. Configurar Número de Telefone

1. Em **"Configuração da API"** → **"Número de telefone"**
2. Clique em **"Adicionar número de telefone"**
3. Digite o número: `+55 21 2018-7776` (ou outro dedicado)
4. Escolha o método de verificação (SMS ou ligação)
5. Insira o código recebido

⚠️ **IMPORTANTE**: Este número NÃO pode estar ativo no WhatsApp comum!

### 4. Gerar Token de Acesso Permanente

1. Vá para **"Configuração da API"** → **"Token de acesso"**
2. Clique em **"Gerar token permanente"**
3. Copie e guarde o token com segurança

### 5. Obter IDs Necessários

Na página de configuração, você verá:
- **Phone number ID**: Algo como `123456789012345`
- **WhatsApp Business Account ID**: Algo como `987654321098765`

### 6. Configurar Variáveis de Ambiente

No arquivo `.env.local`, adicione:

```env
# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=EAAxxxxxx...seu_token_aqui
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765
WHATSAPP_VERIFY_TOKEN=rioporto_verify_token_2025
WHATSAPP_BUSINESS_NUMBER=+552120187776
```

### 7. Testar Envio de Mensagem

Use este curl para testar (substitua os valores):

```bash
curl -X POST https://graph.facebook.com/v18.0/SEU_PHONE_NUMBER_ID/messages \
-H "Authorization: Bearer SEU_ACCESS_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "messaging_product": "whatsapp",
  "to": "552120187776",
  "type": "text",
  "text": {
    "body": "Teste de integração Rio Porto P2P ✅"
  }
}'
```

### 8. Configurar na Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto `rioporto-site`
3. Vá em **Settings** → **Environment Variables**
4. Adicione todas as variáveis do passo 6

## 📊 Formato da Notificação

Quando uma cotação for enviada, a equipe receberá:

```
🔔 *Nova Cotação Recebida*

📊 *Detalhes da Operação:*
• Tipo: COMPRA
• Moeda: Bitcoin (BTC)
• Valor R$: 5.000,00
• Valor Cripto: 0.00123456

👤 *Dados do Cliente:*
• Nome: João Silva
• Email: joao@email.com
• WhatsApp: +55 21 99999-9999

💬 *Observações:*
Gostaria de comprar ainda hoje

⏰ Data/Hora: 28/01/2025 15:30:45
```

## 🔧 Troubleshooting

### Erro: "Token inválido"
- Verifique se copiou o token completo
- Gere um novo token se necessário

### Erro: "Número não registrado"
- Certifique-se que o número está verificado
- Número não pode estar no WhatsApp comum

### Mensagem não chega
- Verifique se o número destino está correto
- Confirme que tem créditos na conta (sandbox gratuita limitada)

## 💰 Custos

- **Primeiras 1.000 mensagens**: Grátis (por mês)
- **Após**: ~R$ 0,10 por mensagem
- **Sem mensalidade** ou taxa de setup

## 🔐 Segurança

1. **Nunca** commite o token no Git
2. Use sempre variáveis de ambiente
3. Rotacione tokens periodicamente
4. Configure webhook para receber respostas (opcional)

## 📚 Documentação Oficial

- Cloud API: https://developers.facebook.com/docs/whatsapp/cloud-api
- Enviar mensagens: https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
- Webhooks: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks

## ✅ Checklist de Verificação

- [ ] App criado no Facebook Developers
- [ ] WhatsApp produto adicionado
- [ ] Número verificado
- [ ] Token permanente gerado
- [ ] IDs copiados
- [ ] Variáveis no .env.local
- [ ] Teste de envio bem-sucedido
- [ ] Variáveis na Vercel configuradas

---

**Após completar todos os passos, o sistema estará pronto para enviar notificações automáticas!**

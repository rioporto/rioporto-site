# 🚀 Configuração de Variáveis de Ambiente na Vercel

## 📋 Lista Completa de Variáveis

### 1. Variáveis Essenciais (OBRIGATÓRIAS)

#### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://ncxilaqbmlituutruqqs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jeGlsYXFibWxpdHV1dHJ1cXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDYyOTQsImV4cCI6MjA2NjE4MjI5NH0.5Kjbiho5zk0WS-AUyMN9cMPWRu8pY8wvLF3urS0eKjA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jeGlsYXFibWxpdHV1dHJ1cXFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDYwNjI5NCwiZXhwIjoyMDY2MTgyMjk0fQ.jTd3vm9JF37Usl-a-3dtyT4Jz3ZpxjI2O1_AT_Irzo8
```

#### Resend (Email)
```
RESEND_API_KEY=re_XnMasRgC_CDDHtCo3anZHUuBnfkgbeZSA
RESEND_FROM_EMAIL=noreply@rioporto.com
```

#### Zendesk
```
NEXT_PUBLIC_ZENDESK_KEY=91137f06-867b-4536-9657-dd64d4f92617
ZENDESK_WEBHOOK_SECRET=99be7c9fb49cfaae98f7de46cde9f7e5b964f5da0ede3057cacf098d6d0e252a
```

#### App
```
NEXT_PUBLIC_APP_URL=https://rioporto-site.vercel.app
NODE_ENV=production
```

### 2. Variáveis Opcionais (para futuras features)

#### WhatsApp
```
WHATSAPP_BUSINESS_NUMBER=5521340003259
```

#### Google Maps (substituir com API key real quando necessário)
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

#### Hotmart (substituir quando implementar integração)
```
HOTMART_API_KEY=your_hotmart_api_key
HOTMART_WEBHOOK_SECRET=your_hotmart_webhook_secret
```

#### Bitcoin (substituir quando implementar carteira)
```
BITCOIN_XPUB=your_bitcoin_xpub
BITCOIN_WEBHOOK_SECRET=your_bitcoin_webhook_secret
```

---

## 🔧 Como Configurar na Vercel

### Passo 1: Acessar Dashboard da Vercel
1. Acesse https://vercel.com/dashboard
2. Faça login com sua conta GitHub
3. Clique no projeto `rioporto-site`

### Passo 2: Acessar Configurações
1. No menu do projeto, clique em **Settings**
2. No menu lateral, clique em **Environment Variables**

### Passo 3: Adicionar Variáveis
Para cada variável:

1. Clique em **Add New**
2. Preencha:
   - **Key**: Nome da variável (ex: `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: Valor da variável
   - **Environment**: Selecione todas as opções:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

3. Clique em **Save**

### Passo 4: Ordem de Adição (Recomendada)

1. **Primeiro**: Adicione todas as variáveis `NEXT_PUBLIC_*` (públicas)
2. **Segundo**: Adicione as variáveis secretas (sem `NEXT_PUBLIC_`)
3. **Terceiro**: Verifique se todas foram adicionadas corretamente

---

## ⚠️ IMPORTANTE

### Variáveis Públicas vs Secretas

- **NEXT_PUBLIC_***: Podem ser vistas no código do frontend
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_ZENDESK_KEY`
  - `NEXT_PUBLIC_APP_URL`
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

- **Variáveis Secretas**: NUNCA devem ser expostas no frontend
  - `SUPABASE_SERVICE_ROLE_KEY` ⚠️
  - `RESEND_API_KEY` ⚠️
  - `ZENDESK_WEBHOOK_SECRET` ⚠️
  - `HOTMART_*` ⚠️
  - `BITCOIN_*` ⚠️

### Valores que DEVEM ser alterados

1. **NEXT_PUBLIC_APP_URL**: Mudar de `http://localhost:3000` para `https://rioporto-site.vercel.app`
2. **NODE_ENV**: Mudar de `development` para `production`

---

## 🚀 Deploy Após Configuração

Após adicionar todas as variáveis:

1. A Vercel automaticamente fará um novo deploy
2. Aguarde o build finalizar (cerca de 2-3 minutos)
3. Acesse o site para verificar se tudo está funcionando

---

## ✅ Checklist de Verificação

Após o deploy, teste:

- [ ] Login/Cadastro funcionando
- [ ] Sistema de comentários operacional
- [ ] Minicurso abrindo corretamente
- [ ] Widget Zendesk visível
- [ ] Cotação P2P calculando
- [ ] Blog carregando posts
- [ ] Dashboard admin acessível

---

## 🆘 Troubleshooting

### Se algo não funcionar:

1. **Verifique os logs**:
   - Vercel Dashboard → Functions → View Logs

2. **Variáveis mais comuns de erro**:
   - `NEXT_PUBLIC_APP_URL` incorreta
   - Faltou alguma variável essencial
   - Variável com espaços ou caracteres extras

3. **Como debugar**:
   - Abra o Console do navegador (F12)
   - Procure por erros de API
   - Verifique Network tab para requisições falhando

---

## 📞 Suporte

Se precisar de ajuda:
- Email: johnnyhelder@gmail.com
- WhatsApp: +55 21 2018-7776

---

**Última atualização**: 27/01/2025
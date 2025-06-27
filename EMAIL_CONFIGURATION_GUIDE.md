# 📧 CONFIGURAÇÃO DE EMAIL - RIO PORTO P2P

## Opções de Serviços de Email

### 1. Resend (Recomendado) ⭐
**Prós**: Simples, moderno, boa documentação, preço justo
**Contras**: Relativamente novo
**Preço**: Gratuito até 3000 emails/mês

#### Instalação:
```bash
npm install resend
```

#### Configuração:
```typescript
// app/api/lead-capture/send-email/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const { data, error } = await resend.emails.send({
  from: 'Rio Porto P2P <noreply@rioporto.com>',
  to: [lead.email],
  subject: '🎯 Seu acesso ao Manual P2P foi liberado!',
  html: getEmailTemplate(lead.full_name, accessLink),
  text: getEmailTextTemplate(lead.full_name, accessLink),
});
```

#### Passos:
1. Criar conta em https://resend.com
2. Verificar domínio (adicionar registros DNS)
3. Gerar API Key
4. Adicionar ao .env.local: `RESEND_API_KEY=re_xxxxx`

### 2. SendGrid
**Prós**: Robusto, confiável, muitos recursos
**Contras**: Interface complexa
**Preço**: Gratuito até 100 emails/dia

#### Instalação:
```bash
npm install @sendgrid/mail
```

#### Configuração:
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: lead.email,
  from: 'noreply@rioporto.com',
  subject: '🎯 Seu acesso ao Manual P2P foi liberado!',
  text: getEmailTextTemplate(lead.full_name, accessLink),
  html: getEmailTemplate(lead.full_name, accessLink),
};

await sgMail.send(msg);
```

### 3. AWS SES
**Prós**: Muito barato, escalável
**Contras**: Setup complexo, precisa sair do sandbox
**Preço**: $0.10 por 1000 emails

### 4. Mailgun
**Prós**: API poderosa, boa deliverability
**Contras**: Mais caro
**Preço**: Pago desde o início

## Configuração de Domínio (Importante!)

Para qualquer serviço, você precisa configurar:

### 1. Registros DNS
```
# SPF Record
TXT @ "v=spf1 include:_spf.resend.com ~all"

# DKIM Records (fornecidos pelo serviço)
TXT resend._domainkey "k=rsa; p=MIGfMA0GCSq..."

# DMARC (opcional mas recomendado)
TXT _dmarc "v=DMARC1; p=none; rua=mailto:dmarc@rioporto.com"
```

### 2. Verificação de Domínio
Cada serviço tem processo próprio de verificação.

## Template de Email Responsivo

O template já está criado em:
`app/api/lead-capture/send-email/route.ts`

Características:
- ✅ HTML responsivo
- ✅ Versão texto puro
- ✅ Call-to-action claro
- ✅ Branding consistente
- ✅ Link de acesso destacado

## Variáveis de Ambiente

Adicione ao `.env.local`:
```env
# Email Service (escolha um)
RESEND_API_KEY=re_xxxxxxxxxxxxx
# ou
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
# ou
AWS_SES_REGION=us-east-1
AWS_SES_ACCESS_KEY_ID=xxxxx
AWS_SES_SECRET_ACCESS_KEY=xxxxx

# Email Settings
EMAIL_FROM_NAME="Rio Porto P2P"
EMAIL_FROM_ADDRESS="noreply@rioporto.com"
EMAIL_REPLY_TO="contato@rioporto.com"
```

## Integração com Lead Capture

Atualizar o modal de lead capture para enviar email:

```typescript
// components/lead-capture/lead-capture-modal.tsx
const response = await fetch('/api/lead-capture', {
  method: 'POST',
  // ... dados do lead
});

if (response.ok) {
  const data = await response.json();
  
  // Enviar email com link de acesso
  await fetch('/api/lead-capture/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadId: data.leadId })
  });
}
```

## Fluxo de Email Automatizado

### 1. Email de Boas-Vindas (Imediato)
- Enviado após cadastro
- Contém link de acesso ao minicurso
- Template já criado

### 2. Email de Lembrete (24h depois)
- Se não acessou o minicurso
- "Você esqueceu seu Manual P2P?"

### 3. Email de Progresso (3 dias)
- Se começou mas não terminou
- "Continue de onde parou"

### 4. Email de Conclusão (Ao finalizar)
- Certificado de conclusão
- Oferta especial Rio Porto P2P

## Monitoramento e Analytics

### Métricas Importantes:
- Taxa de abertura (target: >40%)
- Taxa de clique (target: >20%)
- Bounces (<5%)
- Spam complaints (<0.1%)

### Ferramentas de Tracking:
```typescript
// Adicionar tracking de abertura
const trackingPixel = `<img src="${baseUrl}/api/email-tracking/open?leadId=${leadId}" width="1" height="1" />`;

// Adicionar UTMs nos links
const trackedLink = `${accessLink}?utm_source=email&utm_medium=welcome&utm_campaign=minicurso`;
```

## Testes de Email

### 1. Teste Local com Mailtrap
```env
# .env.local (desenvolvimento)
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=xxxxx
MAILTRAP_PASS=xxxxx
```

### 2. Preview de Templates
Criar página de preview:
```typescript
// app/email-preview/page.tsx
export default function EmailPreview() {
  const mockData = {
    name: "João Silva",
    accessLink: "https://rioporto.com/minicurso?token=xxx"
  };
  
  return (
    <div dangerouslySetInnerHTML={{ 
      __html: getEmailTemplate(mockData.name, mockData.accessLink) 
    }} />
  );
}
```

### 3. Testes A/B
- Subject lines diferentes
- CTAs variados
- Horários de envio

## Troubleshooting

### Email não chega:
1. Verificar spam/lixeira
2. Checar logs do serviço
3. Validar configuração DNS
4. Testar com email diferente

### Taxa de abertura baixa:
1. Melhorar subject line
2. Testar horários diferentes
3. Segmentar lista

### Links quebrados:
1. Validar URLs
2. Checar HTTPS
3. Testar em diferentes clients

## Compliance e Boas Práticas

### LGPD/GDPR:
- ✅ Double opt-in (recomendado)
- ✅ Link de descadastro
- ✅ Política de privacidade
- ✅ Dados criptografados

### Anti-Spam:
- ✅ Autenticação SPF/DKIM/DMARC
- ✅ Conteúdo relevante
- ✅ Proporção texto/imagem
- ✅ Evitar spam triggers

### Lista de Checagem:
- [ ] Domínio verificado
- [ ] DNS configurado
- [ ] Templates testados
- [ ] Tracking implementado
- [ ] Fallback para erro
- [ ] Logs configurados
- [ ] Métricas definidas

## Scripts Úteis

### Testar envio:
```bash
# test-email.js
const { sendWelcomeEmail } = require('./email-service');

sendWelcomeEmail({
  email: 'teste@example.com',
  name: 'Teste',
  accessToken: 'test-token'
}).then(console.log).catch(console.error);
```

### Reenviar emails falhados:
```sql
-- Buscar leads sem email enviado
SELECT * FROM leads 
WHERE created_at > NOW() - INTERVAL '7 days'
AND email_sent IS NULL OR email_sent = false;
```

---

**Próximo passo**: Escolher serviço de email (Resend recomendado) e configurar!
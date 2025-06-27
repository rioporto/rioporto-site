# 📧 Configuração DNS para Email com Resend

## 🎯 Objetivo
Configurar o DNS do domínio `rioporto.com` para permitir envio de emails através do Resend.

---

## 📋 Pré-requisitos

1. **Acesso ao painel DNS do domínio** (Registro.br, Cloudflare, etc)
2. **Conta no Resend** já criada
3. **API Key do Resend**: `re_XnMasRgC_CDDHtCo3anZHUuBnfkgbeZSA`

---

## 🔧 Passo a Passo

### Passo 1: Acessar o Resend

1. Acesse https://resend.com/login
2. Faça login com suas credenciais
3. No dashboard, clique em **Domains**

### Passo 2: Adicionar Domínio

1. Clique em **Add Domain**
2. Digite: `rioporto.com`
3. Clique em **Add**

### Passo 3: Obter Registros DNS

O Resend mostrará uma tela com os registros DNS necessários. Geralmente são:

#### 1. Registro SPF (TXT)
```
Name: @
Type: TXT
Value: v=spf1 include:amazonses.com ~all
```

#### 2. Registro DKIM (3 registros CNAME)
```
Name: resend._domainkey
Type: CNAME
Value: [valor fornecido pelo Resend]

Name: resend2._domainkey
Type: CNAME
Value: [valor fornecido pelo Resend]

Name: resend3._domainkey
Type: CNAME
Value: [valor fornecido pelo Resend]
```

#### 3. Registro DMARC (TXT) - Opcional mas recomendado
```
Name: _dmarc
Type: TXT
Value: v=DMARC1; p=none; rua=mailto:dmarc@rioporto.com
```

---

## 🌐 Configurar no Provedor DNS

### Se usar Cloudflare:

1. Acesse https://dash.cloudflare.com
2. Selecione o domínio `rioporto.com`
3. Vá em **DNS**
4. Para cada registro:
   - Clique em **Add Record**
   - Selecione o tipo (TXT ou CNAME)
   - Cole os valores
   - **IMPORTANTE**: Para CNAME, deixe o proxy (nuvem laranja) DESLIGADO

### Se usar Registro.br:

1. Acesse https://registro.br
2. Faça login
3. Vá em **Painel de Controle** → **DNS**
4. Adicione cada registro conforme indicado

### Se usar outro provedor:

O processo é similar - procure a seção de gerenciamento DNS e adicione os registros.

---

## ✅ Verificação

### No Resend:

1. Após adicionar todos os registros, volte ao Resend
2. Na página do domínio, clique em **Verify DNS Records**
3. Aguarde a verificação (pode levar até 48h, mas geralmente é rápido)

### Status esperado:
- ✅ SPF: Verified
- ✅ DKIM: Verified
- ✅ DMARC: Verified (se configurado)

---

## 🧪 Teste de Envio

Após verificação bem-sucedida:

### 1. Teste Manual no Resend:
1. No dashboard do Resend, vá em **Emails**
2. Clique em **Send Test Email**
3. Envie para seu email pessoal

### 2. Teste no Código:

```bash
# No terminal do projeto
cd D:\Projetos\rioporto-site

# Crie um arquivo de teste
```

Crie `test-email.js`:
```javascript
const { Resend } = require('resend');

const resend = new Resend('re_XnMasRgC_CDDHtCo3anZHUuBnfkgbeZSA');

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: 'Rio Porto P2P <noreply@rioporto.com>',
      to: 'johnnyhelder@gmail.com',
      subject: 'Teste de Email - Rio Porto',
      html: '<h1>Email funcionando!</h1><p>Configuração DNS concluída com sucesso.</p>'
    });
    console.log('Email enviado:', data);
  } catch (error) {
    console.error('Erro:', error);
  }
}

testEmail();
```

Execute:
```bash
node test-email.js
```

---

## 📬 Emails Configurados no Sistema

O sistema já está preparado para enviar:

1. **Email de Boas-vindas**: Quando usuário baixa o minicurso
2. **Notificação de Comentário**: Quando há resposta em comentário
3. **Recuperação de Senha**: Para reset de senha (futuro)
4. **Newsletter**: Para campanhas de email (próximo sprint)

---

## ⚠️ Troubleshooting

### Problema: "Domain not verified"
- **Solução**: Aguarde propagação DNS (até 48h)
- **Verificar**: Use https://mxtoolbox.com para checar registros

### Problema: "SPF record not found"
- **Solução**: Verifique se adicionou o registro TXT corretamente
- **Dica**: Alguns provedores exigem aspas no valor

### Problema: Emails indo para SPAM
- **Solução**: Configure DMARC
- **Dica**: Comece com `p=none` e depois mude para `p=quarantine`

---

## 🎯 Próximos Passos

Após DNS configurado:

1. **Criar templates adicionais** de email
2. **Configurar bounce handling** no Resend
3. **Monitorar métricas** de entrega
4. **Implementar unsubscribe** link

---

## 📞 Suporte Resend

- Documentação: https://resend.com/docs
- Status: https://status.resend.com
- Suporte: support@resend.com

---

**Última atualização**: 27/01/2025
# 🚨 Solução Temporária - Zendesk

Como o widget do Zendesk não está abrindo automaticamente, vamos adicionar um link direto.

## Opção 1: Link Direto para Novo Ticket

Adicione este link no botão de suporte:

```typescript
// No botão "Abrir Chat de Suporte"
<Button
  type="button"
  variant="outline"
  size="lg"
  className="w-full"
  onClick={() => {
    // Dados da cotação
    const assunto = `Cotação ${formData.tipo} - ${cryptoName}`;
    const descricao = `
Olá! Acabei de enviar uma cotação:

Tipo: ${formData.tipo === 'compra' ? 'Compra' : 'Venda'}
Criptomoeda: ${cryptoName}
Valor em R$: ${formData.valorBRL}
Valor em Cripto: ${formData.valorCripto}

Dados de contato:
Nome: ${nome}
Email: ${email}
WhatsApp: ${telefone || 'Não informado'}

Observações: ${formData.observacoes || 'Nenhuma'}
    `.trim();
    
    // Criar URL do Zendesk com dados preenchidos
    const zendeskUrl = new URL('https://rioportop2p.zendesk.com/hc/pt-br/requests/new');
    zendeskUrl.searchParams.append('ticket_form_id', '360000000000'); // ID do formulário (ajustar)
    zendeskUrl.searchParams.append('tf_subject', assunto);
    zendeskUrl.searchParams.append('tf_description', descricao);
    zendeskUrl.searchParams.append('tf_email', email);
    zendeskUrl.searchParams.append('tf_name', nome);
    
    // Abrir em nova aba
    window.open(zendeskUrl.toString(), '_blank');
  }}
>
  <MessageSquare className="mr-2 h-4 w-4" />
  Abrir Suporte
</Button>
```

## Opção 2: WhatsApp Direto

Se preferir usar WhatsApp:

```typescript
<Button
  type="button"
  variant="outline"
  size="lg"
  className="w-full"
  onClick={() => {
    const mensagem = `Olá! Acabei de enviar uma cotação de ${formData.tipo} de ${cryptoName}. Valor: R$ ${formData.valorBRL}`;
    const whatsappUrl = `https://wa.me/5521201877776?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
  }}
>
  <MessageSquare className="mr-2 h-4 w-4" />
  Falar no WhatsApp
</Button>
```

## Opção 3: Email Direto

```typescript
<Button
  type="button"
  variant="outline"
  size="lg"
  className="w-full"
  onClick={() => {
    const assunto = `Cotação ${formData.tipo} - ${cryptoName}`;
    const corpo = `
Olá!

Acabei de enviar uma cotação através do site:

Tipo: ${formData.tipo === 'compra' ? 'Compra' : 'Venda'}
Criptomoeda: ${cryptoName}
Valor em R$: ${formData.valorBRL}
Valor em Cripto: ${formData.valorCripto}

Meus dados:
Nome: ${nome}
Email: ${email}
WhatsApp: ${telefone || 'Não informado'}

Observações: ${formData.observacoes || 'Nenhuma'}

Aguardo retorno.

Atenciosamente,
${nome}
    `.trim();
    
    const mailtoUrl = `mailto:contato@rioporto.com?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    window.location.href = mailtoUrl;
  }}
>
  <MessageSquare className="mr-2 h-4 w-4" />
  Enviar Email
</Button>
```

## Implementação Rápida

Escolha uma das opções acima e substitua o código do botão atual. O Zendesk direto (Opção 1) é a mais recomendada pois mantém tudo centralizado no sistema de tickets.
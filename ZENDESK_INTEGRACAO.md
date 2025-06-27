# 💬 ZENDESK - PLANO DE INTEGRAÇÃO

**Última atualização**: 29/01/2025  
**Status**: Planejamento  
**Motivo**: Substituir WhatsApp Business bloqueado pela Meta

## 🎯 Objetivo

Implementar o Zendesk como solução completa de atendimento ao cliente, integrando com nossa base de dados Supabase para um suporte contextualizado e eficiente.

## 🔍 Por que Zendesk?

### Vantagens sobre WhatsApp
1. **Sem restrições**: Não há risco de bloqueio por "ICO"
2. **Multi-canal**: Chat, email, telefone em um só lugar
3. **Automação**: Respostas automáticas e workflows
4. **Analytics**: Métricas detalhadas de atendimento
5. **Integração API**: Conecta com Supabase

### Funcionalidades Principais
- Widget de chat no site
- Sistema de tickets
- Base de conhecimento
- Automação com triggers
- Relatórios avançados

## 🏗️ Arquitetura de Integração

### 1. Widget no Site
```typescript
// Instalação do widget Zendesk
<Script
  id="zendesk-widget"
  strategy="lazyOnload"
  dangerouslySetInnerHTML={{
    __html: `
      window.zESettings = {
        webWidget: {
          color: { theme: '#004aad' },
          launcher: {
            label: { 'pt-br': 'Precisa de ajuda?' }
          },
          contactForm: {
            fields: [
              { id: 'email', prefill: { '*': user?.email } },
              { id: 'name', prefill: { '*': user?.full_name } }
            ]
          }
        }
      };
    `
  }}
/>
```

### 2. Integração com Supabase
```typescript
// API Route: /api/zendesk/webhook
export async function POST(req: Request) {
  const event = await req.json();
  
  switch(event.type) {
    case 'ticket.created':
      // Buscar dados do cliente no Supabase
      const customer = await getCustomerByEmail(event.email);
      
      // Atualizar ticket com contexto
      await updateZendeskTicket(event.ticket_id, {
        custom_fields: {
          btc_balance: customer.btc_balance,
          last_transaction: customer.last_transaction,
          verification_status: customer.kyc_status
        }
      });
      break;
  }
}
```

### 3. Sincronização de Dados
```typescript
// Sincronizar leads com Zendesk
interface ZendeskSync {
  createOrUpdateUser(lead: Lead): Promise<ZendeskUser>;
  addNote(userId: string, note: string): Promise<void>;
  createTicket(data: TicketData): Promise<Ticket>;
}

// Eventos para sincronizar:
- Novo lead cadastrado
- Transação P2P realizada
- Problema reportado
- Feedback enviado
```

## 📋 Implementação por Etapas

### Fase 1: Setup Básico (1 dia)
- [ ] Criar conta Zendesk
- [ ] Configurar domínio e branding
- [ ] Instalar widget no site
- [ ] Configurar idioma PT-BR
- [ ] Criar campos customizados

### Fase 2: Integração (2 dias)
- [ ] Configurar webhooks
- [ ] API de sincronização
- [ ] Autenticação OAuth
- [ ] Testes de integração
- [ ] Documentação

### Fase 3: Automação (1 dia)
- [ ] Triggers para notificações
- [ ] Macros de respostas
- [ ] Workflows de escalação
- [ ] SLA configuration
- [ ] Relatórios

### Fase 4: Base de Conhecimento (2 dias)
- [ ] Migrar conteúdo do minicurso
- [ ] FAQs sobre P2P
- [ ] Guias de segurança
- [ ] Vídeos tutoriais
- [ ] Search optimization

## 🤖 Automações Planejadas

### 1. Boas-vindas Automática
```
QUANDO: Novo chat iniciado
AÇÃO: 
- Mensagem de boas-vindas
- Menu com opções principais
- Coletar email se não logado
```

### 2. Cotação Rápida
```
QUANDO: Cliente pergunta sobre preço
AÇÃO:
- Buscar cotação atual
- Mostrar taxas
- Oferecer iniciar transação
```

### 3. Status de Transação
```
QUANDO: Cliente pergunta sobre transação
AÇÃO:
- Buscar no Supabase
- Mostrar status atual
- Tempo estimado
```

## 💾 Dados a Sincronizar

### Do Supabase → Zendesk
1. **Informações do Cliente**:
   - Nome, email, telefone
   - Status de verificação
   - Histórico de transações
   - Preferências

2. **Contexto de Negócio**:
   - Última cotação vista
   - Transações pendentes
   - Saldo estimado
   - Documentos enviados

### Do Zendesk → Supabase
1. **Interações de Suporte**:
   - Tickets criados
   - Problemas reportados
   - Feedback
   - Satisfação

2. **Métricas**:
   - Tempo de resposta
   - Resolução
   - CSAT scores
   - Tags/categorias

## 📊 Métricas de Sucesso

### KPIs Principais
- Tempo primeira resposta: <1 min
- Tempo resolução: <30 min
- CSAT: >90%
- Taxa de resolução primeiro contato: >80%

### Relatórios
- Volume por categoria
- Horários de pico
- Problemas recorrentes
- Performance por agente

## 💰 Custos Estimados

### Plano Suite Team ($55/agente/mês)
- 5 agentes: $275/mês
- Chat, email, voz
- Automação completa
- API ilimitada
- Base conhecimento

### ROI Esperado
- Redução 50% tempo atendimento
- Aumento 30% satisfação
- Economia vs. WhatsApp API
- Melhor compliance

## 🚀 Cronograma

### Semana 1
- Setup e configuração
- Widget no site
- Treinamento equipe

### Semana 2
- Integração Supabase
- Automações básicas
- Testes

### Semana 3
- Base conhecimento
- Otimizações
- Go-live

## 🔗 Recursos

### Documentação
- [Zendesk API](https://developer.zendesk.com/api-reference)
- [Web Widget](https://developer.zendesk.com/documentation/classic-web-widget-sdks/)
- [Apps Framework](https://developer.zendesk.com/documentation/apps/)

### Exemplos de Código
- [Node.js SDK](https://github.com/zendesk/node-zendesk)
- [Webhooks](https://support.zendesk.com/hc/en-us/articles/4408839108378)
- [Custom Fields](https://developer.zendesk.com/api-reference/ticketing/tickets/ticket_fields/)

---

**Próximos passos**: Aprovar orçamento e iniciar trial do Zendesk
# 📚 Configuração do Zendesk - Passo a Passo

## 1. Acessar o Painel Admin

1. Faça login no seu Zendesk
2. Clique no ícone de configurações (⚙️) no canto inferior esquerdo
3. Selecione "Admin Center"

## 2. Configurar o Widget Web

### Passo 1: Acessar Configurações do Widget
- No Admin Center, vá para: **Canais > Mensagens e Widgets Web**
- Clique em "Widget Web"

### Passo 2: Personalizar Aparência
1. **Cor Principal**: Defina como `#004aad` (azul Rio Porto)
2. **Posição**: Canto inferior direito
3. **Idioma**: Português (Brasil)

### Passo 3: Configurar Formulários
1. **Formulário de Contato**:
   - Nome (obrigatório)
   - Email (obrigatório)
   - Assunto
   - Mensagem

2. **Campos Personalizados** (opcional):
   - Tipo de Cliente: [Comprador/Vendedor]
   - Volume Estimado
   - Urgência

### Passo 4: Obter a Chave
1. Na aba "Instalação"
2. Copie o script que aparece
3. A chave está em: `key=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`
4. Adicione ao seu `.env.local`:
   ```
   NEXT_PUBLIC_ZENDESK_KEY=sua-chave-aqui
   ```

## 3. Configurar Webhooks (Opcional)

### Criar Webhook para Sincronização
1. Vá para: **Apps e integrações > Webhooks**
2. Clique em "Criar webhook"
3. Configure:
   - **Nome**: Rio Porto Sync
   - **URL**: `https://rioporto.com/api/zendesk/webhook`
   - **Método**: POST
   - **Formato**: JSON

### Eventos para Monitorar
- ✅ Ticket Created
- ✅ Ticket Updated
- ✅ Ticket Solved
- ✅ Customer Satisfaction Rating

### Gerar Secret do Webhook
1. Ao criar o webhook, um secret será gerado
2. Copie e adicione ao `.env.local`:
   ```
   ZENDESK_WEBHOOK_SECRET=seu-secret-aqui
   ```

## 4. Configurar Gatilhos Automáticos

### Gatilho 1: Boas-vindas
**Condições**:
- Ticket é criado
- Canal é Widget Web

**Ações**:
- Enviar email de confirmação
- Adicionar tag "novo-cliente"

### Gatilho 2: Prioridade Alta
**Condições**:
- Mensagem contém: "urgente", "bloqueado", "erro"
- OU Volume > R$ 10.000

**Ações**:
- Definir prioridade como Alta
- Notificar equipe no Slack/WhatsApp

## 5. Configurar Base de Conhecimento

### Criar Categorias
1. **Iniciantes**
   - O que é P2P?
   - Como comprar Bitcoin?
   - Taxas e limites

2. **Segurança**
   - Como evitar golpes
   - Verificação de identidade
   - Melhores práticas

3. **Técnico**
   - Carteiras recomendadas
   - Como enviar Bitcoin
   - Problemas comuns

### Artigos Essenciais
- "Primeira compra: passo a passo"
- "Documentos necessários"
- "Tempo de processamento"
- "Formas de pagamento aceitas"

## 6. Configurar Horário de Atendimento

1. Vá para: **Configurações > Horário comercial**
2. Configure:
   - Segunda a Sexta: 9h às 18h
   - Sábado: 9h às 13h
   - Domingo: Fechado
   - Feriados: Adicionar feriados brasileiros

## 7. Mensagens Automáticas

### Online
```
Olá! 👋 Bem-vindo à Rio Porto P2P!
Como posso ajudar você hoje?
```

### Offline
```
Obrigado pelo contato! 
Nosso horário de atendimento é de segunda a sexta, das 9h às 18h.
Deixe sua mensagem que responderemos assim que possível.
```

### Tempo de Espera
```
Todos os nossos atendentes estão ocupados.
Seu atendimento é importante para nós. 
Tempo estimado de espera: X minutos.
```

## 8. Integração com CRM

### Campos Sincronizados
- Email → Supabase users.email
- Nome → Supabase users.full_name
- Telefone → Supabase users.whatsapp
- Histórico de tickets → support_tickets

### Contexto Automático
Quando um cliente autenticado abrir o chat:
- Mostrar últimas transações
- Status de verificação
- Tickets anteriores
- Preferências salvas

## 9. Métricas para Acompanhar

### KPIs Principais
- Tempo médio de primeira resposta: < 5 min
- Tempo médio de resolução: < 2 horas
- Satisfação do cliente: > 95%
- Taxa de resolução no primeiro contato: > 80%

### Relatórios Semanais
- Volume de tickets por categoria
- Principais dúvidas dos clientes
- Performance da equipe
- Feedback dos clientes

## 10. Checklist de Implementação

- [ ] Widget instalado e funcionando
- [ ] Cores e branding configurados
- [ ] Formulários em português
- [ ] Webhook configurado (se aplicável)
- [ ] Gatilhos automáticos criados
- [ ] Base de conhecimento com 10+ artigos
- [ ] Horário comercial definido
- [ ] Mensagens automáticas personalizadas
- [ ] Equipe treinada no sistema
- [ ] Métricas configuradas

## 🎯 Dicas Importantes

1. **Teste o Widget**: Use modo incógnito para testar como visitante
2. **Treine a Equipe**: Garanta que todos saibam usar o sistema
3. **Monitore Métricas**: Revise semanalmente e ajuste processos
4. **Colete Feedback**: Use as avaliações para melhorar
5. **Mantenha Atualizado**: Revise artigos e respostas mensalmente

## 📞 Suporte Zendesk

Se precisar de ajuda:
- Central de Ajuda: https://support.zendesk.com/hc/pt-br
- Comunidade: https://support.zendesk.com/hc/pt-br/community/topics
- Suporte: support@zendesk.com
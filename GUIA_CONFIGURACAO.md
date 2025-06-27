# 🚀 Guia de Configuração Rápida - Rio Porto P2P

## 📋 Status do Projeto

### ✅ Concluído (100%)
- Sistema de comentários no blog
- Minicurso com áudios e tracking
- Integração Zendesk (código pronto)
- Sistema de email (código pronto)

### 🔧 Pendente de Configuração
1. **Zendesk** - Adicionar chave da API
2. **Resend** - Configurar conta e API key
3. **Deploy** - Publicar alterações

## 🛠️ Passos para Finalizar

### 1. Configurar Zendesk
Você já tem uma conta Zendesk criada. Agora precisa:

1. **Obter a chave do widget:**
   - Acesse seu painel Zendesk
   - Vá em Admin > Canais > Widget Web
   - Copie a chave do widget

2. **Configurar webhook (opcional):**
   - Em Admin > Extensões > Webhooks
   - Criar novo webhook apontando para: `https://seu-dominio.com/api/zendesk/webhook`
   - Copiar o secret do webhook

3. **Adicionar ao .env.local:**
   ```env
   NEXT_PUBLIC_ZENDESK_KEY=sua_chave_widget_aqui
   ZENDESK_WEBHOOK_SECRET=seu_secret_aqui
   ```

### 2. Configurar Resend (Email)
1. **Criar conta no Resend:**
   - Acesse https://resend.com
   - Crie uma conta gratuita

2. **Verificar domínio:**
   - Adicionar registros DNS no seu provedor
   - Aguardar verificação

3. **Obter API Key:**
   - No dashboard, criar nova API key
   - Adicionar ao .env.local:
   ```env
   RESEND_API_KEY=re_sua_api_key_aqui
   ```

### 3. Executar Migrações do Banco
No Supabase, execute o SQL em:
```
supabase/migrations/20240127_add_tracking_tables.sql
```

### 4. Deploy
```bash
# Commit das alterações
git add .
git commit -m "feat: add zendesk, email service and minicourse tracking"

# Deploy na Vercel
vercel --prod
```

## 📊 Novos Recursos Implementados

### 🎧 Tracking do Minicurso
- Rastreia visualizações de páginas
- Monitora reprodução de áudios
- Calcula progresso automaticamente
- Estatísticas detalhadas por lead

### 💬 Zendesk Widget
- Chat integrado no site
- Pré-preenchimento com dados do usuário
- Customização completa em PT-BR
- Webhook para sincronizar tickets

### 📧 Sistema de Email
- Templates profissionais
- Email de boas-vindas do minicurso
- Notificações de comentários
- Preparado para expansão futura

## 🔐 Variáveis de Ambiente Necessárias

Adicione estas variáveis ao seu `.env.local`:

```env
# Zendesk
NEXT_PUBLIC_ZENDESK_KEY=sua_chave_widget
ZENDESK_WEBHOOK_SECRET=seu_webhook_secret

# Email Service (Resend)
RESEND_API_KEY=re_sua_api_key
```

## 📝 Notas Importantes

1. **Minicurso**: Os áudios já estão gerados e hospedados no Supabase Storage
2. **Tracking**: Funciona com sendBeacon para garantir registro ao sair da página
3. **Email**: Sistema preparado mas precisa da API key do Resend
4. **Zendesk**: Widget aparecerá automaticamente após configurar a chave

## 🎯 Próximos Passos (Opcional)

1. **Analytics Dashboard**: Criar painel para visualizar métricas do minicurso
2. **Automação WhatsApp**: Quando a Meta liberar o acesso
3. **Integração Hotmart**: Para vendas de produtos digitais
4. **Sistema de Afiliados**: Programa de indicação

## 🆘 Suporte

Se precisar de ajuda com alguma configuração, os arquivos principais são:

- **Zendesk Widget**: `/components/zendesk/zendesk-widget.tsx`
- **Email Service**: `/lib/email.ts`
- **Tracking**: `/hooks/use-minicurso-tracking.ts`
- **API Minicurso**: `/app/api/minicurso/route.ts`

## 📁 Estrutura de Arquivos Novos

```
rioporto-site/
├── app/
│   ├── api/
│   │   ├── minicurso/
│   │   │   ├── route.ts (API principal)
│   │   │   └── tracking/
│   │   │       └── route.ts (API de tracking)
│   │   └── zendesk/
│   │       └── webhook/
│   │           └── route.ts (Webhook Zendesk)
│   └── providers/
│       └── zendesk-provider.tsx
├── components/
│   └── zendesk/
│       └── zendesk-widget.tsx
├── hooks/
│   └── use-minicurso-tracking.ts
├── lib/
│   └── email.ts
└── supabase/
    └── migrations/
        └── 20240127_add_tracking_tables.sql
```

## ✅ Checklist Final

- [ ] Configurar Zendesk API key
- [ ] Configurar Resend e verificar domínio
- [ ] Executar migrações no Supabase
- [ ] Testar widget do Zendesk
- [ ] Testar envio de email do minicurso
- [ ] Testar tracking do minicurso
- [ ] Deploy em produção

## 🎉 Conclusão

Com essas configurações finais, seu projeto estará 100% operacional com:
- Sistema completo de captura e nutrição de leads
- Minicurso interativo com tracking detalhado
- Suporte integrado via Zendesk
- Sistema de email automatizado
- Blog com sistema de comentários

Parabéns pelo projeto! 🚀
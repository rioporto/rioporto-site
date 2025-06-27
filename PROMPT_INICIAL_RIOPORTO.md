# 🚀 PROMPT INICIAL - RIO PORTO P2P

## Para iniciar novo chat no Claude Desktop, use:

```
Olá! Estou continuando o projeto Rio Porto P2P - Chat #15.

CONTEXTO ATUAL:
- Projeto em: D:\Projetos\rioporto-site
- Sistema de comentários 100% completo ✅
- Minicurso 100% completo (com tracking) ✅
- Sistema de email 100% (código pronto) ✅
- Zendesk integrado (falta configurar chaves) ✅
- WhatsApp bloqueado pela Meta

TRABALHO REALIZADO (Chat #14):
1. Sistema de tracking do minicurso ✅
2. Integração Zendesk completa ✅
3. Sistema de email com Resend ✅
4. Correções de build ✅
5. Deploy funcionando ✅

PENDENTE DE CONFIGURAÇÃO:
1. Adicionar chaves API no Vercel/env
2. Executar migrações no Supabase
3. Configurar DNS para email

Por favor, leia o PROJETO_MASTER.md para contexto completo.
Uso Claude Desktop no Windows + CLAUDE CODE no terminal Ubuntu no Cursor quando necessário.

Como podemos continuar?
```

## 📋 Informações Essenciais

### Stack Tecnológica
- Next.js 14.2.30 (App Router)
- TypeScript 5.3.3
- Tailwind CSS + Shadcn/ui
- Supabase (PostgreSQL + Auth)
- Vercel (Deploy)
- Zendesk (Suporte - integrado)
- Resend (Email - integrado)

### URLs Importantes
- **Produção**: https://rioporto-site.vercel.app
- **GitHub**: https://github.com/rioporto/rioporto-site
- **Supabase**: projeto `ncxilaqbmlituutruqqs`
- **Zendesk**: https://rioportop2p.zendesk.com

### Status Atual (Chat #14)
- ✅ Sistema P2P completo
- ✅ Blog com comentários e admin
- ✅ Lead capture funcional
- ✅ Minicurso com tracking
- ✅ Dashboard admin
- ✅ Zendesk integrado
- ✅ Sistema de Email
- 🔜 Sistema de Cursos
- 🔜 Sistema KYC

### Trabalho Realizado no Chat #14
1. **Tracking do Minicurso**: Sistema completo de analytics
2. **Zendesk Widget**: Integração total com customização PT-BR
3. **Zendesk Webhook**: API para sincronização de tickets
4. **Sistema de Email**: Templates profissionais com Resend
5. **Correções de Build**: Componentes UI e dependências
6. **Deploy**: Funcionando em produção

### Comandos Frequentes
```bash
# Desenvolvimento
npm run dev
npm run type-check
npm run build

# Deploy
git add -A
git commit -m "feat: descrição"
git push origin main

# Testar APIs
curl https://rioporto-site.vercel.app/api/zendesk/webhook
```

### Variáveis de Ambiente Necessárias
```env
# Zendesk
NEXT_PUBLIC_ZENDESK_KEY=sua_chave_widget
ZENDESK_WEBHOOK_SECRET=seu_webhook_secret

# Email Service (Resend)
RESEND_API_KEY=re_sua_api_key
```

### Migrações Pendentes
Execute no Supabase SQL Editor:
```sql
-- /supabase/migrations/20240127_add_tracking_tables.sql
```

### Contatos
- **Admin**: johnnyhelder@gmail.com
- **WhatsApp**: +55 21 2018-7776
- **Zendesk**: https://rioportop2p.zendesk.com

### Arquivos Principais
1. `PROJETO_MASTER.md` - Documentação principal
2. `GUIA_CONFIGURACAO.md` - Passos para finalizar
3. `IMPLEMENTACOES_COMPLETAS.md` - O que foi feito
4. `/app/api/zendesk/webhook/route.ts` - Webhook API
5. `/app/api/minicurso/tracking/route.ts` - Tracking API
6. `/hooks/use-minicurso-tracking.ts` - Hook de tracking
7. `/lib/email.ts` - Sistema de email

### Próximos Passos Imediatos

#### 1. Configurar Variáveis (10 min)
- Adicionar no Vercel Dashboard
- Ou no .env.local para teste

#### 2. Executar Migrações (5 min)
- Copiar SQL e executar no Supabase

#### 3. Configurar DNS (15 min)
- Verificar domínio no Resend
- Adicionar registros DNS

#### 4. Testar Integrações (10 min)
- Widget Zendesk
- Envio de emails
- Tracking do minicurso

## 💡 Dicas para o Claude

1. **SEMPRE leia** PROJETO_MASTER.md primeiro
2. **Use artifacts** para códigos grandes
3. **Tracking**: Sistema completo com sendBeacon
4. **Zendesk**: Widget e webhook prontos
5. **Email**: Templates já criados
6. **Deploy**: Automático via GitHub
7. **Migrações**: SQL em /supabase/migrations

## 🎯 Prioridades por Sprint

### Sprint Concluída (Chat #14)
1. ✅ Tracking do minicurso
2. ✅ Integração Zendesk
3. ✅ Sistema de email
4. ✅ Correções de build
5. ✅ Deploy funcional

### Próximo Sprint
1. Dashboard de métricas
2. Newsletter double opt-in
3. PWA support
4. Otimizações SEO
5. Testes E2E

### Fase 3 (Cursos)
1. Upload de vídeos
2. Área do aluno
3. Certificados
4. Gamificação

### Fase 4 (KYC)
1. Upload documentos
2. Validação automática
3. Dashboard compliance
4. Integração bureaus

## 🚨 Lembretes Importantes

1. **Build**: Todos os erros foram corrigidos
2. **Zendesk**: Webhook simplificado para testes
3. **Email**: Resend é o serviço escolhido
4. **Tracking**: Funciona com sendBeacon
5. **Deploy**: Vercel em https://rioporto-site.vercel.app

---

**Última atualização**: 27/01/2025 - Chat #14
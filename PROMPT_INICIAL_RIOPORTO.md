# 🚀 PROMPT INICIAL - RIO PORTO P2P

## Para iniciar novo chat no Claude Desktop, use:

```
Olá! Estou continuando o projeto Rio Porto P2P - Chat #17.

CONTEXTO ATUAL:
- Projeto em: D:\Projetos\rioporto-site
- Sistema de comentários 100% completo ✅
- Minicurso 100% completo (com tracking) ✅
- Sistema de email 100% (código pronto) ✅
- Zendesk 100% integrado (widget visível) ✅
- WhatsApp opcional no cadastro

TRABALHO REALIZADO (Chat #16):
1. Simplificado cadastro (WhatsApp opcional) ✅
2. Removido sistema OTP ✅
3. Zendesk widget visível ✅
4. Correção abertura após cotação ✅
5. Botão manual de suporte ✅

PENDENTE:
1. Configurar variáveis na Vercel (produção)
2. Configurar DNS para email (Resend)
3. Deploy final e testes

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
- Zendesk (Suporte - 100% integrado)
- Resend (Email - integrado)

### URLs Importantes
- **Produção**: https://rioporto-site.vercel.app
- **GitHub**: https://github.com/rioporto/rioporto-site
- **Supabase**: projeto `ncxilaqbmlituutruqqs`
- **Zendesk**: https://rioportop2p.zendesk.com

### Status Atual (Chat #16)
- ✅ Sistema P2P completo
- ✅ Blog com comentários e admin
- ✅ Lead capture funcional
- ✅ Minicurso com tracking
- ✅ Dashboard admin
- ✅ Zendesk (widget visível + botão manual)
- ✅ Sistema de Email
- ✅ Migrações SQL executadas
- ✅ WhatsApp opcional no cadastro
- 🔜 Sistema de Cursos
- 🔜 Sistema KYC

### Trabalho Realizado no Chat #16
1. **Cadastro Simplificado**: WhatsApp volta a ser opcional
2. **Sem OTP**: Removido sistema de verificação SMS/WhatsApp
3. **Zendesk Visível**: Widget sempre disponível
4. **Cotação Corrigida**: Chat abre após enviar
5. **Botão Manual**: Suporte quando automático falha

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

### Variáveis de Ambiente (Já configuradas localmente)
```env
# Zendesk
NEXT_PUBLIC_ZENDESK_KEY=91137f06-867b-4536-9657-dd64d4f92617
ZENDESK_WEBHOOK_SECRET=99be7c9fb49cfaae98f7de46cde9f7e5b964f5da0ede3057cacf098d6d0e252a

# Email Service (Resend)
RESEND_API_KEY=re_XnMasRgC_CDDHtCo3anZHUuBnfkgbeZSA
RESEND_FROM_EMAIL=noreply@rioporto.com
```

### Migrações Executadas ✅
- Tabela `minicurso_activities` criada
- Tabela `support_tickets` criada  
- Colunas de progresso adicionadas em `leads`
- Políticas RLS configuradas

### Contatos
- **Admin**: johnnyhelder@gmail.com
- **WhatsApp**: +55 21 2018-7776
- **Zendesk**: https://rioportop2p.zendesk.com

### Arquivos Principais
1. `PROJETO_MASTER.md` - Documentação principal
2. `GUIA_CONFIGURACAO.md` - Passos para finalizar
3. `IMPLEMENTACOES_COMPLETAS.md` - O que foi feito
4. `/lib/zendesk.ts` - Funções do Zendesk programático
5. `/app/test-config/page.tsx` - Página de verificação
6. `/app/api/minicurso/tracking/route.ts` - Tracking API
7. `/hooks/use-minicurso-tracking.ts` - Hook de tracking
8. `/lib/email.ts` - Sistema de email

### Próximos Passos Imediatos

#### 1. Configurar Variáveis na Vercel (10 min)
- Acessar dashboard e adicionar as mesmas do .env.local

#### 2. Configurar DNS Resend (15 min)
- Verificar domínio no Resend
- Adicionar registros DNS

#### 3. Deploy Final (5 min)
- `git push origin main`
- Verificar em produção

#### 4. Testar Fluxo Completo (10 min)
- Cadastro com WhatsApp opcional
- Formulário de cotação → Zendesk
- Widget visível e funcional

## 💡 Dicas para o Claude

1. **Use artifacts** para códigos grandes
2. **Zendesk**: Widget visível, abre após cotação
3. **WhatsApp**: Opcional, sem verificação
4. **Email**: Templates já criados
5. **Deploy**: Automático via GitHub
6. **Migrações**: Já executadas

## 🎯 Prioridades por Sprint

### Sprint Concluída (Chat #16)
1. ✅ Cadastro simplificado
2. ✅ Removido sistema OTP
3. ✅ Zendesk widget visível
4. ✅ Correção abertura chat
5. ✅ Botão manual suporte

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
2. **Zendesk**: Widget visível + botão manual de suporte
3. **Email**: Resend é o serviço escolhido
4. **WhatsApp**: Opcional no cadastro, sem verificação
5. **Deploy**: Vercel em https://rioporto-site.vercel.app

---

**Última atualização**: 27/01/2025 - Chat #16
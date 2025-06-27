# ✅ Checklist Final - Deploy Rio Porto P2P

## 🚀 Pré-Deploy

### 1. Verificações de Código
- [x] Build local sem erros: `npm run build`
- [x] Todos os componentes UI instalados
- [x] Sistema de comentários funcionando
- [x] Minicurso com tracking completo
- [x] Zendesk widget visível
- [x] WhatsApp opcional no cadastro

### 2. Banco de Dados (Supabase)
- [x] Todas as tabelas criadas
- [x] Migrações executadas
- [x] RLS (Row Level Security) configurado
- [x] Dados de teste inseridos
- [ ] Backup do banco antes do deploy

---

## 🔧 Configuração de Produção

### 1. Variáveis de Ambiente na Vercel ⏳
- [ ] Acessar: https://vercel.com/dashboard
- [ ] Projeto: `rioporto-site`
- [ ] Settings → Environment Variables
- [ ] Adicionar todas as variáveis do arquivo `VERCEL_VARIAVEIS_CONFIG.md`
- [ ] Alterar `NEXT_PUBLIC_APP_URL` para `https://rioporto-site.vercel.app`
- [ ] Alterar `NODE_ENV` para `production`

### 2. Configuração DNS (Resend) ⏳
- [ ] Acessar Resend: https://resend.com/domains
- [ ] Adicionar domínio: `rioporto.com`
- [ ] Configurar registros DNS no provedor:
  - [ ] SPF (TXT)
  - [ ] DKIM (3x CNAME)
  - [ ] DMARC (TXT) - opcional
- [ ] Verificar no Resend
- [ ] Testar envio de email

### 3. Deploy na Vercel
- [ ] Commit final: `git add -A && git commit -m "feat: configurações de produção"`
- [ ] Push: `git push origin main`
- [ ] Aguardar build automático
- [ ] Verificar logs de deploy

---

## 🧪 Testes Pós-Deploy

### 1. Funcionalidades Básicas
- [ ] **Home**: Página carrega corretamente
- [ ] **Blog**: Posts aparecem
- [ ] **Sobre**: Informações visíveis
- [ ] **Cotação P2P**: Cálculo funcionando

### 2. Sistema de Autenticação
- [ ] **Cadastro**: Criar nova conta
  - [ ] WhatsApp opcional
  - [ ] Sem verificação OTP
  - [ ] Redirecionamento para dashboard
- [ ] **Login**: Entrar com conta existente
- [ ] **Logout**: Sair corretamente
- [ ] **Senha**: Recuperação funcionando

### 3. Lead Capture & Minicurso
- [ ] **Modal**: Aparece na home após 3 segundos
- [ ] **Formulário**: Aceita dados
- [ ] **Email**: Recebe email de boas-vindas
- [ ] **Acesso**: Link com token funciona
- [ ] **Navegação**: Todas as páginas carregam
- [ ] **Áudios**: Reproduzem corretamente
- [ ] **Tracking**: Atividades sendo registradas

### 4. Sistema de Comentários
- [ ] **Listagem**: Comentários aparecem nos posts
- [ ] **Adicionar**: Novo comentário funciona
- [ ] **Responder**: Sistema de respostas OK
- [ ] **Moderação**: Admin pode aprovar/rejeitar

### 5. Dashboard Admin
- [ ] **Acesso**: `/admin` com conta admin
- [ ] **Estatísticas**: Números corretos
- [ ] **Comentários**: Painel de moderação
- [ ] **Minicurso**: Métricas de acesso
- [ ] **Blog**: Criar/editar posts

### 6. Integração Zendesk
- [ ] **Widget**: Visível no canto inferior direito
- [ ] **Idioma**: Português BR
- [ ] **Cotação**: Abre chat após enviar
- [ ] **Dados**: Pré-preenchimento funcionando
- [ ] **Botão manual**: Aparece quando necessário

### 7. Sistema de Email
- [ ] **Boas-vindas**: Email chegando
- [ ] **Formato**: HTML renderizando corretamente
- [ ] **Links**: Funcionando no email
- [ ] **Remetente**: `noreply@rioporto.com`

---

## 🐛 Problemas Comuns e Soluções

### 1. "500 Internal Server Error"
- Verificar logs na Vercel
- Confirmar todas as variáveis de ambiente
- Checar conexão com Supabase

### 2. "Failed to fetch"
- Verificar CORS
- Confirmar URLs corretas
- Testar APIs individualmente

### 3. Email não chega
- Verificar DNS (pode levar 48h)
- Checar spam/lixeira
- Confirmar API key do Resend

### 4. Zendesk não abre
- Limpar cache do navegador
- Verificar bloqueadores de popup
- Testar em aba anônima

### 5. Login não funciona
- Verificar Supabase Auth
- Confirmar redirect URLs
- Checar cookies/localStorage

---

## 📊 Monitoramento Pós-Deploy

### Primeiras 24 horas:
- [ ] Verificar logs de erro a cada 4h
- [ ] Monitorar performance (Vercel Analytics)
- [ ] Acompanhar primeiros usuários
- [ ] Responder feedbacks urgentes

### Primeira semana:
- [ ] Análise de métricas de uso
- [ ] Otimizações de performance
- [ ] Correções de bugs reportados
- [ ] Melhorias de UX baseadas em feedback

---

## 📞 Canais de Suporte

### Para usuários:
- **Zendesk Widget**: No site
- **Email**: contato@rioporto.com
- **WhatsApp**: Via Zendesk

### Para desenvolvimento:
- **Admin**: johnnyhelder@gmail.com
- **WhatsApp**: +55 21 2018-7776
- **GitHub Issues**: Para bugs

---

## 🎉 Critérios de Sucesso

O deploy será considerado bem-sucedido quando:

1. ✅ Todas as funcionalidades testadas e funcionando
2. ✅ Nenhum erro crítico nos logs
3. ✅ Emails sendo enviados e recebidos
4. ✅ Zendesk integrado e operacional
5. ✅ Performance aceitável (< 3s load time)
6. ✅ Primeiros usuários conseguindo se cadastrar

---

## 🚀 Próximos Passos (Pós-Deploy)

1. **Imediato** (1-3 dias):
   - Monitorar estabilidade
   - Corrigir bugs críticos
   - Otimizar performance

2. **Curto prazo** (1-2 semanas):
   - Implementar analytics detalhado
   - Newsletter com double opt-in
   - PWA support
   - SEO avançado

3. **Médio prazo** (1-2 meses):
   - Sistema de cursos (Fase 3)
   - Dashboard de métricas
   - Automações de marketing

---

**Data do Deploy**: ___/___/2025  
**Responsável**: _________________  
**Status**: [ ] Em progresso [ ] Concluído

---

**Última atualização**: 27/01/2025
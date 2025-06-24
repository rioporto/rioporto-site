# 📅 ROADMAP DETALHADO - FASE 2 DO PROJETO RIO PORTO P2P

## 🎯 OBJETIVO DA FASE 2
Melhorar a qualidade técnica, implementar funcionalidades pendentes e preparar base para sistema de cursos.

## 📊 CRONOGRAMA ESTIMADO
- **Início**: 24/06/2025
- **Duração estimada**: 2-3 semanas
- **Metodologia**: Desenvolvimento incremental com deploys contínuos

## 🔧 SPRINT 1 - MELHORIAS TÉCNICAS (3-4 dias)

### 1.1 Implementar Tabela Related Posts
**Prioridade**: 🔴 Alta  
**Tempo estimado**: 2 horas  
**Descrição**: Criar tabela no Supabase e reimplementar função

**Tarefas**:
- [ ] Criar tabela `related_posts` no Supabase
  ```sql
  CREATE TABLE related_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    related_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    relevance_score FLOAT DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, related_post_id)
  );
  ```
- [ ] Popular tabela com dados iniciais
- [ ] Reimplementar função `getRelatedPosts()`
- [ ] Testar no frontend

### 1.2 Otimizar Imagens
**Prioridade**: 🟡 Média  
**Tempo estimado**: 3 horas  
**Descrição**: Substituir `<img>` por `next/image`

**Tarefas**:
- [ ] `/app/(marketing)/blog/client.tsx` - linha 261
- [ ] `/app/(marketing)/blog/[slug]/page.tsx` - linhas 160, 187
- [ ] `/components/crypto-search.tsx` - linhas 63, 114
- [ ] Configurar domínios externos no `next.config.js`

### 1.3 Resolver Warnings React Hooks
**Prioridade**: 🟡 Média  
**Tempo estimado**: 2 horas  
**Descrição**: Adicionar dependências corretas nos useEffect

**Arquivos para corrigir**:
- [ ] `/app/(marketing)/cotacao/page.tsx`
- [ ] `/app/(platform)/admin/comments/page.tsx`
- [ ] `/app/(platform)/debug-auth/page.tsx`
- [ ] `/components/blog/comments*.tsx`

### 1.4 Melhorar Tratamento de Erros
**Prioridade**: 🟢 Baixa  
**Tempo estimado**: 2 horas  
**Descrição**: Implementar error boundaries e tratamento consistente

**Tarefas**:
- [ ] Criar componente `ErrorBoundary`
- [ ] Implementar `error.tsx` nas rotas principais
- [ ] Melhorar logs de erro com Sentry (opcional)

## ✨ SPRINT 2 - NOVAS FUNCIONALIDADES (5-6 dias)

### 2.1 Sistema Completo de Comentários
**Prioridade**: 🔴 Alta  
**Tempo estimado**: 1 dia  
**Descrição**: Finalizar sistema de comentários com moderação

**Tarefas**:
- [ ] Interface de moderação no admin
- [ ] Notificação por email de novos comentários
- [ ] Sistema de reply aninhado
- [ ] Captcha para evitar spam
- [ ] Contador de comentários nos posts

### 2.2 Newsletter com Double Opt-in
**Prioridade**: 🔴 Alta  
**Tempo estimado**: 4 horas  
**Descrição**: Implementar confirmação por email

**Tarefas**:
- [ ] Template de email de confirmação
- [ ] Rota de confirmação `/api/newsletter/confirm`
- [ ] Página de confirmação bem-sucedida
- [ ] Cron job para limpar não confirmados

### 2.3 WhatsApp Business API
**Prioridade**: 🟡 Média  
**Tempo estimado**: 1 dia  
**Descrição**: Integrar cotação via WhatsApp

**Tarefas**:
- [ ] Configurar webhook WhatsApp Business
- [ ] Parser de mensagens
- [ ] Resposta automática com cotação
- [ ] Rate limiting por número

### 2.4 Dashboard com Métricas
**Prioridade**: 🟡 Média  
**Tempo estimado**: 2 dias  
**Descrição**: Dashboard administrativo com KPIs

**Componentes**:
- [ ] Gráfico de visualizações (Recharts)
- [ ] Taxa de conversão de newsletter
- [ ] Comentários pendentes
- [ ] Posts mais populares
- [ ] Origem do tráfego

## 🎨 SPRINT 3 - MELHORIAS UX/UI (3-4 dias)

### 3.1 Animações com Framer Motion
**Prioridade**: 🟢 Baixa  
**Tempo estimado**: 1 dia  

**Implementar**:
- [ ] Page transitions
- [ ] Scroll animations
- [ ] Hover effects aprimorados
- [ ] Loading states animados

### 3.2 Dark Mode
**Prioridade**: 🟡 Média  
**Tempo estimado**: 4 horas  

**Tarefas**:
- [ ] Configurar tema dark no Tailwind
- [ ] Toggle de tema no header
- [ ] Persistir preferência do usuário
- [ ] Ajustar cores dos gráficos

### 3.3 PWA Support
**Prioridade**: 🟢 Baixa  
**Tempo estimado**: 3 horas  

**Implementar**:
- [ ] manifest.json
- [ ] Service worker
- [ ] Ícones para todas as plataformas
- [ ] Offline fallback

## 🔌 SPRINT 4 - INTEGRAÇÕES (2-3 dias)

### 4.1 Google Analytics 4
**Prioridade**: 🔴 Alta  
**Tempo estimado**: 2 horas  

### 4.2 Meta Pixel
**Prioridade**: 🟡 Média  
**Tempo estimado**: 2 horas  

### 4.3 Hotmart API
**Prioridade**: 🟡 Média  
**Tempo estimado**: 1 dia  

### 4.4 API Cotação Real-time
**Prioridade**: 🟡 Média  
**Tempo estimado**: 4 horas  

## 📈 SPRINT 5 - SEO & PERFORMANCE (2 dias)

### 5.1 Sitemap Dinâmico
### 5.2 Meta Tags Dinâmicas  
### 5.3 Schema.org Completo
### 5.4 Core Web Vitals

## 🎓 PREPARAÇÃO PARA SISTEMA DE CURSOS

### Estrutura de Dados Necessária:
```sql
-- Tabela de cursos
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  price DECIMAL(10,2),
  thumbnail_url TEXT,
  instructor_id UUID,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Módulos dos cursos
CREATE TABLE course_modules (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id),
  title VARCHAR(255),
  order_index INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aulas
CREATE TABLE lessons (
  id UUID PRIMARY KEY,
  module_id UUID REFERENCES course_modules(id),
  title VARCHAR(255),
  video_url TEXT,
  duration INT,
  order_index INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matrículas
CREATE TABLE enrollments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  course_id UUID REFERENCES courses(id),
  progress JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 📋 CHECKLIST DE DEPLOY

Após cada sprint:
1. [ ] Testar localmente
2. [ ] Fazer build de produção
3. [ ] Commitar com mensagem descritiva
4. [ ] Aguardar deploy no Vercel
5. [ ] Testar em produção
6. [ ] Atualizar documentação

## 🎯 MÉTRICAS DE SUCESSO

- [ ] Todos os warnings resolvidos
- [ ] PageSpeed Score > 90
- [ ] Zero erros no console
- [ ] Taxa de conversão newsletter > 5%
- [ ] Tempo de carregamento < 2s

---

**Próximo passo**: Começar pela implementação da tabela `related_posts`
**Comando para continuar**: "Vamos implementar a tabela related_posts no Supabase"

# 💬 Sistema de Comentários - Planejamento

## 📋 Visão Geral

Sistema completo de comentários para o blog da Rio Porto P2P, permitindo engajamento dos leitores com moderação e controle total.

## 🎯 Funcionalidades Planejadas

### 1. Tipos de Comentários
- **Anônimos**: Com reCAPTCHA para evitar spam
- **Autenticados**: Para usuários logados
- **Moderados**: Aprovação antes de publicar (configurável)

### 2. Features Principais
- ✨ Sistema de likes/dislikes
- 💬 Respostas aninhadas (threads)
- 🔔 Notificações por email
- 🛡️ Filtro automático de spam
- 📊 Contadores de comentários
- 🎨 Avatar para usuários autenticados
- 📱 Design responsivo

### 3. Painel de Moderação
- Lista de comentários pendentes
- Aprovar/rejeitar em lote
- Banir usuários/IPs
- Estatísticas de comentários
- Filtros personalizados

## 🗄️ Estrutura do Banco de Dados

```sql
-- Tabela de comentários
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  post_slug VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  author_name VARCHAR(100),
  author_email VARCHAR(255),
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id),
  status VARCHAR(20) DEFAULT 'pending',
  likes_count INT DEFAULT 0,
  dislikes_count INT DEFAULT 0,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Tabela de likes/dislikes
CREATE TABLE comment_reactions (
  id UUID PRIMARY KEY,
  comment_id UUID REFERENCES comments(id),
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  reaction_type VARCHAR(10), -- 'like' ou 'dislike'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id),
  UNIQUE(comment_id, ip_address)
);

-- Tabela de comentários reportados
CREATE TABLE comment_reports (
  id UUID PRIMARY KEY,
  comment_id UUID REFERENCES comments(id),
  reporter_id UUID REFERENCES auth.users(id),
  reason VARCHAR(50),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🏗️ Arquitetura

```
/components/blog/
  ├── comments/
  │   ├── comment-form.tsx      # Formulário de comentário
  │   ├── comment-list.tsx      # Lista de comentários
  │   ├── comment-item.tsx      # Item individual
  │   ├── comment-thread.tsx    # Thread de respostas
  │   └── comment-reactions.tsx # Likes/dislikes
  │
/app/api/comments/
  ├── route.ts                  # GET/POST comentários
  ├── [id]/
  │   ├── route.ts             # PUT/DELETE comentário
  │   ├── like/route.ts        # Like/unlike
  │   └── report/route.ts      # Reportar comentário
  │
/app/(platform)/admin/comments/
  ├── page.tsx                  # Dashboard de moderação
  └── [id]/page.tsx            # Detalhes do comentário
```

## 🔧 Implementação por Etapas

### Etapa 1: Backend (3 horas)
1. Criar tabelas no Supabase
2. Configurar RLS (Row Level Security)
3. Criar API routes
4. Implementar filtro de spam

### Etapa 2: Frontend Básico (3 horas)
1. Componente de formulário
2. Lista de comentários
3. Integração com API
4. Loading states

### Etapa 3: Features Avançadas (2 horas)
1. Sistema de likes/dislikes
2. Respostas aninhadas
3. Notificações por email
4. Avatar de usuários

### Etapa 4: Painel Admin (2 horas)
1. Lista de moderação
2. Ações em lote
3. Estatísticas
4. Configurações

## 🎨 Design

- Seguir o padrão visual do blog
- Usar componentes Shadcn/ui
- Modo claro/escuro
- Animações suaves
- Feedback visual para ações

## 🔒 Segurança

- reCAPTCHA para anônimos
- Rate limiting por IP
- Filtro de palavrões
- Validação no servidor
- Sanitização de HTML
- Proteção contra XSS

## 📊 Métricas

- Total de comentários
- Taxa de aprovação
- Usuários mais ativos
- Posts mais comentados
- Tempo médio de moderação

## 🚀 Próximos Passos

1. Criar estrutura no banco
2. Implementar API routes
3. Desenvolver componentes
4. Testar e refinar
5. Deploy e monitorar

---

**Tempo estimado**: 8-10 horas (1 dia de trabalho)
**Complexidade**: Média
**Prioridade**: Alta (aumenta engajamento)

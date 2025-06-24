# 📝 DOCUMENTAÇÃO DO BLOG - RIO PORTO P2P

## 📅 Última Atualização: 01/01/2025

## 🎯 Status do Blog

### ✅ IMPLEMENTADO:

1. **Integração com Supabase**
   - Tabelas criadas para posts, autores, categorias, tags, comentários
   - Sistema de analytics básico (views, tempo de leitura)
   - Newsletter com inscrição
   - RLS configurado para segurança

2. **API Completa** (`/lib/blog/api.ts`)
   - Busca de posts com filtros (categoria, tag, autor, busca)
   - Paginação funcional
   - Posts em destaque
   - Posts relacionados
   - Sistema de comentários com moderação
   - Estatísticas do blog

3. **Componentes do Blog**
   - Listagem de posts responsiva
   - Página individual com conteúdo Markdown
   - Sistema de comentários com respostas
   - Botões de compartilhamento social
   - Newsletter CTA

4. **Funcionalidades**
   - Busca em tempo real
   - Filtros por categoria
   - Contador de visualizações automático
   - Tempo de leitura calculado automaticamente
   - SEO-friendly URLs (slugs)

5. **SEO Avançado** 🆕
   - Metadata dinâmica para todas as páginas
   - Schema.org markup (JSON-LD)
   - Open Graph tags
   - Twitter Cards
   - Sitemap.xml automático
   - RSS Feed funcional

6. **API Routes**
   - `/api/blog/newsletter` - Inscrição/cancelamento
   - `/api/blog/analytics` - Rastreamento de views
   - `/api/blog/rss` - Feed RSS

## 📊 Estrutura do Banco de Dados

### Tabelas Principais:
- `authors` - Autores dos artigos
- `categories` - Categorias (Bitcoin, Stablecoins, Estratégias)
- `tags` - Tags para organização
- `blog_posts` - Posts do blog
- `post_tags` - Relacionamento posts-tags
- `related_posts` - Posts relacionados
- `comments` - Sistema de comentários
- `newsletter_subscribers` - Inscritos na newsletter
- `post_analytics` - Analytics básico

### Views:
- `published_posts` - Posts publicados com joins
- `category_stats` - Estatísticas por categoria

## 🚀 Como Usar

### 1. Executar SQLs no Supabase:
```bash
# 1. Criar estrutura
supabase_blog_setup.sql

# 2. Migrar dados iniciais
supabase_blog_data_migration.sql
```

### 2. Instalar Dependências:
```bash
npm install marked @types/marked
```

### 3. Páginas do Blog:
- `/blog` - Listagem de posts
- `/blog/[slug]` - Post individual

## 🔧 Próximos Passos

### Funcionalidades Pendentes:
1. **Sistema de Upload de Imagens**
   - Storage bucket no Supabase
   - Upload na criação/edição de posts

2. **Dashboard Administrativo**
   - CRUD de posts
   - Moderação de comentários
   - Gestão de newsletter

3. **SEO e Performance**
   - Metadata dinâmica
   - Sitemap.xml
   - RSS Feed
   - Schema.org markup

4. **Newsletter**
   - Integração com Resend
   - Templates de email
   - Confirmação de inscrição

5. **Melhorias de UX**
   - Infinite scroll
   - Skeleton loading
   - Preview de posts
   - Editor WYSIWYG

## 🗺️ URLs Importantes

### Frontend:
- `/blog` - Listagem de posts
- `/blog/[slug]` - Post individual
- `/blog?category=bitcoin` - Filtro por categoria
- `/blog?tag=seguranca` - Filtro por tag
- `/blog?search=wallet` - Busca

### APIs:
- `/api/blog/newsletter` - Newsletter
- `/api/blog/analytics` - Analytics
- `/api/blog/rss` - Feed RSS
- `/sitemap.xml` - Sitemap automático

## 📝 Estrutura de Arquivos

```
lib/blog/
├── api.ts          # Funções do Supabase
├── data.ts         # Dados mockados (legado)

components/blog/
├── post-content.tsx    # Renderizador Markdown
├── comments.tsx        # Sistema de comentários
├── share-buttons.tsx   # Compartilhamento social

app/(marketing)/blog/
├── page.tsx           # Listagem
└── [slug]/
    └── page.tsx       # Post individual

types/
└── blog.ts           # Tipos TypeScript
```

## 🎨 Customizações Possíveis

### Temas de Categorias:
```tsx
// Cores por categoria
const categoryColors = {
  'Bitcoin': 'orange',
  'Stablecoins': 'green',
  'Estratégias': 'blue'
}
```

### Limites e Configurações:
```tsx
// Em /lib/blog/api.ts
const POSTS_PER_PAGE = 10
const FEATURED_POSTS_LIMIT = 3
const RELATED_POSTS_LIMIT = 3
```

## 🐛 Troubleshooting

### Erro: "Posts não aparecem"
- Verificar se executou os SQLs de migração
- Confirmar que posts estão com `published = true`
- Checar conexão com Supabase

### Erro: "Comentários não funcionam"
- Usuário precisa estar autenticado
- Comentários precisam ser aprovados (admin)
- Verificar políticas RLS

### Erro: "Markdown não renderiza"
- Instalar: `npm install marked @types/marked`
- Verificar conteúdo do post no banco

## 📌 Notas Importantes

1. **Moderação de Comentários**: Todos os comentários começam com `approved = false`
2. **Analytics**: Views são incrementadas automaticamente
3. **Tempo de Leitura**: Calculado automaticamente (200 palavras/min)
4. **Newsletter**: Emails ainda não são enviados (falta Resend)
5. **Imagens**: Usar URLs externas por enquanto

## 🔗 Links Úteis

- [Marked.js Docs](https://marked.js.org/)
- [Supabase Docs](https://supabase.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)

---

**Para dúvidas ou sugestões sobre o Blog, consulte este documento primeiro!**

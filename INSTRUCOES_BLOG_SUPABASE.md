# 🚀 INSTRUÇÕES PARA ATIVAR O BLOG NO SUPABASE

## 📋 Passo a Passo

### 1. Instalar Dependências
```bash
npm install marked @types/marked
```

### 2. Executar SQLs no Supabase

Acesse o SQL Editor no dashboard do Supabase e execute os scripts na ordem:

#### Script 1: Estrutura do Blog
Execute o conteúdo do arquivo `supabase_blog_setup.sql`

Este script cria:
- Tabelas do blog (posts, autores, categorias, etc)
- Índices para performance
- Triggers automáticos
- Views úteis
- Políticas RLS

#### Script 2: Dados Iniciais
Execute o conteúdo do arquivo `supabase_blog_data_migration.sql`

Este script insere:
- 5 autores
- 3 categorias
- 30+ tags
- 10 posts iniciais
- Relacionamentos entre posts

### 3. Verificar Instalação

Execute estas queries para confirmar:

```sql
-- Verificar totais
SELECT COUNT(*) as total_posts FROM blog_posts;
SELECT COUNT(*) as total_authors FROM authors;
SELECT COUNT(*) as total_categories FROM categories;
SELECT COUNT(*) as total_tags FROM tags;

-- Ver posts publicados
SELECT * FROM published_posts LIMIT 5;

-- Ver estatísticas
SELECT * FROM category_stats;
```

### 4. Testar o Blog

1. Acesse: `http://localhost:3000/blog`
2. Clique em um post para ver detalhes
3. Teste a busca e filtros
4. Inscreva-se na newsletter
5. Faça login e comente em um post

### 5. URLs Disponíveis

- **Frontend:**
  - `/blog` - Listagem principal
  - `/blog/[slug]` - Post individual
  - `/blog?category=bitcoin` - Filtro por categoria
  - `/blog?search=termo` - Busca

- **APIs:**
  - `/api/blog/newsletter` - Newsletter
  - `/api/blog/analytics` - Analytics
  - `/api/blog/rss` - Feed RSS
  - `/sitemap.xml` - Sitemap

## ⚠️ Problemas Comuns

### "Posts não aparecem"
- Verifique se executou o script de migração
- Confirme que posts têm `published = true`
- Cheque as políticas RLS

### "Comentários não funcionam"
- Usuário precisa estar logado
- Comentários começam com `approved = false`
- Admin precisa aprovar manualmente

### "Newsletter não envia email"
- Normal! Falta integrar com Resend
- Emails são salvos no banco

## 📊 Painel Admin (Futuro)

Para moderar comentários no Supabase:

```sql
-- Ver comentários pendentes
SELECT c.*, p.full_name as user_name, b.title as post_title
FROM comments c
JOIN profiles p ON c.user_id = p.id
JOIN blog_posts b ON c.post_id = b.id
WHERE c.approved = false
ORDER BY c.created_at DESC;

-- Aprovar comentário
UPDATE comments 
SET approved = true 
WHERE id = 'COMMENT_ID';
```

## 🎉 Pronto!

O Blog está totalmente funcional com:
- ✅ Posts dinâmicos do Supabase
- ✅ Sistema de comentários
- ✅ Newsletter
- ✅ Analytics básico
- ✅ SEO otimizado
- ✅ RSS Feed

**Próximos passos:** Dashboard admin ou sistema de cursos!

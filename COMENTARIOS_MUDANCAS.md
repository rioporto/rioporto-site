# 🔄 Sistema de Comentários - Mudanças Importantes

## 📌 Resumo da Situação

1. **Problema encontrado**: Tabela `comments` já existe com estrutura incompatível
2. **Solução adotada**: Criar novo sistema com prefixo `blog_`
3. **MCP Supabase**: Funcionando mas com limitações (apenas leitura)

## 🗂️ Novas Tabelas (com prefixo blog_)

- `blog_comments` (em vez de `comments`)
- `blog_comment_reactions` (em vez de `comment_reactions`)
- `blog_comment_reports` (em vez de `comment_reports`)
- `blog_blocked_words` (em vez de `blocked_words`)
- `blog_banned_ips` (em vez de `banned_ips`)

## 📁 Arquivos Atualizados

### ✅ SQL
- **`blog_comments_install.sql`** - Script completo para instalar

### ✅ TypeScript
- **`types/comments.ts`** - Tipos atualizados com prefixo Blog
- **`app/api/comments/route.ts`** - API atualizada parcialmente

### ⏳ Ainda precisam ser atualizados
- `app/api/comments/[id]/route.ts`
- `app/api/comments/[id]/like/route.ts`
- `app/api/comments/[id]/report/route.ts`
- `lib/comments/utils.ts`

## 🚀 Próximos Passos

### 1. Executar SQL no Supabase Dashboard
```bash
# Arquivo: blog_comments_install.sql
# Execute no SQL Editor do Supabase
```

### 2. Verificar instalação via MCP
Posso verificar se as tabelas foram criadas corretamente

### 3. Atualizar APIs restantes
Preciso atualizar os outros arquivos de API

### 4. Continuar com Etapa 2 (Frontend)
Criar os componentes visuais

## 💡 Vantagem da mudança

Usar prefixo `blog_` evita conflitos e deixa claro que é o sistema de comentários do blog, não confundindo com outros possíveis sistemas de comentários futuros.

---

**Status**: Aguardando execução do SQL para continuar
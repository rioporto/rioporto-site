# 🔒 Row Level Security (RLS) no Supabase

## 📋 Conceitos Fundamentais

RLS é um recurso do PostgreSQL que permite controlar o acesso a linhas individuais em uma tabela baseado em políticas. No Supabase, isso é ESSENCIAL para segurança.

## ⚠️ REGRA DE OURO

**SEMPRE ative RLS em TODAS as tabelas que contêm dados de usuários!**

```sql
-- Ativar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
```

## 📝 Políticas Comuns

### 1. Perfil de Usuário (profiles)

```sql
-- Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Criar perfil automático no signup
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);
```

### 2. Comentários do Blog

```sql
-- Todos podem ver comentários aprovados
CREATE POLICY "Anyone can view approved comments" 
ON comments FOR SELECT 
USING (approved = true);

-- Usuários autenticados podem criar comentários
CREATE POLICY "Authenticated users can create comments" 
ON comments FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Apenas admins podem aprovar comentários
CREATE POLICY "Only admins can update comments" 
ON comments FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Usuários podem editar seus próprios comentários não aprovados
CREATE POLICY "Users can update own unapproved comments" 
ON comments FOR UPDATE
USING (
  auth.uid() = user_id AND 
  approved = false
);
```

### 3. Transações P2P

```sql
-- Usuários veem apenas suas próprias transações
CREATE POLICY "Users can view own transactions" 
ON transactions FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() = partner_id
);

-- Apenas usuários autenticados podem criar transações
CREATE POLICY "Authenticated users can create transactions" 
ON transactions FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admins podem ver todas as transações
CREATE POLICY "Admins can view all transactions" 
ON transactions FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);
```

## 🎯 Políticas Avançadas

### 1. Política com JOIN

```sql
-- Usuários podem ver posts de categorias públicas
CREATE POLICY "View posts in public categories"
ON blog_posts FOR SELECT
USING (
  category_id IN (
    SELECT id FROM categories WHERE is_public = true
  )
);
```

### 2. Política com Função

```sql
-- Criar função helper
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usar na política
CREATE POLICY "Admins can delete comments"
ON comments FOR DELETE
USING (is_admin());
```

### 3. Política Temporal

```sql
-- Comentários podem ser editados até 15 minutos após criação
CREATE POLICY "Edit comments within 15 minutes"
ON comments FOR UPDATE
USING (
  auth.uid() = user_id AND
  created_at > NOW() - INTERVAL '15 minutes'
);
```

## 🔍 Testando RLS

### 1. Testar como usuário anônimo:
```sql
-- Resetar role
SET ROLE postgres;

-- Agir como anônimo
SET ROLE anon;
SELECT * FROM profiles; -- Deve retornar vazio

-- Voltar ao admin
SET ROLE postgres;
```

### 2. Testar como usuário específico:
```sql
-- Definir usuário para teste
SET request.jwt.claim.sub = 'user-uuid-here';
SET ROLE authenticated;

-- Tentar queries
SELECT * FROM profiles; -- Deve retornar apenas perfil do usuário
```

## 🛠️ Funções Úteis do Supabase

### auth.uid()
Retorna o ID do usuário atual
```sql
SELECT auth.uid(); -- UUID do usuário logado ou NULL
```

### auth.jwt()
Retorna o JWT completo
```sql
SELECT auth.jwt() ->> 'email'; -- Email do usuário
SELECT auth.jwt() ->> 'role'; -- Role do usuário
```

### auth.role()
Retorna o role atual
```sql
SELECT auth.role(); -- 'authenticated', 'anon', etc
```

## ⚠️ Erros Comuns

### 1. Esquecer de ativar RLS
```sql
-- ❌ PERIGO! Tabela acessível por todos
CREATE TABLE sensitive_data (id uuid, secret text);

-- ✅ CORRETO
CREATE TABLE sensitive_data (id uuid, secret text);
ALTER TABLE sensitive_data ENABLE ROW LEVEL SECURITY;
```

### 2. Política muito permissiva
```sql
-- ❌ RUIM - Todos podem ver tudo
CREATE POLICY "Anyone can read" ON table_name
FOR SELECT USING (true);

-- ✅ MELHOR - Apenas dados públicos
CREATE POLICY "View public data" ON table_name
FOR SELECT USING (is_public = true);
```

### 3. Esquecer do service role
```sql
-- Service role bypassa RLS!
-- Use apenas no servidor, NUNCA no cliente
const supabase = createClient(url, SERVICE_ROLE_KEY)
```

## 📚 Padrões de Políticas

### 1. CRUD Completo para Próprios Dados
```sql
-- SELECT
CREATE POLICY "users_select_own" ON table_name
FOR SELECT USING (auth.uid() = user_id);

-- INSERT
CREATE POLICY "users_insert_own" ON table_name
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE
CREATE POLICY "users_update_own" ON table_name
FOR UPDATE USING (auth.uid() = user_id);

-- DELETE
CREATE POLICY "users_delete_own" ON table_name
FOR DELETE USING (auth.uid() = user_id);
```

### 2. Read-Only Público
```sql
CREATE POLICY "public_read_only" ON table_name
FOR SELECT USING (is_published = true);
```

### 3. Admin Full Access
```sql
CREATE POLICY "admin_all_access" ON table_name
FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);
```

## 🔧 Debugging RLS

### 1. Ver políticas de uma tabela:
```sql
SELECT * FROM pg_policies WHERE tablename = 'your_table';
```

### 2. Explicar query com RLS:
```sql
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM comments WHERE approved = true;
```

### 3. Logs de RLS negado:
```sql
-- No Supabase Dashboard > Logs > Postgres
-- Procure por "row level security"
```

## 📋 Checklist de Segurança

- [ ] RLS ativado em todas as tabelas
- [ ] Políticas testadas para cada role
- [ ] Service role key apenas no servidor
- [ ] Anon key apenas para operações públicas
- [ ] Políticas revisadas por outro dev
- [ ] Testes de penetração realizados

---

**Última atualização:** 24/06/2025
**Versão:** 1.0.0

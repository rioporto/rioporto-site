-- ========================================
-- CORREÇÃO URGENTE - SISTEMA DE COMENTÁRIOS
-- ========================================
-- Execute este SQL completo no Supabase

-- 1. Verificar políticas atuais
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'blog_comments';

-- 2. Remover políticas antigas que podem estar causando problema
DROP POLICY IF EXISTS "Qualquer um pode comentar" ON blog_comments;
DROP POLICY IF EXISTS "Permite comentarios anonimos e autenticados" ON blog_comments;
DROP POLICY IF EXISTS "Permite comentarios anonimos" ON blog_comments;

-- 3. Criar nova política que REALMENTE permite comentários anônimos
CREATE POLICY "permite_inserir_comentarios" 
ON blog_comments 
FOR INSERT 
TO public  -- Importante: usar 'public' em vez de 'anon'
WITH CHECK (true);

-- 4. Garantir que anon pode inserir
GRANT INSERT ON blog_comments TO anon;
GRANT SELECT ON blog_comments TO anon;

-- 5. Verificar se funcionou
SELECT has_table_privilege('anon', 'blog_comments', 'INSERT');

-- 6. Teste rápido de inserção
INSERT INTO blog_comments (
    post_slug,
    content,
    author_name,
    author_email,
    status,
    ip_address,
    user_agent
) VALUES (
    'teste-politica',
    'Teste de política RLS',
    'Teste RLS',
    'teste@rls.com',
    'pending',
    '127.0.0.1',
    'Teste'
) RETURNING id, content;

-- 7. Se funcionou, deletar o teste
DELETE FROM blog_comments WHERE post_slug = 'teste-politica';

-- 8. Verificar todas as políticas finais
SELECT * FROM pg_policies WHERE tablename = 'blog_comments';
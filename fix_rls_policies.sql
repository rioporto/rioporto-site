-- Script para verificar e corrigir políticas RLS
-- Execute no Supabase SQL Editor

-- 1. Verificar se as políticas existem
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'blog_comments';

-- 2. Se não houver política de INSERT para anon, criar:
DO $$ 
BEGIN
    -- Remover política antiga se existir
    DROP POLICY IF EXISTS "Qualquer um pode comentar" ON blog_comments;
    
    -- Criar nova política que permite INSERT para todos
    CREATE POLICY "Permite comentarios anonimos e autenticados" 
    ON blog_comments 
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);
END $$;

-- 3. Verificar se as colunas estão corretas
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'blog_comments'
ORDER BY ordinal_position;

-- 4. Verificar se os triggers estão funcionando
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'blog_comment_reactions';

-- 5. Testar inserção manual
INSERT INTO blog_comments (
    post_slug,
    content,
    author_name,
    author_email,
    status,
    ip_address,
    user_agent
) VALUES (
    'test-post',
    'Teste de comentário anônimo',
    'Teste Nome',
    'teste@email.com',
    'pending',
    '127.0.0.1',
    'Test Agent'
) RETURNING *;

-- Se funcionar, deletar o teste:
-- DELETE FROM blog_comments WHERE post_slug = 'test-post';
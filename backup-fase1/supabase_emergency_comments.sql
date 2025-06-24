-- =====================================================
-- SCRIPT DE EMERGÊNCIA - POLÍTICAS SUPER PERMISSIVAS
-- =====================================================
-- Use este script apenas para teste!

-- 1. DROPAR TODAS AS POLÍTICAS DE COMMENTS
-- =====================================================
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'comments'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON comments', pol.policyname);
    END LOOP;
END $$;

-- 2. CRIAR POLÍTICA SUPER PERMISSIVA
-- =====================================================
CREATE POLICY "Permitir tudo para autenticados - TESTE" ON comments
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. VERIFICAR
-- =====================================================
SELECT 'Políticas atuais:' as info;
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'comments';

-- 4. TESTAR INSERÇÃO
-- =====================================================
DO $$
DECLARE
    test_post_id UUID;
    new_comment_id UUID;
BEGIN
    -- Pegar um post
    SELECT id INTO test_post_id FROM blog_posts LIMIT 1;
    
    -- Inserir comentário
    INSERT INTO comments (post_id, user_id, content, approved)
    VALUES (test_post_id, auth.uid(), 'Teste emergencial - ' || NOW()::text, false)
    RETURNING id INTO new_comment_id;
    
    RAISE NOTICE 'Comentário inserido com sucesso! ID: %', new_comment_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'ERRO ao inserir: %', SQLERRM;
END $$;

-- 5. VER COMENTÁRIOS DO USUÁRIO
-- =====================================================
SELECT 
    c.id,
    c.content,
    c.approved,
    c.created_at,
    p.name as user_name
FROM comments c
LEFT JOIN profiles p ON c.user_id = p.id
WHERE c.user_id = auth.uid()
ORDER BY c.created_at DESC
LIMIT 10;

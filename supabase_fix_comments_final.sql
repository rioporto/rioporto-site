-- =====================================================
-- CORREÇÃO FINAL DE COMENTÁRIOS
-- =====================================================
-- Este script corrige os problemas de comentários usando apenas
-- a estrutura existente do banco de dados

-- 1. LIMPAR POLÍTICAS ANTIGAS (GARANTIR QUE NÃO HÁ CONFLITOS)
-- =====================================================
DO $$ 
BEGIN
    -- Dropar todas as políticas existentes da tabela comments
    DROP POLICY IF EXISTS "Usuários podem criar comentários" ON comments;
    DROP POLICY IF EXISTS "Usuários podem editar próprios comentários" ON comments;
    DROP POLICY IF EXISTS "Usuários podem deletar próprios comentários" ON comments;
    DROP POLICY IF EXISTS "Comentários aprovados são visíveis" ON comments;
    DROP POLICY IF EXISTS "Comentários aprovados são públicos" ON comments;
    DROP POLICY IF EXISTS "Usuários autenticados podem criar comentários" ON comments;
    DROP POLICY IF EXISTS "Usuários podem ver próprios comentários" ON comments;
    DROP POLICY IF EXISTS "Usuários podem editar comentários não aprovados" ON comments;
    DROP POLICY IF EXISTS "Usuários podem deletar seus comentários" ON comments;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- 2. CRIAR POLÍTICAS SIMPLES E FUNCIONAIS
-- =====================================================

-- Política 1: Qualquer pessoa pode ver comentários aprovados
CREATE POLICY "Ver comentários aprovados" ON comments
    FOR SELECT
    USING (approved = true);

-- Política 2: Usuários autenticados podem criar comentários
CREATE POLICY "Criar comentários" ON comments
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Política 3: Usuários podem ver seus próprios comentários (mesmo não aprovados)
CREATE POLICY "Ver próprios comentários" ON comments
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Política 4: Usuários podem atualizar seus comentários não aprovados
CREATE POLICY "Atualizar próprios comentários" ON comments
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id AND approved = false);

-- Política 5: Usuários podem deletar seus próprios comentários
CREATE POLICY "Deletar próprios comentários" ON comments
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 3. GARANTIR QUE PROFILES ESTÁ CONFIGURADO CORRETAMENTE
-- =====================================================
DO $$ 
BEGIN
    -- Dropar políticas antigas de profiles
    DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Políticas para profiles
CREATE POLICY "Ver próprio perfil" ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Atualizar próprio perfil" ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- 4. VERIFICAR E CORRIGIR DADOS
-- =====================================================

-- Garantir que todos os usuários tenham um perfil
INSERT INTO profiles (id, email, name)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1))
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- 5. CRIAR FUNÇÃO HELPER SIMPLIFICADA
-- =====================================================
CREATE OR REPLACE FUNCTION user_has_profile()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid()
        AND name IS NOT NULL 
        AND name != ''
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. TESTAR AS CORREÇÕES
-- =====================================================

-- Teste 1: Verificar se o usuário atual tem perfil
SELECT 
    auth.uid() as user_id,
    user_has_profile() as has_profile,
    (SELECT name FROM profiles WHERE id = auth.uid()) as profile_name;

-- Teste 2: Tentar inserir um comentário de teste
DO $$
DECLARE
    test_post_id UUID;
BEGIN
    -- Pegar o ID de um post qualquer
    SELECT id INTO test_post_id FROM blog_posts LIMIT 1;
    
    -- Tentar inserir
    INSERT INTO comments (post_id, user_id, content, approved)
    VALUES (test_post_id, auth.uid(), 'Teste após correções finais', false);
    
    RAISE NOTICE 'Comentário de teste inserido com sucesso!';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao inserir comentário: %', SQLERRM;
END $$;

-- 7. VERIFICAR RESULTADOS
-- =====================================================

-- Ver políticas ativas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename IN ('comments', 'profiles')
ORDER BY tablename, policyname;

-- Ver comentários do usuário atual
SELECT 
    c.id,
    c.content,
    c.approved,
    c.created_at,
    p.name as author_name
FROM comments c
LEFT JOIN profiles p ON c.user_id = p.id
WHERE c.user_id = auth.uid()
ORDER BY c.created_at DESC
LIMIT 5;

-- 8. INFORMAÇÕES ÚTEIS
-- =====================================================
/*
Para aprovar comentários manualmente:
UPDATE comments SET approved = true WHERE id = 'ID_DO_COMENTARIO';

Para ver todos os comentários pendentes:
SELECT c.*, p.name FROM comments c
JOIN profiles p ON c.user_id = p.id
WHERE c.approved = false
ORDER BY c.created_at DESC;
*/

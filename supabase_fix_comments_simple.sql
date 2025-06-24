-- =====================================================
-- CORREÇÃO DE POLÍTICAS PARA COMENTÁRIOS (VERSÃO SIMPLIFICADA)
-- =====================================================
-- Execute este script para corrigir problemas de permissão nos comentários
-- Esta versão usa apenas o campo 'name' existente, sem adicionar 'full_name'

-- 1. DROPAR POLÍTICAS ANTIGAS
-- =====================================================
DROP POLICY IF EXISTS "Usuários podem criar comentários" ON comments;
DROP POLICY IF EXISTS "Usuários podem editar próprios comentários" ON comments;
DROP POLICY IF EXISTS "Usuários podem deletar próprios comentários" ON comments;
DROP POLICY IF EXISTS "Comentários aprovados são visíveis" ON comments;
DROP POLICY IF EXISTS "Comentários aprovados são públicos" ON comments;
DROP POLICY IF EXISTS "Usuários autenticados podem criar comentários" ON comments;
DROP POLICY IF EXISTS "Usuários podem ver próprios comentários" ON comments;
DROP POLICY IF EXISTS "Usuários podem editar comentários não aprovados" ON comments;
DROP POLICY IF EXISTS "Usuários podem deletar seus comentários" ON comments;

-- 2. CRIAR NOVAS POLÍTICAS MAIS PERMISSIVAS
-- =====================================================

-- Política para visualizar comentários aprovados (pública)
CREATE POLICY "Comentários aprovados são públicos" ON comments
    FOR SELECT
    USING (approved = true);

-- Política para usuários autenticados criarem comentários
CREATE POLICY "Usuários autenticados podem criar comentários" ON comments
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id AND
        approved = false -- Forçar que novos comentários comecem não aprovados
    );

-- Política para usuários verem seus próprios comentários (mesmo não aprovados)
CREATE POLICY "Usuários podem ver próprios comentários" ON comments
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Política para usuários editarem seus comentários não aprovados
CREATE POLICY "Usuários podem editar comentários não aprovados" ON comments
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = user_id AND 
        approved = false
    )
    WITH CHECK (
        auth.uid() = user_id AND
        approved = false
    );

-- Política para usuários deletarem seus comentários
CREATE POLICY "Usuários podem deletar seus comentários" ON comments
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 3. CRIAR FUNÇÃO PARA VERIFICAR PERFIL COMPLETO (usando campo 'name')
-- =====================================================
CREATE OR REPLACE FUNCTION check_user_can_comment(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Verificar se o usuário tem perfil com nome preenchido
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id 
        AND name IS NOT NULL 
        AND name != ''
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. GARANTIR QUE USUÁRIOS POSSAM LER SEUS PRÓPRIOS PERFIS
-- =====================================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 5. TESTE DE DIAGNÓSTICO
-- =====================================================
-- Execute estas queries para verificar:

-- Verificar se há usuários sem nome
SELECT id, email, name, phone 
FROM profiles 
WHERE name IS NULL OR name = '';

-- Verificar políticas ativas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('comments', 'profiles')
ORDER BY tablename, policyname;

-- Testar função
SELECT check_user_can_comment(auth.uid());

-- 6. INSERIR COMENTÁRIO DE TESTE (opcional)
-- =====================================================
-- Descomente e execute para testar se consegue inserir um comentário:
/*
INSERT INTO comments (post_id, user_id, content, approved)
VALUES (
  (SELECT id FROM blog_posts LIMIT 1),
  auth.uid(),
  'Teste de comentário após correção',
  false
)
RETURNING *;
*/

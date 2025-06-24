-- =====================================================
-- CORREÇÃO DE POLÍTICAS PARA COMENTÁRIOS
-- =====================================================
-- Execute este script para corrigir problemas de permissão nos comentários

-- 1. DROPAR POLÍTICAS ANTIGAS
-- =====================================================
DROP POLICY IF EXISTS "Usuários podem criar comentários" ON comments;
DROP POLICY IF EXISTS "Usuários podem editar próprios comentários" ON comments;
DROP POLICY IF EXISTS "Usuários podem deletar próprios comentários" ON comments;
DROP POLICY IF EXISTS "Comentários aprovados são visíveis" ON comments;

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

-- 3. VERIFICAR SE A TABELA PROFILES TEM FULL_NAME
-- =====================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Atualizar full_name com o valor de name se estiver vazio
UPDATE profiles 
SET full_name = name 
WHERE full_name IS NULL AND name IS NOT NULL;

-- 4. CRIAR FUNÇÃO PARA VERIFICAR PERFIL COMPLETO
-- =====================================================
CREATE OR REPLACE FUNCTION check_user_can_comment(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Verificar se o usuário tem perfil completo
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id 
        AND full_name IS NOT NULL 
        AND full_name != ''
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. GARANTIR QUE USUÁRIOS POSSAM LER SEUS PRÓPRIOS PERFIS
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

-- 6. TESTE DE DIAGNÓSTICO
-- =====================================================
-- Execute estas queries para verificar:

-- Verificar se há usuários sem full_name
SELECT id, email, name, full_name 
FROM profiles 
WHERE full_name IS NULL OR full_name = '';

-- Verificar políticas ativas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('comments', 'profiles')
ORDER BY tablename, policyname;

-- Testar função
SELECT check_user_can_comment(auth.uid());

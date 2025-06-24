-- =====================================================
-- CORREÇÃO: COMENTÁRIOS VISÍVEIS PARA TODOS
-- =====================================================
-- Este script corrige o problema de comentários aprovados
-- só aparecerem para usuários logados

-- 1. VERIFICAR POLÍTICAS ATUAIS
-- =====================================================
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'comments'
ORDER BY policyname;

-- 2. REMOVER POLÍTICA PROBLEMÁTICA (SE EXISTIR)
-- =====================================================
DROP POLICY IF EXISTS "Comentários aprovados são públicos" ON comments;
DROP POLICY IF EXISTS "Ver comentários aprovados" ON comments;

-- 3. CRIAR NOVA POLÍTICA PARA VISUALIZAÇÃO PÚBLICA
-- =====================================================
-- Esta política permite que QUALQUER PESSOA (mesmo não logada)
-- veja comentários aprovados
CREATE POLICY "Comentários aprovados são públicos para todos" ON comments
    FOR SELECT
    TO public  -- Mudança importante: usar 'public' em vez de 'anon' ou 'authenticated'
    USING (approved = true);

-- 4. MANTER OUTRAS POLÍTICAS PARA USUÁRIOS AUTENTICADOS
-- =====================================================
-- Verificar se estas políticas existem, senão criar:

-- Usuários autenticados podem criar comentários
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'comments' 
        AND policyname = 'Criar comentários'
    ) THEN
        CREATE POLICY "Criar comentários" ON comments
            FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Usuários podem ver seus próprios comentários
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'comments' 
        AND policyname = 'Ver próprios comentários'
    ) THEN
        CREATE POLICY "Ver próprios comentários" ON comments
            FOR SELECT
            TO authenticated
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- 5. TESTAR A VISIBILIDADE
-- =====================================================
-- Execute esta query SEM estar logado (anon)
-- para verificar se consegue ver comentários aprovados
SELECT 
    c.id,
    c.content,
    c.approved,
    c.created_at
FROM comments c
WHERE c.approved = true
LIMIT 5;

-- 6. VERIFICAR POLÍTICAS FINAIS
-- =====================================================
SELECT 
    policyname,
    roles,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'comments'
ORDER BY policyname;

-- 7. ESTATÍSTICAS
-- =====================================================
SELECT 
    COUNT(*) FILTER (WHERE approved = true) as comentarios_visiveis,
    COUNT(*) FILTER (WHERE approved = false) as comentarios_pendentes,
    COUNT(*) as total_comentarios
FROM comments;

-- =====================================================
-- OPÇÃO ALTERNATIVA: COMENTÁRIOS HÍBRIDOS
-- =====================================================
-- Esta configuração permite:
-- 1. Visitantes veem QUANTIDADE de comentários
-- 2. Mas precisam logar para LER o conteúdo

-- PASSO 1: Criar view para contagem pública
-- =====================================================
CREATE OR REPLACE VIEW public.comment_counts AS
SELECT 
    post_id,
    COUNT(*) FILTER (WHERE approved = true) as approved_count,
    COUNT(*) as total_count
FROM comments
GROUP BY post_id;

-- Permitir acesso público à view
GRANT SELECT ON public.comment_counts TO anon;
GRANT SELECT ON public.comment_counts TO authenticated;

-- PASSO 2: Ajustar política de comentários
-- =====================================================
-- Remover política pública anterior
DROP POLICY IF EXISTS "Comentários aprovados são públicos para todos" ON comments;

-- Criar política apenas para autenticados
CREATE POLICY "Comentários aprovados para autenticados" ON comments
    FOR SELECT
    TO authenticated  -- Apenas usuários logados
    USING (approved = true OR auth.uid() = user_id);

-- PASSO 3: Função para pegar contagem
-- =====================================================
CREATE OR REPLACE FUNCTION get_post_comment_count(post_uuid UUID)
RETURNS TABLE(approved_count BIGINT, total_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(cc.approved_count, 0),
        COALESCE(cc.total_count, 0)
    FROM comment_counts cc
    WHERE cc.post_id = post_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permitir execução pública
GRANT EXECUTE ON FUNCTION get_post_comment_count TO anon;
GRANT EXECUTE ON FUNCTION get_post_comment_count TO authenticated;

-- TESTE: Ver se funciona
SELECT * FROM get_post_comment_count((SELECT id FROM blog_posts LIMIT 1));

-- =====================================================
-- GERENCIAR COMENTÁRIOS
-- =====================================================

-- 1. VER TODOS OS COMENTÁRIOS PENDENTES COM DETALHES
-- =====================================================
SELECT 
    c.id,
    c.content,
    c.created_at,
    p.name as author_name,
    p.email as author_email,
    bp.title as post_title
FROM comments c
LEFT JOIN profiles p ON c.user_id = p.id
LEFT JOIN blog_posts bp ON c.post_id = bp.id
WHERE c.approved = false
ORDER BY c.created_at DESC;

-- 2. APROVAR UM COMENTÁRIO ESPECÍFICO
-- =====================================================
-- Substitua 'ID_AQUI' pelo ID do comentário que deseja aprovar
-- Por exemplo: UPDATE comments SET approved = true WHERE id = '123e4567-e89b-12d3-a456-426614174000';

-- UPDATE comments SET approved = true WHERE id = 'ID_AQUI';

-- 3. APROVAR TODOS OS COMENTÁRIOS DE UM USUÁRIO
-- =====================================================
-- UPDATE comments 
-- SET approved = true 
-- WHERE user_id = (SELECT id FROM profiles WHERE email = 'email@exemplo.com');

-- 4. APROVAR TODOS OS COMENTÁRIOS PENDENTES (USE COM CUIDADO!)
-- =====================================================
-- UPDATE comments SET approved = true WHERE approved = false;

-- 5. VER COMENTÁRIOS APROVADOS
-- =====================================================
SELECT 
    c.id,
    c.content,
    c.created_at,
    p.name as author_name,
    bp.title as post_title
FROM comments c
LEFT JOIN profiles p ON c.user_id = p.id
LEFT JOIN blog_posts bp ON c.post_id = bp.id
WHERE c.approved = true
ORDER BY c.created_at DESC
LIMIT 10;

-- 6. DELETAR UM COMENTÁRIO
-- =====================================================
-- DELETE FROM comments WHERE id = 'ID_AQUI';

-- 7. ESTATÍSTICAS DE COMENTÁRIOS
-- =====================================================
SELECT 
    COUNT(*) FILTER (WHERE approved = true) as aprovados,
    COUNT(*) FILTER (WHERE approved = false) as pendentes,
    COUNT(*) as total
FROM comments;

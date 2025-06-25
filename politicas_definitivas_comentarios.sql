-- ========================================
-- POLÍTICAS DEFINITIVAS - SISTEMA DE COMENTÁRIOS
-- ========================================
-- Execute este SQL no Supabase para configurar as políticas corretas

-- 1. Remover política temporária
DROP POLICY IF EXISTS "permitir_tudo_temporario" ON blog_comments;

-- 2. Criar políticas específicas e seguras

-- POLÍTICA 1: Qualquer pessoa pode INSERIR comentários
CREATE POLICY "permite_criar_comentarios" 
ON blog_comments FOR INSERT 
TO public
WITH CHECK (
    -- Deve ter conteúdo
    content IS NOT NULL AND 
    length(content) > 0 AND
    -- Deve ter post_slug
    post_slug IS NOT NULL AND
    -- Se anônimo, deve ter nome e email
    (
        (user_id IS NOT NULL) OR 
        (author_name IS NOT NULL AND author_email IS NOT NULL)
    )
);

-- POLÍTICA 2: Ver comentários aprovados ou próprios
CREATE POLICY "permite_ver_comentarios" 
ON blog_comments FOR SELECT 
USING (
    status = 'approved' OR 
    auth.uid() = user_id OR
    (auth.uid() IS NOT NULL AND auth.uid() IN (
        SELECT id FROM auth.users WHERE email = 'johnnyhelder@gmail.com'
    ))
);

-- POLÍTICA 3: Editar apenas próprios comentários
CREATE POLICY "permite_editar_proprios" 
ON blog_comments FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- POLÍTICA 4: Deletar apenas próprios comentários
CREATE POLICY "permite_deletar_proprios" 
ON blog_comments FOR DELETE 
USING (auth.uid() = user_id);

-- 3. Políticas para reactions
DROP POLICY IF EXISTS "Reações são públicas" ON blog_comment_reactions;
DROP POLICY IF EXISTS "Qualquer um pode reagir" ON blog_comment_reactions;

CREATE POLICY "permite_ver_reacoes" 
ON blog_comment_reactions FOR SELECT 
USING (true);

CREATE POLICY "permite_criar_reacoes" 
ON blog_comment_reactions FOR INSERT 
TO public
WITH CHECK (comment_id IS NOT NULL);

CREATE POLICY "permite_atualizar_proprias_reacoes" 
ON blog_comment_reactions FOR UPDATE 
USING (auth.uid() = user_id OR (user_id IS NULL AND ip_address IS NOT NULL));

CREATE POLICY "permite_deletar_proprias_reacoes" 
ON blog_comment_reactions FOR DELETE 
USING (auth.uid() = user_id OR (user_id IS NULL AND ip_address IS NOT NULL));

-- 4. Políticas para reports
DROP POLICY IF EXISTS "Qualquer um pode reportar" ON blog_comment_reports;

CREATE POLICY "permite_criar_reports" 
ON blog_comment_reports FOR INSERT 
TO public
WITH CHECK (comment_id IS NOT NULL AND reason IS NOT NULL);

CREATE POLICY "permite_ver_proprios_reports" 
ON blog_comment_reports FOR SELECT 
USING (
    auth.uid() = reporter_id OR
    auth.uid() IN (
        SELECT id FROM auth.users WHERE email = 'johnnyhelder@gmail.com'
    )
);

-- 5. Verificar políticas criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename IN ('blog_comments', 'blog_comment_reactions', 'blog_comment_reports')
ORDER BY tablename, policyname;

-- 6. Mensagem de sucesso
SELECT 'Políticas configuradas com sucesso! O sistema está seguro e funcional.' as resultado;
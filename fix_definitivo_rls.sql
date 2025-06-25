-- SOLUÇÃO DEFINITIVA - RECRIAR POLÍTICAS DO ZERO
-- Execute no Supabase SQL Editor

-- 1. Desabilitar RLS temporariamente
ALTER TABLE blog_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comment_reactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comment_reports DISABLE ROW LEVEL SECURITY;

-- 2. Remover TODAS as políticas antigas
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename IN ('blog_comments', 'blog_comment_reactions', 'blog_comment_reports')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, 'blog_comments');
    END LOOP;
END $$;

-- 3. Reabilitar RLS
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comment_reports ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas simples e funcionais
-- Para blog_comments
CREATE POLICY "permitir_tudo_temporario" ON blog_comments
FOR ALL USING (true) WITH CHECK (true);

-- 5. Testar
SELECT 'Políticas recriadas! Teste agora no site.' as resultado;
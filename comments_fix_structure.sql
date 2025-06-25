-- ========================================
-- SISTEMA DE COMENTÁRIOS - DIAGNÓSTICO E CORREÇÃO
-- ========================================
-- Execute cada parte separadamente
-- ========================================

-- PARTE 1: Verificar estrutura atual da tabela comments
-- ========================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'comments'
ORDER BY ordinal_position;

-- PARTE 2: Adicionar colunas que estão faltando
-- ========================================
-- Se a coluna 'status' não existir:
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' 
CHECK (status IN ('pending', 'approved', 'rejected', 'spam'));

-- Se outras colunas também estiverem faltando, adicione:
ALTER TABLE comments ADD COLUMN IF NOT EXISTS post_slug VARCHAR(255) NOT NULL DEFAULT 'temp';
ALTER TABLE comments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS author_name VARCHAR(100);
ALTER TABLE comments ADD COLUMN IF NOT EXISTS author_email VARCHAR(255);
ALTER TABLE comments ADD COLUMN IF NOT EXISTS content TEXT NOT NULL DEFAULT 'temp';
ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id UUID;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS likes_count INT DEFAULT 0;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS dislikes_count INT DEFAULT 0;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS ip_address INET;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE comments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE comments ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- PARTE 3: Adicionar constraint de parent_id se não existir
-- ========================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'comments_parent_id_fkey' 
        AND table_name = 'comments'
    ) THEN
        ALTER TABLE comments 
        ADD CONSTRAINT comments_parent_id_fkey 
        FOREIGN KEY (parent_id) 
        REFERENCES comments(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- PARTE 4: Adicionar constraint de validação do autor
-- ========================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'valid_author' 
        AND table_name = 'comments'
    ) THEN
        ALTER TABLE comments
        ADD CONSTRAINT valid_author CHECK (
            (user_id IS NOT NULL) OR 
            (author_name IS NOT NULL AND author_email IS NOT NULL)
        );
    END IF;
END $$;

-- PARTE 5: Criar índices que faltam
-- ========================================
CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_published_at ON comments(published_at DESC);

-- PARTE 6: Verificar estrutura atualizada
-- ========================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'comments'
ORDER BY ordinal_position;

-- ========================================
-- Após corrigir a tabela comments, execute o script completo:
-- comments_complete_fix.sql
-- ========================================
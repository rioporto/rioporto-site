-- ========================================
-- SISTEMA DE COMENTÁRIOS - EXECUÇÃO POR PARTES
-- ========================================
-- Execute cada parte separadamente para identificar onde está o erro

-- PARTE 1: Verificar tabelas existentes
-- ========================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'comment%'
ORDER BY table_name;

-- Se existirem tabelas antigas, execute:
-- DROP TABLE IF EXISTS comment_reports CASCADE;
-- DROP TABLE IF EXISTS comment_reactions CASCADE;
-- DROP TABLE IF EXISTS comments CASCADE;

-- PARTE 2: Criar apenas a tabela comments primeiro
-- ========================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_slug VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name VARCHAR(100),
  author_email VARCHAR(255),
  content TEXT NOT NULL,
  parent_id UUID,
  status VARCHAR(20) DEFAULT 'pending',
  likes_count INT DEFAULT 0,
  dislikes_count INT DEFAULT 0,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- PARTE 3: Verificar se a tabela foi criada
-- ========================================
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'comments' 
ORDER BY ordinal_position;

-- PARTE 4: Se a tabela foi criada com sucesso, adicionar constraints
-- ========================================
-- Foreign key para parent_id
ALTER TABLE comments 
ADD CONSTRAINT comments_parent_id_fkey 
FOREIGN KEY (parent_id) 
REFERENCES comments(id) 
ON DELETE CASCADE;

-- Check constraints
ALTER TABLE comments 
ADD CONSTRAINT comments_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'spam'));

ALTER TABLE comments
ADD CONSTRAINT valid_author CHECK (
  (user_id IS NOT NULL) OR 
  (author_name IS NOT NULL AND author_email IS NOT NULL)
);

-- PARTE 5: Criar índices
-- ========================================
CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_published_at ON comments(published_at DESC);

-- Se tudo funcionou até aqui, continue com as outras tabelas...
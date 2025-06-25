-- ========================================
-- SISTEMA DE COMENTÁRIOS - RECRIAÇÃO COMPLETA
-- ========================================
-- ATENÇÃO: Este script REMOVE tudo e recria do zero!
-- ========================================

-- PARTE 1: Remover TUDO relacionado a comentários
-- ========================================

-- Remover views
DROP VIEW IF EXISTS comments_with_author CASCADE;
DROP VIEW IF EXISTS post_comment_stats CASCADE;

-- Remover triggers
DROP TRIGGER IF EXISTS update_reaction_counts ON comment_reactions;
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;

-- Remover funções
DROP FUNCTION IF EXISTS update_comment_reaction_counts() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Remover tabelas (ordem importante!)
DROP TABLE IF EXISTS comment_reports CASCADE;
DROP TABLE IF EXISTS comment_reactions CASCADE;
DROP TABLE IF EXISTS banned_ips CASCADE;
DROP TABLE IF EXISTS blocked_words CASCADE;
DROP TABLE IF EXISTS comments CASCADE;

-- PARTE 2: Criar tudo do zero
-- ========================================

-- 1. Tabela de comentários
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_slug VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name VARCHAR(100),
  author_email VARCHAR(255),
  content TEXT NOT NULL,
  parent_id UUID,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  likes_count INT DEFAULT 0,
  dislikes_count INT DEFAULT 0,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  
  CONSTRAINT valid_author CHECK (
    (user_id IS NOT NULL) OR 
    (author_name IS NOT NULL AND author_email IS NOT NULL)
  )
);

-- Adicionar foreign key para parent_id
ALTER TABLE comments 
ADD CONSTRAINT comments_parent_id_fkey 
FOREIGN KEY (parent_id) 
REFERENCES comments(id) 
ON DELETE CASCADE;

-- Criar índices
CREATE INDEX idx_comments_post_slug ON comments(post_slug);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_published_at ON comments(published_at DESC);

-- 2. Tabela de reações
CREATE TABLE comment_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET,
  reaction_type VARCHAR(10) NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_user_reaction UNIQUE(comment_id, user_id),
  CONSTRAINT unique_ip_reaction UNIQUE(comment_id, ip_address),
  CONSTRAINT valid_reactor CHECK (
    (user_id IS NOT NULL) OR (ip_address IS NOT NULL)
  )
);

CREATE INDEX idx_reactions_comment_id ON comment_reactions(comment_id);
CREATE INDEX idx_reactions_user_id ON comment_reactions(user_id);

-- 3. Tabela de reports
CREATE TABLE comment_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_ip INET,
  reason VARCHAR(50) NOT NULL CHECK (reason IN ('spam', 'offensive', 'harassment', 'misinformation', 'other')),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_comment_id ON comment_reports(comment_id);
CREATE INDEX idx_reports_status ON comment_reports(status);

-- 4. Tabela de palavras bloqueadas
CREATE TABLE blocked_words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word VARCHAR(100) NOT NULL UNIQUE,
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela de IPs banidos
CREATE TABLE banned_ips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL UNIQUE,
  reason TEXT,
  banned_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PARTE 3: Criar funções
-- ========================================

-- Função para atualizar contadores de likes/dislikes
CREATE OR REPLACE FUNCTION update_comment_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.reaction_type = 'like' THEN
      UPDATE comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
    ELSE
      UPDATE comments SET dislikes_count = dislikes_count + 1 WHERE id = NEW.comment_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.reaction_type = 'like' THEN
      UPDATE comments SET likes_count = likes_count - 1 WHERE id = OLD.comment_id;
    ELSE
      UPDATE comments SET dislikes_count = dislikes_count - 1 WHERE id = OLD.comment_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.reaction_type != NEW.reaction_type THEN
      IF OLD.reaction_type = 'like' THEN
        UPDATE comments SET 
          likes_count = likes_count - 1,
          dislikes_count = dislikes_count + 1 
        WHERE id = NEW.comment_id;
      ELSE
        UPDATE comments SET 
          likes_count = likes_count + 1,
          dislikes_count = dislikes_count - 1 
        WHERE id = NEW.comment_id;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PARTE 4: Criar triggers
-- ========================================

CREATE TRIGGER update_reaction_counts
AFTER INSERT OR DELETE OR UPDATE OF reaction_type ON comment_reactions
FOR EACH ROW
EXECUTE FUNCTION update_comment_reaction_counts();

CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- PARTE 5: Habilitar RLS
-- ========================================

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_ips ENABLE ROW LEVEL SECURITY;

-- PARTE 6: Criar políticas RLS
-- ========================================

-- Políticas para comments
CREATE POLICY "Comentários aprovados são públicos" ON comments
FOR SELECT USING (status = 'approved');

CREATE POLICY "Usuários veem próprios comentários" ON comments
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Qualquer um pode comentar" ON comments
FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários editam próprios comentários" ON comments
FOR UPDATE USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários deletam próprios comentários" ON comments
FOR DELETE USING (auth.uid() = user_id);

-- Políticas para reactions
CREATE POLICY "Reações são públicas" ON comment_reactions
FOR SELECT USING (true);

CREATE POLICY "Qualquer um pode reagir" ON comment_reactions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários atualizam próprias reações" ON comment_reactions
FOR UPDATE USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários deletam próprias reações" ON comment_reactions
FOR DELETE USING (auth.uid() = user_id);

-- Políticas para reports
CREATE POLICY "Qualquer um pode reportar" ON comment_reports
FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários veem próprios reports" ON comment_reports
FOR SELECT USING (auth.uid() = reporter_id);

-- PARTE 7: Inserir dados iniciais
-- ========================================

INSERT INTO blocked_words (word, severity) VALUES
  ('spam', 'high'),
  ('viagra', 'high'),
  ('casino', 'high'),
  ('xxx', 'high'),
  ('porn', 'high')
ON CONFLICT (word) DO NOTHING;

-- PARTE 8: Criar views
-- ========================================

CREATE VIEW comments_with_author AS
SELECT 
  c.*,
  COALESCE(u.email, c.author_email) as display_email,
  COALESCE(
    u.raw_user_meta_data->>'name',
    u.email,
    c.author_name
  ) as display_name,
  u.raw_user_meta_data->>'avatar_url' as avatar_url,
  (SELECT COUNT(*) FROM comments WHERE parent_id = c.id) as replies_count
FROM comments c
LEFT JOIN auth.users u ON c.user_id = u.id;

CREATE VIEW post_comment_stats AS
SELECT 
  post_slug,
  COUNT(*) as total_comments,
  COUNT(DISTINCT COALESCE(user_id::text, ip_address::text)) as unique_commenters,
  AVG(likes_count) as avg_likes,
  MAX(created_at) as last_comment_at
FROM comments
WHERE status = 'approved'
GROUP BY post_slug;

-- PARTE 9: Permissões
-- ========================================

GRANT SELECT ON comments_with_author TO anon, authenticated;
GRANT SELECT ON post_comment_stats TO anon, authenticated;

-- PARTE 10: Verificação final
-- ========================================

SELECT '✅ Tabelas criadas:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('comments', 'comment_reactions', 'comment_reports', 'blocked_words', 'banned_ips')
ORDER BY table_name;

SELECT '✅ Views criadas:' as status;
SELECT table_name FROM information_schema.views
WHERE table_schema = 'public' 
AND table_name IN ('comments_with_author', 'post_comment_stats')
ORDER BY table_name;

SELECT '✅ Sistema de comentários instalado com sucesso!' as status;
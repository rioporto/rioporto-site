-- ========================================
-- SISTEMA DE COMENTÁRIOS DO BLOG - INSTALAÇÃO COMPLETA
-- ========================================
-- Usa blog_comments para evitar conflito com tabela existente
-- Execute este script no Supabase SQL Editor
-- ========================================

-- PARTE 1: Criar tabela principal
-- ========================================
CREATE TABLE blog_comments (
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
ALTER TABLE blog_comments 
ADD CONSTRAINT blog_comments_parent_id_fkey 
FOREIGN KEY (parent_id) 
REFERENCES blog_comments(id) 
ON DELETE CASCADE;

-- Criar índices
CREATE INDEX idx_blog_comments_post_slug ON blog_comments(post_slug);
CREATE INDEX idx_blog_comments_status ON blog_comments(status);
CREATE INDEX idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX idx_blog_comments_user_id ON blog_comments(user_id);
CREATE INDEX idx_blog_comments_published_at ON blog_comments(published_at DESC);

-- PARTE 2: Tabela de reações
-- ========================================
CREATE TABLE blog_comment_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES blog_comments(id) ON DELETE CASCADE,
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

CREATE INDEX idx_blog_reactions_comment_id ON blog_comment_reactions(comment_id);
CREATE INDEX idx_blog_reactions_user_id ON blog_comment_reactions(user_id);

-- PARTE 3: Tabela de reports
-- ========================================
CREATE TABLE blog_comment_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES blog_comments(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_ip INET,
  reason VARCHAR(50) NOT NULL CHECK (reason IN ('spam', 'offensive', 'harassment', 'misinformation', 'other')),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blog_reports_comment_id ON blog_comment_reports(comment_id);
CREATE INDEX idx_blog_reports_status ON blog_comment_reports(status);

-- PARTE 4: Tabela de palavras bloqueadas
-- ========================================
CREATE TABLE blog_blocked_words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word VARCHAR(100) NOT NULL UNIQUE,
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PARTE 5: Tabela de IPs banidos
-- ========================================
CREATE TABLE blog_banned_ips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL UNIQUE,
  reason TEXT,
  banned_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PARTE 6: Funções auxiliares
-- ========================================

-- Função para atualizar contadores de likes/dislikes
CREATE OR REPLACE FUNCTION update_blog_comment_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.reaction_type = 'like' THEN
      UPDATE blog_comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
    ELSE
      UPDATE blog_comments SET dislikes_count = dislikes_count + 1 WHERE id = NEW.comment_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.reaction_type = 'like' THEN
      UPDATE blog_comments SET likes_count = likes_count - 1 WHERE id = OLD.comment_id;
    ELSE
      UPDATE blog_comments SET dislikes_count = dislikes_count - 1 WHERE id = OLD.comment_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.reaction_type != NEW.reaction_type THEN
      IF OLD.reaction_type = 'like' THEN
        UPDATE blog_comments SET 
          likes_count = likes_count - 1,
          dislikes_count = dislikes_count + 1 
        WHERE id = NEW.comment_id;
      ELSE
        UPDATE blog_comments SET 
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
CREATE OR REPLACE FUNCTION update_blog_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PARTE 7: Criar triggers
-- ========================================
CREATE TRIGGER update_blog_reaction_counts
AFTER INSERT OR DELETE OR UPDATE OF reaction_type ON blog_comment_reactions
FOR EACH ROW
EXECUTE FUNCTION update_blog_comment_reaction_counts();

CREATE TRIGGER update_blog_comments_updated_at
BEFORE UPDATE ON blog_comments
FOR EACH ROW
EXECUTE FUNCTION update_blog_updated_at_column();

-- PARTE 8: Habilitar RLS
-- ========================================
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_blocked_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_banned_ips ENABLE ROW LEVEL SECURITY;

-- PARTE 9: Criar políticas RLS
-- ========================================

-- Políticas para blog_comments
CREATE POLICY "Comentários aprovados são públicos" ON blog_comments
FOR SELECT USING (status = 'approved');

CREATE POLICY "Usuários veem próprios comentários" ON blog_comments
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Qualquer um pode comentar" ON blog_comments
FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários editam próprios comentários" ON blog_comments
FOR UPDATE USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários deletam próprios comentários" ON blog_comments
FOR DELETE USING (auth.uid() = user_id);

-- Políticas para blog_comment_reactions
CREATE POLICY "Reações são públicas" ON blog_comment_reactions
FOR SELECT USING (true);

CREATE POLICY "Qualquer um pode reagir" ON blog_comment_reactions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários atualizam próprias reações" ON blog_comment_reactions
FOR UPDATE USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários deletam próprias reações" ON blog_comment_reactions
FOR DELETE USING (auth.uid() = user_id);

-- Políticas para blog_comment_reports
CREATE POLICY "Qualquer um pode reportar" ON blog_comment_reports
FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários veem próprios reports" ON blog_comment_reports
FOR SELECT USING (auth.uid() = reporter_id);

-- PARTE 10: Inserir dados iniciais
-- ========================================
INSERT INTO blog_blocked_words (word, severity) VALUES
  ('spam', 'high'),
  ('viagra', 'high'),
  ('casino', 'high'),
  ('xxx', 'high'),
  ('porn', 'high')
ON CONFLICT (word) DO NOTHING;

-- PARTE 11: Criar views
-- ========================================
CREATE VIEW blog_comments_with_author AS
SELECT 
  c.*,
  COALESCE(u.email, c.author_email) as display_email,
  COALESCE(
    u.raw_user_meta_data->>'name',
    u.email,
    c.author_name
  ) as display_name,
  u.raw_user_meta_data->>'avatar_url' as avatar_url,
  (SELECT COUNT(*) FROM blog_comments WHERE parent_id = c.id) as replies_count
FROM blog_comments c
LEFT JOIN auth.users u ON c.user_id = u.id;

CREATE VIEW blog_post_comment_stats AS
SELECT 
  post_slug,
  COUNT(*) as total_comments,
  COUNT(DISTINCT COALESCE(user_id::text, ip_address::text)) as unique_commenters,
  AVG(likes_count) as avg_likes,
  MAX(created_at) as last_comment_at
FROM blog_comments
WHERE status = 'approved'
GROUP BY post_slug;

-- PARTE 12: Permissões
-- ========================================
GRANT SELECT ON blog_comments_with_author TO anon, authenticated;
GRANT SELECT ON blog_post_comment_stats TO anon, authenticated;

-- PARTE 13: Verificação final
-- ========================================
SELECT '✅ Sistema de comentários do blog instalado!' as status;

SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'blog_%'
ORDER BY table_name;
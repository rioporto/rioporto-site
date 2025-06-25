-- ========================================
-- SISTEMA DE COMENTÁRIOS - SCRIPT CORRIGIDO
-- ========================================
-- Este script considera que a tabela comments já existe
-- e cria apenas o que está faltando
-- ========================================

-- PARTE 1: Criar as tabelas que faltam (sem triggers ainda)
-- ========================================

-- 2. TABELA DE REAÇÕES (LIKES/DISLIKES)
CREATE TABLE IF NOT EXISTS comment_reactions (
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

-- 3. TABELA DE DENÚNCIAS/REPORTS
CREATE TABLE IF NOT EXISTS comment_reports (
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

-- 4. TABELA DE PALAVRAS BLOQUEADAS
CREATE TABLE IF NOT EXISTS blocked_words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word VARCHAR(100) NOT NULL UNIQUE,
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE IPS BANIDOS
CREATE TABLE IF NOT EXISTS banned_ips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL UNIQUE,
  reason TEXT,
  banned_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PARTE 2: Criar índices
-- ========================================
CREATE INDEX IF NOT EXISTS idx_reactions_comment_id ON comment_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON comment_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_comment_id ON comment_reports(comment_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON comment_reports(status);

-- PARTE 3: Criar funções (depois das tabelas)
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

-- PARTE 4: Criar triggers (depois das funções)
-- ========================================

-- Remover triggers antigos se existirem
DROP TRIGGER IF EXISTS update_reaction_counts ON comment_reactions;
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;

-- Criar triggers
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

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Comentários aprovados são públicos" ON comments;
DROP POLICY IF EXISTS "Usuários veem próprios comentários" ON comments;
DROP POLICY IF EXISTS "Qualquer um pode comentar" ON comments;
DROP POLICY IF EXISTS "Usuários editam próprios comentários" ON comments;
DROP POLICY IF EXISTS "Usuários deletam próprios comentários" ON comments;

-- Políticas para COMMENTS
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

-- Políticas para REACTIONS
CREATE POLICY "Reações são públicas" ON comment_reactions
FOR SELECT USING (true);

CREATE POLICY "Qualquer um pode reagir" ON comment_reactions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários atualizam próprias reações" ON comment_reactions
FOR UPDATE USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários deletam próprias reações" ON comment_reactions
FOR DELETE USING (auth.uid() = user_id);

-- Políticas para REPORTS
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

-- Remover views antigas se existirem
DROP VIEW IF EXISTS comments_with_author CASCADE;
DROP VIEW IF EXISTS post_comment_stats CASCADE;

-- View para comentários com informações do autor
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

-- View para estatísticas por post
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
SELECT 'Tabelas criadas:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('comments', 'comment_reactions', 'comment_reports', 'blocked_words', 'banned_ips')
ORDER BY table_name;

SELECT 'Views criadas:' as info;
SELECT table_name FROM information_schema.views
WHERE table_schema = 'public' 
AND table_name IN ('comments_with_author', 'post_comment_stats')
ORDER BY table_name;
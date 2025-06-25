-- ========================================
-- SISTEMA DE COMENTÁRIOS - RIO PORTO P2P
-- ========================================
-- Última atualização: 25/06/2025
-- 
-- Este script cria todas as tabelas necessárias
-- para o sistema completo de comentários
-- ========================================

-- 1. TABELA DE COMENTÁRIOS
-- ========================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_slug VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name VARCHAR(100),
  author_email VARCHAR(255),
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  likes_count INT DEFAULT 0,
  dislikes_count INT DEFAULT 0,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  
  -- Índices para performance
  CONSTRAINT valid_author CHECK (
    (user_id IS NOT NULL) OR 
    (author_name IS NOT NULL AND author_email IS NOT NULL)
  )
);

-- Índices para otimização
CREATE INDEX idx_comments_post_slug ON comments(post_slug);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_published_at ON comments(published_at DESC);

-- 2. TABELA DE REAÇÕES (LIKES/DISLIKES)
-- ========================================
CREATE TABLE IF NOT EXISTS comment_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET,
  reaction_type VARCHAR(10) NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Garantir apenas uma reação por usuário/IP por comentário
  CONSTRAINT unique_user_reaction UNIQUE(comment_id, user_id),
  CONSTRAINT unique_ip_reaction UNIQUE(comment_id, ip_address),
  CONSTRAINT valid_reactor CHECK (
    (user_id IS NOT NULL) OR (ip_address IS NOT NULL)
  )
);

-- Índices
CREATE INDEX idx_reactions_comment_id ON comment_reactions(comment_id);
CREATE INDEX idx_reactions_user_id ON comment_reactions(user_id);

-- 3. TABELA DE DENÚNCIAS/REPORTS
-- ========================================
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

-- Índices
CREATE INDEX idx_reports_comment_id ON comment_reports(comment_id);
CREATE INDEX idx_reports_status ON comment_reports(status);

-- 4. TABELA DE PALAVRAS BLOQUEADAS (FILTRO DE SPAM)
-- ========================================
CREATE TABLE IF NOT EXISTS blocked_words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word VARCHAR(100) NOT NULL UNIQUE,
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE IPS BANIDOS
-- ========================================
CREATE TABLE IF NOT EXISTS banned_ips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL UNIQUE,
  reason TEXT,
  banned_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- FUNÇÕES AUXILIARES
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
    -- Se mudou o tipo de reação
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

-- Trigger para atualizar contadores
CREATE TRIGGER update_reaction_counts
AFTER INSERT OR DELETE OR UPDATE OF reaction_type ON comment_reactions
FOR EACH ROW
EXECUTE FUNCTION update_comment_reaction_counts();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Habilitar RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_ips ENABLE ROW LEVEL SECURITY;

-- Políticas para COMMENTS
-- ========================================

-- Visualizar: todos podem ver comentários aprovados
CREATE POLICY "Comentários aprovados são públicos" ON comments
FOR SELECT USING (status = 'approved');

-- Visualizar próprios comentários (mesmo pendentes)
CREATE POLICY "Usuários veem próprios comentários" ON comments
FOR SELECT USING (auth.uid() = user_id);

-- Criar: qualquer um pode criar (autenticado ou anônimo)
CREATE POLICY "Qualquer um pode comentar" ON comments
FOR INSERT WITH CHECK (true);

-- Atualizar: apenas próprios comentários
CREATE POLICY "Usuários editam próprios comentários" ON comments
FOR UPDATE USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Deletar: apenas próprios comentários
CREATE POLICY "Usuários deletam próprios comentários" ON comments
FOR DELETE USING (auth.uid() = user_id);

-- Políticas para REACTIONS
-- ========================================

-- Visualizar todas as reações
CREATE POLICY "Reações são públicas" ON comment_reactions
FOR SELECT USING (true);

-- Criar reação
CREATE POLICY "Qualquer um pode reagir" ON comment_reactions
FOR INSERT WITH CHECK (true);

-- Atualizar própria reação
CREATE POLICY "Usuários atualizam próprias reações" ON comment_reactions
FOR UPDATE USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Deletar própria reação
CREATE POLICY "Usuários deletam próprias reações" ON comment_reactions
FOR DELETE USING (auth.uid() = user_id);

-- Políticas para REPORTS
-- ========================================

-- Criar report
CREATE POLICY "Qualquer um pode reportar" ON comment_reports
FOR INSERT WITH CHECK (true);

-- Visualizar próprios reports
CREATE POLICY "Usuários veem próprios reports" ON comment_reports
FOR SELECT USING (auth.uid() = reporter_id);

-- ========================================
-- DADOS INICIAIS - PALAVRAS BLOQUEADAS
-- ========================================

-- Inserir algumas palavras básicas para filtro
INSERT INTO blocked_words (word, severity) VALUES
  ('spam', 'high'),
  ('viagra', 'high'),
  ('casino', 'high'),
  ('xxx', 'high'),
  ('porn', 'high')
ON CONFLICT (word) DO NOTHING;

-- ========================================
-- VIEWS ÚTEIS
-- ========================================

-- View para comentários com informações do autor
CREATE OR REPLACE VIEW comments_with_author AS
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
CREATE OR REPLACE VIEW post_comment_stats AS
SELECT 
  post_slug,
  COUNT(*) as total_comments,
  COUNT(DISTINCT COALESCE(user_id::text, ip_address::text)) as unique_commenters,
  AVG(likes_count) as avg_likes,
  MAX(created_at) as last_comment_at
FROM comments
WHERE status = 'approved'
GROUP BY post_slug;

-- ========================================
-- GRANT PERMISSIONS
-- ========================================

-- Permitir que o anon e authenticated usem as views
GRANT SELECT ON comments_with_author TO anon, authenticated;
GRANT SELECT ON post_comment_stats TO anon, authenticated;

-- ========================================
-- FIM DO SCRIPT
-- ========================================
-- Para executar:
-- 1. Acesse o Supabase SQL Editor
-- 2. Cole este script completo
-- 3. Execute
-- ========================================
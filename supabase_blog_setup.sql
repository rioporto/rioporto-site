-- =====================================================
-- SETUP DO BLOG - RIO PORTO P2P
-- =====================================================

-- 1. TABELA DE AUTORES
-- =====================================================
CREATE TABLE IF NOT EXISTS authors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    role TEXT,
    email TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. TABELA DE CATEGORIAS
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. TABELA DE TAGS
-- =====================================================
CREATE TABLE IF NOT EXISTS tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. TABELA DE POSTS
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    read_time INTEGER, -- em minutos
    views INTEGER DEFAULT 0,
    meta_description TEXT,
    meta_keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. TABELA DE RELACIONAMENTO POSTS-TAGS
-- =====================================================
CREATE TABLE IF NOT EXISTS post_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(post_id, tag_id)
);

-- 6. TABELA DE POSTS RELACIONADOS
-- =====================================================
CREATE TABLE IF NOT EXISTS related_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    related_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(post_id, related_post_id),
    CHECK (post_id != related_post_id)
);

-- 7. TABELA DE COMENTÁRIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 8. TABELA DE NEWSLETTER
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    subscribed BOOLEAN DEFAULT true,
    verified BOOLEAN DEFAULT false,
    verification_token TEXT,
    categories TEXT[], -- categorias de interesse
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 9. TABELA DE ANALYTICS DE POSTS
-- =====================================================
CREATE TABLE IF NOT EXISTS post_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    time_spent INTEGER, -- em segundos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published, published_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;
CREATE INDEX idx_post_tags_post ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag ON post_tags(tag_id);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_approved ON comments(approved) WHERE approved = true;
CREATE INDEX idx_analytics_post ON post_analytics(post_id);
CREATE INDEX idx_analytics_created ON post_analytics(created_at DESC);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON authors
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_newsletter_updated_at BEFORE UPDATE ON newsletter_subscribers
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- =====================================================
-- FUNÇÃO PARA CALCULAR TEMPO DE LEITURA
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_read_time(content TEXT)
RETURNS INTEGER AS $$
DECLARE
    word_count INTEGER;
    words_per_minute INTEGER := 200;
BEGIN
    word_count := array_length(string_to_array(content, ' '), 1);
    RETURN CEIL(word_count::FLOAT / words_per_minute);
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular automaticamente o tempo de leitura
CREATE OR REPLACE FUNCTION update_read_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.read_time := calculate_read_time(NEW.content);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_read_time_trigger
BEFORE INSERT OR UPDATE OF content ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_read_time();

-- =====================================================
-- FUNÇÃO PARA INCREMENTAR VIEWS
-- =====================================================
CREATE OR REPLACE FUNCTION increment_post_views(post_id_param UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE blog_posts 
    SET views = views + 1 
    WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para posts publicados com informações completas
CREATE OR REPLACE VIEW published_posts AS
SELECT 
    p.*,
    a.name as author_name,
    a.slug as author_slug,
    a.avatar_url as author_avatar,
    c.name as category_name,
    c.slug as category_slug,
    COALESCE(
        ARRAY_AGG(
            DISTINCT jsonb_build_object(
                'id', t.id,
                'name', t.name,
                'slug', t.slug
            )
        ) FILTER (WHERE t.id IS NOT NULL), 
        ARRAY[]::jsonb[]
    ) as tags
FROM blog_posts p
LEFT JOIN authors a ON p.author_id = a.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.published = true
GROUP BY p.id, a.name, a.slug, a.avatar_url, c.name, c.slug;

-- View para estatísticas de categorias
CREATE OR REPLACE VIEW category_stats AS
SELECT 
    c.*,
    COUNT(DISTINCT p.id) as post_count,
    COUNT(DISTINCT p.id) FILTER (WHERE p.published = true) as published_count
FROM categories c
LEFT JOIN blog_posts p ON c.id = p.category_id
GROUP BY c.id;

-- =====================================================
-- RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE related_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública para conteúdo publicado
CREATE POLICY "Posts publicados são visíveis para todos" ON blog_posts
    FOR SELECT USING (published = true);

CREATE POLICY "Autores são visíveis para todos" ON authors
    FOR SELECT USING (true);

CREATE POLICY "Categorias são visíveis para todos" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Tags são visíveis para todos" ON tags
    FOR SELECT USING (true);

CREATE POLICY "Tags de posts publicados são visíveis" ON post_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM blog_posts 
            WHERE blog_posts.id = post_tags.post_id 
            AND blog_posts.published = true
        )
    );

CREATE POLICY "Posts relacionados publicados são visíveis" ON related_posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM blog_posts 
            WHERE blog_posts.id = related_posts.post_id 
            AND blog_posts.published = true
        )
    );

CREATE POLICY "Comentários aprovados são visíveis" ON comments
    FOR SELECT USING (approved = true);

-- Políticas para usuários autenticados
CREATE POLICY "Usuários podem criar comentários" ON comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem editar próprios comentários" ON comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar próprios comentários" ON comments
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para newsletter (apenas insert público)
CREATE POLICY "Qualquer um pode se inscrever na newsletter" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Políticas para analytics (apenas insert)
CREATE POLICY "Analytics podem ser inseridos" ON post_analytics
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Inserir categorias
INSERT INTO categories (name, slug, description, icon) VALUES
    ('Bitcoin', 'bitcoin', 'Artigos sobre Bitcoin, a primeira e maior criptomoeda', 'Bitcoin'),
    ('Stablecoins', 'stablecoins', 'Conteúdo sobre moedas estáveis como USDT e USDC', 'DollarSign'),
    ('Estratégias', 'estrategias', 'Estratégias de investimento e trading em criptomoedas', 'TrendingUp')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- COMENTÁRIOS E OBSERVAÇÕES
-- =====================================================
-- 1. As tabelas foram criadas com campos essenciais para um blog profissional
-- 2. RLS está configurado para permitir leitura pública de conteúdo publicado
-- 3. Sistema de analytics básico para rastrear visualizações
-- 4. Suporte para comentários com moderação
-- 5. Newsletter com verificação de email
-- 6. Tags e categorias para melhor organização
-- 7. Posts relacionados para aumentar engajamento
-- 8. Triggers automáticos para updated_at e read_time

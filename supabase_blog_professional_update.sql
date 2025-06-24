-- =====================================================
-- ATUALIZAÇÃO DE NOMENCLATURAS PROFISSIONAIS
-- =====================================================
-- Execute este script APÓS ter o blog funcionando

-- 1. ATUALIZAR CATEGORIAS PARA NOMES MAIS PROFISSIONAIS
-- =====================================================
UPDATE categories 
SET 
  name = 'Bitcoin & Blockchain',
  description = 'Análises fundamentais e técnicas sobre Bitcoin e tecnologia blockchain'
WHERE slug = 'bitcoin';

UPDATE categories 
SET 
  name = 'Ativos Digitais Estáveis',
  description = 'Inteligência de mercado sobre stablecoins e moedas digitais pareadas'
WHERE slug = 'stablecoins';

UPDATE categories 
SET 
  name = 'Inteligência de Mercado',
  description = 'Análises estratégicas e insights exclusivos sobre o mercado de criptoativos'
WHERE slug = 'estrategias';

-- 2. ATUALIZAR ROLES DOS AUTORES
-- =====================================================
UPDATE authors SET role = 'Senior Analyst - Digital Assets' WHERE slug = 'joao-silva';
UPDATE authors SET role = 'Head of Security - Crypto Assets' WHERE slug = 'maria-santos';
UPDATE authors SET role = 'Chief Investment Strategist' WHERE slug = 'pedro-costa';
UPDATE authors SET role = 'Senior DeFi Analyst' WHERE slug = 'ana-oliveira';
UPDATE authors SET role = 'Lead Blockchain Engineer' WHERE slug = 'carlos-mendes';

-- 3. CRIAR NOVAS TAGS PROFISSIONAIS
-- =====================================================
INSERT INTO tags (name, slug) VALUES
    ('Market Analysis', 'market-analysis'),
    ('Technical Report', 'technical-report'),
    ('Investment Strategy', 'investment-strategy'),
    ('Risk Assessment', 'risk-assessment'),
    ('Market Intelligence', 'market-intelligence'),
    ('Executive Brief', 'executive-brief'),
    ('Research Paper', 'research-paper'),
    ('Strategic Insights', 'strategic-insights')
ON CONFLICT (name) DO NOTHING;

-- 4. ADICIONAR CAMPOS PROFISSIONAIS (OPCIONAL)
-- =====================================================
-- Se quiser adicionar campos extras para tornar mais profissional:

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS executive_summary TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS key_insights TEXT[];
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS report_type VARCHAR(50);

-- 5. CRIAR VIEW PARA RELATÓRIOS EXECUTIVOS
-- =====================================================
CREATE OR REPLACE VIEW executive_reports AS
SELECT 
    p.id,
    p.slug,
    p.title,
    p.executive_summary,
    p.key_insights,
    p.risk_level,
    p.published_at,
    p.views,
    a.name as analyst_name,
    a.role as analyst_role,
    c.name as category,
    ARRAY_AGG(DISTINCT t.name) as tags
FROM blog_posts p
LEFT JOIN authors a ON p.author_id = a.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.published = true
AND p.featured = true
GROUP BY p.id, a.name, a.role, c.name;

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
-- Execute para verificar as mudanças:
SELECT * FROM categories;
SELECT name, role FROM authors;
SELECT COUNT(*) as novas_tags FROM tags WHERE slug LIKE '%analysis%' OR slug LIKE '%report%';

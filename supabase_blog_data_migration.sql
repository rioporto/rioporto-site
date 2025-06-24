-- =====================================================
-- MIGRAÇÃO DOS DADOS DO BLOG - RIO PORTO P2P
-- =====================================================
-- Execute este script APÓS o supabase_blog_setup.sql

-- 1. INSERIR AUTORES
-- =====================================================
INSERT INTO authors (slug, name, bio, role) VALUES
    ('joao-silva', 'João Silva', 'Especialista em Bitcoin com mais de 5 anos de experiência no mercado de criptomoedas.', 'Analista de Bitcoin'),
    ('maria-santos', 'Maria Santos', 'Consultora de segurança em criptoativos e educadora financeira.', 'Consultora de Segurança'),
    ('pedro-costa', 'Pedro Costa', 'Trader profissional e estrategista de investimentos em criptomoedas.', 'Estrategista de Investimentos'),
    ('ana-oliveira', 'Ana Oliveira', 'Especialista em DeFi e stablecoins, com foco em soluções de pagamento.', 'Especialista em DeFi'),
    ('carlos-mendes', 'Carlos Mendes', 'Engenheiro de blockchain e pesquisador de tecnologias descentralizadas.', 'Engenheiro Blockchain')
ON CONFLICT (slug) DO NOTHING;

-- 2. INSERIR TAGS
-- =====================================================
INSERT INTO tags (name, slug) VALUES
    ('Bitcoin', 'bitcoin'),
    ('Blockchain', 'blockchain'),
    ('Iniciantes', 'iniciantes'),
    ('Educação', 'educacao'),
    ('Carteira', 'carteira'),
    ('Segurança', 'seguranca'),
    ('Tutorial', 'tutorial'),
    ('Ouro', 'ouro'),
    ('Investimento', 'investimento'),
    ('Reserva de Valor', 'reserva-de-valor'),
    ('Stablecoins', 'stablecoins'),
    ('USDT', 'usdt'),
    ('USDC', 'usdc'),
    ('Dólar Digital', 'dolar-digital'),
    ('Halving', 'halving'),
    ('Mineração', 'mineracao'),
    ('Análise', 'analise'),
    ('Lightning Network', 'lightning-network'),
    ('Pagamentos', 'pagamentos'),
    ('Tecnologia', 'tecnologia'),
    ('Estratégias', 'estrategias'),
    ('DCA', 'dca'),
    ('Longo Prazo', 'longo-prazo'),
    ('Hardware Wallet', 'hardware-wallet'),
    ('Boas Práticas', 'boas-praticas'),
    ('Inflação', 'inflacao'),
    ('Economia', 'economia'),
    ('Proteção Patrimonial', 'protecao-patrimonial'),
    ('PIX', 'pix'),
    ('Brasil', 'brasil')
ON CONFLICT (name) DO NOTHING;

-- 3. INSERIR POSTS DO BLOG
-- =====================================================
-- Aguarde um momento, vou criar uma função temporária para facilitar
CREATE OR REPLACE FUNCTION insert_blog_post_with_tags(
    p_slug TEXT,
    p_title TEXT,
    p_excerpt TEXT,
    p_content TEXT,
    p_category_name TEXT,
    p_author_name TEXT,
    p_published_at TIMESTAMP WITH TIME ZONE,
    p_featured BOOLEAN,
    p_tags TEXT[]
) RETURNS UUID AS $$
DECLARE
    v_post_id UUID;
    v_category_id UUID;
    v_author_id UUID;
    v_tag_id UUID;
    v_tag TEXT;
BEGIN
    -- Buscar IDs
    SELECT id INTO v_category_id FROM categories WHERE name = p_category_name;
    SELECT id INTO v_author_id FROM authors WHERE name = p_author_name;
    
    -- Inserir post
    INSERT INTO blog_posts (
        slug, title, excerpt, content, category_id, author_id, 
        published, published_at, featured
    ) VALUES (
        p_slug, p_title, p_excerpt, p_content, v_category_id, v_author_id,
        true, p_published_at, p_featured
    ) RETURNING id INTO v_post_id;
    
    -- Inserir tags
    FOREACH v_tag IN ARRAY p_tags
    LOOP
        SELECT id INTO v_tag_id FROM tags WHERE name = v_tag;
        IF v_tag_id IS NOT NULL THEN
            INSERT INTO post_tags (post_id, tag_id) 
            VALUES (v_post_id, v_tag_id)
            ON CONFLICT DO NOTHING;
        END IF;
    END LOOP;
    
    RETURN v_post_id;
END;
$$ LANGUAGE plpgsql;

-- 4. INSERIR OS POSTS
-- =====================================================

-- Post 1: O que é Bitcoin?
SELECT insert_blog_post_with_tags(
    'o-que-e-bitcoin-guia-completo-iniciantes',
    'O que é Bitcoin? Guia Completo para Iniciantes',
    'Entenda de forma simples e direta o que é Bitcoin, como funciona a tecnologia blockchain e por que ele é considerado o ouro digital do século 21.',
    E'# O que é Bitcoin? Guia Completo para Iniciantes\n\nO Bitcoin é a primeira e mais conhecida criptomoeda do mundo, criada em 2009 por uma pessoa ou grupo sob o pseudônimo de Satoshi Nakamoto. Mas o que exatamente isso significa?\n\n## Uma Nova Forma de Dinheiro\n\nBitcoin é essencialmente dinheiro digital - uma forma de moeda que existe apenas online e não é controlada por nenhum governo ou banco central. É como ter dinheiro em sua carteira, mas essa carteira está no seu computador ou celular.\n\n### Principais Características do Bitcoin:\n\n1. **Descentralizado**: Não há uma autoridade central controlando o Bitcoin\n2. **Digital**: Existe apenas em formato eletrônico\n3. **Limitado**: Apenas 21 milhões de bitcoins serão criados\n4. **Transparente**: Todas as transações são públicas (mas anônimas)\n5. **Seguro**: Protegido por criptografia avançada\n\n## Como Funciona o Bitcoin?\n\nO Bitcoin funciona através de uma tecnologia chamada **blockchain** (corrente de blocos). Imagine um livro contábil gigante que registra todas as transações de Bitcoin que já aconteceram. Este livro:\n\n- É copiado em milhares de computadores ao redor do mundo\n- É atualizado a cada 10 minutos com novas transações\n- Não pode ser alterado ou falsificado\n- É verificado por uma rede de computadores (mineradores)\n\n### O Processo de uma Transação\n\n1. **Você envia Bitcoin**: Usando sua carteira digital, você cria uma transação\n2. **A rede verifica**: Mineradores confirmam que você tem os bitcoins\n3. **Transação confirmada**: Após verificação, a transação é adicionada ao blockchain\n4. **Destinatário recebe**: Os bitcoins aparecem na carteira do destinatário\n\n## Por que o Bitcoin é Valioso?\n\nO valor do Bitcoin vem de várias características únicas:\n\n### 1. Escassez Digital\nAssim como o ouro é valioso por ser raro, o Bitcoin tem fornecimento limitado. Nunca haverá mais de 21 milhões de bitcoins.\n\n### 2. Utilidade como Dinheiro\n- **Divisível**: Pode ser dividido em até 100 milhões de partes (satoshis)\n- **Portátil**: Pode ser enviado para qualquer lugar do mundo\n- **Durável**: Não se degrada com o tempo\n- **Verificável**: Autenticidade facilmente confirmada\n\n### 3. Rede de Segurança\nO Bitcoin é protegido pela maior rede computacional do mundo, tornando-o extremamente seguro contra ataques.\n\n## Bitcoin vs Dinheiro Tradicional\n\n| Característica | Bitcoin | Dinheiro Tradicional |\n|----------------|---------|---------------------|\n| Controle | Descentralizado | Bancos Centrais |\n| Inflação | Limitada (21M) | Ilimitada |\n| Transações | 24/7, global | Horário bancário |\n| Taxas | Baixas | Podem ser altas |\n| Privacidade | Pseudônimo | Identificado |\n\n## Como Começar com Bitcoin?\n\n### 1. Eduque-se\nContinue aprendendo sobre Bitcoin através de recursos confiáveis.\n\n### 2. Crie uma Carteira\nEscolha uma carteira digital segura para armazenar seus bitcoins.\n\n### 3. Compre Bitcoin\nUse uma exchange confiável ou serviço P2P como a Rio Porto.\n\n### 4. Pratique Segurança\n- Use senhas fortes\n- Ative autenticação de dois fatores\n- Considere uma hardware wallet para valores maiores\n\n## Riscos e Considerações\n\nComo qualquer investimento, Bitcoin tem riscos:\n\n- **Volatilidade**: O preço pode variar significativamente\n- **Irreversibilidade**: Transações não podem ser canceladas\n- **Responsabilidade**: Você é seu próprio banco\n- **Regulamentação**: Leis podem mudar\n\n## O Futuro do Bitcoin\n\nO Bitcoin continua evoluindo com:\n\n- **Lightning Network**: Pagamentos instantâneos\n- **Maior adoção**: Mais empresas aceitando Bitcoin\n- **Desenvolvimento**: Melhorias constantes no protocolo\n- **Educação**: Mais pessoas entendendo a tecnologia\n\n## Conclusão\n\nO Bitcoin representa uma revolução no conceito de dinheiro. É uma tecnologia que permite transferir valor pela internet sem intermediários, de forma segura e transparente.\n\nEmbora possa parecer complexo no início, os princípios básicos são simples: é dinheiro digital que você controla completamente.\n\nSe você está interessado em começar sua jornada com Bitcoin, a Rio Porto P2P está aqui para ajudar com compra e venda segura, além de consultoria especializada.\n\n---\n\n**Quer aprender mais?** Explore nossos outros artigos sobre Bitcoin e criptomoedas ou entre em contato para uma consultoria personalizada.',
    'Bitcoin',
    'João Silva',
    '2024-01-15'::TIMESTAMP WITH TIME ZONE,
    true,
    ARRAY['Bitcoin', 'Blockchain', 'Iniciantes', 'Educação']
);

-- Post 2: Como Criar sua Primeira Carteira Bitcoin
SELECT insert_blog_post_with_tags(
    'como-criar-primeira-carteira-bitcoin',
    'Como Criar sua Primeira Carteira Bitcoin com Segurança',
    'Passo a passo completo para criar e proteger sua carteira Bitcoin. Aprenda as melhores práticas de segurança desde o início.',
    E'# Como Criar sua Primeira Carteira Bitcoin com Segurança\n\nConteúdo completo do artigo aqui...',
    'Bitcoin',
    'Maria Santos',
    '2024-01-12'::TIMESTAMP WITH TIME ZONE,
    true,
    ARRAY['Bitcoin', 'Carteira', 'Segurança', 'Tutorial']
);

-- Post 3: Bitcoin vs Ouro
SELECT insert_blog_post_with_tags(
    'bitcoin-vs-ouro-comparacao-completa',
    'Bitcoin vs Ouro: Qual é o Melhor Ativo de Reserva?',
    'Comparação detalhada entre Bitcoin e ouro como reservas de valor. Entenda as vantagens e desvantagens de cada um.',
    E'# Bitcoin vs Ouro: Comparação Completa\n\nConteúdo completo do artigo aqui...',
    'Bitcoin',
    'Pedro Costa',
    '2024-01-10'::TIMESTAMP WITH TIME ZONE,
    false,
    ARRAY['Bitcoin', 'Ouro', 'Investimento', 'Reserva de Valor']
);

-- Post 4: O que são Stablecoins
SELECT insert_blog_post_with_tags(
    'o-que-sao-stablecoins-usdt-usdc',
    'O que são Stablecoins? USDT e USDC Explicados',
    'Entenda o papel das stablecoins no ecossistema crypto e como USDT e USDC mantêm paridade com o dólar.',
    E'# O que são Stablecoins?\n\nConteúdo completo do artigo aqui...',
    'Stablecoins',
    'Ana Oliveira',
    '2024-01-08'::TIMESTAMP WITH TIME ZONE,
    false,
    ARRAY['Stablecoins', 'USDT', 'USDC', 'Dólar Digital']
);

-- Post 5: Halving do Bitcoin
SELECT insert_blog_post_with_tags(
    'halving-bitcoin-2024-o-que-esperar',
    'Halving do Bitcoin 2024: O que Esperar',
    'Análise completa sobre o próximo halving do Bitcoin e seus possíveis impactos no preço e na mineração.',
    E'# Halving do Bitcoin 2024\n\nConteúdo completo do artigo aqui...',
    'Bitcoin',
    'Carlos Mendes',
    '2024-01-05'::TIMESTAMP WITH TIME ZONE,
    true,
    ARRAY['Bitcoin', 'Halving', 'Mineração', 'Análise']
);

-- Post 6: Lightning Network
SELECT insert_blog_post_with_tags(
    'lightning-network-pagamentos-instantaneos',
    'Lightning Network: Pagamentos Instantâneos com Bitcoin',
    'Como a Lightning Network resolve o problema de escalabilidade do Bitcoin e permite micropagamentos instantâneos.',
    E'# Lightning Network: Pagamentos Instantâneos\n\nConteúdo completo do artigo aqui...',
    'Bitcoin',
    'João Silva',
    '2024-01-03'::TIMESTAMP WITH TIME ZONE,
    false,
    ARRAY['Bitcoin', 'Lightning Network', 'Pagamentos', 'Tecnologia']
);

-- Post 7: Estratégia DCA
SELECT insert_blog_post_with_tags(
    'estrategias-dca-bitcoin-longo-prazo',
    'DCA: A Melhor Estratégia para Acumular Bitcoin',
    'Dollar Cost Averaging (DCA) explicado: como construir uma posição sólida em Bitcoin ao longo do tempo.',
    E'# DCA: Dollar Cost Averaging\n\nConteúdo completo do artigo aqui...',
    'Estratégias',
    'Maria Santos',
    '2024-01-01'::TIMESTAMP WITH TIME ZONE,
    false,
    ARRAY['Estratégias', 'DCA', 'Investimento', 'Longo Prazo']
);

-- Post 8: Segurança em Bitcoin
SELECT insert_blog_post_with_tags(
    'seguranca-bitcoin-proteja-seus-ativos',
    'Segurança em Bitcoin: Como Proteger seus Ativos',
    'Guia definitivo de segurança: hardware wallets, seed phrases, multi-sig e as melhores práticas para proteger seu Bitcoin.',
    E'# Segurança em Bitcoin\n\nConteúdo completo do artigo aqui...',
    'Bitcoin',
    'Pedro Costa',
    '2023-12-28'::TIMESTAMP WITH TIME ZONE,
    false,
    ARRAY['Bitcoin', 'Segurança', 'Hardware Wallet', 'Boas Práticas']
);

-- Post 9: Bitcoin e Inflação
SELECT insert_blog_post_with_tags(
    'bitcoin-inflacao-protecao-patrimonio',
    'Bitcoin como Proteção Contra a Inflação',
    'Entenda como o Bitcoin pode servir como hedge contra a inflação e proteger seu poder de compra ao longo do tempo.',
    E'# Bitcoin como Proteção Contra a Inflação\n\nConteúdo completo do artigo aqui...',
    'Bitcoin',
    'Ana Oliveira',
    '2023-12-25'::TIMESTAMP WITH TIME ZONE,
    false,
    ARRAY['Bitcoin', 'Inflação', 'Economia', 'Proteção Patrimonial']
);

-- Post 10: Stablecoins no Brasil
SELECT insert_blog_post_with_tags(
    'stablecoins-brasil-pix-criptomoedas',
    'Stablecoins no Brasil: A Ponte entre PIX e Criptomoedas',
    'Como as stablecoins facilitam a entrada no mundo crypto para brasileiros acostumados com o PIX.',
    E'# Stablecoins no Brasil\n\nConteúdo completo do artigo aqui...',
    'Stablecoins',
    'Carlos Mendes',
    '2023-12-22'::TIMESTAMP WITH TIME ZONE,
    false,
    ARRAY['Stablecoins', 'PIX', 'Brasil', 'Pagamentos']
);

-- 5. CRIAR RELACIONAMENTOS ENTRE POSTS
-- =====================================================
-- Relacionar posts sobre Bitcoin básico
INSERT INTO related_posts (post_id, related_post_id)
SELECT 
    p1.id,
    p2.id
FROM blog_posts p1
CROSS JOIN blog_posts p2
WHERE p1.slug = 'o-que-e-bitcoin-guia-completo-iniciantes'
AND p2.slug IN (
    'como-criar-primeira-carteira-bitcoin',
    'bitcoin-vs-ouro-comparacao-completa',
    'seguranca-bitcoin-proteja-seus-ativos'
)
ON CONFLICT DO NOTHING;

-- Relacionar posts sobre segurança
INSERT INTO related_posts (post_id, related_post_id)
SELECT 
    p1.id,
    p2.id
FROM blog_posts p1
CROSS JOIN blog_posts p2
WHERE p1.slug = 'como-criar-primeira-carteira-bitcoin'
AND p2.slug IN (
    'seguranca-bitcoin-proteja-seus-ativos',
    'o-que-e-bitcoin-guia-completo-iniciantes'
)
ON CONFLICT DO NOTHING;

-- 6. LIMPAR FUNÇÃO TEMPORÁRIA
-- =====================================================
DROP FUNCTION IF EXISTS insert_blog_post_with_tags;

-- =====================================================
-- VERIFICAÇÃO DOS DADOS
-- =====================================================
-- Execute estas queries para verificar se tudo foi inserido corretamente:

-- SELECT COUNT(*) as total_posts FROM blog_posts;
-- SELECT COUNT(*) as total_authors FROM authors;
-- SELECT COUNT(*) as total_categories FROM categories;
-- SELECT COUNT(*) as total_tags FROM tags;
-- SELECT * FROM category_stats;

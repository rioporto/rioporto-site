export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content?: string
  category: "Bitcoin" | "Stablecoins" | "Estratégias"
  author: string
  date: string
  readTime: string
  image?: string
  featured: boolean
  tags?: string[]
  relatedPosts?: string[]
}

export interface Author {
  id: string
  name: string
  bio: string
  avatar?: string
  role: string
}

export interface Category {
  name: string
  slug: string
  description: string
  count: number
  icon: any
}

// Dados mockados - depois migrar para Supabase ou CMS
export const authors: Record<string, Author> = {
  "joao-silva": {
    id: "joao-silva",
    name: "João Silva",
    bio: "Especialista em Bitcoin com mais de 5 anos de experiência no mercado de criptomoedas.",
    role: "Analista de Bitcoin"
  },
  "maria-santos": {
    id: "maria-santos",
    name: "Maria Santos",
    bio: "Consultora de segurança em criptoativos e educadora financeira.",
    role: "Consultora de Segurança"
  },
  "pedro-costa": {
    id: "pedro-costa",
    name: "Pedro Costa",
    bio: "Trader profissional e estrategista de investimentos em criptomoedas.",
    role: "Estrategista de Investimentos"
  },
  "ana-oliveira": {
    id: "ana-oliveira",
    name: "Ana Oliveira",
    bio: "Especialista em DeFi e stablecoins, com foco em soluções de pagamento.",
    role: "Especialista em DeFi"
  },
  "carlos-mendes": {
    id: "carlos-mendes",
    name: "Carlos Mendes",
    bio: "Engenheiro de blockchain e pesquisador de tecnologias descentralizadas.",
    role: "Engenheiro Blockchain"
  }
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "o-que-e-bitcoin-guia-completo-iniciantes",
    title: "O que é Bitcoin? Guia Completo para Iniciantes",
    excerpt: "Entenda de forma simples e direta o que é Bitcoin, como funciona a tecnologia blockchain e por que ele é considerado o ouro digital do século 21.",
    category: "Bitcoin",
    author: "João Silva",
    date: "2024-01-15",
    readTime: "8 min",
    featured: true,
    tags: ["bitcoin", "blockchain", "iniciantes", "educação"]
  },
  {
    id: 2,
    slug: "como-criar-primeira-carteira-bitcoin",
    title: "Como Criar sua Primeira Carteira Bitcoin com Segurança",
    excerpt: "Passo a passo completo para criar e proteger sua carteira Bitcoin. Aprenda as melhores práticas de segurança desde o início.",
    category: "Bitcoin",
    author: "Maria Santos",
    date: "2024-01-12",
    readTime: "10 min",
    featured: true,
    tags: ["bitcoin", "carteira", "segurança", "tutorial"]
  },
  {
    id: 3,
    slug: "bitcoin-vs-ouro-comparacao-completa",
    title: "Bitcoin vs Ouro: Qual é o Melhor Ativo de Reserva?",
    excerpt: "Comparação detalhada entre Bitcoin e ouro como reservas de valor. Entenda as vantagens e desvantagens de cada um.",
    category: "Bitcoin",
    author: "Pedro Costa",
    date: "2024-01-10",
    readTime: "12 min",
    featured: false,
    tags: ["bitcoin", "ouro", "investimento", "reserva de valor"]
  },
  {
    id: 4,
    slug: "o-que-sao-stablecoins-usdt-usdc",
    title: "O que são Stablecoins? USDT e USDC Explicados",
    excerpt: "Entenda o papel das stablecoins no ecossistema crypto e como USDT e USDC mantêm paridade com o dólar.",
    category: "Stablecoins",
    author: "Ana Oliveira",
    date: "2024-01-08",
    readTime: "6 min",
    featured: false,
    tags: ["stablecoins", "usdt", "usdc", "dólar digital"]
  },
  {
    id: 5,
    slug: "halving-bitcoin-2024-o-que-esperar",
    title: "Halving do Bitcoin 2024: O que Esperar",
    excerpt: "Análise completa sobre o próximo halving do Bitcoin e seus possíveis impactos no preço e na mineração.",
    category: "Bitcoin",
    author: "Carlos Mendes",
    date: "2024-01-05",
    readTime: "15 min",
    featured: true,
    tags: ["bitcoin", "halving", "mineração", "análise"]
  },
  {
    id: 6,
    slug: "lightning-network-pagamentos-instantaneos",
    title: "Lightning Network: Pagamentos Instantâneos com Bitcoin",
    excerpt: "Como a Lightning Network resolve o problema de escalabilidade do Bitcoin e permite micropagamentos instantâneos.",
    category: "Bitcoin",
    author: "João Silva",
    date: "2024-01-03",
    readTime: "9 min",
    featured: false,
    tags: ["bitcoin", "lightning network", "pagamentos", "tecnologia"]
  },
  {
    id: 7,
    slug: "estrategias-dca-bitcoin-longo-prazo",
    title: "DCA: A Melhor Estratégia para Acumular Bitcoin",
    excerpt: "Dollar Cost Averaging (DCA) explicado: como construir uma posição sólida em Bitcoin ao longo do tempo.",
    category: "Estratégias",
    author: "Maria Santos",
    date: "2024-01-01",
    readTime: "7 min",
    featured: false,
    tags: ["estratégias", "dca", "investimento", "longo prazo"]
  },
  {
    id: 8,
    slug: "seguranca-bitcoin-proteja-seus-ativos",
    title: "Segurança em Bitcoin: Como Proteger seus Ativos",
    excerpt: "Guia definitivo de segurança: hardware wallets, seed phrases, multi-sig e as melhores práticas para proteger seu Bitcoin.",
    category: "Bitcoin",
    author: "Pedro Costa",
    date: "2023-12-28",
    readTime: "11 min",
    featured: false,
    tags: ["bitcoin", "segurança", "hardware wallet", "boas práticas"]
  },
  {
    id: 9,
    slug: "bitcoin-inflacao-protecao-patrimonio",
    title: "Bitcoin como Proteção Contra a Inflação",
    excerpt: "Entenda como o Bitcoin pode servir como hedge contra a inflação e proteger seu poder de compra ao longo do tempo.",
    category: "Bitcoin",
    author: "Ana Oliveira",
    date: "2023-12-25",
    readTime: "8 min",
    featured: false,
    tags: ["bitcoin", "inflação", "economia", "proteção patrimonial"]
  },
  {
    id: 10,
    slug: "stablecoins-brasil-pix-criptomoedas",
    title: "Stablecoins no Brasil: A Ponte entre PIX e Criptomoedas",
    excerpt: "Como as stablecoins facilitam a entrada no mundo crypto para brasileiros acostumados com o PIX.",
    category: "Stablecoins",
    author: "Carlos Mendes",
    date: "2023-12-22",
    readTime: "7 min",
    featured: false,
    tags: ["stablecoins", "pix", "brasil", "pagamentos"]
  }
]

// Função para buscar posts por categoria
export function getPostsByCategory(category?: string): BlogPost[] {
  if (!category || category === "Todos") {
    return blogPosts
  }
  return blogPosts.filter(post => post.category === category)
}

// Função para buscar posts em destaque
export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured)
}

// Função para buscar post por slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}

// Função para buscar posts relacionados
export function getRelatedPosts(currentSlug: string, category: string, limit: number = 3): BlogPost[] {
  return blogPosts
    .filter(post => post.slug !== currentSlug && post.category === category)
    .slice(0, limit)
}

// Função para buscar posts por tag
export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => post.tags?.includes(tag))
}

// Estatísticas do blog
export function getBlogStats() {
  const totalPosts = blogPosts.length
  const bitcoinPosts = blogPosts.filter(p => p.category === "Bitcoin").length
  const stablecoinPosts = blogPosts.filter(p => p.category === "Stablecoins").length
  const strategyPosts = blogPosts.filter(p => p.category === "Estratégias").length
  
  return {
    total: totalPosts,
    bitcoin: bitcoinPosts,
    bitcoinPercentage: (bitcoinPosts / totalPosts * 100).toFixed(1),
    stablecoins: stablecoinPosts,
    stablecoinsPercentage: (stablecoinPosts / totalPosts * 100).toFixed(1),
    strategies: strategyPosts,
    strategiesPercentage: (strategyPosts / totalPosts * 100).toFixed(1)
  }
}
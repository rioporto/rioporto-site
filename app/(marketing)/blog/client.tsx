"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bitcoin, Search, Clock, User, ArrowRight, BookOpen, DollarSign, TrendingUp, Loader2, Gift, CheckCircle } from "lucide-react"
import Link from "next/link"
import { getBlogPosts, getCategoryStats } from "@/lib/blog/api"
import { BlogPostWithRelations, CategoryStats } from "@/types/blog"
import { useToast } from "@/components/ui/use-toast"
import { useDebounce } from "@/hooks/use-debounce"

export default function BlogPageClient() {
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<BlogPostWithRelations[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<BlogPostWithRelations[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [subscribing, setSubscribing] = useState(false)
  const { toast } = useToast()
  
  // Debounce search to improve performance
  const debouncedSearch = useDebounce(searchQuery, 500)

  // Carregar posts com cache
  const loadPosts = useCallback(async () => {
    setLoading(true)
    try {
      const filters = {
        category: selectedCategory === "todos" ? undefined : selectedCategory,
        search: debouncedSearch || undefined,
        page,
        limit: 9
      }
      
      const response = await getBlogPosts(filters)
      setPosts(response.posts)
      setTotalPages(response.totalPages)
      
      // Carregar posts em destaque apenas na primeira página E quando não houver filtro de categoria
      if (page === 1 && !debouncedSearch && selectedCategory === "todos") {
        const featuredResponse = await getBlogPosts({ featured: true, limit: 3 })
        setFeaturedPosts(featuredResponse.posts)
      } else {
        setFeaturedPosts([])
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
      // Mostrar toast apenas se for erro de rede
      if (error instanceof Error && error.message.includes('network')) {
        toast({
          title: "Erro de conexão",
          description: "Verifique sua conexão com a internet e tente novamente.",
          variant: "destructive"
        })
      }
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, debouncedSearch, page, toast])

  // Carregar posts quando filtros mudarem
  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  // Carregar estatísticas de categorias apenas uma vez
  useEffect(() => {
    loadCategoryStats()
  }, [])

  async function loadCategoryStats() {
    try {
      const stats = await getCategoryStats()
      setCategoryStats(stats)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  async function handleNewsletterSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!newsletterEmail) return

    setSubscribing(true)
    try {
      const response = await fetch('/api/blog/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      })

      if (response.ok) {
        toast({
          title: "Inscrição realizada!",
          description: "Você receberá nossos insights exclusivos por email.",
        })
        setNewsletterEmail("")
      } else {
        const error = await response.json()
        toast({
          title: "Erro na inscrição",
          description: error.error || "Tente novamente mais tarde.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro na inscrição",
        description: "Não foi possível processar sua inscrição.",
        variant: "destructive"
      })
    } finally {
      setSubscribing(false)
    }
  }

  const categories = [
    { 
      name: "Todos", 
      slug: "todos",
      count: categoryStats.reduce((sum, cat) => sum + cat.published_count, 0), 
      icon: BookOpen 
    },
    { 
      name: "Bitcoin", 
      slug: "bitcoin",
      count: categoryStats.find(c => c.slug === "bitcoin")?.published_count || 0, 
      icon: Bitcoin 
    },
    { 
      name: "Stablecoins", 
      slug: "stablecoins",
      count: categoryStats.find(c => c.slug === "stablecoins")?.published_count || 0, 
      icon: DollarSign 
    },
    { 
      name: "Estratégias", 
      slug: "estrategias",
      count: categoryStats.find(c => c.slug === "estrategias")?.published_count || 0, 
      icon: TrendingUp 
    },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Badge className="mb-4" variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Centro de Conhecimento
            </Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Análises e Estratégias em Ativos Digitais
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Insights especializados e conteúdo exclusivo sobre Bitcoin, criptoativos e tendências do mercado financeiro digital
            </p>
            
            {/* Badge de Conteúdo Gratuito */}
            <div className="mb-6 flex justify-center">
              <Badge variant="secondary" className="gap-2 px-4 py-2 text-sm">
                <Gift className="h-4 w-4" />
                Todo conteúdo disponível gratuitamente
              </Badge>
            </div>
            
            {/* Search Bar */}
            <div className="mx-auto max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Pesquisar artigos, análises e guias..."
                  className="pl-10 pr-4 py-6 text-lg"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setPage(1) // Reset to first page on search
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b bg-muted/30 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <Button
                key={category.slug}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                className="gap-2"
                onClick={() => {
                  setSelectedCategory(category.slug)
                  setPage(1)
                }}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
                <Badge variant="secondary" className="ml-1">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Free Content Message */}
      {selectedCategory !== "todos" && (
        <section className="bg-primary/5 px-4 py-4">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>
                Você está visualizando conteúdo gratuito da categoria <strong>{categories.find(c => c.slug === selectedCategory)?.name}</strong>
              </span>
            </div>
          </div>
        </section>
      )}

      {loading ? (
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Carregando conteúdo...</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Posts - Only show when no category filter */}
          {page === 1 && featuredPosts.length > 0 && !debouncedSearch && selectedCategory === "todos" && (
            <section className="px-4 py-12">
              <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Análises em Destaque</h2>
                  <Badge variant="outline" className="gap-1">
                    <Gift className="h-3 w-3" />
                    Acesso Gratuito
                  </Badge>
                </div>
                
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {featuredPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {post.featured_image_url && (
                        <div className="aspect-video bg-muted relative">
                          <Image 
                            src={post.featured_image_url} 
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={post.category_name === "Bitcoin" ? "default" : "secondary"}>
                            {post.category_name}
                          </Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.read_time} min
                          </span>
                        </div>
                        <CardTitle className="line-clamp-2">
                          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                            {post.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          {post.author_name}
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/blog/${post.slug}`}>
                            Ler mais
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All Posts */}
          {posts.length > 0 ? (
            <section className="px-4 py-12 bg-muted/30">
              <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    {selectedCategory !== "todos" 
                      ? `${categories.find(c => c.slug === selectedCategory)?.name || 'Publicações'}` 
                      : page === 1 
                        ? "Publicações Recentes" 
                        : `Página ${page}`}
                  </h2>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Gift className="h-4 w-4" />
                    Conteúdo gratuito e acessível
                  </span>
                </div>
                
                <div className="grid gap-6">
                  {posts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={post.category_name === "Bitcoin" ? "default" : "secondary"}>
                                {post.category_name}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(post.published_at || '').toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <CardTitle className="mb-2">
                              <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                                {post.title}
                              </Link>
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {post.excerpt}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {post.author_name}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {post.read_time} min
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/blog/${post.slug}`}>
                                Ler
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <Button 
                      variant="outline" 
                      disabled={page === 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                      Anterior
                    </Button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                    
                    {totalPages > 5 && (
                      <>
                        <span className="px-2 py-2">...</span>
                        <Button
                          variant={page === totalPages ? "default" : "outline"}
                          onClick={() => setPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                    
                    <Button 
                      variant="outline"
                      disabled={page === totalPages}
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                      Próximo
                    </Button>
                  </div>
                )}
              </div>
            </section>
          ) : (
            <section className="px-4 py-12 bg-muted/30">
              <div className="mx-auto max-w-6xl text-center">
                <h3 className="text-xl font-semibold mb-2">Nenhuma publicação encontrada</h3>
                <p className="text-muted-foreground">
                  Refine sua pesquisa utilizando outros termos ou explore as categorias disponíveis.
                </p>
              </div>
            </section>
          )}
        </>
      )}

      {/* Newsletter CTA */}
      <section className="px-4 py-16 bg-primary/5">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Inteligência de Mercado Exclusiva</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Receba análises estratégicas e insights privilegiados sobre Bitcoin e o mercado de ativos digitais
          </p>
          <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Seu melhor email corporativo"
              className="flex-1"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              disabled={subscribing}
            />
            <Button size="lg" className="bitcoin-bg" disabled={subscribing}>
              {subscribing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assinar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>
    </main>
  )
}
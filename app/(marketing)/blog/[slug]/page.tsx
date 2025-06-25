import { Metadata } from 'next'
import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Bitcoin, Clock, User, Calendar, Share2, BookOpen, ArrowLeft, ArrowRight, Eye, MessageCircle } from "lucide-react"
import Link from "next/link"
import { getPostBySlug, getRelatedPosts, trackPostView } from "@/lib/blog/api"
import { BlogPostContent } from "@/components/blog/post-content"
import { CommentSection } from "@/components/blog/comments/comment-section"
import { ShareButtons } from "@/components/blog/share-buttons"
import { generateBlogMetadata, generateArticleJsonLd } from "@/lib/blog/metadata"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post não encontrado | Rio Porto P2P Blog',
      description: 'O post que você está procurando não foi encontrado.'
    }
  }

  return generateBlogMetadata({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    image: post.featured_image_url || undefined,
    publishedAt: post.published_at || undefined,
    author: post.author_name || undefined
  })
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }

  // Rastrear visualização (sem await para não bloquear renderização)
  trackPostView({ 
    post_id: post.id,
    session_id: crypto.randomUUID() // Em produção, usar um session ID real
  })

  // Buscar posts relacionados
  const relatedPosts = await getRelatedPosts(post.id, 3)

  // Gerar JSON-LD para SEO
  const jsonLd = generateArticleJsonLd({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    image: post.featured_image_url || undefined,
    publishedAt: post.published_at || new Date().toISOString(),
    modifiedAt: post.updated_at,
    author: post.author_name || 'Rio Porto P2P',
    content: post.content
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="flex min-h-screen flex-col">
        {/* Breadcrumb */}
        <section className="border-b px-4 py-4">
          <div className="mx-auto max-w-4xl">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Início
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-foreground transition-colors">
                Artigos
              </Link>
              <span>/</span>
              <span className="text-foreground">{post.category_name}</span>
            </nav>
          </div>
        </section>

        {/* Article Header */}
        <section className="px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar aos Artigos
              </Link>
            </Button>

            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <Badge variant={post.category_name === "Bitcoin" ? "default" : "secondary"}>
                  {post.category_name}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.read_time} min de leitura
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.views} visualizações
                </span>
              </div>

              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                {post.title}
              </h1>

              <p className="text-xl text-muted-foreground">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.published_at || '').toLocaleDateString('pt-BR')}</span>
                </div>
                <ShareButtons 
                  url={`/blog/${post.slug}`}
                  title={post.title}
                  description={post.excerpt}
                />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/blog?tag=${tag.slug}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {post.featured_image_url && (
          <section className="px-4 pb-8">
            <div className="mx-auto max-w-4xl">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                <Image 
                  src={post.featured_image_url} 
                  alt={post.title || "Featured image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority
                />
              </div>
            </div>
          </section>
        )}

        {/* Article Content */}
        <article className="px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <BlogPostContent content={post.content} />
          </div>
        </article>

        <Separator className="mx-auto max-w-4xl" />

        {/* Author Bio */}
        <section className="px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center relative overflow-hidden">
                    {post.author_avatar ? (
                      <Image 
                        src={post.author_avatar} 
                        alt={post.author_name || "Author"}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <User className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <CardTitle>{post.author_name}</CardTitle>
                    <CardDescription>
                      Especialista em Bitcoin e criptomoedas na Rio Porto P2P
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Comments Section */}
        <section className="px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <CommentSection postSlug={post.slug} />
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="px-4 py-12">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-8 text-2xl font-bold">Conteúdo Relacionado</h2>
              
              <div className="grid gap-6 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <Badge variant={relatedPost.category_name === "Bitcoin" ? "default" : "secondary"} className="w-fit mb-2">
                        {relatedPost.category_name}
                      </Badge>
                      <CardTitle className="line-clamp-2">
                        <Link href={`/blog/${relatedPost.slug}`} className="hover:text-primary transition-colors">
                          {relatedPost.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-3 mb-4">
                        {relatedPost.excerpt}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {relatedPost.read_time} min
                        </span>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/blog/${relatedPost.slug}`}>
                            Ler
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="px-4 py-16 bg-primary/5">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Pronto para Começar com Bitcoin?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              A Rio Porto P2P oferece a maneira mais segura e simples de comprar e vender Bitcoin no Brasil
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/cotacao">
                  Fazer Cotação
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contato">
                  Falar com Especialista
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
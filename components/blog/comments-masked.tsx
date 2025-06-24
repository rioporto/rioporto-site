"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, User, AlertCircle, ChevronRight, Lock, Eye } from "lucide-react"
import { getPostComments, createComment } from "@/lib/blog/api"
import { BlogComment } from "@/types/blog"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BlogCommentsProps {
  postId: string
}

export function BlogComments({ postId }: BlogCommentsProps) {
  const [comments, setComments] = useState<BlogComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()
  
  // Controle de mascaramento
  const maxPreviewLength = 80

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    loadComments()
    checkUser()
  }, [postId])

  async function checkUser() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setProfile(profileData)
        
        if (!profileData?.name) {
          console.log('Usuário sem nome no perfil')
        }
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
    }
  }

  async function loadComments() {
    try {
      const data = await getPostComments(postId)
      setComments(data)
    } catch (error) {
      console.error('Erro ao carregar comentários:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para comentar.",
        variant: "destructive"
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: "Comentário vazio",
        description: "Por favor, escreva algo antes de enviar.",
        variant: "destructive"
      })
      return
    }

    if (!profile?.name) {
      toast({
        title: "Perfil incompleto",
        description: "Por favor, complete seu perfil com um nome antes de comentar.",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)
    try {
      const comment = await createComment({
        post_id: postId,
        content: newComment.trim(),
        parent_id: replyingTo || undefined
      })

      toast({
        title: "Comentário enviado com sucesso!",
        description: "Seu comentário foi enviado para moderação e será publicado após aprovação.",
      })
      setNewComment("")
      setReplyingTo(null)
    } catch (error: any) {
      console.error('Erro detalhado ao enviar comentário:', error)
      toast({
        title: "Erro ao enviar comentário",
        description: "Não foi possível enviar seu comentário. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  function maskContent(content: string): string {
    if (content.length <= maxPreviewLength) {
      return content
    }
    return content.substring(0, maxPreviewLength) + "..."
  }

  function renderComment(comment: BlogComment, isReply = false) {
    const isLoggedIn = !!user
    const shouldMask = !isLoggedIn
    
    return (
      <div key={comment.id} className={isReply ? "ml-12" : ""}>
        <Card className={`mb-4 ${shouldMask ? 'relative overflow-hidden' : ''}`}>
          <CardHeader className="pb-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className={shouldMask ? 'blur-sm' : ''}>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-semibold ${shouldMask ? 'blur-sm' : ''}`}>
                    {shouldMask ? "Usuário Rio Porto" : (comment.user?.name || "Usuário Anônimo")}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(comment.created_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
                
                {shouldMask ? (
                  <div className="relative">
                    <p className="text-sm leading-relaxed opacity-60">
                      {maskContent(comment.content)}
                    </p>
                    {comment.content.length > maxPreviewLength && (
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
                    )}
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                )}
                
                {!isReply && user && !shouldMask && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 -ml-2"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Responder
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          {/* Overlay para não logados - só renderiza no cliente */}
          {mounted && shouldMask && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
              <Card className="border-primary/20 bg-background/95 shadow-lg">
                <CardContent className="py-4 px-6">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Lock className="h-6 w-6 text-primary" />
                    <p className="text-sm font-medium">
                      Faça login para ler e interagir com os comentários
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" asChild>
                        <a href="/login">
                          Fazer Login
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href="/cadastro">Criar Conta</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </Card>
        
        {/* Renderizar respostas */}
        {comment.replies && comment.replies.length > 0 && !shouldMask && (
          <div className="mb-4">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}

        {/* Indicador de respostas para não logados */}
        {comment.replies && comment.replies.length > 0 && shouldMask && (
          <div className="ml-12 mb-4">
            <Card className="border-dashed opacity-60">
              <CardContent className="py-3 px-4">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {comment.replies.length} {comment.replies.length === 1 ? 'resposta' : 'respostas'}
                  <span className="text-primary ml-auto text-xs">
                    Faça login para ver
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Formulário de resposta */}
        {replyingTo === comment.id && (
          <div className="ml-12 mb-4">
            <form onSubmit={handleSubmitComment}>
              <Textarea
                placeholder="Digite sua resposta..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2"
                rows={3}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Resposta
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setReplyingTo(null)
                    setNewComment("")
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando comentários...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Banner para não logados com comentários */}
      {!user && comments.length > 0 && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Este artigo tem {comments.length} {comments.length === 1 ? 'comentário' : 'comentários'} da comunidade
                </p>
                <p className="text-xs text-muted-foreground">
                  Faça login para ler na íntegra e participar da discussão
                </p>
              </div>
              <Button size="sm" variant="default" asChild>
                <a href="/login">Fazer Login</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário de novo comentário */}
      {user ? (
        <>
          {/* Alerta se o perfil estiver incompleto */}
          {!profile?.name && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Complete seu perfil com um nome para poder comentar.
                <Button variant="link" size="sm" asChild className="ml-2">
                  <a href="/perfil">Completar Perfil</a>
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Deixe um comentário</h3>
                <Badge variant="secondary" className="text-xs">
                  Contribua com a comunidade
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitComment}>
                <Textarea
                  placeholder="Compartilhe sua opinião ou experiência..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-4"
                  rows={4}
                  disabled={!profile?.name}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Todos os comentários são moderados antes da publicação
                  </p>
                  <Button 
                    type="submit" 
                    disabled={submitting || !profile?.name}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Comentário
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="mb-8">
          <CardContent className="py-8 text-center">
            <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium mb-2">
              Participe da discussão!
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Faça login para comentar e interagir com a comunidade
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <a href="/login">Fazer Login</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/cadastro">Criar Conta</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de comentários */}
      {comments.length > 0 ? (
        <div>
          {comments.map(comment => renderComment(comment))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Seja o primeiro a comentar neste artigo!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

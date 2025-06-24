"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  User, 
  Calendar,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  ShieldAlert
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

interface Comment {
  id: string
  content: string
  approved: boolean
  created_at: string
  post_id: string
  user_id: string
  user?: {
    name: string
    email: string
  }
  post?: {
    title: string
    slug: string
  }
}

export default function AdminCommentsPage() {
  const [user, setUser] = useState<any>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'all'>('pending')
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAdmin && user) {
      loadComments()
    }
  }, [isAdmin, activeFilter, user])

  async function checkAuth() {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      console.log("Current user:", currentUser?.email)
      
      if (!currentUser) {
        console.log("No user, redirecting to login")
        window.location.href = "/login"
        return
      }

      setUser(currentUser)

      // Lista de emails admin
      const adminEmails = ["johnnyhelder@gmail.com", "admin@rioporto.com"]
      const userIsAdmin = adminEmails.includes(currentUser.email || "")
      
      console.log("Is admin:", userIsAdmin)
      setIsAdmin(userIsAdmin)
      
      if (!userIsAdmin) {
        console.log("Not admin, showing access denied")
      }
    } catch (error) {
      console.error("Auth check error:", error)
    } finally {
      setCheckingAuth(false)
    }
  }

  async function loadComments() {
    setLoading(true)
    try {
      let query = supabase
        .from('comments')
        .select(`
          *,
          user:profiles!comments_user_id_fkey(name, email),
          post:blog_posts!comments_post_id_fkey(title, slug)
        `)
        .order('created_at', { ascending: false })

      if (activeFilter === 'pending') {
        query = query.eq('approved', false)
      } else if (activeFilter === 'approved') {
        query = query.eq('approved', true)
      }

      const { data, error } = await query

      if (error) {
        console.error("Load comments error:", error)
        throw error
      }

      setComments(data || [])
    } catch (error) {
      console.error('Erro ao carregar comentários:', error)
      toast({
        title: "Erro ao carregar comentários",
        description: "Não foi possível carregar os comentários.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(commentId: string) {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ approved: true })
        .eq('id', commentId)

      if (error) throw error

      toast({
        title: "Comentário aprovado!",
        description: "O comentário foi aprovado com sucesso.",
      })

      loadComments()
    } catch (error) {
      console.error('Erro ao aprovar comentário:', error)
      toast({
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar o comentário.",
        variant: "destructive"
      })
    }
  }

  async function handleReject(commentId: string) {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ approved: false })
        .eq('id', commentId)

      if (error) throw error

      toast({
        title: "Comentário rejeitado",
        description: "O comentário foi marcado como não aprovado.",
      })

      loadComments()
    } catch (error) {
      console.error('Erro ao rejeitar comentário:', error)
      toast({
        title: "Erro ao rejeitar",
        description: "Não foi possível rejeitar o comentário.",
        variant: "destructive"
      })
    }
  }

  async function handleDelete(commentId: string) {
    if (!confirm("Tem certeza que deseja excluir este comentário?")) {
      return
    }

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error

      toast({
        title: "Comentário excluído",
        description: "O comentário foi excluído permanentemente.",
      })

      loadComments()
    } catch (error) {
      console.error('Erro ao excluir comentário:', error)
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o comentário.",
        variant: "destructive"
      })
    }
  }

  // Checking auth
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="container max-w-2xl py-16">
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <ShieldAlert className="h-6 w-6" />
              <CardTitle>Acesso Negado</CardTitle>
            </div>
            <CardDescription>
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Esta área é restrita apenas para administradores do sistema.
              </AlertDescription>
            </Alert>
            
            <div className="pt-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Usuário atual: <strong>{user?.email}</strong>
              </p>
              <div className="flex gap-3">
                <Button asChild variant="outline">
                  <Link href="/dashboard">Voltar ao Dashboard</Link>
                </Button>
                <Button asChild>
                  <Link href="/">Ir para Home</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const pendingCount = comments.filter(c => !c.approved).length
  const approvedCount = comments.filter(c => c.approved).length

  function renderComment(comment: Comment) {
    return (
      <Card key={comment.id} className="mb-4">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{comment.user?.name || "Anônimo"}</span>
                <span className="text-sm text-muted-foreground">({comment.user?.email})</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {format(new Date(comment.created_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`/blog/${comment.post?.slug}`} 
                  target="_blank"
                  className="text-sm text-primary hover:underline"
                >
                  {comment.post?.title}
                </a>
              </div>
            </div>
            <Badge variant={comment.approved ? "success" : "secondary"}>
              {comment.approved ? "Aprovado" : "Pendente"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4 whitespace-pre-wrap">{comment.content}</p>
          
          <div className="flex gap-2">
            {!comment.approved && (
              <Button
                size="sm"
                onClick={() => handleApprove(comment.id)}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Aprovar
              </Button>
            )}
            
            {comment.approved && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleReject(comment.id)}
                className="gap-2"
              >
                <EyeOff className="h-4 w-4" />
                Desaprovar
              </Button>
            )}
            
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(comment.id)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              asChild
            >
              <a href={`/blog/${comment.post?.slug}#comments`} target="_blank" className="gap-2">
                <Eye className="h-4 w-4" />
                Ver no Blog
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Moderar Comentários</h1>
        <p className="text-muted-foreground">
          Aprove ou rejeite comentários do blog
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Comentários
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aprovados
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={activeFilter === 'pending' ? 'default' : 'outline'}
          onClick={() => setActiveFilter('pending')}
          className="gap-2"
        >
          <Clock className="h-4 w-4" />
          Pendentes ({pendingCount})
        </Button>
        <Button
          variant={activeFilter === 'approved' ? 'default' : 'outline'}
          onClick={() => setActiveFilter('approved')}
          className="gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Aprovados ({approvedCount})
        </Button>
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setActiveFilter('all')}
          className="gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Todos
        </Button>
      </div>

      {/* Lista de comentários */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {activeFilter === 'pending' 
                ? 'Nenhum comentário pendente'
                : activeFilter === 'approved'
                ? 'Nenhum comentário aprovado'
                : 'Nenhum comentário encontrado'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div>
          {comments.map(comment => renderComment(comment))}
        </div>
      )}
    </div>
  )
}

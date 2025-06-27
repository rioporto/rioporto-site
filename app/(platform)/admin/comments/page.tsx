"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
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
  ShieldAlert,
  Search,
  Filter,
  TrendingUp,
  RefreshCw,
  Ban
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

interface Comment {
  id: string
  content: string
  status: 'pending' | 'approved' | 'rejected' | 'spam'
  created_at: string
  post_slug: string
  user_id: string | null
  author_name: string | null
  author_email: string | null
  user?: {
    email: string
  }
  post?: {
    title: string
    slug: string
  }
}

interface CommentStats {
  total: number
  pending: number
  approved: number
  rejected: number
  spam: number
  todayComments: number
  weekComments: number
}

export default function AdminCommentsPage() {
  const [user, setUser] = useState<any>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [filteredComments, setFilteredComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'spam'>('pending')
  const [searchTerm, setSearchTerm] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [stats, setStats] = useState<CommentStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    spam: 0,
    todayComments: 0,
    weekComments: 0
  })
  const [selectedComments, setSelectedComments] = useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAdmin && user) {
      loadComments()
    }
  }, [isAdmin, user])

  useEffect(() => {
    filterComments()
  }, [comments, activeFilter, searchTerm])

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
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Load comments error:", error)
        throw error
      }

      setComments(data || [])
      calculateStats(data || [])
    } catch (error) {
      console.error('Erro ao carregar comentários:', error)
      toast({
        title: "Erro ao carregar comentários",
        description: "Não foi possível carregar os comentários.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  function calculateStats(commentsData: Comment[]) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const stats: CommentStats = {
      total: commentsData.length,
      pending: commentsData.filter(c => c.status === 'pending').length,
      approved: commentsData.filter(c => c.status === 'approved').length,
      rejected: commentsData.filter(c => c.status === 'rejected').length,
      spam: commentsData.filter(c => c.status === 'spam').length,
      todayComments: commentsData.filter(c => new Date(c.created_at) >= today).length,
      weekComments: commentsData.filter(c => new Date(c.created_at) >= weekAgo).length
    }

    setStats(stats)
  }

  function filterComments() {
    let filtered = [...comments]

    // Filtro por status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(c => c.status === activeFilter)
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.author_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.post_slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredComments(filtered)
  }

  async function handleRefresh() {
    setIsRefreshing(true)
    await loadComments()
    toast({
      title: "Comentários atualizados",
      description: "A lista foi atualizada com sucesso.",
    })
  }

  async function handleApprove(commentId: string) {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ status: 'approved', published_at: new Date().toISOString() })
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
        .from('blog_comments')
        .update({ status: 'rejected' })
        .eq('id', commentId)

      if (error) throw error

      toast({
        title: "Comentário rejeitado",
        description: "O comentário foi marcado como rejeitado.",
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

  async function handleMarkAsSpam(commentId: string) {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ status: 'spam' })
        .eq('id', commentId)

      if (error) throw error

      toast({
        title: "Marcado como spam",
        description: "O comentário foi marcado como spam.",
      })

      loadComments()
    } catch (error) {
      console.error('Erro ao marcar como spam:', error)
      toast({
        title: "Erro ao marcar como spam",
        description: "Não foi possível marcar o comentário como spam.",
        variant: "destructive"
      })
    }
  }

  async function handleDelete(commentId: string) {
    if (!confirm("Tem certeza que deseja excluir este comentário permanentemente?")) {
      return
    }

    try {
      const { error } = await supabase
        .from('blog_comments')
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

  async function handleBulkAction(action: 'approve' | 'reject' | 'spam' | 'delete') {
    if (selectedComments.length === 0) {
      toast({
        title: "Nenhum comentário selecionado",
        description: "Selecione pelo menos um comentário para executar a ação.",
        variant: "destructive"
      })
      return
    }

    const confirmMessage = action === 'delete' 
      ? `Tem certeza que deseja excluir ${selectedComments.length} comentário(s)?`
      : `Tem certeza que deseja ${action === 'approve' ? 'aprovar' : action === 'reject' ? 'rejeitar' : 'marcar como spam'} ${selectedComments.length} comentário(s)?`

    if (!confirm(confirmMessage)) return

    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('blog_comments')
          .delete()
          .in('id', selectedComments)

        if (error) throw error
      } else {
        const updateData: any = { status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'spam' }
        if (action === 'approve') {
          updateData.published_at = new Date().toISOString()
        }

        const { error } = await supabase
          .from('blog_comments')
          .update(updateData)
          .in('id', selectedComments)

        if (error) throw error
      }

      toast({
        title: "Ação em lote concluída",
        description: `${selectedComments.length} comentário(s) foram ${action === 'approve' ? 'aprovados' : action === 'reject' ? 'rejeitados' : action === 'spam' ? 'marcados como spam' : 'excluídos'}.`,
      })

      setSelectedComments([])
      loadComments()
    } catch (error) {
      console.error('Erro na ação em lote:', error)
      toast({
        title: "Erro na ação em lote",
        description: "Não foi possível executar a ação em lote.",
        variant: "destructive"
      })
    }
  }

  function toggleSelectComment(commentId: string) {
    setSelectedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    )
  }

  function selectAllComments() {
    if (selectedComments.length === filteredComments.length) {
      setSelectedComments([])
    } else {
      setSelectedComments(filteredComments.map(c => c.id))
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

  function renderComment(comment: Comment) {
    const isSelected = selectedComments.includes(comment.id)
    
    return (
      <Card key={comment.id} className={`mb-4 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelectComment(comment.id)}
                className="mt-1"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{comment.author_name || comment.user?.email?.split('@')[0] || "Anônimo"}</span>
                  <span className="text-sm text-muted-foreground">({comment.author_email || comment.user?.email})</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(comment.created_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Post: {comment.post_slug}
                  </span>
                </div>
              </div>
            </div>
            <Badge 
              variant={
                comment.status === 'approved' ? "default" : 
                comment.status === 'rejected' ? "destructive" : 
                comment.status === 'spam' ? "outline" :
                "secondary"
              } 
              className={
                comment.status === 'approved' ? "bg-green-600 hover:bg-green-700" : 
                comment.status === 'spam' ? "bg-orange-600 hover:bg-orange-700" :
                ""
              }
            >
              {comment.status === 'approved' ? "Aprovado" : 
               comment.status === 'rejected' ? "Rejeitado" : 
               comment.status === 'spam' ? "Spam" :
               "Pendente"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4 whitespace-pre-wrap">{comment.content}</p>
          
          <div className="flex gap-2 flex-wrap">
            {comment.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleApprove(comment.id)}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Aprovar
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleReject(comment.id)}
                  className="gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Rejeitar
                </Button>
              </>
            )}
            
            {comment.status === 'approved' && (
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
            
            {comment.status !== 'spam' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMarkAsSpam(comment.id)}
                className="gap-2"
              >
                <Ban className="h-4 w-4" />
                Spam
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
              <a href={`/blog/${comment.post_slug}#comments`} target="_blank" className="gap-2">
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
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Moderar Comentários</h1>
          <p className="text-muted-foreground">
            Gerencie todos os comentários do blog
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Comentários
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.todayComments} hoje
            </p>
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
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando revisão
            </p>
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
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">
              {stats.rejected} rejeitados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Atividade Semanal
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.weekComments}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 7 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de ferramentas */}
      <div className="mb-6 space-y-4">
        {/* Busca */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por conteúdo, autor, email ou post..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {selectedComments.length > 0 && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('approve')}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Aprovar ({selectedComments.length})
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('reject')}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Rejeitar ({selectedComments.length})
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('spam')}
                className="gap-2"
              >
                <Ban className="h-4 w-4" />
                Spam ({selectedComments.length})
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleBulkAction('delete')}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Excluir ({selectedComments.length})
              </Button>
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('all')}
            size="sm"
          >
            Todos ({stats.total})
          </Button>
          <Button
            variant={activeFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('pending')}
            size="sm"
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            Pendentes ({stats.pending})
          </Button>
          <Button
            variant={activeFilter === 'approved' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('approved')}
            size="sm"
            className="gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Aprovados ({stats.approved})
          </Button>
          <Button
            variant={activeFilter === 'rejected' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('rejected')}
            size="sm"
            className="gap-2"
          >
            <XCircle className="h-4 w-4" />
            Rejeitados ({stats.rejected})
          </Button>
          <Button
            variant={activeFilter === 'spam' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('spam')}
            size="sm"
            className="gap-2"
          >
            <Ban className="h-4 w-4" />
            Spam ({stats.spam})
          </Button>
        </div>
      </div>

      {/* Seleção em massa */}
      {filteredComments.length > 0 && (
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={selectedComments.length === filteredComments.length}
              onChange={selectAllComments}
            />
            Selecionar todos ({filteredComments.length})
          </label>
        </div>
      )}

      {/* Lista de comentários */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredComments.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Nenhum comentário encontrado com os filtros aplicados'
                : activeFilter === 'pending' 
                ? 'Nenhum comentário pendente'
                : activeFilter === 'approved'
                ? 'Nenhum comentário aprovado'
                : activeFilter === 'rejected'
                ? 'Nenhum comentário rejeitado'
                : activeFilter === 'spam'
                ? 'Nenhum comentário marcado como spam'
                : 'Nenhum comentário encontrado'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div>
          {filteredComments.map(comment => renderComment(comment))}
        </div>
      )}
    </div>
  )
}
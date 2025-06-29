'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Eye,
  BookOpen,
  Clock,
  Users,
  DollarSign,
  Settings,
  Copy,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Course {
  id: string
  slug: string
  title: string
  short_description: string
  price: number
  is_free: boolean
  is_featured: boolean
  is_published: boolean
  duration_minutes: number
  level: string
  created_at: string
  updated_at: string
  _count?: {
    enrollments: number
    modules: number
  }
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadCourses()
    loadStats()
  }, [])

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_enrollments (count),
          course_modules (count)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Processar dados para incluir contagens
      const processedCourses = data?.map(course => ({
        ...course,
        _count: {
          enrollments: course.course_enrollments?.[0]?.count || 0,
          modules: course.course_modules?.[0]?.count || 0
        }
      }))

      setCourses(processedCourses || [])
    } catch (error) {
      console.error('Erro ao carregar cursos:', error)
      toast.error('Erro ao carregar cursos')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // Buscar estatísticas
      const { data: coursesData } = await supabase
        .from('courses')
        .select('id, price, is_published')

      const { data: enrollmentsData } = await supabase
        .from('course_enrollments')
        .select('id')

      if (coursesData && enrollmentsData) {
        const publishedCourses = coursesData.filter(c => c.is_published).length
        const totalRevenue = coursesData.reduce((sum, c) => sum + (c.price || 0), 0)

        setStats({
          totalCourses: coursesData.length,
          publishedCourses,
          totalEnrollments: enrollmentsData.length,
          totalRevenue
        })
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const togglePublish = async (course: Course) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: !course.is_published })
        .eq('id', course.id)

      if (error) throw error

      toast.success(course.is_published ? 'Curso despublicado' : 'Curso publicado!')
      loadCourses()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      toast.error('Erro ao alterar status do curso')
    }
  }

  const duplicateCourse = async (course: Course) => {
    try {
      const newSlug = `${course.slug}-copy-${Date.now()}`
      const { error } = await supabase
        .from('courses')
        .insert({
          ...course,
          id: undefined,
          slug: newSlug,
          title: `${course.title} (Cópia)`,
          is_published: false,
          created_at: undefined,
          updated_at: undefined
        })

      if (error) throw error

      toast.success('Curso duplicado com sucesso!')
      loadCourses()
    } catch (error) {
      console.error('Erro ao duplicar curso:', error)
      toast.error('Erro ao duplicar curso')
    }
  }

  const deleteCourse = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Curso excluído com sucesso')
      loadCourses()
    } catch (error) {
      console.error('Erro ao excluir curso:', error)
      toast.error('Erro ao excluir curso')
    }
  }

  const getLevelBadge = (level: string) => {
    const variants = {
      beginner: 'default',
      intermediate: 'secondary',
      advanced: 'destructive'
    } as const

    const labels = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado'
    }

    return (
      <Badge variant={variants[level as keyof typeof variants] || 'default'}>
        {labels[level as keyof typeof labels] || level}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Carregando cursos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Cursos</h1>
          <p className="text-muted-foreground">
            Crie e gerencie seus cursos online
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Curso
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Publicados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cursos</CardTitle>
          <CardDescription>
            Gerencie todos os cursos da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum curso criado</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando seu primeiro curso
              </p>
              <Button asChild>
                <Link href="/admin/courses/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Curso
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Alunos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {course.short_description}
                        </p>
                        <div className="flex gap-2 mt-1">
                          {course.is_featured && (
                            <Badge variant="secondary" className="text-xs">
                              Destaque
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {course.duration_minutes} min
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getLevelBadge(course.level)}</TableCell>
                    <TableCell>
                      {course.is_free ? (
                        <Badge variant="outline">Grátis</Badge>
                      ) : (
                        `R$ ${course.price.toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>{course._count?.enrollments || 0}</TableCell>
                    <TableCell>
                      {course.is_published ? (
                        <Badge className="bg-green-500">Publicado</Badge>
                      ) : (
                        <Badge variant="secondary">Rascunho</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(course.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${course.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${course.id}/modules`}>
                              <Settings className="mr-2 h-4 w-4" />
                              Gerenciar Módulos
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/courses/${course.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => togglePublish(course)}>
                            {course.is_published ? (
                              <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Despublicar
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Publicar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicateCourse(course)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteCourse(course.id)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
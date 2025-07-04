import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Award, Play, CheckCircle, Users, Star, Lock } from "lucide-react"
import Link from "next/link"
import { createClient } from '@/lib/supabase/server'

async function getCourses() {
  const supabase = createClient()
  
  const { data: courses, error } = await supabase
    .from('courses')
    .select(`
      *,
      course_enrollments (count),
      course_modules (
        id,
        course_lessons (count)
      )
    `)
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar cursos:', error)
    return []
  }

  // Processar dados para incluir contagens
  return courses?.map(course => ({
    ...course,
    totalLessons: course.course_modules?.reduce((sum: number, module: any) => 
      sum + (module.course_lessons?.[0]?.count || 0), 0
    ) || 0,
    totalStudents: course.course_enrollments?.[0]?.count || 0
  })) || []
}

export default async function CursosPage() {
  const courses = await getCourses()
  
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Aprenda Bitcoin e Criptomoedas
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Educação de qualidade para você dominar o mundo das criptomoedas com segurança e confiança
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Conteúdo Exclusivo</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span>Certificado Digital</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Acesso Vitalício</span>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Nenhum curso disponível no momento</h2>
              <p className="text-muted-foreground mb-8">
                Estamos preparando conteúdos incríveis para você. Volte em breve!
              </p>
              <Button size="lg" asChild>
                <Link href="/minicurso-gratis">
                  Enquanto isso, acesse nosso Curso Grátis P2P
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Cursos do banco de dados */}
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative">
                    {course.thumbnail_url ? (
                      <img 
                        src={course.thumbnail_url} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-16 w-16 text-primary/50" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex gap-2">
                      {course.is_featured && (
                        <Badge className="bg-yellow-500">DESTAQUE</Badge>
                      )}
                      {course.is_free ? (
                        <Badge className="bg-green-500">GRÁTIS</Badge>
                      ) : (
                        <Badge variant="secondary">R$ {course.price}</Badge>
                      )}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>
                      {course.short_description || course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration_minutes} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.totalStudents} alunos</span>
                        </div>
                        {course.totalLessons > 0 && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{course.totalLessons} aulas</span>
                          </div>
                        )}
                      </div>
                      
                      {course.what_you_learn && course.what_you_learn.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">O que você vai aprender:</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {course.what_you_learn.slice(0, 3).map((item: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                            {course.what_you_learn.length > 3 && (
                              <li className="text-xs text-muted-foreground ml-6">
                                +{course.what_you_learn.length - 3} mais...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full" 
                        asChild
                      >
                        <Link href={course.slug === 'manual-p2p' ? '/minicurso-gratis' : `/courses/${course.slug}`}>
                          {course.is_free ? 'Acessar Gratuitamente' : 'Ver Detalhes'}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Comece sua Jornada no Mundo das Criptomoedas
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Nossos cursos são desenvolvidos por especialistas para garantir que você aprenda de forma prática e segura
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/cotacao">Fazer Primeira Compra</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contato">Falar com Especialista</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
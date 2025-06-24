"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Shield, 
  BookOpen, 
  TrendingUp, 
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, profile } = useAuth()

  const getKycStatusIcon = () => {
    switch (profile?.kyc_status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const getKycStatusText = () => {
    switch (profile?.kyc_status) {
      case 'approved':
        return 'Verificado'
      case 'rejected':
        return 'Rejeitado'
      default:
        return 'Pendente'
    }
  }

  const getUserLevelText = () => {
    switch (profile?.level) {
      case '3':
        return 'Premium'
      case '2':
        return 'Intermediário'
      default:
        return 'Básico'
    }
  }

  const getUserLevelLimit = () => {
    switch (profile?.level) {
      case '3':
        return 'R$ 50.000'
      case '2':
        return 'R$ 50.000'
      default:
        return 'R$ 4.999'
    }
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header do Dashboard */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Olá, {profile?.name || 'Usuário'}!</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel de controle
          </p>
        </div>
        <Button asChild>
          <Link href="/cotacao">
            Nova Cotação <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Cards de Status */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Status KYC */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Verificação KYC
            </CardTitle>
            <CardDescription>Status da sua verificação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getKycStatusIcon()}
                <span className="font-medium">{getKycStatusText()}</span>
              </div>
              {profile?.kyc_status === 'pending' && (
                <Button size="sm" variant="outline" asChild>
                  <Link href="/kyc">Completar</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Nível da Conta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Nível da Conta
            </CardTitle>
            <CardDescription>Seu limite de transação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{getUserLevelText()}</span>
                <Badge variant={profile?.level === '3' ? "default" : "secondary"}>
                  Nível {profile?.level || '1'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Limite: até {getUserLevelLimit()} por transação
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cursos Disponíveis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Cursos
            </CardTitle>
            <CardDescription>Acesso aos cursos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">
                {profile?.level === '3' ? 'Todos' : 'Gratuitos'}
              </p>
              <Button size="sm" variant="outline" asChild className="w-full">
                <Link href="/cursos">Acessar Cursos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" asChild className="justify-start">
              <Link href="/cotacao">
                <TrendingUp className="mr-2 h-4 w-4" />
                Nova Cotação
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/transacoes">
                <Clock className="mr-2 h-4 w-4" />
                Histórico
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/perfil">
                <User className="mr-2 h-4 w-4" />
                Meu Perfil
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/cursos">
                <BookOpen className="mr-2 h-4 w-4" />
                Cursos
              </Link>
            </Button>
            {/* Botão Admin - apenas para administradores */}
            {(user?.email === "johnnyhelder@gmail.com" || user?.email === "admin@rioporto.com") && (
              <Button variant="outline" asChild className="justify-start">
                <Link href="/admin/comments">
                  <Shield className="mr-2 h-4 w-4" />
                  Moderar Comentários
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações da Conta */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
              <dd className="text-sm">{profile?.email || user?.email}</dd>
            </div>
            {profile?.phone && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">WhatsApp</dt>
                <dd className="text-sm">{profile.phone}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Membro desde</dt>
              <dd className="text-sm">
                {profile?.created_at 
                  ? new Date(profile.created_at).toLocaleDateString('pt-BR')
                  : 'Hoje'
                }
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

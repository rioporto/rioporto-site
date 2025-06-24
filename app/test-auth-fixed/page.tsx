"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function TestAuthFixed() {
  const { user, profile, session, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Testando AuthContext</CardTitle>
            <CardDescription>Verificando estado de autenticação...</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-muted-foreground">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Teste do AuthContext - CORRIGIDO</CardTitle>
          <CardDescription>
            Esta página testa se o AuthContext está funcionando corretamente após as correções
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Loading State */}
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium">Loading State:</span>
            <span className="text-muted-foreground">
              {loading ? "Carregando..." : "Carregamento completo ✓"}
            </span>
          </div>

          {/* User State */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {user ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">Usuário:</span>
              <span className="text-muted-foreground">
                {user ? user.email : "Não autenticado"}
              </span>
            </div>
            {user && (
              <div className="ml-8 text-sm text-muted-foreground">
                ID: {user.id}
              </div>
            )}
          </div>

          {/* Session State */}
          <div className="flex items-center gap-3">
            {session ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span className="font-medium">Sessão:</span>
            <span className="text-muted-foreground">
              {session ? "Ativa" : "Sem sessão"}
            </span>
          </div>

          {/* Profile State */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {profile ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
              <span className="font-medium">Perfil:</span>
              <span className="text-muted-foreground">
                {profile ? "Carregado" : "Não carregado (opcional)"}
              </span>
            </div>
            {profile && (
              <div className="ml-8 text-sm text-muted-foreground space-y-1">
                <div>Nome: {profile.name || "Não definido"}</div>
                <div>Telefone: {profile.phone || "Não definido"}</div>
                <div>Nível: {profile.level || "Não definido"}</div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Resumo:</h3>
            <div className="text-sm space-y-1">
              <p className="text-green-600">✓ AuthContext carregou corretamente</p>
              <p className="text-green-600">✓ Loading state funcionando</p>
              {user ? (
                <p className="text-green-600">✓ Usuário autenticado</p>
              ) : (
                <p className="text-yellow-600">⚠ Usuário não autenticado</p>
              )}
              {!profile && user && (
                <p className="text-yellow-600">⚠ Perfil não carregado (mas isso é OK)</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {user ? (
              <>
                <Button onClick={() => signOut()}>
                  Fazer Logout
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard">
                    Ir para Dashboard
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin-comments-fixed">
                    Admin Comentários
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link href="/login">
                    Fazer Login
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/cadastro">
                    Criar Conta
                  </Link>
                </Button>
              </>
            )}
            <Button asChild variant="ghost">
              <Link href="/">
                Voltar para Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

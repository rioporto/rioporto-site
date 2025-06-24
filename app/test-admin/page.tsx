"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function TestAdminPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [tests, setTests] = useState({
    auth: { status: 'pending', message: '' },
    admin: { status: 'pending', message: '' },
    comments: { status: 'pending', message: '' },
    database: { status: 'pending', message: '' }
  })

  useEffect(() => {
    runTests()
  }, [])

  async function runTests() {
    const supabase = createClient()
    
    // Test 1: Verificar autenticação
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      
      if (user) {
        setUser(user)
        updateTest('auth', 'success', `Autenticado como: ${user.email}`)
      } else {
        updateTest('auth', 'error', 'Não autenticado')
      }
    } catch (error: any) {
      updateTest('auth', 'error', `Erro: ${error.message}`)
    }

    // Test 2: Verificar se é admin
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const adminEmails = ["johnnyhelder@gmail.com", "admin@rioporto.com"]
      
      if (user && adminEmails.includes(user.email || "")) {
        updateTest('admin', 'success', 'Usuário é administrador')
      } else {
        updateTest('admin', 'warning', `Usuário não é admin. Email: ${user?.email || 'N/A'}`)
      }
    } catch (error: any) {
      updateTest('admin', 'error', `Erro: ${error.message}`)
    }

    // Test 3: Verificar acesso a comentários
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('count')
        .limit(1)
      
      if (error) throw error
      updateTest('comments', 'success', 'Acesso à tabela de comentários OK')
    } catch (error: any) {
      updateTest('comments', 'error', `Erro ao acessar comentários: ${error.message}`)
    }

    // Test 4: Verificar conexão com banco
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
      
      if (error) throw error
      updateTest('database', 'success', 'Conexão com banco de dados OK')
    } catch (error: any) {
      updateTest('database', 'error', `Erro de conexão: ${error.message}`)
    }

    setLoading(false)
  }

  function updateTest(test: string, status: string, message: string) {
    setTests(prev => ({
      ...prev,
      [test]: { status, message }
    }))
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default:
        return <Loader2 className="h-5 w-5 animate-spin" />
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      case 'warning':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico do Sistema Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Geral */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Esta página testa todos os componentes necessários para o funcionamento do admin.
            </AlertDescription>
          </Alert>

          {/* Testes */}
          <div className="space-y-4">
            <div className="grid gap-4">
              {/* Teste de Autenticação */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(tests.auth.status)}
                  <div>
                    <p className="font-medium">Autenticação</p>
                    <p className={`text-sm ${getStatusColor(tests.auth.status)}`}>
                      {tests.auth.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Teste de Admin */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(tests.admin.status)}
                  <div>
                    <p className="font-medium">Permissões de Admin</p>
                    <p className={`text-sm ${getStatusColor(tests.admin.status)}`}>
                      {tests.admin.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Teste de Comentários */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(tests.comments.status)}
                  <div>
                    <p className="font-medium">Acesso a Comentários</p>
                    <p className={`text-sm ${getStatusColor(tests.comments.status)}`}>
                      {tests.comments.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Teste de Banco de Dados */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(tests.database.status)}
                  <div>
                    <p className="font-medium">Conexão com Banco</p>
                    <p className={`text-sm ${getStatusColor(tests.database.status)}`}>
                      {tests.database.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Usuário */}
          {user && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Informações do Usuário</h3>
              <dl className="space-y-1 text-sm">
                <div>
                  <dt className="inline font-medium">Email:</dt>
                  <dd className="inline ml-2">{user.email}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">ID:</dt>
                  <dd className="inline ml-2 font-mono text-xs">{user.id}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Última conexão:</dt>
                  <dd className="inline ml-2">{new Date(user.last_sign_in_at).toLocaleString('pt-BR')}</dd>
                </div>
              </dl>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3 pt-4">
            <Button onClick={() => window.location.reload()}>
              Executar Testes Novamente
            </Button>
            
            {user && tests.admin.status === 'success' && (
              <Button 
                variant="default"
                onClick={() => window.location.href = '/admin/comments'}
              >
                Ir para Admin de Comentários
              </Button>
            )}
            
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/dashboard'}
            >
              Voltar ao Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

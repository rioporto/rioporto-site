"use client"

import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export default function DebugAuthPage() {
  const { user, profile, session, loading, signOut } = useAuth()
  const [localStorageData, setLocalStorageData] = useState<Record<string, string>>({})
  const [supabaseSession, setSupabaseSession] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    // Verificar localStorage
    const storage: Record<string, string> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.includes('supabase') || key.includes('auth'))) {
        storage[key] = localStorage.getItem(key) || ''
      }
    }
    setLocalStorageData(storage)

    // Verificar sessão diretamente no Supabase
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    setSupabaseSession(session)
    addLog(`Sessão Supabase: ${session ? 'Ativa' : 'Nenhuma'}`)
  }

  const handleManualSignOut = async () => {
    addLog('Iniciando logout manual...')
    
    try {
      const supabase = createClient()
      
      // 1. Fazer signOut no Supabase
      addLog('Chamando supabase.auth.signOut()...')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        addLog(`Erro no signOut: ${error.message}`)
      } else {
        addLog('SignOut bem-sucedido no Supabase')
      }
      
      // 2. Limpar todo o localStorage
      addLog('Limpando localStorage...')
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
        addLog(`Removido: ${key}`)
      })
      
      // 3. Limpar sessionStorage também
      addLog('Limpando sessionStorage...')
      sessionStorage.clear()
      
      // 4. Aguardar um pouco e recarregar
      addLog('Aguardando 1 segundo...')
      setTimeout(() => {
        addLog('Recarregando página...')
        window.location.href = '/'
      }, 1000)
      
    } catch (error: any) {
      addLog(`Erro geral: ${error.message}`)
    }
  }

  const handleContextSignOut = async () => {
    addLog('Usando signOut do contexto...')
    try {
      await signOut()
    } catch (error: any) {
      addLog(`Erro: ${error.message}`)
    }
  }

  const clearAllStorage = () => {
    addLog('Limpando TUDO do storage...')
    localStorage.clear()
    sessionStorage.clear()
    addLog('Storage limpo! Recarregando...')
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Debug de Autenticação</h1>

      {/* Estado do Contexto */}
      <Card>
        <CardHeader>
          <CardTitle>Estado do Contexto de Auth</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-muted p-4 rounded overflow-auto">
            {JSON.stringify({
              loading,
              user: user ? { id: user.id, email: user.email } : null,
              profile: profile ? { id: profile.id, name: profile.name } : null,
              session: session ? 'Presente' : null
            }, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Sessão Supabase Direta */}
      <Card>
        <CardHeader>
          <CardTitle>Sessão Supabase (Verificação Direta)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-muted p-4 rounded overflow-auto">
            {JSON.stringify(supabaseSession ? {
              user: { id: supabaseSession.user.id, email: supabaseSession.user.email },
              expires_at: supabaseSession.expires_at
            } : null, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* LocalStorage */}
      <Card>
        <CardHeader>
          <CardTitle>LocalStorage (Chaves Supabase/Auth)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-muted p-4 rounded overflow-auto max-h-60">
            {JSON.stringify(localStorageData, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Ações */}
      <Card>
        <CardHeader>
          <CardTitle>Ações de Teste</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button onClick={checkAuthState} variant="outline">
              Recarregar Estado
            </Button>
            <Button onClick={handleContextSignOut} variant="default">
              SignOut via Contexto
            </Button>
            <Button onClick={handleManualSignOut} variant="secondary">
              SignOut Manual Completo
            </Button>
            <Button onClick={clearAllStorage} variant="destructive">
              Limpar TODO Storage
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Logs de Execução</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded font-mono text-xs space-y-1 max-h-60 overflow-auto">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">Nenhum log ainda...</p>
            ) : (
              logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function DebugPage() {
  const { user, profile, session, loading } = useAuth()
  const [supabaseSession, setSupabaseSession] = useState<any>(null)
  const [debugInfo, setDebugInfo] = useState<string>("")

  const checkSupabaseDirectly = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getSession()
    setSupabaseSession(data.session)
    
    if (error) {
      setDebugInfo(`Erro: ${error.message}`)
    } else {
      setDebugInfo("Sessão verificada diretamente no Supabase")
    }
  }

  const forceLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Debug de Autenticação</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estado do Context</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto">
              {JSON.stringify({
                loading,
                user: user ? { id: user.id, email: user.email } : null,
                profile: profile ? { id: profile.id, name: profile.name, email: profile.email } : null,
                session: session ? "Existe" : "Não existe"
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sessão Direta do Supabase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={checkSupabaseDirectly}>
                Verificar Sessão Diretamente
              </Button>
              
              {supabaseSession && (
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto">
                  {JSON.stringify({
                    user: supabaseSession.user ? { 
                      id: supabaseSession.user.id, 
                      email: supabaseSession.user.email 
                    } : null,
                    expires_at: supabaseSession.expires_at
                  }, null, 2)}
                </pre>
              )}
              
              {debugInfo && (
                <p className="text-sm text-muted-foreground">{debugInfo}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações de Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={forceLogout} 
              variant="destructive"
              className="w-full"
            >
              Forçar Logout (Direto no Supabase)
            </Button>
            
            <div className="text-sm text-muted-foreground">
              <p>Esta página ajuda a debugar problemas de autenticação.</p>
              <p>Compare o estado do Context com a sessão direta do Supabase.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
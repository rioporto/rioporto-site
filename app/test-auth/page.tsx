"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TestAuthPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      console.log("User:", user)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const adminEmails = ["johnnyhelder@gmail.com", "admin@rioporto.com"]
  const isAdmin = user && adminEmails.includes(user.email)

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle>Teste de Autenticação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold">Status:</p>
            <p className={user ? "text-green-600" : "text-red-600"}>
              {user ? "✅ Logado" : "❌ Não logado"}
            </p>
          </div>
          
          {user && (
            <>
              <div>
                <p className="font-semibold">Email:</p>
                <p className="font-mono">{user.email}</p>
              </div>
              
              <div>
                <p className="font-semibold">É Admin?</p>
                <p className={isAdmin ? "text-green-600" : "text-red-600"}>
                  {isAdmin ? "✅ SIM - Pode acessar /admin/comments" : "❌ NÃO - Sem acesso admin"}
                </p>
              </div>

              <div>
                <p className="font-semibold">Emails admin configurados:</p>
                <ul className="text-sm text-muted-foreground">
                  {adminEmails.map(email => (
                    <li key={email} className="font-mono">• {email}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
          
          <div className="pt-4 flex flex-col gap-3">
            {!user ? (
              <Button onClick={() => window.location.href = '/login'}>
                Fazer Login
              </Button>
            ) : (
              <>
                <Button onClick={() => window.location.href = '/dashboard'}>
                  Ir para Dashboard
                </Button>
                {isAdmin && (
                  <Button onClick={() => window.location.href = '/admin/comments'} variant="default">
                    Acessar Admin de Comentários
                  </Button>
                )}
                <Button onClick={() => window.location.href = '/logout'} variant="destructive">
                  Fazer Logout
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AdminCommentsDebugPage() {
  const [status, setStatus] = useState("Iniciando...")
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    debugAuth()
  }, [])

  async function debugAuth() {
    try {
      setStatus("Criando cliente Supabase...")
      const supabase = createClient()
      
      setStatus("Verificando usuário...")
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        setError(error)
        setStatus("Erro ao verificar usuário")
        return
      }
      
      if (!user) {
        setStatus("Usuário não está logado")
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
        return
      }
      
      setUser(user)
      setStatus("Usuário verificado com sucesso!")
      
    } catch (err) {
      setError(err)
      setStatus("Erro inesperado")
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Debug - Admin Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold">Status:</p>
            <p className="text-sm">{status}</p>
          </div>
          
          {user && (
            <div>
              <p className="font-semibold">Usuário:</p>
              <p className="text-sm">{user.email}</p>
            </div>
          )}
          
          {error && (
            <div>
              <p className="font-semibold text-red-600">Erro:</p>
              <pre className="text-xs bg-red-50 p-2 rounded">
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="pt-4 flex gap-2">
            <Button onClick={() => window.location.reload()}>
              Recarregar
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
              Voltar ao Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

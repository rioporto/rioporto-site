"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthTestPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container py-8">Carregando...</div>
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
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
                <p>{user.email}</p>
              </div>
              
              <div>
                <p className="font-semibold">ID:</p>
                <p className="text-xs font-mono">{user.id}</p>
              </div>
              
              <div>
                <p className="font-semibold">É Admin?</p>
                <p className={["johnnyhelder@gmail.com", "admin@rioporto.com"].includes(user.email) ? "text-green-600" : "text-red-600"}>
                  {["johnnyhelder@gmail.com", "admin@rioporto.com"].includes(user.email) ? "✅ Sim" : "❌ Não"}
                </p>
              </div>
            </>
          )}
          
          <div className="pt-4 flex gap-3">
            {!user && (
              <Button asChild>
                <Link href="/login">Fazer Login</Link>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/comments">Admin</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

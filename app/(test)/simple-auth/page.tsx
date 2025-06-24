"use client"

import { useSimpleAuth } from "@/contexts/simple-auth-context"

export default function TestWithSimpleAuthPage() {
  const { user, loading } = useSimpleAuth()

  if (loading) {
    return <div>Carregando auth simplificado...</div>
  }

  return (
    <div>
      <h1>Teste com Auth Simplificado</h1>
      <p>Status: {user ? "Logado" : "Não logado"}</p>
      {user && <p>Email: {user.email}</p>}
      <hr />
      <a href="/admin/comments">Tentar Admin Comments</a>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function TestDirectPage() {
  const [status, setStatus] = useState("Carregando...")
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
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
      
      setUser(user)
      setStatus(user ? "Usuário logado" : "Usuário não logado")
      
    } catch (err: any) {
      setError(err)
      setStatus("Erro inesperado")
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Test Direct (Sem Layout)</h1>
      <hr />
      <p><strong>Status:</strong> {status}</p>
      {user && (
        <>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ID:</strong> {user.id}</p>
        </>
      )}
      {error && (
        <div style={{ color: "red" }}>
          <p><strong>Erro:</strong></p>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      <hr />
      <button onClick={() => window.location.reload()}>Recarregar</button>
      {" "}
      <button onClick={() => window.location.href = "/"}>Home</button>
    </div>
  )
}

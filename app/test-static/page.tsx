"use client"

import { useState, useEffect } from "react"

export default function TestStaticPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Montando componente...</div>
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Página Estática (Sem Auth)</h1>
      <p>Esta página não usa nenhum contexto ou autenticação.</p>
      <p>Se você está vendo isso, o problema está no AuthContext.</p>
      <hr />
      <div>
        <h3>Links de Teste:</h3>
        <ul>
          <li><a href="/dashboard">Dashboard (com auth)</a></li>
          <li><a href="/admin/comments">Admin Comments (com auth)</a></li>
          <li><a href="/test-admin">Test Admin (sem layout platform)</a></li>
          <li><a href="/">Home</a></li>
        </ul>
      </div>
    </div>
  )
}

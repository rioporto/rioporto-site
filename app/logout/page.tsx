"use client"

import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  useEffect(() => {
    // Executar logout imediatamente ao montar o componente
    const performLogout = async () => {
      try {
        // 1. Limpar TODO o localStorage e sessionStorage primeiro
        try {
          localStorage.clear()
          sessionStorage.clear()
        } catch (e) {
          console.error('Erro ao limpar storage:', e)
        }

        // 2. Tentar fazer logout no Supabase se possível
        try {
          const { createClient } = await import('@/lib/supabase/client')
          const supabase = createClient()
          await supabase.auth.signOut()
        } catch (e) {
          console.error('Erro ao fazer signOut:', e)
        }

        // 3. Limpar cookies também
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
        })

        // 4. Pequeno delay e forçar redirecionamento
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // 5. Usar replace em vez de href para evitar voltar
        window.location.replace('/')
        
      } catch (error) {
        console.error('Erro geral no logout:', error)
        // Mesmo com erro, forçar redirecionamento
        setTimeout(() => {
          window.location.replace('/')
        }, 500)
      }
    }

    // Chamar a função imediatamente
    performLogout()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-lg text-foreground">Saindo...</p>
        <p className="text-sm text-muted-foreground mt-2">
          Se não for redirecionado, 
          <a href="/" className="underline ml-1">clique aqui</a>
        </p>
      </div>
    </div>
  )
}

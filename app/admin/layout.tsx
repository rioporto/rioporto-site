// app/admin/layout.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          toast.error('Você precisa estar autenticado para acessar esta área')
          router.push('/auth/signin?redirect=/admin/dashboard')
          return
        }

        // Aqui você pode adicionar verificação adicional para checar se é admin
        // Por exemplo, verificar se o usuário tem role 'admin' na tabela profiles
        
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        router.push('/auth/signin?redirect=/admin/dashboard')
      }
    }

    checkAuth()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/auth/signin')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  )
}

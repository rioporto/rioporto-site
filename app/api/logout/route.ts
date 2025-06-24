import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createClient()
    
    // Fazer logout no servidor
    await supabase.auth.signOut()
    
    // Criar resposta com redirecionamento relativo
    const response = NextResponse.redirect(new URL('/', request.url))
    
    // Limpar todos os cookies relacionados ao Supabase
    cookieStore.getAll().forEach((cookie) => {
      if (cookie.name.includes('supabase') || cookie.name.includes('auth')) {
        response.cookies.delete(cookie.name)
      }
    })
    
    // Adicionar headers para prevenir cache
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Erro no logout:', error)
    // Mesmo com erro, redirecionar
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export async function POST(request: Request) {
  return GET(request)
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { post_id, session_id, referrer } = await request.json()

    if (!post_id) {
      return NextResponse.json(
        { error: 'Post ID é obrigatório' },
        { status: 400 }
      )
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Obter informações da requisição
    const userAgent = request.headers.get('user-agent') || null
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               null

    // Registrar visualização
    const { error: analyticsError } = await supabase
      .from('post_analytics')
      .insert({
        post_id,
        user_id: user?.id,
        session_id: session_id || crypto.randomUUID(),
        ip_address: ip,
        user_agent: userAgent,
        referrer: referrer || request.headers.get('referer')
      })

    if (analyticsError) {
      console.error('Erro ao registrar analytics:', analyticsError)
    }

    // Incrementar contador de views
    const { error: viewError } = await supabase
      .rpc('increment_post_views', { post_id_param: post_id })

    if (viewError) {
      console.error('Erro ao incrementar views:', viewError)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro na API de analytics:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const post_id = searchParams.get('post_id')
    const period = searchParams.get('period') || '7d'

    const supabase = createClient()

    // Verificar se usuário é admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar estatísticas
    let query = supabase
      .from('post_analytics')
      .select('*')

    if (post_id) {
      query = query.eq('post_id', post_id)
    }

    // Filtrar por período
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case '24h':
        startDate.setDate(now.getDate() - 1)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
    }

    query = query.gte('created_at', startDate.toISOString())

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao buscar analytics' },
        { status: 500 }
      )
    }

    // Processar dados para estatísticas
    const stats = {
      totalViews: data?.length || 0,
      uniqueVisitors: new Set(data?.map(d => d.session_id)).size,
      averageTimeSpent: data?.reduce((acc, d) => acc + (d.time_spent || 0), 0) / (data?.length || 1),
      topReferrers: getTopReferrers(data || []),
      viewsByDay: getViewsByDay(data || [])
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Erro ao buscar analytics:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

function getTopReferrers(data: any[]) {
  const referrers = data.reduce((acc, d) => {
    if (d.referrer) {
      acc[d.referrer] = (acc[d.referrer] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  return Object.entries(referrers)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([referrer, count]) => ({ referrer, count }))
}

function getViewsByDay(data: any[]) {
  const viewsByDay = data.reduce((acc, d) => {
    const date = new Date(d.created_at).toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(viewsByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }))
}
// app/api/admin/export-quotations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    // Buscar parâmetros de filtro da URL
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    // Construir query
    let query = supabase
      .from('quotations')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Aplicar filtros
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    
    if (type && type !== 'all') {
      query = query.eq('type', type)
    }
    
    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate)
    }
    
    const { data: quotations, error } = await query
    
    if (error) {
      throw error
    }
    
    // Criar CSV
    const headers = [
      'ID',
      'Data',
      'Nome',
      'Email',
      'Telefone',
      'Tipo',
      'Criptomoeda',
      'Quantidade',
      'Valor BRL',
      'Taxa',
      'Total',
      'Status',
      'Wallet',
      'Observações',
      'Contactado em',
      'Completado em'
    ]
    
    const rows = quotations.map(q => [
      q.id,
      format(new Date(q.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }),
      q.nome,
      q.email,
      q.telefone || q.phone_number || '',
      q.type === 'buy' ? 'Compra' : 'Venda',
      q.crypto,
      q.amount,
      q.brl_value.toFixed(2),
      q.fee.toFixed(2),
      q.total.toFixed(2),
      q.status,
      q.wallet || '',
      q.observacoes || '',
      q.contacted_at ? format(new Date(q.contacted_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }) : '',
      q.completed_at ? format(new Date(q.completed_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }) : ''
    ])
    
    // Criar conteúdo CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    // Criar nome do arquivo
    const filename = `cotacoes_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`
    
    // Retornar CSV
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
    
  } catch (error) {
    console.error('Erro ao exportar cotações:', error)
    return NextResponse.json(
      { error: 'Erro ao exportar cotações' },
      { status: 500 }
    )
  }
}

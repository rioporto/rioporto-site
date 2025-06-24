import { NextResponse } from "next/server"
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()
    
    // Verificar usuário autenticado (opcional para cotação)
    const { data: { user } } = await supabase.auth.getUser()
    
    const {
      tipo,
      cryptoName,
      valorBRL,
      valorCripto,
      price,
      wallet,
      observacoes,
      nome,
      email,
      telefone,
    } = body

    // Calcular comissão
    const brlAmount = parseFloat(valorBRL)
    const getCommissionRate = (value: number) => {
      if (value <= 4999) return 0.035
      if (value <= 50000) return 0.025
      if (value <= 100000) return 0.015
      return 0.01
    }
    
    const commissionRate = getCommissionRate(brlAmount)
    const commissionAmount = brlAmount * commissionRate

    // Se o usuário estiver logado, criar transação no banco
    if (user) {
      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: tipo === 'compra' ? 'buy' : 'sell',
          crypto_currency: cryptoName,
          crypto_amount: parseFloat(valorCripto),
          brl_amount: brlAmount,
          exchange_rate: price,
          commission_rate: commissionRate,
          commission_amount: commissionAmount,
          wallet_address: wallet,
          notes: observacoes,
          status: 'pending',
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar transação:', error)
        // Não vamos retornar erro, pois a cotação ainda pode ser processada manualmente
      }
    }

    // Aqui você pode adicionar lógica para:
    // 1. Enviar email para a equipe
    // 2. Criar notificação no sistema
    // 3. Integrar com WhatsApp Business API
    
    // Por enquanto, vamos apenas registrar no console
    console.log('Nova cotação recebida:', {
      tipo,
      cryptoName,
      valorBRL,
      valorCripto,
      nome,
      email,
      telefone,
      userId: user?.id || 'não-autenticado'
    })

    return NextResponse.json({
      success: true,
      message: 'Cotação recebida com sucesso',
    })
  } catch (error) {
    console.error("Erro na API de cotação:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
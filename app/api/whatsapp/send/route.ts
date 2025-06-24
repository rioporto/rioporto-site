// app/api/whatsapp/send/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { whatsappClient } from '@/lib/whatsapp/client'
import { QuotationRequest } from '@/types/whatsapp'
import { handleApiError, ValidationError, AuthenticationError } from '@/lib/errors'
import { z } from 'zod'

// Schema de validação
const sendMessageSchema = z.object({
  to: z.string().min(10).regex(/^\+?[1-9]\d{1,14}$/, 'Número de telefone inválido'),
  message: z.string().min(1).max(4096)
})

const sendQuotationSchema = z.object({
  phoneNumber: z.string().min(10),
  type: z.enum(['buy', 'sell']),
  crypto: z.string().default('BTC'),
  amount: z.number().positive(),
  currency: z.literal('BRL')
})

// Enviar mensagem simples
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new AuthenticationError('Usuário não autenticado')
    }

    // Verificar se é admin (level 3)
    const { data: profile } = await supabase
      .from('profiles')
      .select('level')
      .eq('id', user.id)
      .single()

    if (profile?.level !== '3') {
      throw new AuthenticationError('Apenas administradores podem enviar mensagens')
    }

    // Validar dados
    const body = await request.json()
    const validatedData = sendMessageSchema.parse(body)

    // Enviar mensagem
    const success = await whatsappClient.sendTextMessage(
      validatedData.to,
      validatedData.message
    )

    if (!success) {
      throw new Error('Falha ao enviar mensagem')
    }

    // Registrar no banco
    await supabase.from('whatsapp_messages').insert({
      from: 'system',
      to: validatedData.to,
      message: validatedData.message,
      type: 'outbound',
      status: 'sent',
      user_id: user.id
    })

    return NextResponse.json({ 
      success: true,
      message: 'Mensagem enviada com sucesso'
    })

  } catch (error) {
    return handleApiError(error, request.url)
  }
}

// Enviar cotação
export async function PUT(request: NextRequest) {
  try {
    // Validar dados
    const body = await request.json()
    const validatedData = sendQuotationSchema.parse(body)

    // Enviar cotação
    const response = await whatsappClient.sendQuotation(validatedData)

    // Salvar no banco (opcional - para histórico)
    const supabase = createClient()
    await supabase.from('quotations').insert({
      phone_number: response.phoneNumber,
      type: validatedData.type,
      crypto: response.quotation.crypto,
      amount: response.quotation.amount,
      brl_value: response.quotation.brlValue,
      fee: response.quotation.fee,
      total: response.quotation.total,
      valid_until: response.quotation.validUntil,
      status: response.status
    })

    return NextResponse.json({ 
      success: true,
      quotation: response
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(
        new ValidationError('Dados inválidos', error.flatten().fieldErrors),
        request.url
      )
    }
    return handleApiError(error, request.url)
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, name, categories } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Verificar se email já existe
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 409 }
      )
    }

    // Criar novo inscrito
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        name,
        categories: categories || ['bitcoin'], // Default para Bitcoin
        verification_token: crypto.randomUUID()
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao inscrever:', error)
      return NextResponse.json(
        { error: 'Erro ao processar inscrição' },
        { status: 500 }
      )
    }

    // TODO: Enviar email de confirmação com Resend
    // await sendVerificationEmail(email, data.verification_token)

    return NextResponse.json({
      success: true,
      message: 'Inscrição realizada com sucesso!'
    })

  } catch (error) {
    console.error('Erro na API de newsletter:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Cancelar inscrição usando token
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ subscribed: false })
      .eq('verification_token', token)

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao cancelar inscrição' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Inscrição cancelada com sucesso'
    })

  } catch (error) {
    console.error('Erro ao cancelar inscrição:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
// app/api/whatsapp/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { whatsappConfig } from '@/lib/whatsapp/config'
import { whatsappClient } from '@/lib/whatsapp/client'
import { WhatsAppWebhook, QuotationRequest } from '@/types/whatsapp'
import { logger } from '@/lib/errors'

// Verificação do webhook (para configuração inicial)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    if (mode === 'subscribe' && token === whatsappConfig.verifyToken) {
      logger.info('WhatsApp webhook verified successfully')
      return new NextResponse(challenge, { status: 200 })
    }

    return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
  } catch (error) {
    logger.error('WhatsApp webhook verification error', error as Error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Receber mensagens do WhatsApp
export async function POST(request: NextRequest) {
  try {
    const body: WhatsAppWebhook = await request.json()
    
    // Log para debug
    logger.info('WhatsApp webhook received', { body: JSON.stringify(body) })

    // Processar cada entrada
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        const { value } = change
        
        // Verificar se há mensagens
        if (value.messages && value.messages.length > 0) {
          for (const message of value.messages) {
            // Processar apenas mensagens de texto
            if (message.type === 'text' && message.text) {
              await processMessage(
                message.from,
                message.text.body,
                value.metadata.display_phone_number
              )
            }
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 })
  } catch (error) {
    logger.error('WhatsApp webhook error', error as Error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Processar mensagem recebida
async function processMessage(from: string, text: string, to: string) {
  try {
    const normalizedText = text.toLowerCase().trim()
    
    // Comandos disponíveis
    if (normalizedText === 'oi' || normalizedText === 'olá' || normalizedText === 'ola') {
      await sendWelcomeMessage(from)
      return
    }
    
    if (normalizedText === 'cotação' || normalizedText === 'cotacao') {
      await sendQuotationMenu(from)
      return
    }
    
    if (normalizedText.includes('comprar')) {
      await processQuotationRequest(from, 'buy', normalizedText)
      return
    }
    
    if (normalizedText.includes('vender')) {
      await processQuotationRequest(from, 'sell', normalizedText)
      return
    }
    
    if (normalizedText === 'confirmar') {
      await confirmQuotation(from)
      return
    }
    
    if (normalizedText === 'cancelar') {
      await cancelQuotation(from)
      return
    }
    
    // Mensagem padrão
    await sendDefaultMessage(from)
    
  } catch (error) {
    logger.error('Error processing message', error as Error, { from, text })
  }
}

// Enviar mensagem de boas-vindas
async function sendWelcomeMessage(to: string) {
  const message = `🎉 *Bem-vindo à Rio Porto P2P!* 🎉

Somos especialistas em Bitcoin e criptomoedas.

📋 *Comandos disponíveis:*
• *COTAÇÃO* - Ver cotação atual
• *COMPRAR* - Comprar Bitcoin
• *VENDER* - Vender Bitcoin

Como posso ajudar você hoje?`

  await whatsappClient.sendTextMessage(to, message)
}

// Enviar menu de cotação
async function sendQuotationMenu(to: string) {
  const message = `💰 *COTAÇÃO BITCOIN* 💰

Para receber uma cotação personalizada, envie:

*COMPRAR [valor em BTC]*
Ex: COMPRAR 0.001

*VENDER [valor em BTC]*
Ex: VENDER 0.001

Ou digite o valor em reais:
*COMPRAR R$ 1000*
*VENDER R$ 5000*`

  await whatsappClient.sendTextMessage(to, message)
}

// Processar solicitação de cotação
async function processQuotationRequest(to: string, type: 'buy' | 'sell', text: string) {
  try {
    // Extrair valor do texto (simplificado - melhorar com regex)
    let amount = 0.001 // Valor padrão
    
    const numbers = text.match(/[\d.,]+/g)
    if (numbers && numbers.length > 0) {
      amount = parseFloat(numbers[0].replace(',', '.'))
    }
    
    const request: QuotationRequest = {
      phoneNumber: to,
      type,
      crypto: 'BTC',
      amount,
      currency: 'BRL'
    }
    
    await whatsappClient.sendQuotation(request)
    
  } catch (error) {
    await whatsappClient.sendTextMessage(
      to,
      '❌ Desculpe, não consegui processar sua solicitação. Por favor, tente novamente.'
    )
  }
}

// Confirmar cotação
async function confirmQuotation(to: string) {
  const message = `✅ *Cotação confirmada!*

Vou transferir você para um de nossos especialistas para finalizar a operação.

⏱️ Tempo médio de atendimento: 5 minutos

Aguarde...`

  await whatsappClient.sendTextMessage(to, message)
}

// Cancelar cotação
async function cancelQuotation(to: string) {
  const message = `❌ *Cotação cancelada*

Quando quiser fazer uma nova cotação, é só enviar:
• *COTAÇÃO*
• *COMPRAR*
• *VENDER*

Obrigado! 😊`

  await whatsappClient.sendTextMessage(to, message)
}

// Mensagem padrão
async function sendDefaultMessage(to: string) {
  const message = `🤔 Desculpe, não entendi sua mensagem.

Digite um dos comandos:
• *COTAÇÃO*
• *COMPRAR*
• *VENDER*

Ou envie *OI* para ver o menu completo.`

  await whatsappClient.sendTextMessage(to, message)
}
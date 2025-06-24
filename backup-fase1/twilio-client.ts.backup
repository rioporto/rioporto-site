// lib/whatsapp/twilio-client.ts
// Cliente alternativo usando Twilio (mais fácil de configurar)

import { Twilio } from 'twilio'
import { whatsappConfig } from './config'
import { WhatsAppMessage, QuotationRequest, QuotationResponse } from '@/types/whatsapp'
import { getBitcoinPriceBRL } from '@/lib/api/crypto'

// Configuração do Twilio
const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  authToken: process.env.TWILIO_AUTH_TOKEN || '',
  whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886', // Número sandbox
}

export class TwilioWhatsAppClient {
  private client: Twilio
  
  constructor() {
    this.client = new Twilio(twilioConfig.accountSid, twilioConfig.authToken)
  }
  
  // Enviar mensagem de texto via Twilio
  async sendTextMessage(to: string, message: string): Promise<boolean> {
    try {
      // Formatar número para WhatsApp
      const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to.replace(/\D/g, '')}`
      
      const result = await this.client.messages.create({
        body: message,
        from: twilioConfig.whatsappNumber,
        to: formattedTo
      })
      
      console.log('Mensagem enviada:', result.sid)
      return result.status !== 'failed'
      
    } catch (error) {
      console.error('Erro ao enviar mensagem Twilio:', error)
      return false
    }
  }
  
  // Enviar cotação
  async sendQuotation(request: QuotationRequest): Promise<QuotationResponse> {
    try {
      // Buscar preço atual do Bitcoin
      const bitcoinPrice = await getBitcoinPriceBRL()
      
      // Calcular valores
      const brlValue = request.amount * bitcoinPrice
      const feeRate = whatsappConfig.fees.find(f => brlValue <= f.limit)?.rate || 0.01
      const fee = brlValue * feeRate
      const total = request.type === 'buy' ? brlValue + fee : brlValue - fee
      
      // Criar resposta
      const response: QuotationResponse = {
        id: crypto.randomUUID(),
        phoneNumber: request.phoneNumber,
        quotation: {
          crypto: request.crypto,
          amount: request.amount,
          brlValue,
          fee,
          total,
          validUntil: new Date(Date.now() + 15 * 60 * 1000) // 15 minutos
        },
        status: 'pending'
      }
      
      // Formatar mensagem
      const message = this.formatQuotationMessage(response)
      
      // Enviar mensagem
      await this.sendTextMessage(request.phoneNumber, message)
      
      response.status = 'sent'
      return response
      
    } catch (error) {
      console.error('Erro ao enviar cotação:', error)
      throw error
    }
  }
  
  // Formatar mensagem de cotação
  private formatQuotationMessage(response: QuotationResponse): string {
    const { quotation } = response
    const type = response.phoneNumber.includes('buy') ? 'COMPRA' : 'VENDA'
    
    return `🪙 *COTAÇÃO ${quotation.crypto}* 🪙
    
Tipo: ${type}
Quantidade: ${quotation.amount} ${quotation.crypto}
Valor: R$ ${quotation.brlValue.toFixed(2)}
Taxa: R$ ${quotation.fee.toFixed(2)}
*Total: R$ ${quotation.total.toFixed(2)}*

⏱️ Cotação válida até: ${quotation.validUntil.toLocaleTimeString('pt-BR')}

Para confirmar, responda:
✅ *CONFIRMAR* - Para prosseguir
❌ *CANCELAR* - Para cancelar

_Rio Porto P2P - Sua exchange de confiança_`
  }
}

// Exportar cliente baseado na configuração
export const whatsappClient = process.env.TWILIO_ACCOUNT_SID 
  ? new TwilioWhatsAppClient() 
  : null

// Instruções de uso do Twilio Sandbox
export const TWILIO_SANDBOX_INSTRUCTIONS = `
Para testar com Twilio Sandbox:

1. Envie mensagem no WhatsApp para: +1 415 523 8886
2. Digite: "join <seu-código-sandbox>"
3. Você receberá confirmação
4. Agora pode testar o bot!

Limitações do Sandbox:
- Apenas números pré-registrados
- Mensagens têm prefixo "[Twilio Sandbox]"
- Máximo 3 números de teste
`
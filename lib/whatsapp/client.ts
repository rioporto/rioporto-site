// lib/whatsapp/client.ts

import axios from "axios"
import { whatsappConfig } from "./config"
import { WhatsAppMessage, QuotationRequest, QuotationResponse } from "@/types/whatsapp"
import { getBitcoinPriceBRL } from "@/lib/api/crypto"

export class WhatsAppClient {
  private apiUrl: string
  private headers: Record<string, string>
  
  constructor() {
    this.apiUrl = whatsappConfig.apiUrl
    this.headers = {
      "Authorization": `Bearer ${whatsappConfig.accessToken}`,
      "Content-Type": "application/json"
    }
  }
  
  // Enviar mensagem de texto
  async sendTextMessage(to: string, message: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${whatsappConfig.phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to.replace(/\D/g, ""), // Remove não-números
          type: "text",
          text: { body: message }
        },
        { headers: this.headers }
      )
      
      return response.status === 200
    } catch (error) {
      console.error("Erro ao enviar mensagem WhatsApp:", error)
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
      const total = request.type === "buy" ? brlValue + fee : brlValue - fee
      
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
        status: "pending"
      }
      
      // Formatar mensagem
      const message = this.formatQuotationMessage(response)
      
      // Enviar mensagem
      await this.sendTextMessage(request.phoneNumber, message)
      
      response.status = "sent"
      return response
      
    } catch (error) {
      console.error("Erro ao enviar cotação:", error)
      throw error
    }
  }
  
  // Formatar mensagem de cotação
  private formatQuotationMessage(response: QuotationResponse): string {
    const { quotation } = response
    const type = response.phoneNumber.includes("buy") ? "COMPRA" : "VENDA"
    
    return `🪙 *COTAÇÃO ${quotation.crypto}* 🪙
    
Tipo: ${type}
Quantidade: ${quotation.amount} ${quotation.crypto}
Valor: R$ ${quotation.brlValue.toFixed(2)}
Taxa: R$ ${quotation.fee.toFixed(2)}
*Total: R$ ${quotation.total.toFixed(2)}*

⏱️ Cotação válida até: ${quotation.validUntil.toLocaleTimeString("pt-BR")}

Para confirmar, responda:
✅ *CONFIRMAR* - Para prosseguir
❌ *CANCELAR* - Para cancelar

_Rio Porto P2P - Sua exchange de confiança_`
  }
}

export const whatsappClient = new WhatsAppClient()

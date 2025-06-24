// types/whatsapp.ts

export interface WhatsAppMessage {
  from: string
  to: string
  body: string
  timestamp: Date
  messageId: string
  type: "text" | "image" | "audio" | "document"
}

export interface WhatsAppWebhook {
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        messages?: Array<{
          from: string
          id: string
          timestamp: string
          text?: {
            body: string
          }
          type: string
        }>
      }
    }>
  }>
}

export interface QuotationRequest {
  phoneNumber: string
  type: "buy" | "sell"
  crypto: string
  amount: number
  currency: "BRL"
}

export interface QuotationResponse {
  id: string
  phoneNumber: string
  quotation: {
    crypto: string
    amount: number
    brlValue: number
    fee: number
    total: number
    validUntil: Date
  }
  status: "pending" | "sent" | "expired"
}

// lib/whatsapp/config.ts

export const whatsappConfig = {
  // Número do WhatsApp Business
  businessNumber: process.env.WHATSAPP_BUSINESS_NUMBER || "+552120187776",
  
  // Token de acesso (será configurado no .env)
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
  
  // ID da conta do WhatsApp Business
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
  
  // Webhook verify token
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || "rioporto_verify_token_2025",
  
  // URL da API do WhatsApp
  apiUrl: "https://graph.facebook.com/v18.0",
  
  // Templates de mensagens
  templates: {
    quotation: "cotacao_bitcoin",
    welcome: "boas_vindas",
    confirmation: "confirmacao_pedido"
  },
  
  // Taxas por faixa de valor
  fees: [
    { limit: 4999, rate: 0.035 },
    { limit: 50000, rate: 0.025 },
    { limit: 100000, rate: 0.015 },
    { limit: Infinity, rate: 0.01 }
  ]
}

export function getCommissionRate(value: number): number {
  const tier = whatsappConfig.fees.find(tier => value <= tier.limit)
  return tier?.rate || 0.01
}

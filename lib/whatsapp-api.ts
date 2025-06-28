// lib/whatsapp-api.ts
// Integração com WhatsApp Business API oficial (Cloud API)
// Documentação: https://developers.facebook.com/docs/whatsapp/cloud-api

interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  businessNumber: string;
}

interface SendMessageParams {
  to: string;
  message: string;
  templateName?: string;
  templateParams?: Record<string, string>;
}

interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Configuração da API
const config: WhatsAppConfig = {
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  businessNumber: process.env.WHATSAPP_BUSINESS_NUMBER || '+552120187776'
};

// Função para enviar mensagem de texto simples
export async function sendWhatsAppMessage(params: SendMessageParams): Promise<WhatsAppResponse> {
  try {
    if (!config.accessToken || !config.phoneNumberId) {
      throw new Error('WhatsApp API não configurada corretamente');
    }

    const url = `https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`;

    const body = {
      messaging_product: 'whatsapp',
      to: params.to.replace(/\D/g, ''), // Remove caracteres não numéricos
      type: 'text',
      text: {
        preview_url: false,
        body: params.message
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (response.ok && data.messages?.[0]?.id) {
      return {
        success: true,
        messageId: data.messages[0].id
      };
    } else {
      return {
        success: false,
        error: data.error?.message || 'Erro ao enviar mensagem'
      };
    }
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

// Função para enviar notificação de cotação
export async function notificarCotacaoWhatsApp(dados: {
  tipo: 'compra' | 'venda';
  moeda: string;
  valorBRL: string;
  valorCripto: string;
  nome: string;
  email: string;
  telefone?: string;
  observacoes?: string;
}): Promise<WhatsAppResponse> {
  const mensagem = `🔔 *Nova Cotação Recebida*

📊 *Detalhes da Operação:*
• Tipo: ${dados.tipo.toUpperCase()}
• Moeda: ${dados.moeda}
• Valor R$: ${dados.valorBRL}
• Valor Cripto: ${dados.valorCripto}

👤 *Dados do Cliente:*
• Nome: ${dados.nome}
• Email: ${dados.email}
${dados.telefone ? `• WhatsApp: ${dados.telefone}` : ''}

${dados.observacoes ? `💬 *Observações:*\n${dados.observacoes}` : ''}

⏰ Data/Hora: ${new Date().toLocaleString('pt-BR')}

_Por favor, entre em contato com o cliente o mais breve possível._`;

  return sendWhatsAppMessage({
    to: config.businessNumber,
    message: mensagem
  });
}

// Função para validar número de WhatsApp
export function validarNumeroWhatsApp(numero: string): boolean {
  // Remove espaços, hífens e parênteses
  const numeroLimpo = numero.replace(/\D/g, '');
  
  // Verifica se tem o formato brasileiro (55 + DDD + número)
  // Exemplo: 5521999999999 (13 dígitos) ou 55219999999 (11 dígitos para fixo)
  const regexBrasil = /^55\d{10,11}$/;
  
  // Também aceita sem o código do país
  const regexSemPais = /^\d{10,11}$/;
  
  return regexBrasil.test(numeroLimpo) || regexSemPais.test(numeroLimpo);
}

// Função para formatar número para o padrão da API
export function formatarNumeroWhatsApp(numero: string): string {
  let numeroLimpo = numero.replace(/\D/g, '');
  
  // Se não tem código do país, adiciona 55 (Brasil)
  if (!numeroLimpo.startsWith('55')) {
    numeroLimpo = '55' + numeroLimpo;
  }
  
  return numeroLimpo;
}

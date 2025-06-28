// lib/whatsapp-simple.ts
// Solução simples sem usar WhatsApp Business API
// Apenas abre o WhatsApp com mensagem pré-formatada

interface WhatsAppMessage {
  tipo: 'compra' | 'venda';
  moeda: string;
  valorBRL: string;
  valorCripto: string;
  nome: string;
  email: string;
  telefone?: string;
  observacoes?: string;
}

// Número do WhatsApp da empresa (sem +)
const WHATSAPP_EMPRESA = '552120187776';

/**
 * Gera link direto para WhatsApp com mensagem formatada
 */
export function gerarLinkWhatsApp(dados: WhatsAppMessage): string {
  // Formatar mensagem
  const mensagem = `🔔 *Nova Cotação via Site*

📊 *Detalhes da Operação:*
• Tipo: ${dados.tipo.toUpperCase()}
• Moeda: ${dados.moeda}
• Valor R$: ${dados.valorBRL}
• Valor Cripto: ${dados.valorCripto}

👤 *Meus Dados:*
• Nome: ${dados.nome}
• Email: ${dados.email}
${dados.telefone ? `• WhatsApp: ${dados.telefone}` : ''}

${dados.observacoes ? `💬 *Observações:*\n${dados.observacoes}` : ''}

⏰ Enviado em: ${new Date().toLocaleString('pt-BR')}

_Por favor, entre em contato comigo sobre esta cotação._`;

  // Codificar mensagem para URL
  const mensagemCodificada = encodeURIComponent(mensagem);
  
  // Retornar link do WhatsApp
  return `https://wa.me/${WHATSAPP_EMPRESA}?text=${mensagemCodificada}`;
}

/**
 * Abre WhatsApp em nova aba com mensagem
 */
export function abrirWhatsApp(dados: WhatsAppMessage): void {
  const link = gerarLinkWhatsApp(dados);
  window.open(link, '_blank');
}

/**
 * Gera link simples para contato
 */
export function linkContatoWhatsApp(mensagem?: string): string {
  const texto = mensagem || 'Olá! Gostaria de fazer uma cotação P2P.';
  return `https://wa.me/${WHATSAPP_EMPRESA}?text=${encodeURIComponent(texto)}`;
}

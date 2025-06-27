// lib/zendesk.ts
interface ZendeskUserData {
  name: string;
  email: string;
  whatsapp?: string;
  cotacao?: {
    tipo: 'compra' | 'venda';
    moeda: string;
    valor: number;
    formaPagamento?: string;
  };
}

/**
 * Abre o widget do Zendesk com dados pré-preenchidos
 */
export function openZendeskChat(userData: ZendeskUserData) {
  console.log('Tentando abrir Zendesk com dados:', userData);
  
  if (typeof window === 'undefined' || !window.zE) {
    console.warn('Zendesk widget não está carregado');
    return false;
  }

  try {
    // Identificar o usuário
    window.zE('webWidget', 'identify', {
      name: userData.name,
      email: userData.email,
    });

    // Pré-preencher os campos do formulário
    window.zE('webWidget', 'prefill', {
      name: {
        value: userData.name,
        readOnly: true
      },
      email: {
        value: userData.email,
        readOnly: true
      }
    });

    // Construir mensagem inicial com os dados
    let initialMessage = `Olá! Meu nome é ${userData.name}.\\n`;
    
    if (userData.whatsapp) {
      initialMessage += `WhatsApp: ${userData.whatsapp}\\n`;
    }
    
    if (userData.cotacao) {
      initialMessage += `\\n📊 Cotação solicitada:\\n`;
      initialMessage += `Tipo: ${userData.cotacao.tipo.toUpperCase()}\\n`;
      initialMessage += `Moeda: ${userData.cotacao.moeda}\\n`;
      initialMessage += `Valor: R$ ${userData.cotacao.valor.toLocaleString('pt-BR')}\\n`;
      
      if (userData.cotacao.formaPagamento) {
        initialMessage += `Forma de pagamento: ${userData.cotacao.formaPagamento}\\n`;
      }
    }

    // Definir campos personalizados (se configurados no Zendesk)
    if (userData.whatsapp) {
      window.zE('webWidget', 'updateSettings', {
        webWidget: {
          contactForm: {
            fields: [
              { id: 'whatsapp', prefill: { '*': userData.whatsapp } }
            ]
          }
        }
      });
    }

    // Mostrar o widget
    window.zE('webWidget', 'show');
    console.log('Widget mostrado');
    
    // Abrir o widget
    window.zE('webWidget', 'open');
    console.log('Widget aberto');

    // Se houver mensagem de cotação, adicionar ao campo de mensagem
    if (userData.cotacao) {
      setTimeout(() => {
        // Tentar preencher o campo de mensagem
        const messageField = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
        if (messageField) {
          messageField.value = initialMessage;
          messageField.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, 1000);
    }

    return true;
  } catch (error) {
    console.error('Erro ao abrir Zendesk:', error);
    return false;
  }
}

/**
 * Verifica se o Zendesk está carregado e pronto
 */
export function isZendeskReady(): boolean {
  return typeof window !== 'undefined' && typeof window.zE !== 'undefined';
}

/**
 * Aguarda o Zendesk carregar antes de executar uma ação
 */
export function waitForZendesk(callback: () => void, timeout = 10000) {
  console.log('Aguardando Zendesk carregar...');
  const startTime = Date.now();
  
  const checkInterval = setInterval(() => {
    if (isZendeskReady()) {
      clearInterval(checkInterval);
      console.log('Zendesk carregado após', Date.now() - startTime, 'ms');
      callback();
    } else if (Date.now() - startTime > timeout) {
      clearInterval(checkInterval);
      console.error('Timeout esperando Zendesk carregar');
      // Tentar forçar a abertura mesmo assim
      if (window.zE) {
        console.log('Zendesk encontrado após timeout, tentando abrir...');
        callback();
      } else {
        // Mostrar mensagem alternativa para o usuário
        alert('Não foi possível abrir o chat automaticamente. Por favor, recarregue a página e tente novamente.');
      }
    }
  }, 100);
}

// Declaração global para TypeScript
declare global {
  interface Window {
    zE: any;
    zESettings: any;
  }
}
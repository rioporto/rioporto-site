// lib/zendesk-simple.ts
// Versão simplificada para garantir que funcione

export function abrirZendeskChat(dados?: {
  nome?: string;
  email?: string;
  mensagem?: string;
}) {
  console.log('[Zendesk] Tentando abrir chat...');
  
  // Verificar se o Zendesk existe
  if (typeof window === 'undefined') {
    console.error('[Zendesk] Window não está disponível');
    return false;
  }
  
  // Se não tem zE, tentar algumas vezes
  let tentativas = 0;
  const maxTentativas = 30; // 15 segundos
  
  const tentar = () => {
    tentativas++;
    
    if (window.zE) {
      try {
        console.log('[Zendesk] Widget encontrado! Abrindo...');
        
        // Garantir que está visível
        window.zE('webWidget', 'show');
        
        // Se temos dados, identificar usuário
        if (dados && (dados.nome || dados.email)) {
          window.zE('webWidget', 'identify', {
            name: dados.nome || '',
            email: dados.email || ''
          });
        }
        
        // Abrir imediatamente
        window.zE('webWidget', 'open');
        
        // Se tem mensagem, tentar preencher
        if (dados?.mensagem) {
          setTimeout(() => {
            try {
              // Tentar enviar mensagem automática
              window.zE('webWidget', 'chat:send', dados.mensagem);
            } catch (e) {
              console.log('[Zendesk] Não foi possível enviar mensagem automática');
            }
          }, 1000);
        }
        
        console.log('[Zendesk] Chat aberto com sucesso!');
        return true;
        
      } catch (error) {
        console.error('[Zendesk] Erro ao abrir:', error);
        return false;
      }
    } else {
      console.log(`[Zendesk] Tentativa ${tentativas}/${maxTentativas} - Widget ainda não carregado`);
      
      if (tentativas < maxTentativas) {
        setTimeout(tentar, 500);
      } else {
        console.error('[Zendesk] Widget não carregou após todas tentativas');
        
        // Última tentativa - mostrar botão do Zendesk se existir
        const zendeskLauncher = document.querySelector('#launcher') || 
                              document.querySelector('[data-id="launcher"]') ||
                              document.querySelector('.zEWidget-launcher');
        
        if (zendeskLauncher) {
          console.log('[Zendesk] Tentando clicar no botão do launcher');
          (zendeskLauncher as HTMLElement).click();
        }
        
        return false;
      }
    }
  };
  
  // Começar tentativas
  tentar();
  
  return true; // Retorna true para indicar que está tentando
}

// Função auxiliar para verificar se Zendesk está carregado
export function zendeskCarregado(): boolean {
  return typeof window !== 'undefined' && window.zE !== undefined;
}

// Função para forçar exibição do widget
export function mostrarBotaoZendesk() {
  if (window.zE) {
    window.zE('webWidget', 'show');
    console.log('[Zendesk] Botão do widget exibido');
  }
}

// Função para debug - verificar estado do Zendesk
export function debugZendesk() {
  console.log('[Zendesk Debug]', {
    windowZE: typeof window !== 'undefined' ? (window.zE ? 'Existe' : 'Não existe') : 'Window não disponível',
    zendeskKey: process.env.NEXT_PUBLIC_ZENDESK_KEY || 'Não encontrada',
    launcher: document.querySelector('#launcher') ? 'Encontrado' : 'Não encontrado',
    widget: document.querySelector('.zEWidget-launcher') ? 'Encontrado' : 'Não encontrado',
    allZendesk: document.querySelectorAll('[class*="zendesk"], [id*="zendesk"], [class*="zE"]').length
  });
}
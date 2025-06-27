// lib/zendesk-utils.ts
export function openZendeskWidget(data?: {
  name?: string;
  email?: string;
  message?: string;
  subject?: string;
}) {
  return new Promise<boolean>((resolve) => {
    let attempts = 0;
    const maxAttempts = 20; // 20 tentativas = 10 segundos no máximo
    
    const tryOpen = () => {
      attempts++;
      console.log(`[Zendesk] Tentativa ${attempts} de ${maxAttempts}`);
      
      if (window.zE) {
        try {
          // Garantir que o widget está visível
          window.zE('webWidget', 'show');
          
          // Se temos dados, pré-preencher
          if (data) {
            if (data.name || data.email) {
              window.zE('webWidget', 'identify', {
                name: data.name || '',
                email: data.email || '',
              });
              
              window.zE('webWidget', 'prefill', {
                name: { value: data.name || '' },
                email: { value: data.email || '' },
              });
            }
            
            // Se temos mensagem, pré-preencher o campo de descrição
            if (data.message) {
              window.zE('webWidget', 'prefill', {
                description: { value: data.message }
              });
            }
          }
          
          // Abrir o widget
          window.zE('webWidget', 'open');
          
          console.log('[Zendesk] Widget aberto com sucesso!');
          resolve(true);
        } catch (error) {
          console.error('[Zendesk] Erro ao abrir widget:', error);
          
          if (attempts < maxAttempts) {
            setTimeout(tryOpen, 500);
          } else {
            console.error('[Zendesk] Falha após todas as tentativas');
            resolve(false);
          }
        }
      } else {
        console.log('[Zendesk] Widget ainda não carregado...');
        
        if (attempts < maxAttempts) {
          setTimeout(tryOpen, 500);
        } else {
          console.error('[Zendesk] Widget não carregou após todas as tentativas');
          resolve(false);
        }
      }
    };
    
    // Primeira tentativa imediata
    tryOpen();
  });
}

export function isZendeskLoaded(): boolean {
  return typeof window !== 'undefined' && window.zE !== undefined;
}

export function showZendeskLauncher() {
  if (window.zE) {
    window.zE('webWidget', 'show');
  }
}

export function hideZendeskLauncher() {
  if (window.zE) {
    window.zE('webWidget', 'hide');
  }
}

// Criar ticket via API (para backend)
export async function createZendeskTicket(data: {
  name: string;
  email: string;
  subject: string;
  description: string;
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  tags?: string[];
}) {
  try {
    const response = await fetch('/api/zendesk/ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Falha ao criar ticket');
    }
    
    return await response.json();
  } catch (error) {
    console.error('[Zendesk] Erro ao criar ticket:', error);
    throw error;
  }
}
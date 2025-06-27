// components/zendesk/zendesk-widget.tsx
'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface ZendeskWidgetProps {
  zendeskKey: string;
  userEmail?: string;
  userName?: string;
}

export function ZendeskWidget({ zendeskKey, userEmail, userName }: ZendeskWidgetProps) {
  useEffect(() => {
    // Aguardar o Zendesk carregar
    const checkZendesk = setInterval(() => {
      if (window.zE) {
        clearInterval(checkZendesk);
        
        // Ocultar o widget por padrão após 2 segundos
        // Isso dá tempo para o widget carregar completamente
        setTimeout(() => {
          window.zE('webWidget', 'hide');
          console.log('Widget Zendesk ocultado');
        }, 2000);
        
        // Configurar informações do usuário se disponíveis
        if (userEmail) {
          window.zE('webWidget', 'identify', {
            name: userName || '',
            email: userEmail,
          });
          
          // Pré-preencher formulário
          window.zE('webWidget', 'prefill', {
            name: {
              value: userName || '',
              readOnly: false
            },
            email: {
              value: userEmail,
              readOnly: false
            },
          });
        }
      }
    }, 100);
    
    // Limpar intervalo ao desmontar
    return () => clearInterval(checkZendesk);
  }, [userEmail, userName]);

  return (
    <>
      <Script
        id="zendesk-widget"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.zESettings = {
              webWidget: {
                locale: 'pt-br',
                zIndex: 999999,
                launcher: {
                  chatLabel: {
                    'pt-br': 'Suporte'
                  }
                },
                color: {
                  theme: '#004aad',
                  launcher: '#004aad',
                  launcherText: '#FFFFFF',
                  button: '#004aad',
                  resultLists: '#004aad',
                  header: '#004aad',
                  articleLinks: '#004aad'
                },
                launcher: {
                  label: {
                    'pt-br': 'Precisa de ajuda?'
                  },
                  mobile: {
                    labelVisible: true
                  }
                },
                contactForm: {
                  title: {
                    'pt-br': 'Como podemos ajudar?'
                  },
                  fields: [
                    { id: 'description', prefill: { '*': '' } }
                  ],
                  selectTicketForm: {
                    'pt-br': 'Selecione um tópico'
                  }
                },
                helpCenter: {
                  title: {
                    'pt-br': 'Central de Ajuda Rio Porto P2P'
                  },
                  messageButton: {
                    'pt-br': 'Enviar mensagem'
                  },
                  originalArticleButton: false,
                  searchPlaceholder: {
                    'pt-br': 'Buscar ajuda...'
                  }
                },
                chat: {
                  title: {
                    'pt-br': 'Chat Rio Porto P2P'
                  },
                  menuOptions: {
                    emailTranscript: {
                      enabled: true,
                      visible: true
                    }
                  },
                  prechatForm: {
                    greeting: {
                      'pt-br': 'Olá! Como podemos ajudar você hoje?'
                    },
                    departmentLabel: {
                      'pt-br': 'Departamento'
                    }
                  },
                  offlineForm: {
                    greeting: {
                      'pt-br': 'Nosso time está offline no momento. Deixe sua mensagem que responderemos em breve!'
                    }
                  },
                  concierge: {
                    name: 'Rio Porto P2P',
                    title: {
                      'pt-br': 'Suporte Especializado'
                    }
                  }
                },
                offset: {
                  horizontal: '20px',
                  vertical: '20px',
                  mobile: {
                    horizontal: '10px',
                    vertical: '10px'
                  }
                },
                navigation: {
                  popoutButton: {
                    enabled: false
                  }
                },
                analytics: true,
                errorReporting: true
              }
            };
          `,
        }}
      />
      <Script
        id="ze-snippet"
        src={`https://static.zdassets.com/ekr/snippet.js?key=${zendeskKey}`}
        strategy="lazyOnload"
      />
    </>
  );
}

// Declaração global para TypeScript
declare global {
  interface Window {
    zE: any;
    zESettings: any;
  }
}
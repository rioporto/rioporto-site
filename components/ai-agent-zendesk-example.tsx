// components/ai-agent-zendesk-example.tsx
'use client';

import { Button } from "@/components/ui/button";
import { openZendeskChat, waitForZendesk } from "@/lib/zendesk";
import { MessageSquare } from "lucide-react";

/**
 * Exemplo de como o agente de IA pode abrir o Zendesk
 * com dados pré-coletados do usuário
 */
export function AIAgentZendeskExample() {
  
  // Exemplo 1: Usuário quer tirar dúvidas gerais
  const handleGeneralSupport = () => {
    waitForZendesk(() => {
      openZendeskChat({
        name: "João Silva",
        email: "joao@email.com",
        whatsapp: "+55 21 99999-9999"
      });
    });
  };

  // Exemplo 2: Usuário quer fazer uma cotação
  const handleQuoteSupport = () => {
    waitForZendesk(() => {
      openZendeskChat({
        name: "Maria Santos",
        email: "maria@email.com",
        whatsapp: "+55 21 88888-8888",
        cotacao: {
          tipo: "compra",
          moeda: "Bitcoin (BTC)",
          valor: 5000,
          formaPagamento: "PIX"
        }
      });
    });
  };

  // Exemplo 3: Agente de IA detecta que precisa de suporte humano
  const handleAIHandoff = (context: any) => {
    // O agente de IA coletou essas informações durante a conversa
    const userInfo = {
      name: context.userName || "Usuário",
      email: context.userEmail || "",
      whatsapp: context.userPhone || "",
    };

    // Contexto da conversa
    const conversationContext = `
Conversa com IA:
- Usuário quer comprar Bitcoin
- Valor: R$ 10.000
- Primeira vez comprando
- Tem dúvidas sobre segurança
- Precisa de ajuda humana
    `.trim();

    waitForZendesk(() => {
      // Primeiro identificar o usuário
      if (window.zE) {
        window.zE('webWidget', 'identify', userInfo);
        
        // Abrir o widget
        window.zE('webWidget', 'show');
        window.zE('webWidget', 'open');
        
        // Pré-preencher com contexto
        setTimeout(() => {
          const messageField = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
          if (messageField) {
            messageField.value = conversationContext;
            messageField.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }, 1000);
      }
    });
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold">Exemplos de Integração Zendesk</h2>
      
      <div className="space-y-2">
        <Button 
          onClick={handleGeneralSupport}
          variant="outline"
          className="w-full justify-start"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Suporte Geral
        </Button>

        <Button 
          onClick={handleQuoteSupport}
          variant="outline"
          className="w-full justify-start"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Suporte com Cotação
        </Button>

        <Button 
          onClick={() => handleAIHandoff({
            userName: "Carlos Teste",
            userEmail: "carlos@teste.com",
            userPhone: "+55 21 77777-7777"
          })}
          variant="outline"
          className="w-full justify-start"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Handoff do Agente IA
        </Button>
      </div>
    </div>
  );
}
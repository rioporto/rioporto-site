# 📚 Integração: Minicurso P2P + Sistema Multi-Agente

## 🎯 Objetivo

Integrar o minicurso "Manual P2P: Negocie Bitcoin como um Profissional" como ferramenta educacional do sistema multi-agente, permitindo que os agentes referenciem e compartilhem conteúdo relevante.

## 📖 Estrutura do Minicurso

O minicurso já criado contém:

1. **Introdução**: A Revolução do Dinheiro P2P
2. **Capítulo 1**: Descomplicando o P2P
3. **Capítulo 2**: P2P vs. Corretoras
4. **Capítulo 3**: Sua Fortaleza Digital (Autocustódia)
5. **Capítulo 4**: Navegando em Águas Seguras
6. **Capítulo 5**: A Burocracia sem Medo
7. **Capítulo 6**: A Vantagem RIO PORTO P2P

## 🔧 Implementação

### 1. Knowledge Base do Minicurso

```python
# agents/tools/minicurso_tools.py
from crewai_tools import BaseTool
from typing import Dict, List, Optional
import json
from pathlib import Path

class MinicursoKnowledgeTool(BaseTool):
    name: str = "Minicurso P2P Knowledge"
    description: str = "Acessa conteúdo do minicurso P2P para educar clientes"
    
    def __init__(self):
        super().__init__()
        self.load_content()
    
    def load_content(self):
        """Carrega conteúdo estruturado do minicurso"""
        self.chapters = {
            "introducao": {
                "title": "A Revolução Silenciosa do Dinheiro Ponto a Ponto",
                "key_points": [
                    "Bitcoin nasceu como sistema P2P em 2008",
                    "Exchanges reintroduziram intermediários",
                    "P2P é o retorno às origens: controle e liberdade",
                    "Este manual ensina a negociar como profissional"
                ],
                "target_questions": [
                    "o que é p2p",
                    "por que usar p2p",
                    "historia do bitcoin"
                ]
            },
            "capitulo1": {
                "title": "Descomplicando o P2P",
                "key_points": [
                    "P2P é negociação direta entre pessoas",
                    "Processo: Contato → Acordo → Pagamento → Liberação",
                    "Sem intermediários = mais controle",
                    "Fluxo simples e transparente"
                ],
                "content": """
                P2P (Peer-to-Peer) é como vender um item usado online:
                1. Contato e Cotação com vendedor (Rio Porto P2P)
                2. Acordo de termos (quantidade e pagamento)
                3. Pagamento via PIX e confirmação
                4. Liberação das criptos para sua carteira
                """,
                "target_questions": [
                    "como funciona p2p",
                    "passo a passo p2p",
                    "processo de compra"
                ]
            },
            "capitulo2": {
                "title": "P2P vs. Corretoras",
                "key_points": [
                    "Mais privacidade e controle",
                    "Flexibilidade de pagamento",
                    "Custos menores e transparentes",
                    "Soberania sobre seus fundos"
                ],
                "comparison": {
                    "P2P Rio Porto": {
                        "segurança": "Altíssima (sem custódia)",
                        "privacidade": "Alta (com conformidade)",
                        "taxas": "Competitiva e transparente",
                        "suporte": "Humano e especializado"
                    },
                    "Corretoras": {
                        "segurança": "Risco de custódia",
                        "privacidade": "Baixa (KYC obrigatório)",
                        "taxas": "Múltiplas taxas ocultas",
                        "suporte": "Automatizado/lento"
                    }
                },
                "target_questions": [
                    "p2p ou corretora",
                    "vantagens p2p",
                    "diferença exchange"
                ]
            },
            "capitulo3": {
                "title": "Sua Fortaleza Digital (Autocustódia)",
                "key_points": [
                    "Not Your Keys, Not Your Coins",
                    "Autocustódia = soberania real",
                    "Hot wallets para uso diário",
                    "Cold wallets para guardar valor"
                ],
                "wallet_recommendations": {
                    "iniciante": {
                        "hot": ["Trust Wallet", "Blue Wallet"],
                        "cold": ["Papel (com cuidado)"]
                    },
                    "intermediario": {
                        "hot": ["Electrum", "Sparrow"],
                        "cold": ["Ledger Nano S Plus"]
                    },
                    "avancado": {
                        "hot": ["Sparrow + Tor"],
                        "cold": ["Coldcard", "Trezor Model T"]
                    }
                },
                "target_questions": [
                    "carteira bitcoin",
                    "autocustódia",
                    "guardar bitcoin",
                    "wallet segura"
                ]
            },
            "capitulo4": {
                "title": "Navegando em Águas Seguras",
                "key_points": [
                    "Golpe do comprovante falso",
                    "Golpe da triangulação",
                    "Sempre verificar no extrato bancário",
                    "Negociar apenas com titular da conta"
                ],
                "security_checklist": [
                    "✓ Confie APENAS no seu extrato bancário",
                    "✓ Negocie apenas com o titular da conta",
                    "✓ Comece com valores pequenos",
                    "✓ Desconfie de ofertas muito boas"
                ],
                "target_questions": [
                    "golpes p2p",
                    "segurança bitcoin",
                    "como evitar fraude",
                    "p2p seguro"
                ]
            },
            "capitulo5": {
                "title": "A Burocracia sem Medo",
                "key_points": [
                    "P2P é legal no Brasil",
                    "IN 1888: declarar se > R$ 30k/mês",
                    "Ganho capital: isento até R$ 35k/mês em vendas",
                    "Sempre consulte um contador"
                ],
                "tax_info": {
                    "in_1888": {
                        "limite": 30000,
                        "prazo": "último dia útil do mês seguinte",
                        "multa": "R$ 500 a R$ 1.500"
                    },
                    "imposto_renda": {
                        "isencao_mensal": 35000,
                        "aliquota": "15% sobre o lucro"
                    }
                },
                "target_questions": [
                    "bitcoin imposto",
                    "declarar bitcoin",
                    "in 1888",
                    "bitcoin legal"
                ]
            },
            "capitulo6": {
                "title": "A Vantagem RIO PORTO P2P",
                "key_points": [
                    "Segurança garantida com processos rigorosos",
                    "Suporte humano e especializado",
                    "Soberania com tranquilidade",
                    "Conformidade e paz de espírito"
                ],
                "differentials": {
                    "valor_minimo": "R$ 100",
                    "taxa": "2% fixa e transparente",
                    "cotacao": "Travada por 15 minutos",
                    "suporte": "WhatsApp com especialistas",
                    "pagamento": "PIX sem taxa adicional"
                },
                "target_questions": [
                    "rio porto",
                    "por que rio porto",
                    "diferencial"
                ]
            }
        }
    
    def _run(self, query: str, chapter: Optional[str] = None) -> Dict:
        """Busca informação relevante no minicurso"""
        
        query_lower = query.lower()
        relevant_content = []
        
        # Buscar em todos os capítulos ou em um específico
        chapters_to_search = [self.chapters[chapter]] if chapter else self.chapters.values()
        
        for chap in chapters_to_search:
            # Verificar se a query matches com target_questions
            if any(target in query_lower for target in chap.get('target_questions', [])):
                relevant_content.append({
                    "chapter": chap['title'],
                    "content": chap.get('content', ''),
                    "key_points": chap.get('key_points', []),
                    "extra_data": {
                        k: v for k, v in chap.items() 
                        if k not in ['title', 'key_points', 'content', 'target_questions']
                    }
                })
        
        if not relevant_content:
            # Busca mais ampla por palavras-chave
            for chap in chapters_to_search:
                if any(word in str(chap).lower() for word in query_lower.split()):
                    relevant_content.append({
                        "chapter": chap['title'],
                        "key_points": chap.get('key_points', [])
                    })
        
        return {
            "found": len(relevant_content) > 0,
            "content": relevant_content,
            "source": "Minicurso: Manual P2P - Negocie Bitcoin como um Profissional"
        }

class MinicursoQuizTool(BaseTool):
    name: str = "Minicurso Quiz Generator"
    description: str = "Gera quiz educativo baseado no minicurso"
    
    def _run(self, topic: str) -> Dict:
        """Gera perguntas educativas sobre o tópico"""
        
        quizzes = {
            "p2p_basics": [
                {
                    "question": "O que significa P2P?",
                    "options": [
                        "A) Pay to Play",
                        "B) Peer-to-Peer (Ponto a Ponto)",
                        "C) Price to Price",
                        "D) Private to Public"
                    ],
                    "correct": "B",
                    "explanation": "P2P significa Peer-to-Peer, ou seja, transações diretas entre pessoas sem intermediários."
                }
            ],
            "security": [
                {
                    "question": "Qual a regra de ouro para verificar pagamentos P2P?",
                    "options": [
                        "A) Confiar no comprovante enviado",
                        "B) Verificar apenas no extrato bancário",
                        "C) Aceitar print de tela",
                        "D) Confirmar por telefone"
                    ],
                    "correct": "B",
                    "explanation": "SEMPRE verifique pagamentos no seu extrato bancário oficial. Comprovantes podem ser falsificados."
                }
            ],
            "tax": [
                {
                    "question": "Qual o limite mensal para declaração na IN 1888?",
                    "options": [
                        "A) R$ 10.000",
                        "B) R$ 20.000",
                        "C) R$ 30.000",
                        "D) R$ 50.000"
                    ],
                    "correct": "C",
                    "explanation": "Operações acima de R$ 30.000/mês devem ser declaradas na IN 1888 da Receita Federal."
                }
            ]
        }
        
        topic_quiz = quizzes.get(topic, quizzes["p2p_basics"])
        
        return {
            "quiz": topic_quiz,
            "topic": topic,
            "instructions": "Responda com a letra da alternativa correta"
        }
```

### 2. Agente Educador Especializado

```python
# agents/core/educator_agent.py
from crewai import Agent
from ..tools.minicurso_tools import MinicursoKnowledgeTool, MinicursoQuizTool

class EducatorAgent:
    def __init__(self):
        self.knowledge_tool = MinicursoKnowledgeTool()
        self.quiz_tool = MinicursoQuizTool()
        
        self.agent = Agent(
            role="Educador Bitcoin P2P",
            goal="Educar clientes sobre Bitcoin e P2P usando o minicurso",
            backstory="""Você é um educador experiente em criptomoedas.
            Usa o minicurso 'Manual P2P' como base para ensinar.
            Sempre que possível, referencia capítulos específicos.
            Torna conceitos complexos em explicações simples.""",
            tools=[self.knowledge_tool, self.quiz_tool],
            verbose=True
        )
    
    def create_educational_response(self, query: str) -> str:
        """Cria resposta educativa baseada no minicurso"""
        
        # Buscar conteúdo relevante
        content = self.knowledge_tool._run(query)
        
        if not content['found']:
            return self._general_education_response()
        
        # Formatar resposta educativa
        response = "📚 **Informação do Minicurso P2P:**\n\n"
        
        for item in content['content']:
            response += f"**{item['chapter']}**\n"
            
            if item.get('content'):
                response += f"{item['content']}\n\n"
            
            if item.get('key_points'):
                response += "**Pontos principais:**\n"
                for point in item['key_points']:
                    response += f"• {point}\n"
                response += "\n"
            
            if item.get('extra_data'):
                for key, value in item['extra_data'].items():
                    if isinstance(value, dict):
                        response += f"\n**{key.replace('_', ' ').title()}:**\n"
                        for k, v in value.items():
                            response += f"• {k}: {v}\n"
        
        response += "\n💡 *Quer aprender mais? Baixe nosso minicurso completo!*"
        
        return response
    
    def _general_education_response(self) -> str:
        return """
📚 Não encontrei informação específica sobre isso no minicurso, mas posso ajudar!

O nosso **Manual P2P: Negocie Bitcoin como um Profissional** cobre:
• Como funciona o P2P
• Vantagens sobre corretoras
• Segurança e autocustódia
• Como evitar golpes
• Aspectos legais e fiscais
• Por que escolher a Rio Porto P2P

Quer que eu explique algum desses tópicos?
"""
```

### 3. Integração com Flow Principal

```python
# agents/flows/educational_flow.py
from crewai import Task, Crew
from ..core.educator_agent import EducatorAgent
from typing import Dict

class EducationalFlow:
    def __init__(self):
        self.educator = EducatorAgent()
    
    def should_trigger_education(self, message: str) -> bool:
        """Detecta quando ativar modo educacional"""
        
        educational_triggers = [
            "como funciona",
            "o que é",
            "explique",
            "não entendo",
            "primeira vez",
            "iniciante",
            "aprender",
            "dúvida sobre",
            "pode me ensinar",
            "tutorial"
        ]
        
        message_lower = message.lower()
        return any(trigger in message_lower for trigger in educational_triggers)
    
    def create_educational_task(self, query: str) -> Task:
        """Cria task educacional"""
        
        return Task(
            description=f"""
            Cliente tem dúvida educacional: {query}
            
            1. Use o minicurso como base
            2. Explique de forma didática
            3. Inclua exemplos práticos
            4. Sugira próximos passos
            5. Ofereça o minicurso completo se relevante
            """,
            expected_output="Explicação educativa clara e completa",
            agent=self.educator.agent
        )
    
    def generate_quiz(self, topic: str) -> Dict:
        """Gera quiz interativo"""
        
        quiz_task = Task(
            description=f"Gere um quiz educativo sobre {topic}",
            expected_output="Quiz com pergunta e explicação",
            agent=self.educator.agent
        )
        
        crew = Crew(agents=[self.educator.agent], tasks=[quiz_task])
        result = crew.kickoff()
        
        return result
```

### 4. Integração WhatsApp com Conteúdo Educacional

```python
# agents/integrations/whatsapp_educational.py
from typing import Dict, Optional
import json

class WhatsAppEducationalFormatter:
    """Formata conteúdo educacional para WhatsApp"""
    
    @staticmethod
    def format_chapter_summary(chapter_data: Dict) -> str:
        """Formata resumo de capítulo para WhatsApp"""
        
        message = f"*📖 {chapter_data['title']}*\n\n"
        
        # Pontos principais
        if chapter_data.get('key_points'):
            for point in chapter_data['key_points']:
                message += f"✅ {point}\n"
        
        message += "\n_Digite 'mais' para detalhes completos_"
        
        return message
    
    @staticmethod
    def format_interactive_menu() -> str:
        """Menu interativo do minicurso"""
        
        return """
*📚 Manual P2P - Menu Interativo*

Digite o número do capítulo que deseja:

1️⃣ Como funciona o P2P
2️⃣ P2P vs Corretoras  
3️⃣ Carteiras e Segurança
4️⃣ Como evitar golpes
5️⃣ Impostos e legislação
6️⃣ Vantagens Rio Porto

0️⃣ Baixar minicurso completo

_Exemplo: Digite "1" para aprender sobre P2P_
"""
    
    @staticmethod
    def format_quiz(quiz_data: Dict) -> str:
        """Formata quiz para WhatsApp"""
        
        quiz = quiz_data['quiz'][0]
        
        message = f"*🎯 Quiz Educativo*\n\n"
        message += f"{quiz['question']}\n\n"
        
        for option in quiz['options']:
            message += f"{option}\n"
        
        message += "\n_Responda com a letra da alternativa_"
        
        return message
    
    @staticmethod
    def create_educational_journey(customer_level: str) -> list:
        """Cria jornada educacional personalizada"""
        
        journeys = {
            "iniciante": [
                "Primeiro, vamos entender o que é P2P",
                "Depois, vou mostrar como é seguro",
                "Por fim, faremos sua primeira compra juntos"
            ],
            "intermediario": [
                "Vejo que já conhece Bitcoin",
                "Vou mostrar as vantagens do P2P",
                "E como otimizar suas operações"
            ],
            "avancado": [
                "Como trader experiente",
                "Nosso P2P oferece melhores taxas",
                "E total controle sobre seus ativos"
            ]
        }
        
        return journeys.get(customer_level, journeys["iniciante"])
```

### 5. Análise e Personalização Educacional

```python
# agents/analytics/educational_analytics.py
from typing import Dict, List
from datetime import datetime
import json

class EducationalAnalytics:
    """Analisa interações educacionais para melhorar o sistema"""
    
    def __init__(self):
        self.interactions = []
    
    def track_educational_interaction(self, customer_id: str, topic: str, 
                                    understood: bool, time_spent: float):
        """Rastreia interação educacional"""
        
        self.interactions.append({
            "customer_id": customer_id,
            "topic": topic,
            "understood": understood,
            "time_spent": time_spent,
            "timestamp": datetime.now().isoformat()
        })
    
    def get_difficult_topics(self) -> List[str]:
        """Identifica tópicos que clientes têm dificuldade"""
        
        topic_stats = {}
        
        for interaction in self.interactions:
            topic = interaction['topic']
            if topic not in topic_stats:
                topic_stats[topic] = {"total": 0, "understood": 0}
            
            topic_stats[topic]["total"] += 1
            if interaction['understood']:
                topic_stats[topic]["understood"] += 1
        
        # Calcular taxa de compreensão
        difficult_topics = []
        for topic, stats in topic_stats.items():
            understanding_rate = stats["understood"] / stats["total"]
            if understanding_rate < 0.7:  # Menos de 70% entendem
                difficult_topics.append({
                    "topic": topic,
                    "understanding_rate": understanding_rate,
                    "total_interactions": stats["total"]
                })
        
        return sorted(difficult_topics, key=lambda x: x["understanding_rate"])
    
    def personalize_education(self, customer_id: str) -> Dict:
        """Personaliza abordagem educacional por cliente"""
        
        customer_interactions = [
            i for i in self.interactions 
            if i["customer_id"] == customer_id
        ]
        
        if not customer_interactions:
            return {"level": "iniciante", "approach": "basic"}
        
        # Analisar perfil
        topics_understood = sum(1 for i in customer_interactions if i["understood"])
        total_topics = len(customer_interactions)
        
        understanding_rate = topics_understood / total_topics if total_topics > 0 else 0
        
        if understanding_rate > 0.8:
            return {"level": "avancado", "approach": "technical"}
        elif understanding_rate > 0.5:
            return {"level": "intermediario", "approach": "balanced"}
        else:
            return {"level": "iniciante", "approach": "simplified"}
```

### 6. Exemplo de Uso Completo

```python
# examples/educational_bot_demo.py
from agents.flows.educational_flow import EducationalFlow
from agents.integrations.whatsapp_educational import WhatsAppEducationalFormatter
from agents.analytics.educational_analytics import EducationalAnalytics

# Inicializar componentes
edu_flow = EducationalFlow()
formatter = WhatsAppEducationalFormatter()
analytics = EducationalAnalytics()

def process_educational_message(customer_id: str, message: str):
    """Processa mensagem com foco educacional"""
    
    # Verificar se é pergunta educacional
    if edu_flow.should_trigger_education(message):
        # Personalizar abordagem
        profile = analytics.personalize_education(customer_id)
        
        # Criar resposta educacional
        response = edu_flow.educator.create_educational_response(message)
        
        # Formatar para WhatsApp
        formatted = formatter.format_chapter_summary({
            "title": "Resposta Educacional",
            "content": response
        })
        
        # Rastrear interação
        analytics.track_educational_interaction(
            customer_id=customer_id,
            topic="p2p_basics",
            understood=True,  # Seria determinado por feedback
            time_spent=30.0
        )
        
        return formatted
    
    # Verificar comandos especiais
    if message.strip() in ["0", "1", "2", "3", "4", "5", "6"]:
        if message == "0":
            return """
📚 *Baixar Minicurso Completo*

Acesse: https://rioporto.com/minicurso

Ou receba por WhatsApp digitando: ENVIAR MINICURSO
"""
        else:
            # Retornar capítulo específico
            chapters = {
                "1": "p2p_basics",
                "2": "p2p_vs_exchanges",
                "3": "wallets",
                "4": "security",
                "5": "tax",
                "6": "rio_porto"
            }
            
            chapter_key = chapters.get(message)
            content = edu_flow.educator.knowledge_tool._run("", chapter_key)
            
            return formatter.format_chapter_summary(content['content'][0])
    
    # Menu padrão
    return formatter.format_interactive_menu()

# Testar
if __name__ == "__main__":
    # Simular conversas
    test_messages = [
        "O que é P2P?",
        "Como funciona bitcoin?",
        "1",  # Capítulo 1
        "Quero aprender sobre carteiras",
        "É seguro comprar P2P?"
    ]
    
    for msg in test_messages:
        print(f"\nCliente: {msg}")
        response = process_educational_message("customer_123", msg)
        print(f"Bot: {response}")
        print("-" * 50)
```

## 🎯 Benefícios da Integração

### Para o Cliente:
1. **Educação contextualizada** durante o atendimento
2. **Referências diretas** ao minicurso oficial
3. **Aprendizado interativo** com quizzes
4. **Jornada personalizada** por nível

### Para o Negócio:
1. **Reduz dúvidas** recorrentes
2. **Aumenta confiança** do cliente
3. **Qualifica leads** através da educação
4. **Diferencial competitivo** no mercado

## 📊 Métricas de Sucesso

```python
# Métricas educacionais para monitorar
educational_metrics = {
    "engagement": {
        "minicurso_downloads": 0,
        "chapters_accessed": 0,
        "quizzes_completed": 0,
        "avg_time_learning": 0
    },
    "effectiveness": {
        "questions_before_education": 0,
        "questions_after_education": 0,
        "conversion_rate_educated": 0,
        "conversion_rate_not_educated": 0
    },
    "content_performance": {
        "most_accessed_chapters": [],
        "least_understood_topics": [],
        "quiz_success_rate": 0
    }
}
```

## 🚀 Próximos Passos

1. **Criar versão PDF** profissional do minicurso
2. **Desenvolver mais quizzes** interativos
3. **Adicionar gamificação** (badges, certificados)
4. **Criar vídeos curtos** para cada capítulo
5. **Implementar chatbot** especializado em educação

---

**Com esta integração, o sistema multi-agente não apenas atende, mas também educa, criando clientes mais informados e confiantes!**

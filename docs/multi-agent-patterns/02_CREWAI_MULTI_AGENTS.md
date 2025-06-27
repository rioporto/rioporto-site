# CrewAI Multi-Agent Patterns

## 🎯 Visão Geral
CrewAI é um framework moderno para orquestração de agentes autônomos que trabalham colaborativamente. Ideal para criar sistemas onde agentes têm papéis específicos e delegam tarefas entre si.

## 📦 Instalação
```bash
pip install crewai
pip install 'crewai[tools]'
```

## 🔧 Configuração Inicial

### Importações Essenciais
```python
from crewai import Agent, Crew, Task, Process
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import SerperDevTool
from crewai.flow.flow import Flow, listen, start, router, or_
from pydantic import BaseModel
from typing import List, Dict, Any
```

## 🤖 Padrão 1: Crew Sequencial para Rio Porto P2P

### Definir Agentes Especializados
```python
# Agente de Análise de Mercado
market_analyst = Agent(
    role="Analista de Mercado Bitcoin",
    goal="Analisar tendências e fornecer insights sobre o mercado de Bitcoin",
    backstory="""Você é um analista experiente do mercado de criptomoedas 
    com foco em Bitcoin. Você acompanha preços, volumes e tendências para 
    ajudar clientes da Rio Porto P2P a tomar decisões informadas.""",
    verbose=True,
    allow_delegation=False,
    tools=[SerperDevTool()]  # Para pesquisar dados atuais
)

# Agente de Atendimento ao Cliente
customer_service = Agent(
    role="Especialista em Atendimento P2P",
    goal="Fornecer suporte excepcional aos clientes da Rio Porto P2P",
    backstory="""Você é o principal ponto de contato dos clientes. 
    Especializado em explicar processos P2P, segurança e autocustódia 
    de forma clara e acessível.""",
    verbose=True,
    allow_delegation=True  # Pode delegar para outros agentes
)

# Agente de Compliance
compliance_officer = Agent(
    role="Oficial de Compliance Cripto",
    goal="Garantir conformidade regulatória e orientar sobre impostos",
    backstory="""Você é especialista em regulamentação brasileira de 
    criptomoedas, incluindo IN 1888 e declaração de IR. Sempre 
    recomenda consultar um contador para casos específicos.""",
    verbose=True,
    allow_delegation=False
)

# Agente de Segurança
security_expert = Agent(
    role="Especialista em Segurança Bitcoin",
    goal="Educar sobre melhores práticas de segurança e autocustódia",
    backstory="""Você é um expert em segurança de Bitcoin, carteiras 
    e proteção contra fraudes. Ensina práticas seguras de forma 
    didática e acessível.""",
    verbose=True,
    allow_delegation=False
)
```

### Definir Tarefas
```python
# Tarefa 1: Análise de Solicitação
analyze_request = Task(
    description="""Analise a solicitação do cliente: {customer_request}
    
    Identifique:
    1. Tipo de necessidade (compra/venda, suporte, compliance)
    2. Nível de experiência do cliente
    3. Urgência da solicitação
    4. Riscos potenciais
    
    Forneça uma análise estruturada.""",
    expected_output="Análise detalhada da solicitação com recomendações",
    agent=customer_service
)

# Tarefa 2: Pesquisa de Mercado
market_research = Task(
    description="""Com base na análise anterior, pesquise:
    1. Cotação atual do Bitcoin em Reais
    2. Tendências de mercado das últimas 24h
    3. Volume de negociação P2P no Brasil
    4. Fatores que podem impactar o preço
    
    Foco em informações relevantes para P2P.""",
    expected_output="Relatório de mercado com cotações e análises",
    agent=market_analyst,
    context=[analyze_request]  # Depende da tarefa anterior
)

# Tarefa 3: Orientação de Compliance
compliance_check = Task(
    description="""Avalie aspectos de compliance para a transação:
    1. Limites da IN 1888 (R$ 30.000/mês)
    2. Necessidade de declaração
    3. Tributação sobre ganhos
    4. Documentação necessária
    
    Considere o perfil do cliente identificado.""",
    expected_output="Orientações de compliance personalizadas",
    agent=compliance_officer,
    context=[analyze_request]
)

# Tarefa 4: Recomendações de Segurança
security_recommendations = Task(
    description="""Forneça recomendações de segurança específicas:
    1. Tipo de carteira mais adequada
    2. Processo seguro para a transação
    3. Verificações anti-fraude
    4. Backup e recuperação
    
    Adapte ao nível de experiência do cliente.""",
    expected_output="Guia de segurança personalizado",
    agent=security_expert,
    context=[analyze_request]
)

# Tarefa 5: Resposta Final
final_response = Task(
    description="""Compile todas as informações em uma resposta única:
    1. Saudação personalizada
    2. Cotação e condições (se aplicável)
    3. Orientações de compliance resumidas
    4. Dicas de segurança essenciais
    5. Próximos passos claros
    6. Oferta de suporte adicional
    
    Use tom profissional mas acessível.
    Inclua o diferencial Rio Porto P2P.""",
    expected_output="Resposta completa e formatada para o cliente",
    agent=customer_service,
    context=[market_research, compliance_check, security_recommendations]
)
```

### Criar e Executar Crew
```python
# Criar crew com processo sequencial
rioporto_crew = Crew(
    agents=[
        customer_service,
        market_analyst,
        compliance_officer,
        security_expert
    ],
    tasks=[
        analyze_request,
        market_research,
        compliance_check,
        security_recommendations,
        final_response
    ],
    process=Process.sequential,
    verbose=True
)

# Executar crew
result = rioporto_crew.kickoff(
    inputs={
        "customer_request": "Olá, quero comprar R$ 5.000 em Bitcoin. É minha primeira vez."
    }
)

print(result)
```

## 🔄 Padrão 2: Crew Hierárquico com Supervisor

```python
# Supervisor que coordena outros agentes
supervisor = Agent(
    role="Supervisor de Atendimento Rio Porto",
    goal="Coordenar equipe de especialistas para melhor atender o cliente",
    backstory="""Você é o supervisor sênior da Rio Porto P2P. 
    Analisa solicitações e delega para especialistas apropriados, 
    garantindo respostas completas e precisas.""",
    verbose=True,
    allow_delegation=True
)

# Agente focado em vendas
sales_agent = Agent(
    role="Especialista em Vendas P2P",
    goal="Converter interessados em clientes satisfeitos",
    backstory="""Você é especialista em vendas consultivas de Bitcoin. 
    Foca em entender necessidades e apresentar soluções.""",
    verbose=True,
    allow_delegation=False
)

# Tarefa principal do supervisor
supervisor_task = Task(
    description="""Coordene o atendimento para: {customer_message}
    
    1. Analise a mensagem
    2. Delegue para especialistas apropriados
    3. Compile resposta unificada
    4. Garanta que todos os pontos foram abordados""",
    expected_output="Resposta completa e coordenada",
    agent=supervisor
)

# Crew hierárquico
hierarchical_crew = Crew(
    agents=[supervisor, sales_agent, market_analyst, security_expert],
    tasks=[supervisor_task],
    process=Process.hierarchical,
    manager_llm="gpt-4",  # LLM para o supervisor
    verbose=True
)
```

## 🌊 Padrão 3: Flow Multi-Agente com Estados

```python
from crewai.flow.flow import Flow, listen, start, router

# Estado do Flow
class CustomerFlowState(BaseModel):
    customer_id: str = ""
    request_type: str = ""  # "buy", "sell", "support", "compliance"
    amount: float = 0.0
    experience_level: str = ""  # "beginner", "intermediate", "advanced"
    quote: Dict[str, Any] = {}
    recommendations: List[str] = []
    
class RioPortoFlow(Flow[CustomerFlowState]):
    
    @start()
    def receive_message(self, message: str) -> Dict[str, Any]:
        """Recebe mensagem inicial do cliente"""
        self.state.customer_id = self.generate_customer_id()
        
        # Crew para análise inicial
        analysis_crew = Crew(
            agents=[customer_service],
            tasks=[
                Task(
                    description=f"Analise: {message}",
                    expected_output="JSON com tipo de request e dados",
                    agent=customer_service
                )
            ]
        )
        
        result = analysis_crew.kickoff()
        return {"request_type": result.request_type, "message": message}
    
    @router(receive_message)
    def route_request(self) -> str:
        """Roteia baseado no tipo de solicitação"""
        if self.state.request_type == "buy":
            return "process_purchase"
        elif self.state.request_type == "sell":
            return "process_sale"
        elif self.state.request_type == "compliance":
            return "compliance_guidance"
        else:
            return "general_support"
    
    @listen("process_purchase")
    def process_purchase(self) -> Dict[str, Any]:
        """Processa solicitação de compra"""
        
        # Crew especializado em compras
        purchase_crew = Crew(
            agents=[market_analyst, security_expert],
            tasks=[
                Task(
                    description="Gere cotação para compra de Bitcoin",
                    expected_output="Cotação detalhada com taxas",
                    agent=market_analyst
                ),
                Task(
                    description="Crie guia de segurança para iniciante",
                    expected_output="Passo a passo de segurança",
                    agent=security_expert
                )
            ]
        )
        
        result = purchase_crew.kickoff()
        self.state.quote = result.quote
        self.state.recommendations.extend(result.security_tips)
        
        return {"status": "quote_generated"}
    
    @listen(or_("process_purchase", "process_sale", "compliance_guidance"))
    def prepare_final_response(self) -> str:
        """Prepara resposta final para o cliente"""
        
        response_crew = Crew(
            agents=[customer_service],
            tasks=[
                Task(
                    description=f"""
                    Crie resposta final incluindo:
                    - Cotação: {self.state.quote}
                    - Recomendações: {self.state.recommendations}
                    - Próximos passos
                    """,
                    expected_output="Mensagem formatada para WhatsApp",
                    agent=customer_service
                )
            ]
        )
        
        final_message = response_crew.kickoff()
        return final_message

# Executar flow
flow = RioPortoFlow()
response = flow.kickoff(message="Quero comprar R$ 1000 em Bitcoin")
```

## 🤝 Padrão 4: Agentes Colaborativos com Handoff

```python
from crewai_tools import tool

# Ferramenta de handoff entre agentes
@tool
def transfer_to_specialist(specialist_type: str, context: str):
    """Transfere conversa para especialista específico"""
    specialists = {
        "security": security_expert,
        "compliance": compliance_officer,
        "market": market_analyst
    }
    return f"Transferindo para {specialist_type} com contexto: {context}"

# Agente principal com capacidade de handoff
main_agent = Agent(
    role="Agente Principal Rio Porto",
    goal="Atender clientes e transferir para especialistas quando necessário",
    backstory="Primeiro ponto de contato, identifica necessidades",
    tools=[transfer_to_specialist],
    allow_delegation=True
)

# Task com handoff
handoff_task = Task(
    description="""
    Atenda o cliente: {message}
    
    Se a pergunta for sobre:
    - Segurança/carteiras -> transfira para security
    - Impostos/regulação -> transfira para compliance  
    - Preços/mercado -> transfira para market
    
    Caso contrário, responda diretamente.
    """,
    expected_output="Resposta ou transferência realizada",
    agent=main_agent
)
```

## 🧠 Padrão 5: Sistema com Memória e Contexto

```python
# Crew com memória habilitada
memory_crew = Crew(
    agents=[customer_service, market_analyst],
    tasks=[analyze_request, market_research],
    process=Process.sequential,
    memory=True,  # Habilita memória
    embedder={
        "provider": "openai",
        "config": {
            "model": "text-embedding-ada-002"
        }
    },
    verbose=True
)

# Knowledge source para o crew
from crewai.knowledge.source.string_knowledge_source import StringKnowledgeSource

knowledge_source = StringKnowledgeSource(
    content="""
    Rio Porto P2P - Guia de Operações:
    
    1. Valor mínimo: R$ 100
    2. Taxa: 2% sobre o valor da operação
    3. Métodos de pagamento: PIX (sem taxa adicional)
    4. Horário de atendimento: 9h às 18h
    5. Tempo de confirmação: 10-30 minutos
    6. Suporte via WhatsApp: +55 21 34000-3259
    
    Diferenciais:
    - Cotação travada por 15 minutos
    - Suporte humano especializado
    - Orientação gratuita sobre autocustódia
    - Conformidade total com legislação brasileira
    """,
    metadata={"type": "operational_guide"}
)

# Crew com knowledge base
knowledge_crew = Crew(
    agents=[customer_service],
    tasks=[final_response],
    knowledge_sources=[knowledge_source],
    process=Process.sequential,
    verbose=True
)
```

## 📊 Padrão 6: Agentes com Ferramentas Customizadas

```python
from crewai_tools import BaseTool

class BitcoinPriceTool(BaseTool):
    name: str = "Bitcoin Price Checker"
    description: str = "Obtém cotação atual do Bitcoin em Reais"
    
    def _run(self, operation: str = "buy") -> str:
        # Aqui você integraria com sua API real
        import requests
        
        # Exemplo com API pública
        response = requests.get("https://api.coinbase.com/v2/exchange-rates?currency=BTC")
        data = response.json()
        
        usd_price = float(data['data']['rates']['USD'])
        
        # Converter para BRL (exemplo simplificado)
        usd_to_brl = 5.20
        brl_price = usd_price * usd_to_brl
        
        if operation == "buy":
            final_price = brl_price * 1.02  # 2% spread
        else:
            final_price = brl_price * 0.98
            
        return f"Bitcoin {operation}: R$ {final_price:,.2f}"

class ComplianceCheckerTool(BaseTool):
    name: str = "Compliance Checker"
    description: str = "Verifica limites e obrigações fiscais"
    
    def _run(self, amount: float) -> str:
        if amount > 30000:
            return f"""
            ⚠️ Atenção: Valor acima de R$ 30.000/mês
            - Obrigatório declarar na IN 1888
            - Prazo: até o último dia útil do mês seguinte
            - Multa por atraso: R$ 500 a R$ 1.500
            """
        else:
            return f"""
            ✅ Valor dentro do limite mensal
            - Não precisa declarar IN 1888 este mês
            - Some com outras operações do mês
            - Guarde comprovantes para IR anual
            """

# Agente com ferramentas customizadas
equipped_agent = Agent(
    role="Agente Equipado Rio Porto",
    goal="Fornecer informações precisas usando ferramentas",
    backstory="Especialista com acesso a dados em tempo real",
    tools=[BitcoinPriceTool(), ComplianceCheckerTool()],
    verbose=True
)
```

## 🚀 Exemplo Completo: Sistema Rio Porto P2P

```python
class RioPortoP2PSystem:
    def __init__(self):
        self.setup_agents()
        self.setup_crews()
        
    def setup_agents(self):
        """Configura todos os agentes do sistema"""
        self.supervisor = Agent(
            role="Supervisor Rio Porto P2P",
            goal="Coordenar atendimento de excelência",
            backstory="Líder experiente em operações P2P",
            allow_delegation=True
        )
        
        self.sales = Agent(
            role="Vendedor Consultivo",
            goal="Converter leads em clientes satisfeitos",
            backstory="Especialista em vendas consultivas de Bitcoin",
            tools=[BitcoinPriceTool()]
        )
        
        self.support = Agent(
            role="Suporte Técnico",
            goal="Resolver dúvidas e problemas técnicos",
            backstory="Expert em carteiras e segurança",
            allow_delegation=False
        )
        
        self.compliance = Agent(
            role="Compliance Officer",
            goal="Garantir conformidade regulatória",
            backstory="Especialista em legislação cripto",
            tools=[ComplianceCheckerTool()]
        )
        
    def setup_crews(self):
        """Configura diferentes crews para cenários"""
        
        # Crew de vendas rápidas
        self.quick_sale_crew = Crew(
            agents=[self.sales],
            tasks=[
                Task(
                    description="Gere cotação e feche venda para: {request}",
                    expected_output="Cotação com instruções de pagamento",
                    agent=self.sales
                )
            ],
            process=Process.sequential
        )
        
        # Crew completo para primeira compra
        self.onboarding_crew = Crew(
            agents=[self.supervisor, self.sales, self.support, self.compliance],
            tasks=[
                Task(
                    description="Coordene onboarding completo para: {request}",
                    expected_output="Guia completo para primeira compra",
                    agent=self.supervisor
                )
            ],
            process=Process.hierarchical,
            manager_llm="gpt-4"
        )
        
    def process_message(self, message: str, customer_profile: dict = None):
        """Processa mensagem do cliente"""
        
        # Análise inicial simples
        is_first_time = "primeira vez" in message.lower()
        is_quick_quote = "cotação" in message.lower() and not is_first_time
        
        if is_quick_quote:
            # Usa crew de venda rápida
            result = self.quick_sale_crew.kickoff(
                inputs={"request": message}
            )
        elif is_first_time:
            # Usa crew de onboarding completo
            result = self.onboarding_crew.kickoff(
                inputs={"request": message}
            )
        else:
            # Usa crew padrão
            result = self.supervisor.execute(message)
            
        return self.format_response(result)
        
    def format_response(self, result):
        """Formata resposta para WhatsApp"""
        return f"""
*Rio Porto P2P* 🪙

{result}

_Digite 'ajuda' para mais opções_
_Ou fale com nosso time: +55 21 34000-3259_
        """

# Uso do sistema
system = RioPortoP2PSystem()

# Processar diferentes tipos de mensagens
response1 = system.process_message(
    "Olá, é minha primeira vez comprando Bitcoin. Como funciona?"
)

response2 = system.process_message(
    "Qual a cotação para comprar R$ 2000?"
)

response3 = system.process_message(
    "Preciso declarar Bitcoin no imposto de renda?"
)
```

## 🎯 Melhores Práticas CrewAI

1. **Papéis Claros**: Defina roles específicos e não sobrepostos
2. **Backstories Detalhadas**: Quanto mais contexto, melhor a performance
3. **Allow Delegation**: Use com sabedoria - nem todos precisam delegar
4. **Context em Tasks**: Conecte tarefas dependentes
5. **Process Type**: Sequential para fluxos lineares, Hierarchical para complexos
6. **Memory**: Habilite para conversas longas ou recorrentes
7. **Tools**: Crie ferramentas específicas para seu domínio

## 🔧 Configuração Avançada

```python
# Crew com todas as features
advanced_crew = Crew(
    agents=[...],
    tasks=[...],
    process=Process.hierarchical,
    manager_llm="gpt-4",
    memory=True,
    cache=True,
    embedder={
        "provider": "openai",
        "config": {"model": "text-embedding-ada-002"}
    },
    knowledge_sources=[knowledge_source],
    verbose=True,
    output_log_file="crew_output.log",
    planning=True,  # Habilita planning
    planning_llm="gpt-4",
    max_iter=10,  # Máximo de iterações
    callbacks={
        "task_started": lambda task: print(f"Iniciando: {task.description}"),
        "task_completed": lambda output: print(f"Completo: {output}")
    }
)
```

---

**CrewAI é ideal para**: Sistemas que precisam de colaboração natural entre agentes, com delegação flexível e processamento de tarefas complexas em etapas.

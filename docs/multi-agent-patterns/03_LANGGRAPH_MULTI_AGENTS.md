# LangGraph Multi-Agent Patterns

## 🎯 Visão Geral
LangGraph é a biblioteca da LangChain para construir aplicações com múltiplos agentes usando grafos. Oferece controle fino sobre fluxo de execução, estados compartilhados e handoffs entre agentes.

## 📦 Instalação
```bash
pip install langgraph
pip install langgraph-supervisor  # Para padrão supervisor
pip install langgraph-swarm       # Para padrão swarm
pip install langchain-openai      # Para LLMs
```

## 🔧 Configuração Inicial

### Importações Essenciais
```python
from typing import Literal, Annotated, Dict, List, Any
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.types import Command
from langgraph.prebuilt import create_react_agent
from langchain_core.tools import tool, InjectedToolCallId
from langgraph.prebuilt import InjectedState

# Modelo base
model = ChatOpenAI(model="gpt-4", temperature=0)
```

## 🤖 Padrão 1: Supervisor Multi-Agente

### Setup do Supervisor
```python
from langgraph_supervisor import create_supervisor

# Ferramentas para os agentes
def get_bitcoin_quote(amount_brl: float = 1000) -> str:
    """Obtém cotação do Bitcoin em Reais"""
    # Simulação - integre com API real
    btc_price = 250000  # R$ 250k por BTC
    btc_amount = amount_brl / btc_price
    return f"""
    Cotação Bitcoin:
    - 1 BTC = R$ {btc_price:,.2f}
    - R$ {amount_brl:,.2f} = {btc_amount:.8f} BTC
    - Taxa Rio Porto: 2%
    - Total: R$ {amount_brl * 1.02:,.2f}
    """

def check_compliance_requirements(amount: float) -> str:
    """Verifica requisitos de compliance"""
    if amount > 30000:
        return """
        ⚠️ Transação acima de R$ 30.000
        - Necessário declarar IN 1888
        - Prazo: último dia útil do mês seguinte
        - Documentação: CPF, comprovante de residência
        """
    return "✅ Transação dentro dos limites. Documentação padrão: CPF"

def get_wallet_recommendation(experience: str) -> str:
    """Recomenda carteira baseada na experiência"""
    wallets = {
        "iniciante": "Trust Wallet (mobile) - Fácil de usar",
        "intermediário": "Electrum (desktop) - Mais controle",
        "avançado": "Coldcard (hardware) - Máxima segurança"
    }
    return f"Recomendação: {wallets.get(experience, wallets['iniciante'])}"

# Criar agentes especializados
cotacao_agent = create_react_agent(
    model="openai:gpt-4",
    tools=[get_bitcoin_quote],
    prompt="""Você é o especialista em cotação da Rio Porto P2P.
    Forneça cotações precisas e explique taxas e condições.
    Sempre mencione o valor mínimo de R$ 100.""",
    name="cotacao_agent"
)

compliance_agent = create_react_agent(
    model="openai:gpt-4",
    tools=[check_compliance_requirements],
    prompt="""Você é o oficial de compliance da Rio Porto P2P.
    Oriente sobre requisitos legais e documentação necessária.
    Sempre recomende consultar um contador para casos específicos.""",
    name="compliance_agent"
)

seguranca_agent = create_react_agent(
    model="openai:gpt-4",
    tools=[get_wallet_recommendation],
    prompt="""Você é o especialista em segurança da Rio Porto P2P.
    Eduque sobre carteiras e melhores práticas de segurança.
    Adapte as recomendações ao nível do cliente.""",
    name="seguranca_agent"
)

# Criar supervisor
supervisor = create_supervisor(
    agents=[cotacao_agent, compliance_agent, seguranca_agent],
    model=ChatOpenAI(model="gpt-4"),
    prompt="""Você é o supervisor de atendimento da Rio Porto P2P.
    
    Analise a solicitação do cliente e delegue para o agente apropriado:
    - Cotação/preços -> cotacao_agent
    - Impostos/documentação -> compliance_agent  
    - Carteiras/segurança -> seguranca_agent
    
    Você pode chamar múltiplos agentes se necessário.
    Compile uma resposta final unificada e amigável."""
).compile()

# Executar supervisor
response = supervisor.stream({
    "messages": [{
        "role": "user",
        "content": "Quero comprar R$ 5000 em Bitcoin. Preciso declarar?"
    }]
})

for chunk in response:
    print(chunk)
```

## 🔄 Padrão 2: Network (Agentes se Comunicando)

```python
# Estado customizado para o sistema
class RioPortoState(MessagesState):
    customer_id: str = ""
    operation_type: str = ""  # "buy", "sell", "support"
    amount: float = 0.0
    quote_provided: bool = False
    compliance_checked: bool = False
    
# Agente de entrada que roteia para outros
def entry_agent(state: RioPortoState) -> Command[Literal["sales_agent", "support_agent", END]]:
    """Agente inicial que analisa e roteia"""
    
    messages = state["messages"]
    last_message = messages[-1].content if messages else ""
    
    # Análise simples - em produção use NLP/LLM
    if any(word in last_message.lower() for word in ["comprar", "vender", "cotação"]):
        next_agent = "sales_agent"
        state.operation_type = "trade"
    elif any(word in last_message.lower() for word in ["carteira", "segurança", "ajuda"]):
        next_agent = "support_agent" 
        state.operation_type = "support"
    else:
        # Mensagem genérica - finaliza com menu
        return Command(
            goto=END,
            update={
                "messages": [{
                    "role": "assistant",
                    "content": """Olá! Sou o assistente da Rio Porto P2P. Como posso ajudar?
                    
1️⃣ Comprar/Vender Bitcoin
2️⃣ Suporte com carteiras
3️⃣ Informações sobre impostos
                    
Digite o número da opção ou descreva sua necessidade."""
                }]
            }
        )
    
    return Command(
        goto=next_agent,
        update={"operation_type": state.operation_type}
    )

def sales_agent(state: RioPortoState) -> Command[Literal["compliance_agent", "quote_agent", END]]:
    """Agente de vendas"""
    
    # Extrair valor da mensagem (simplificado)
    import re
    last_message = state["messages"][-1].content
    amount_match = re.search(r'R?\$?\s*([\d.,]+)', last_message)
    
    if amount_match:
        amount = float(amount_match.group(1).replace('.', '').replace(',', '.'))
        state.amount = amount
        
        # Rotear baseado no valor
        if amount >= 30000:
            next_agent = "compliance_agent"  # Verificar compliance primeiro
        else:
            next_agent = "quote_agent"
            
        return Command(
            goto=next_agent,
            update={
                "amount": amount,
                "messages": [{
                    "role": "assistant", 
                    "content": f"Entendi! Você quer negociar R$ {amount:,.2f}. Vou verificar para você..."
                }]
            }
        )
    else:
        return Command(
            goto=END,
            update={
                "messages": [{
                    "role": "assistant",
                    "content": "Por favor, informe o valor que deseja negociar. Exemplo: R$ 1.000"
                }]
            }
        )

def compliance_agent(state: RioPortoState) -> Command[Literal["quote_agent", END]]:
    """Agente de compliance"""
    
    compliance_msg = check_compliance_requirements(state.amount)
    
    return Command(
        goto="quote_agent",
        update={
            "compliance_checked": True,
            "messages": [{
                "role": "assistant",
                "content": f"Informação importante sobre compliance:\n\n{compliance_msg}"
            }]
        }
    )

def quote_agent(state: RioPortoState) -> Command[Literal[END]]:
    """Agente que fornece cotação final"""
    
    quote = get_bitcoin_quote(state.amount)
    
    final_message = f"""
{quote}

✅ Cotação válida por 15 minutos
📱 Para prosseguir, entre em contato:
   WhatsApp: +55 21 34000-3259
   
Posso ajudar com mais alguma coisa?"""
    
    return Command(
        goto=END,
        update={
            "quote_provided": True,
            "messages": [{"role": "assistant", "content": final_message}]
        }
    )

# Construir grafo
builder = StateGraph(RioPortoState)
builder.add_node("entry_agent", entry_agent)
builder.add_node("sales_agent", sales_agent)
builder.add_node("support_agent", lambda s: Command(goto=END, update={"messages": [{"role": "assistant", "content": "Suporte em desenvolvimento"}]}))
builder.add_node("compliance_agent", compliance_agent)
builder.add_node("quote_agent", quote_agent)

builder.add_edge(START, "entry_agent")

network = builder.compile()

# Executar
result = network.invoke({
    "messages": [{"role": "user", "content": "Quero comprar R$ 35000 em Bitcoin"}]
})
```

## 🤝 Padrão 3: Swarm com Handoffs

```python
from langgraph_swarm import create_swarm, create_handoff_tool

# Criar ferramentas de handoff
transfer_to_cotacao = create_handoff_tool(
    agent_name="cotacao_assistant",
    description="Transferir para especialista em cotação"
)

transfer_to_suporte = create_handoff_tool(
    agent_name="suporte_assistant", 
    description="Transferir para suporte técnico"
)

transfer_to_compliance = create_handoff_tool(
    agent_name="compliance_assistant",
    description="Transferir para especialista em compliance"
)

# Agente principal de atendimento
atendimento_assistant = create_react_agent(
    model="anthropic:claude-3-5-sonnet-latest",
    tools=[transfer_to_cotacao, transfer_to_suporte, transfer_to_compliance],
    prompt="""Você é o atendente principal da Rio Porto P2P.
    
    Sua função é:
    1. Receber o cliente cordialmente
    2. Entender a necessidade
    3. Transferir para o especialista apropriado
    
    Sempre seja cordial e profissional.""",
    name="atendimento_assistant"
)

# Agente de cotação
cotacao_assistant = create_react_agent(
    model="anthropic:claude-3-5-sonnet-latest",
    tools=[get_bitcoin_quote, transfer_to_compliance],
    prompt="""Você é o especialista em cotação da Rio Porto P2P.
    
    - Forneça cotações precisas
    - Explique taxas e prazos
    - Se valor > R$ 30k, transfira para compliance
    - Mencione sempre o WhatsApp para fechar negócio""",
    name="cotacao_assistant"
)

# Agente de suporte
suporte_assistant = create_react_agent(
    model="anthropic:claude-3-5-sonnet-latest",
    tools=[get_wallet_recommendation, transfer_to_cotacao],
    prompt="""Você é o suporte técnico da Rio Porto P2P.
    
    - Ajude com carteiras e segurança
    - Eduque sobre autocustódia
    - Se cliente quiser comprar, transfira para cotação""",
    name="suporte_assistant"
)

# Agente de compliance
compliance_assistant = create_react_agent(
    model="anthropic:claude-3-5-sonnet-latest",
    tools=[check_compliance_requirements, transfer_to_cotacao],
    prompt="""Você é o especialista em compliance da Rio Porto P2P.
    
    - Oriente sobre IN 1888 e impostos
    - Explique documentação necessária
    - Após orientar, transfira de volta para cotação se aplicável""",
    name="compliance_assistant"
)

# Criar swarm
swarm = create_swarm(
    agents=[
        atendimento_assistant,
        cotacao_assistant,
        suporte_assistant,
        compliance_assistant
    ],
    default_active_agent="atendimento_assistant"
).compile()

# Executar swarm
for chunk in swarm.stream({
    "messages": [{
        "role": "user",
        "content": "Olá! Nunca comprei Bitcoin mas quero investir R$ 50.000"
    }]
}):
    print(chunk)
```

## 🎯 Padrão 4: Handoff Tool Customizado

```python
# Criar ferramenta de handoff mais sofisticada
def create_handoff_tool(*, agent_name: str, description: str = None):
    name = f"transfer_to_{agent_name}"
    description = description or f"Transfer to {agent_name}"
    
    @tool(name, description=description)
    def handoff_tool(
        reason: str,  # Motivo da transferência
        context: str,  # Contexto relevante
        priority: Literal["low", "medium", "high"] = "medium",
        state: Annotated[MessagesState, InjectedState],
        tool_call_id: Annotated[str, InjectedToolCallId],
    ) -> Command:
        
        # Mensagem de handoff com contexto
        handoff_message = f"""
🔄 Transferência de Atendimento
Para: {agent_name}
Motivo: {reason}
Prioridade: {priority}
Contexto: {context}
"""
        
        tool_message = {
            "role": "tool",
            "content": handoff_message,
            "name": name,
            "tool_call_id": tool_call_id,
        }
        
        # Adicionar contexto ao estado
        enhanced_state = {
            **state,
            "handoff_context": {
                "from_agent": state.get("current_agent", "unknown"),
                "to_agent": agent_name,
                "reason": reason,
                "priority": priority,
                "timestamp": datetime.now().isoformat()
            }
        }
        
        return Command(
            goto=agent_name,
            update={
                "messages": state["messages"] + [tool_message],
                "handoff_history": state.get("handoff_history", []) + [enhanced_state["handoff_context"]]
            },
            graph=Command.PARENT,
        )
    
    return handoff_tool
```

## 🏗️ Padrão 5: Sistema Hierárquico Completo

```python
# Estado para equipes
class TeamState(MessagesState):
    team_name: str
    task_status: str
    results: Dict[str, Any]

# Supervisor de equipe de vendas
def sales_team_supervisor(state: TeamState) -> Command[Literal["price_analyst", "negotiator", END]]:
    """Supervisor da equipe de vendas"""
    
    messages = state["messages"]
    
    # Lógica de roteamento
    if not state.get("results", {}).get("price_calculated"):
        return Command(goto="price_analyst")
    elif not state.get("results", {}).get("negotiation_complete"):
        return Command(goto="negotiator")
    else:
        return Command(goto=END)

def price_analyst(state: TeamState) -> Command[Literal["sales_team_supervisor"]]:
    """Analista de preços"""
    
    # Calcular preço com margem
    quote = get_bitcoin_quote(5000)  # Exemplo
    
    return Command(
        goto="sales_team_supervisor",
        update={
            "messages": [{"role": "assistant", "content": quote}],
            "results": {"price_calculated": True, "quote": quote}
        }
    )

# Construir subgrafo da equipe de vendas
sales_team_builder = StateGraph(TeamState)
sales_team_builder.add_node("sales_team_supervisor", sales_team_supervisor)
sales_team_builder.add_node("price_analyst", price_analyst)
sales_team_builder.add_node("negotiator", lambda s: Command(goto="sales_team_supervisor"))
sales_team_builder.add_edge(START, "sales_team_supervisor")
sales_team_graph = sales_team_builder.compile()

# Supervisor principal
def top_supervisor(state: MessagesState) -> Command[Literal["sales_team", "support_team", END]]:
    """Supervisor principal que gerencia equipes"""
    
    last_message = state["messages"][-1].content
    
    if "comprar" in last_message or "vender" in last_message:
        return Command(goto="sales_team")
    elif "ajuda" in last_message or "suporte" in last_message:
        return Command(goto="support_team")
    else:
        return Command(goto=END)

# Construir sistema principal
main_builder = StateGraph(MessagesState)
main_builder.add_node("top_supervisor", top_supervisor)
main_builder.add_node("sales_team", sales_team_graph)  # Subgrafo
main_builder.add_node("support_team", lambda s: Command(goto="top_supervisor"))  # Placeholder

main_builder.add_edge(START, "top_supervisor")
main_builder.add_edge("sales_team", "top_supervisor")
main_builder.add_edge("support_team", "top_supervisor")

hierarchical_system = main_builder.compile()
```

## 🧠 Padrão 6: Sistema com Memória e Contexto

```python
from langgraph.checkpoint.memory import MemorySaver

# Estado com histórico de cliente
class CustomerState(MessagesState):
    customer_id: str
    interaction_history: List[Dict[str, Any]]
    preferences: Dict[str, Any]
    total_traded: float
    vip_status: bool

def analyze_customer(state: CustomerState) -> CustomerState:
    """Analisa histórico do cliente"""
    
    # Simular análise de histórico
    total = sum(t.get("amount", 0) for t in state.get("interaction_history", []))
    
    state["total_traded"] = total
    state["vip_status"] = total > 100000  # VIP se já negociou > 100k
    
    return state

def personalized_agent(state: CustomerState) -> Command[Literal[END]]:
    """Agente que personaliza atendimento baseado no histórico"""
    
    if state.get("vip_status"):
        greeting = "Olá! É um prazer tê-lo de volta. Como seu consultor VIP, "
        benefits = "\n🌟 Benefícios VIP: Taxa reduzida (1.5%), Suporte prioritário"
    else:
        greeting = "Bem-vindo à Rio Porto P2P! "
        benefits = ""
    
    # Personalizar baseado em preferências
    if state.get("preferences", {}).get("prefers_whatsapp"):
        contact = "WhatsApp"
    else:
        contact = "telefone"
        
    response = f"""
{greeting}estou aqui para ajudar.

Vejo que você já negociou R$ {state.get('total_traded', 0):,.2f} conosco.{benefits}

Como prefere ser atendido hoje? Posso ajudar via {contact}.
"""
    
    return Command(
        goto=END,
        update={"messages": [{"role": "assistant", "content": response}]}
    )

# Criar grafo com memória
memory_builder = StateGraph(CustomerState)
memory_builder.add_node("analyze", analyze_customer)
memory_builder.add_node("personalize", personalized_agent)
memory_builder.add_edge(START, "analyze")
memory_builder.add_edge("analyze", "personalize")

# Compilar com checkpointer para persistência
checkpointer = MemorySaver()
memory_graph = memory_builder.compile(checkpointer=checkpointer)

# Executar com thread_id para manter contexto
import uuid

thread_config = {"configurable": {"thread_id": "customer_123"}}

# Primeira interação
result1 = memory_graph.invoke({
    "messages": [{"role": "user", "content": "Olá"}],
    "customer_id": "123",
    "interaction_history": [
        {"date": "2024-01-15", "type": "buy", "amount": 50000},
        {"date": "2024-02-20", "type": "buy", "amount": 75000}
    ],
    "preferences": {"prefers_whatsapp": True}
}, config=thread_config)

# Segunda interação - mantém contexto
result2 = memory_graph.invoke({
    "messages": [{"role": "user", "content": "Quero comprar mais Bitcoin"}]
}, config=thread_config)
```

## 🚀 Sistema Completo Rio Porto P2P

```python
# Sistema integrado com todos os padrões
class RioPortoLangGraphSystem:
    def __init__(self):
        self.setup_tools()
        self.setup_agents()
        self.setup_graph()
        
    def setup_tools(self):
        """Configura todas as ferramentas"""
        
        @tool
        def get_real_time_quote(amount: float) -> Dict[str, Any]:
            """Obtém cotação em tempo real via API"""
            # Integrar com API real
            btc_price = 250000
            return {
                "btc_price": btc_price,
                "amount_btc": amount / btc_price,
                "fee": amount * 0.02,
                "total": amount * 1.02,
                "expires_at": (datetime.now() + timedelta(minutes=15)).isoformat()
            }
        
        @tool 
        def create_order(customer_id: str, amount: float, operation: str) -> str:
            """Cria ordem no sistema"""
            order_id = f"ORD-{uuid.uuid4().hex[:8]}"
            
            # Salvar no banco
            return f"""
Ordem criada com sucesso!
ID: {order_id}
Valor: R$ {amount:,.2f}
Operação: {operation}

Próximos passos:
1. Faça o PIX para: 12.345.678/0001-90
2. Envie comprovante via WhatsApp
3. Receba seu Bitcoin em até 30 minutos
"""

        @tool
        def check_kyc_status(customer_id: str) -> Dict[str, Any]:
            """Verifica status KYC do cliente"""
            # Simular verificação
            return {
                "verified": True,
                "level": "basic",
                "limits": {"daily": 50000, "monthly": 300000}
            }
        
        self.tools = {
            "quote": get_real_time_quote,
            "order": create_order,
            "kyc": check_kyc_status
        }
        
    def setup_agents(self):
        """Configura agentes especializados"""
        
        # Agente KYC/Onboarding
        self.kyc_agent = create_react_agent(
            model="gpt-4",
            tools=[self.tools["kyc"]],
            prompt="Verifique KYC e limites do cliente",
            name="kyc_agent"
        )
        
        # Agente de Trading
        self.trading_agent = create_react_agent(
            model="gpt-4",
            tools=[self.tools["quote"], self.tools["order"]],
            prompt="Execute ordens de compra/venda com precisão",
            name="trading_agent"
        )
        
    def setup_graph(self):
        """Configura o grafo principal"""
        
        # Estado principal
        class MainState(MessagesState):
            customer_verified: bool = False
            order_details: Dict[str, Any] = {}
            
        # Nó de entrada
        def entry_node(state: MainState) -> Command[Literal["kyc_agent", "trading_agent", END]]:
            if not state.get("customer_verified"):
                return Command(goto="kyc_agent")
            else:
                return Command(goto="trading_agent")
        
        # Construir grafo
        builder = StateGraph(MainState)
        builder.add_node("entry", entry_node)
        builder.add_node("kyc_agent", self.kyc_agent)
        builder.add_node("trading_agent", self.trading_agent)
        
        builder.add_edge(START, "entry")
        builder.add_edge("kyc_agent", "trading_agent")
        builder.add_edge("trading_agent", END)
        
        self.graph = builder.compile(checkpointer=MemorySaver())
        
    def process_message(self, message: str, customer_id: str):
        """Processa mensagem do cliente"""
        
        thread_config = {"configurable": {"thread_id": customer_id}}
        
        result = self.graph.invoke({
            "messages": [{"role": "user", "content": message}],
            "customer_id": customer_id
        }, config=thread_config)
        
        return result["messages"][-1].content

# Usar o sistema
system = RioPortoLangGraphSystem()
response = system.process_message(
    "Quero comprar R$ 10.000 em Bitcoin",
    "customer_123"
)
print(response)
```

## 📊 Visualização e Debug

```python
# Visualizar grafo
from IPython.display import Image, display

# Gerar diagrama Mermaid
display(Image(network.get_graph().draw_mermaid_png()))

# Debug com streaming detalhado
for chunk in graph.stream(
    {"messages": [{"role": "user", "content": "teste"}]},
    stream_mode="values",
    debug=True
):
    print("=" * 50)
    print(chunk)
```

## 🎯 Melhores Práticas LangGraph

1. **State Design**: Projete estados que capturem toda informação necessária
2. **Command Pattern**: Use Command para controle preciso de fluxo
3. **Subgraphs**: Modularize sistemas complexos
4. **Error Handling**: Implemente nós de fallback
5. **Checkpointing**: Use para conversas com contexto
6. **Tool Design**: Ferramentas devem ser atômicas e bem documentadas
7. **Testing**: Teste cada nó e caminho independentemente

---

**LangGraph é ideal para**: Sistemas que precisam de controle fino sobre fluxo de execução, estados complexos e integração profunda com o ecossistema LangChain.

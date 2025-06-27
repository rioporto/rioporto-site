# 🤖 Exemplos Práticos - Agentes Rio Porto P2P

## 1. Agente de Cotação Simples

```python
# examples/simple_quote_agent.py
from crewai import Agent, Task, Crew
import requests
from datetime import datetime

# Criar agente de cotação
quote_agent = Agent(
    role="Especialista em Cotação Bitcoin",
    goal="Fornecer cotações precisas e rápidas",
    backstory="Sou especialista em mercado de criptomoedas com anos de experiência",
    verbose=True
)

# Função para obter cotação real
def get_bitcoin_price():
    try:
        # API pública gratuita
        response = requests.get('https://api.coinbase.com/v2/exchange-rates?currency=BTC')
        data = response.json()
        usd_price = float(data['data']['rates']['USD'])
        
        # Conversão simples USD -> BRL
        brl_price = usd_price * 5.20  # Taxa aproximada
        
        return {
            "usd": usd_price,
            "brl": brl_price,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    except:
        return None

# Task de cotação
quote_task = Task(
    description="""
    Forneça a cotação atual do Bitcoin incluindo:
    1. Preço em Reais
    2. Taxa da Rio Porto (2%)
    3. Valor final com taxa
    4. Validade da cotação (15 minutos)
    
    Use a função get_bitcoin_price() para obter dados reais.
    """,
    expected_output="Cotação formatada e clara para o cliente",
    agent=quote_agent
)

# Executar
crew = Crew(agents=[quote_agent], tasks=[quote_task])
result = crew.kickoff()
print(result)
```

## 2. Sistema Multi-Agente com Handoff

```python
# examples/multi_agent_handoff.py
from crewai import Agent, Task, Crew, Process
from langchain.tools import tool

# Ferramenta de transferência
@tool
def transfer_to_specialist(specialist: str, reason: str):
    """Transfere para outro especialista"""
    return f"Transferindo para {specialist}: {reason}"

# Agente recepcionista
receptionist = Agent(
    role="Recepcionista Virtual",
    goal="Receber clientes e direcionar para o especialista correto",
    backstory="Sou o primeiro contato, sempre cordial e eficiente",
    tools=[transfer_to_specialist],
    allow_delegation=True
)

# Especialista em vendas
sales_specialist = Agent(
    role="Especialista em Vendas",
    goal="Converter interessados em clientes",
    backstory="Expert em vendas consultivas de Bitcoin",
    allow_delegation=False
)

# Especialista em suporte
support_specialist = Agent(
    role="Especialista em Suporte",
    goal="Resolver problemas técnicos",
    backstory="Especialista técnico em carteiras e segurança",
    allow_delegation=False
)

# Task principal
main_task = Task(
    description="""
    Cliente disse: "Nunca comprei Bitcoin mas tenho interesse. Como funciona?"
    
    1. Receba cordialmente
    2. Identifique a necessidade
    3. Transfira para o especialista apropriado
    4. Garanta que o cliente foi bem atendido
    """,
    expected_output="Cliente direcionado e atendido adequadamente",
    agent=receptionist
)

# Crew hierárquico
crew = Crew(
    agents=[receptionist, sales_specialist, support_specialist],
    tasks=[main_task],
    process=Process.hierarchical,
    manager_llm="gpt-4",
    verbose=True
)

result = crew.kickoff()
print(result)
```

## 3. Agente com Memória de Contexto

```python
# examples/agent_with_memory.py
from crewai import Agent, Task, Crew
from typing import Dict, List
import json

class CustomerMemory:
    def __init__(self):
        self.memory_file = "customer_memory.json"
        self.load_memory()
    
    def load_memory(self):
        try:
            with open(self.memory_file, 'r') as f:
                self.data = json.load(f)
        except:
            self.data = {}
    
    def save_memory(self):
        with open(self.memory_file, 'w') as f:
            json.dump(self.data, f, indent=2)
    
    def get_customer(self, phone: str) -> Dict:
        return self.data.get(phone, {
            "interactions": [],
            "total_traded": 0,
            "preferences": {}
        })
    
    def update_customer(self, phone: str, interaction: Dict):
        if phone not in self.data:
            self.data[phone] = self.get_customer(phone)
        
        self.data[phone]["interactions"].append(interaction)
        self.save_memory()

# Instância de memória
memory = CustomerMemory()

# Agente com contexto
contextual_agent = Agent(
    role="Consultor Personalizado",
    goal="Fornecer atendimento personalizado baseado no histórico",
    backstory="Conheço cada cliente e suas preferências",
    verbose=True
)

# Task com contexto
def create_contextual_task(phone: str, message: str):
    customer_data = memory.get_customer(phone)
    
    return Task(
        description=f"""
        Cliente: {phone}
        Mensagem: {message}
        
        Histórico do cliente:
        - Total negociado: R$ {customer_data['total_traded']:,.2f}
        - Interações anteriores: {len(customer_data['interactions'])}
        - Preferências: {customer_data.get('preferences', {})}
        
        Forneça atendimento personalizado considerando o histórico.
        """,
        expected_output="Resposta personalizada baseada no contexto",
        agent=contextual_agent
    )

# Simular interações
phone = "+5521999999999"
messages = [
    "Olá, quero saber sobre Bitcoin",
    "Qual o valor mínimo?",
    "Ok, quero comprar R$ 500"
]

for msg in messages:
    task = create_contextual_task(phone, msg)
    crew = Crew(agents=[contextual_agent], tasks=[task])
    result = crew.kickoff()
    
    # Salvar interação
    memory.update_customer(phone, {
        "message": msg,
        "response": str(result),
        "timestamp": datetime.now().isoformat()
    })
    
    print(f"Cliente: {msg}")
    print(f"Agente: {result}\n")
```

## 4. Sistema Completo com WhatsApp

```python
# examples/whatsapp_integration.py
from fastapi import FastAPI, Form
from twilio.rest import Client
from crewai import Agent, Task, Crew
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Cliente Twilio
twilio_client = Client(
    os.getenv('TWILIO_ACCOUNT_SID'),
    os.getenv('TWILIO_AUTH_TOKEN')
)

# Agente principal
main_agent = Agent(
    role="Assistente Rio Porto P2P",
    goal="Atender clientes via WhatsApp",
    backstory="Assistente virtual especializado em Bitcoin",
    verbose=True
)

@app.post("/whatsapp/webhook")
async def whatsapp_webhook(
    From: str = Form(...),
    Body: str = Form(...)
):
    """Recebe mensagens do WhatsApp"""
    
    # Criar task específica
    task = Task(
        description=f"Responda a mensagem: {Body}",
        expected_output="Resposta clara e profissional",
        agent=main_agent
    )
    
    # Processar com CrewAI
    crew = Crew(agents=[main_agent], tasks=[task])
    response = crew.kickoff()
    
    # Enviar resposta via Twilio
    message = twilio_client.messages.create(
        body=str(response),
        from_=os.getenv('TWILIO_WHATSAPP_NUMBER'),
        to=From
    )
    
    return {"status": "success", "message_sid": message.sid}

# Executar: uvicorn examples.whatsapp_integration:app --reload
```

## 5. Agente com Ferramentas de Bitcoin

```python
# examples/bitcoin_tools_agent.py
from crewai import Agent
from langchain.tools import tool
from typing import Dict
import ccxt  # pip install ccxt

# Ferramentas especializadas
@tool
def get_bitcoin_price_brazil() -> Dict:
    """Obtém preço do Bitcoin em exchanges brasileiras"""
    try:
        # Mercado Bitcoin
        exchange = ccxt.mercadobitcoin()
        ticker = exchange.fetch_ticker('BTC/BRL')
        
        return {
            "exchange": "Mercado Bitcoin",
            "price": ticker['last'],
            "volume_24h": ticker['baseVolume'],
            "change_24h": ticker['percentage']
        }
    except Exception as e:
        return {"error": str(e)}

@tool
def calculate_profit_loss(buy_price: float, current_price: float, amount: float) -> Dict:
    """Calcula lucro/prejuízo de uma operação"""
    profit = (current_price - buy_price) * amount
    percentage = ((current_price - buy_price) / buy_price) * 100
    
    return {
        "buy_price": buy_price,
        "current_price": current_price,
        "amount": amount,
        "profit_loss": profit,
        "percentage": percentage,
        "status": "profit" if profit > 0 else "loss"
    }

@tool
def estimate_transaction_time() -> str:
    """Estima tempo de confirmação da transação"""
    import requests
    
    try:
        # API para fee estimation
        response = requests.get('https://mempool.space/api/v1/fees/recommended')
        fees = response.json()
        
        if fees['fastestFee'] > 50:
            return "Alta congestion: 10-30 minutos"
        elif fees['fastestFee'] > 20:
            return "Congestion moderada: 30-60 minutos"
        else:
            return "Rede normal: 10-20 minutos"
    except:
        return "Tempo estimado: 10-60 minutos"

# Agente com ferramentas
bitcoin_expert = Agent(
    role="Especialista Bitcoin",
    goal="Fornecer análises precisas sobre Bitcoin",
    backstory="Analista com 10 anos de experiência em crypto",
    tools=[
        get_bitcoin_price_brazil,
        calculate_profit_loss,
        estimate_transaction_time
    ],
    verbose=True
)

# Task de análise
analysis_task = Task(
    description="""
    Cliente comprou 0.01 BTC por R$ 2.500 há 6 meses.
    
    Forneça:
    1. Cotação atual
    2. Análise de lucro/prejuízo
    3. Tempo estimado para nova transação
    4. Recomendação (manter/vender)
    """,
    expected_output="Análise completa com recomendações",
    agent=bitcoin_expert
)

crew = Crew(agents=[bitcoin_expert], tasks=[analysis_task])
result = crew.kickoff()
print(result)
```

## 6. Sistema de Compliance Automatizado

```python
# examples/compliance_agent.py
from crewai import Agent, Task
from langchain.tools import tool
from datetime import datetime, timedelta
from typing import Dict

@tool
def check_monthly_limit(customer_id: str, amount: float) -> Dict:
    """Verifica limite mensal IN 1888"""
    # Simular busca no banco
    current_month_total = 25000  # Exemplo
    
    new_total = current_month_total + amount
    needs_declaration = new_total > 30000
    
    return {
        "current_month": current_month_total,
        "new_operation": amount,
        "total": new_total,
        "limit": 30000,
        "needs_declaration": needs_declaration,
        "remaining": max(0, 30000 - new_total)
    }

@tool
def calculate_capital_gains(buy_price: float, sell_price: float, amount_btc: float) -> Dict:
    """Calcula ganho de capital para IR"""
    buy_total = buy_price * amount_btc
    sell_total = sell_price * amount_btc
    gain = sell_total - buy_total
    
    # Isenção mensal: R$ 35.000
    if sell_total <= 35000:
        tax = 0
        rate = "Isento"
    else:
        # Alíquota de 15%
        tax = gain * 0.15
        rate = "15%"
    
    return {
        "buy_total": buy_total,
        "sell_total": sell_total,
        "gain": gain,
        "tax": tax,
        "rate": rate,
        "due_date": (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
    }

@tool
def generate_tax_report(customer_id: str, year: int) -> str:
    """Gera relatório para declaração"""
    # Simular dados
    transactions = [
        {"date": "2024-03-15", "type": "buy", "amount": 0.1, "price": 250000},
        {"date": "2024-06-20", "type": "sell", "amount": 0.05, "price": 280000},
        {"date": "2024-09-10", "type": "buy", "amount": 0.2, "price": 245000}
    ]
    
    report = f"RELATÓRIO FISCAL {year} - Cliente {customer_id}\n\n"
    report += "TRANSAÇÕES:\n"
    
    for t in transactions:
        report += f"- {t['date']}: {t['type'].upper()} {t['amount']} BTC @ R$ {t['price']:,.2f}\n"
    
    return report

# Agente de compliance
compliance_agent = Agent(
    role="Oficial de Compliance Cripto",
    goal="Garantir conformidade fiscal e regulatória",
    backstory="Advogado tributarista especializado em criptoativos",
    tools=[check_monthly_limit, calculate_capital_gains, generate_tax_report],
    verbose=True
)

# Task de verificação
compliance_task = Task(
    description="""
    Cliente quer vender 0.5 BTC por R$ 125.000.
    Comprou por R$ 100.000.
    
    Verifique:
    1. Limite IN 1888
    2. Cálculo de ganho de capital
    3. Orientações fiscais
    4. Documentação necessária
    """,
    expected_output="Relatório completo de compliance",
    agent=compliance_agent
)

crew = Crew(agents=[compliance_agent], tasks=[compliance_task])
result = crew.kickoff()
print(result)
```

## 7. Dashboard de Monitoramento

```python
# examples/monitoring_dashboard.py
import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
import random

# Título
st.set_page_config(page_title="Rio Porto P2P - Dashboard", layout="wide")
st.title("🪙 Rio Porto P2P - Dashboard Multi-Agentes")

# Métricas principais
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric(
        "Mensagens Hoje",
        f"{random.randint(800, 1200):,}",
        f"+{random.randint(5, 20)}%"
    )

with col2:
    st.metric(
        "Taxa de Resolução",
        f"{random.randint(85, 95)}%",
        f"+{random.randint(1, 5)}%"
    )

with col3:
    st.metric(
        "Tempo Médio Resposta",
        f"{random.uniform(1.5, 3.5):.1f}s",
        f"-{random.uniform(0.1, 0.5):.1f}s"
    )

with col4:
    st.metric(
        "Clientes Ativos",
        f"{random.randint(300, 500):,}",
        f"+{random.randint(10, 30)}"
    )

# Gráficos
st.markdown("---")
col1, col2 = st.columns(2)

with col1:
    # Distribuição de intents
    st.subheader("📊 Distribuição de Solicitações")
    intents = pd.DataFrame({
        'Tipo': ['Cotação', 'Compra', 'Venda', 'Suporte', 'Compliance'],
        'Quantidade': [
            random.randint(300, 400),
            random.randint(200, 300),
            random.randint(100, 200),
            random.randint(150, 250),
            random.randint(50, 100)
        ]
    })
    fig = px.pie(intents, values='Quantidade', names='Tipo')
    st.plotly_chart(fig)

with col2:
    # Performance por agente
    st.subheader("🤖 Performance por Agente")
    agents = pd.DataFrame({
        'Agente': ['Supervisor', 'Cotação', 'Compliance', 'Suporte', 'Vendas'],
        'Mensagens': [
            random.randint(500, 600),
            random.randint(300, 400),
            random.randint(100, 200),
            random.randint(200, 300),
            random.randint(150, 250)
        ],
        'Tempo Médio (s)': [
            random.uniform(1, 2),
            random.uniform(2, 3),
            random.uniform(3, 4),
            random.uniform(2.5, 3.5),
            random.uniform(2, 3)
        ]
    })
    fig = px.bar(agents, x='Agente', y='Mensagens')
    st.plotly_chart(fig)

# Logs em tempo real
st.markdown("---")
st.subheader("📝 Logs em Tempo Real")

# Simular logs
logs = []
for i in range(10):
    timestamp = datetime.now() - timedelta(minutes=random.randint(0, 60))
    logs.append({
        'Timestamp': timestamp.strftime('%H:%M:%S'),
        'Cliente': f"+5521{random.randint(900000000, 999999999)}",
        'Agente': random.choice(['Supervisor', 'Cotação', 'Compliance', 'Suporte']),
        'Intent': random.choice(['buy', 'sell', 'quote', 'support']),
        'Status': random.choice(['✅ Resolvido', '⏳ Em andamento', '🔄 Transferido'])
    })

df_logs = pd.DataFrame(logs)
st.dataframe(df_logs, use_container_width=True)

# Atualização automática
if st.button("🔄 Atualizar Dashboard"):
    st.rerun()

# Executar: streamlit run examples/monitoring_dashboard.py
```

## 8. Script de Deploy Automatizado

```python
# examples/deploy_script.py
#!/usr/bin/env python3
import os
import subprocess
import sys
from pathlib import Path

def run_command(cmd, description):
    """Executa comando e verifica sucesso"""
    print(f"\n🚀 {description}...")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"❌ Erro: {result.stderr}")
        sys.exit(1)
    else:
        print(f"✅ {description} concluído!")
        return result.stdout

def deploy_agents():
    """Deploy completo do sistema de agentes"""
    
    # 1. Verificar ambiente
    print("🔍 Verificando ambiente...")
    
    required_vars = [
        'OPENAI_API_KEY',
        'DATABASE_URL',
        'REDIS_URL',
        'TWILIO_ACCOUNT_SID'
    ]
    
    missing = [var for var in required_vars if not os.getenv(var)]
    if missing:
        print(f"❌ Variáveis faltando: {', '.join(missing)}")
        sys.exit(1)
    
    # 2. Instalar dependências
    run_command(
        "pip install -r requirements-agents.txt",
        "Instalando dependências"
    )
    
    # 3. Executar testes
    run_command(
        "pytest tests/agents -v",
        "Executando testes"
    )
    
    # 4. Build Docker
    run_command(
        "docker build -t rioporto-agents:latest -f Dockerfile.agents .",
        "Construindo imagem Docker"
    )
    
    # 5. Deploy
    print("\n📦 Fazendo deploy...")
    
    # Opção 1: Docker Compose
    if Path("docker-compose.agents.yml").exists():
        run_command(
            "docker-compose -f docker-compose.agents.yml up -d",
            "Deploy com Docker Compose"
        )
    
    # Opção 2: Kubernetes
    elif Path("k8s/agents-deployment.yaml").exists():
        run_command(
            "kubectl apply -f k8s/agents-deployment.yaml",
            "Deploy no Kubernetes"
        )
    
    # Opção 3: Heroku
    elif os.getenv('HEROKU_APP_NAME'):
        app_name = os.getenv('HEROKU_APP_NAME')
        run_command(
            f"heroku container:push web -a {app_name}",
            "Push para Heroku"
        )
        run_command(
            f"heroku container:release web -a {app_name}",
            "Release no Heroku"
        )
    
    print("\n✅ Deploy concluído com sucesso!")
    print("🌐 Sistema de agentes está online!")
    
    # 6. Verificar saúde
    import time
    import requests
    
    time.sleep(10)  # Aguardar inicialização
    
    try:
        response = requests.get("http://localhost:8001/health")
        if response.status_code == 200:
            print("✅ Sistema está saudável!")
        else:
            print("⚠️  Sistema pode estar com problemas")
    except:
        print("⚠️  Não foi possível verificar saúde do sistema")

if __name__ == "__main__":
    deploy_agents()
```

---

## 🎯 Como Usar os Exemplos

1. **Instale as dependências**:
   ```bash
   pip install crewai langchain streamlit ccxt twilio fastapi
   ```

2. **Configure as variáveis de ambiente**:
   ```bash
   cp .env.example .env.agents
   # Edite .env.agents com suas chaves
   ```

3. **Execute os exemplos**:
   ```bash
   python examples/simple_quote_agent.py
   python examples/multi_agent_handoff.py
   # etc...
   ```

4. **Adapte para seu caso**:
   - Modifique prompts
   - Adicione ferramentas
   - Integre com suas APIs

## 📚 Recursos Extras

- [Vídeo: CrewAI Tutorial](https://youtube.com/...)
- [Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)

---

**Dica**: Comece com exemplos simples e vá aumentando a complexidade gradualmente!

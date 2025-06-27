# 🚀 Padrão Recomendado: Sistema Multi-Agente Rio Porto P2P

## 🎯 Arquitetura Final com CrewAI

Este documento apresenta a implementação completa e otimizada do sistema multi-agente para a Rio Porto P2P, usando CrewAI como framework principal.

## 📦 Dependências

```bash
# requirements-agents.txt
crewai==0.1.0
crewai[tools]==0.1.0
langchain-openai==0.1.0
python-dotenv==1.0.0
pydantic==2.5.0
requests==2.31.0
redis==5.0.1  # Para cache
psycopg2-binary==2.9.9  # Para PostgreSQL
twilio==8.10.0  # Para WhatsApp
```

## 🏗️ Estrutura do Projeto

```
rioporto-site/
├── agents/
│   ├── __init__.py
│   ├── config/
│   │   ├── agents.yaml
│   │   └── tasks.yaml
│   ├── core/
│   │   ├── __init__.py
│   │   ├── supervisor.py
│   │   ├── cotacao_agent.py
│   │   ├── compliance_agent.py
│   │   ├── suporte_agent.py
│   │   └── vendas_agent.py
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── bitcoin_tools.py
│   │   ├── database_tools.py
│   │   ├── whatsapp_tools.py
│   │   └── compliance_tools.py
│   ├── flows/
│   │   ├── __init__.py
│   │   ├── customer_flow.py
│   │   └── states.py
│   └── main.py
├── api/
│   ├── webhooks/
│   │   └── whatsapp.py
│   └── routes/
│       └── agents.py
└── tests/
    └── agents/
```

## 💻 Implementação Completa

### 1. Configuração Base (agents/config/agents.yaml)

```yaml
# agents/config/agents.yaml
supervisor:
  role: >
    Supervisor de Atendimento Rio Porto P2P
  goal: >
    Coordenar o atendimento ao cliente direcionando para o agente especializado
    mais adequado, garantindo uma experiência excepcional e resolutiva
  backstory: >
    Você é o supervisor sênior da Rio Porto P2P com 10 anos de experiência
    em atendimento ao cliente no mercado de criptomoedas. Você conhece
    profundamente cada especialista da equipe e sabe exatamente quando
    acionar cada um. Sua missão é garantir que cada cliente receba o
    melhor atendimento possível.
  llm: gpt-4
  max_iter: 5
  allow_delegation: true

cotacao_specialist:
  role: >
    Especialista em Cotação e Trading de Bitcoin
  goal: >
    Fornecer cotações precisas e atualizadas de Bitcoin, explicar taxas
    e condições de forma clara, e auxiliar clientes a tomar decisões informadas
  backstory: >
    Você é trader profissional com certificação e 8 anos de experiência
    no mercado de criptomoedas. Especializado em análise de mercado e
    precificação, você tem acesso a múltiplas fontes de dados e sempre
    fornece as melhores condições para os clientes da Rio Porto P2P.
    Você é conhecido por sua precisão e transparência.
  llm: gpt-4
  tools:
    - bitcoin_price_tool
    - fee_calculator_tool
    - market_analysis_tool
  
compliance_specialist:
  role: >
    Oficial de Compliance e Especialista Fiscal
  goal: >
    Orientar clientes sobre aspectos legais, fiscais e regulatórios
    das transações com Bitcoin no Brasil
  backstory: >
    Você é advogado especializado em direito tributário e compliance
    com foco em criptoativos. Com mestrado em Direito Digital e
    certificações internacionais, você domina toda a legislação
    brasileira sobre criptomoedas, incluindo IN 1888, IRPF e
    prevenção à lavagem de dinheiro. Sempre atualizado com as
    últimas mudanças regulatórias.
  llm: gpt-4
  tools:
    - compliance_checker_tool
    - tax_calculator_tool
    - document_validator_tool

suporte_specialist:
  role: >
    Especialista em Segurança e Suporte Técnico
  goal: >
    Educar e auxiliar clientes em questões de segurança, carteiras
    e melhores práticas de autocustódia
  backstory: >
    Você é um white hat hacker e especialista em segurança blockchain
    com certificações em segurança da informação. Participou do
    desenvolvimento de carteiras hardware e é contribuidor ativo
    em projetos open source de segurança cripto. Sua missão é
    tornar a autocustódia acessível e segura para todos.
  llm: gpt-3.5-turbo
  tools:
    - wallet_recommendation_tool
    - security_checker_tool
    - tutorial_generator_tool

vendas_specialist:
  role: >
    Consultor de Vendas e Relacionamento
  goal: >
    Converter leads em clientes satisfeitos através de consultoria
    personalizada e acompanhamento próximo
  backstory: >
    Você é consultor de vendas premiado com especialização em
    vendas consultivas B2C. Com formação em psicologia do consumidor
    e experiência em private banking, você entende profundamente
    as necessidades e receios dos clientes. Seu approach é sempre
    educativo e nunca pushy.
  llm: gpt-4
  tools:
    - crm_tool
    - quote_generator_tool
    - followup_scheduler_tool
```

### 2. Ferramentas Customizadas (agents/tools/bitcoin_tools.py)

```python
# agents/tools/bitcoin_tools.py
from crewai_tools import BaseTool
from typing import Dict, Any, Optional
import requests
from datetime import datetime, timedelta
import redis
import json
from decimal import Decimal

# Cache Redis para otimização
cache = redis.Redis(host='localhost', port=6379, decode_responses=True)

class BitcoinPriceTool(BaseTool):
    name: str = "Bitcoin Price Checker"
    description: str = "Obtém cotação atualizada do Bitcoin com spread Rio Porto"
    
    def _run(self, amount_brl: Optional[float] = None, operation: str = "buy") -> Dict[str, Any]:
        """
        Obtém cotação do Bitcoin com cache inteligente
        """
        cache_key = f"btc_price:{operation}"
        cached = cache.get(cache_key)
        
        if cached:
            price_data = json.loads(cached)
        else:
            # Buscar de múltiplas fontes
            price_data = self._fetch_aggregated_price()
            cache.setex(cache_key, 60, json.dumps(price_data))  # Cache por 1 minuto
        
        # Aplicar spread Rio Porto
        base_price = price_data['price']
        if operation == "buy":
            final_price = base_price * Decimal('1.02')  # 2% spread compra
        else:
            final_price = base_price * Decimal('0.98')  # 2% spread venda
            
        result = {
            "operation": operation,
            "base_price": float(base_price),
            "final_price": float(final_price),
            "spread": "2%",
            "minimum": 100.0,
            "maximum": 500000.0,
            "valid_until": (datetime.now() + timedelta(minutes=15)).isoformat(),
            "sources": price_data['sources']
        }
        
        if amount_brl:
            if amount_brl < result['minimum']:
                result['error'] = f"Valor mínimo é R$ {result['minimum']}"
            elif amount_brl > result['maximum']:
                result['error'] = f"Valor máximo é R$ {result['maximum']}"
            else:
                result['amount_brl'] = amount_brl
                result['amount_btc'] = float(Decimal(str(amount_brl)) / final_price)
                result['total_with_fee'] = float(amount_brl)
                
        return result
    
    def _fetch_aggregated_price(self) -> Dict[str, Any]:
        """Busca preço de múltiplas exchanges e retorna média"""
        sources = []
        prices = []
        
        # Binance
        try:
            resp = requests.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCBRL', timeout=3)
            if resp.status_code == 200:
                price = float(resp.json()['price'])
                prices.append(price)
                sources.append({"name": "Binance", "price": price})
        except:
            pass
            
        # Mercado Bitcoin
        try:
            resp = requests.get('https://api.mercadobitcoin.net/api/v4/tickers?symbols=BTC-BRL', timeout=3)
            if resp.status_code == 200:
                price = float(resp.json()[0]['last'])
                prices.append(price)
                sources.append({"name": "Mercado Bitcoin", "price": price})
        except:
            pass
            
        # Fallback para API internacional + conversão
        if not prices:
            resp = requests.get('https://api.coinbase.com/v2/exchange-rates?currency=BTC')
            usd_price = float(resp.json()['data']['rates']['USD'])
            
            # Buscar USD/BRL
            resp = requests.get('https://api.exchangerate-api.com/v4/latest/USD')
            brl_rate = resp.json()['rates']['BRL']
            
            price = usd_price * brl_rate
            prices.append(price)
            sources.append({"name": "Coinbase+Forex", "price": price})
            
        avg_price = sum(prices) / len(prices)
        
        return {
            "price": avg_price,
            "sources": sources,
            "timestamp": datetime.now().isoformat()
        }

class FeeCalculatorTool(BaseTool):
    name: str = "Fee Calculator"
    description: str = "Calcula taxas e valores finais para transações"
    
    def _run(self, amount: float, payment_method: str = "PIX") -> Dict[str, Any]:
        """Calcula taxas baseado no método de pagamento"""
        
        # Taxas por método
        payment_fees = {
            "PIX": 0.0,
            "TED": 10.0,
            "DOC": 15.0,
            "BOLETO": 5.0
        }
        
        # Taxa Rio Porto (2%)
        rio_porto_fee = amount * 0.02
        
        # Taxa do método de pagamento
        payment_fee = payment_fees.get(payment_method.upper(), 0)
        
        # Total
        total_fees = rio_porto_fee + payment_fee
        final_amount = amount + total_fees
        
        return {
            "amount": amount,
            "payment_method": payment_method,
            "rio_porto_fee": rio_porto_fee,
            "rio_porto_fee_percent": "2%",
            "payment_method_fee": payment_fee,
            "total_fees": total_fees,
            "final_amount": final_amount,
            "breakdown": {
                "Valor da operação": f"R$ {amount:,.2f}",
                "Taxa Rio Porto (2%)": f"R$ {rio_porto_fee:,.2f}",
                f"Taxa {payment_method}": f"R$ {payment_fee:,.2f}",
                "Total a pagar": f"R$ {final_amount:,.2f}"
            }
        }

class MarketAnalysisTool(BaseTool):
    name: str = "Market Analysis Tool"
    description: str = "Analisa tendências e fornece insights do mercado"
    
    def _run(self, timeframe: str = "24h") -> Dict[str, Any]:
        """Fornece análise de mercado"""
        
        # Buscar dados históricos
        cache_key = f"market_analysis:{timeframe}"
        cached = cache.get(cache_key)
        
        if cached:
            return json.loads(cached)
            
        analysis = self._perform_analysis(timeframe)
        cache.setex(cache_key, 300, json.dumps(analysis))  # Cache 5 min
        
        return analysis
    
    def _perform_analysis(self, timeframe: str) -> Dict[str, Any]:
        """Realiza análise de mercado"""
        # Implementar análise real aqui
        # Por hora, retorno mockado
        
        return {
            "timeframe": timeframe,
            "trend": "bullish",
            "price_change_24h": "+5.2%",
            "volume_24h": "R$ 2.3B",
            "volatility": "Moderada",
            "recommendation": "Momento favorável para compra - tendência de alta",
            "key_levels": {
                "support": "R$ 245.000",
                "resistance": "R$ 260.000"
            },
            "sentiment": {
                "fear_greed_index": 72,
                "interpretation": "Ganância"
            }
        }
```

### 3. Agentes Core (agents/core/supervisor.py)

```python
# agents/core/supervisor.py
from crewai import Agent, Task, Crew, Process
from crewai.project import CrewBase, agent, crew, task
from typing import List, Dict, Any
import yaml
from pathlib import Path

class RioPortoSupervisor:
    def __init__(self):
        self.config_path = Path(__file__).parent.parent / 'config'
        self.load_configs()
        
    def load_configs(self):
        """Carrega configurações dos agentes"""
        with open(self.config_path / 'agents.yaml', 'r', encoding='utf-8') as f:
            self.agents_config = yaml.safe_load(f)
            
        with open(self.config_path / 'tasks.yaml', 'r', encoding='utf-8') as f:
            self.tasks_config = yaml.safe_load(f)
    
    def create_agents(self):
        """Cria todos os agentes do sistema"""
        from .cotacao_agent import CotacaoAgent
        from .compliance_agent import ComplianceAgent
        from .suporte_agent import SuporteAgent
        from .vendas_agent import VendasAgent
        
        # Supervisor
        self.supervisor = Agent(
            role=self.agents_config['supervisor']['role'],
            goal=self.agents_config['supervisor']['goal'],
            backstory=self.agents_config['supervisor']['backstory'],
            llm=self.agents_config['supervisor']['llm'],
            allow_delegation=True,
            verbose=True
        )
        
        # Especialistas
        self.cotacao_agent = CotacaoAgent().agent
        self.compliance_agent = ComplianceAgent().agent
        self.suporte_agent = SuporteAgent().agent
        self.vendas_agent = VendasAgent().agent
        
        return [
            self.supervisor,
            self.cotacao_agent,
            self.compliance_agent,
            self.suporte_agent,
            self.vendas_agent
        ]
    
    def create_tasks(self, customer_message: str, context: Dict[str, Any] = None):
        """Cria tarefas dinâmicas baseadas na mensagem"""
        
        # Tarefa principal do supervisor
        supervisor_task = Task(
            description=f"""
            Analise a seguinte mensagem do cliente e coordene o atendimento:
            
            Mensagem: {customer_message}
            
            Contexto do cliente:
            - Histórico: {context.get('history', 'Novo cliente')}
            - Preferências: {context.get('preferences', 'Não definidas')}
            
            Passos:
            1. Identifique a necessidade principal
            2. Delegue para o especialista apropriado
            3. Garanta que todas as questões foram respondidas
            4. Compile uma resposta final unificada
            
            Especialistas disponíveis:
            - Cotação: Para preços, taxas e condições de compra/venda
            - Compliance: Para questões legais, impostos e documentação
            - Suporte: Para carteiras, segurança e questões técnicas
            - Vendas: Para converter interessados em clientes
            """,
            expected_output="""
            Resposta completa e profissional incluindo:
            - Saudação personalizada
            - Resposta principal à solicitação
            - Informações complementares relevantes
            - Próximos passos claros
            - Contato para suporte adicional
            """,
            agent=self.supervisor
        )
        
        return [supervisor_task]
    
    def create_crew(self, process_type: Process = Process.hierarchical):
        """Cria o crew principal"""
        agents = self.create_agents()
        
        crew = Crew(
            agents=agents,
            tasks=[],  # Tasks serão adicionadas dinamicamente
            process=process_type,
            manager_llm="gpt-4",
            memory=True,
            cache=True,
            verbose=True
        )
        
        return crew
    
    def process_message(self, message: str, context: Dict[str, Any] = None) -> str:
        """Processa mensagem do cliente"""
        
        # Criar crew
        crew = self.create_crew()
        
        # Criar tasks específicas para esta mensagem
        tasks = self.create_tasks(message, context or {})
        crew.tasks = tasks
        
        # Executar
        result = crew.kickoff()
        
        # Formatar resposta
        return self.format_response(result)
    
    def format_response(self, result: Any) -> str:
        """Formata resposta para o cliente"""
        
        response = str(result)
        
        # Adicionar assinatura
        signature = """

---
*Rio Porto P2P* 🪙
_Sua parceira de confiança em Bitcoin_

📱 WhatsApp: +55 21 34000-3259
🌐 Site: rioporto.com
📧 Email: contato@rioporto.com

_Horário de atendimento: Seg-Sex 9h-18h_
"""
        
        return response + signature
```

### 4. Flow Principal (agents/flows/customer_flow.py)

```python
# agents/flows/customer_flow.py
from crewai.flow.flow import Flow, listen, start, router, or_
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime
from ..core.supervisor import RioPortoSupervisor
from ..tools.database_tools import CustomerDatabase

class CustomerState(BaseModel):
    """Estado do cliente durante o atendimento"""
    customer_id: str = ""
    phone_number: str = ""
    message: str = ""
    intent: str = ""  # buy, sell, support, compliance
    sentiment: str = "neutral"  # positive, neutral, negative
    priority: str = "normal"  # low, normal, high, vip
    context: Dict[str, Any] = {}
    history: List[Dict[str, Any]] = []
    current_quote: Optional[Dict[str, Any]] = None
    compliance_status: str = "pending"
    resolution_status: str = "in_progress"
    agent_responses: Dict[str, str] = {}

class RioPortoCustomerFlow(Flow[CustomerState]):
    def __init__(self):
        super().__init__()
        self.supervisor = RioPortoSupervisor()
        self.db = CustomerDatabase()
        
    @start()
    def receive_message(self, phone: str, message: str) -> Dict[str, Any]:
        """Recebe mensagem inicial do WhatsApp"""
        
        # Atualizar estado
        self.state.phone_number = phone
        self.state.message = message
        self.state.customer_id = self.db.get_or_create_customer(phone)
        
        # Carregar histórico
        self.state.history = self.db.get_customer_history(self.state.customer_id)
        
        # Analisar prioridade
        self.state.priority = self._analyze_priority()
        
        # Log
        self.db.log_interaction(
            customer_id=self.state.customer_id,
            message=message,
            direction="inbound"
        )
        
        return {
            "customer_id": self.state.customer_id,
            "priority": self.state.priority
        }
    
    @router(receive_message)
    def route_by_priority(self) -> str:
        """Roteia baseado na prioridade"""
        
        if self.state.priority == "vip":
            return "vip_treatment"
        elif self.state.priority == "high":
            return "urgent_handling"
        else:
            return "analyze_intent"
    
    @listen("analyze_intent")
    def analyze_intent(self) -> Dict[str, Any]:
        """Analisa intenção do cliente"""
        
        # Usar supervisor para análise inicial
        analysis = self.supervisor.process_message(
            self.state.message,
            context={"history": self.state.history}
        )
        
        # Extrair intent da análise
        message_lower = self.state.message.lower()
        
        if any(word in message_lower for word in ["comprar", "compra", "adquirir"]):
            self.state.intent = "buy"
        elif any(word in message_lower for word in ["vender", "venda", "trocar"]):
            self.state.intent = "sell"
        elif any(word in message_lower for word in ["imposto", "declarar", "receita"]):
            self.state.intent = "compliance"
        elif any(word in message_lower for word in ["carteira", "wallet", "segurança"]):
            self.state.intent = "support"
        else:
            self.state.intent = "general"
            
        return {"intent": self.state.intent}
    
    @router(analyze_intent)
    def route_by_intent(self) -> str:
        """Roteia baseado na intenção"""
        
        routes = {
            "buy": "handle_purchase",
            "sell": "handle_sale",
            "compliance": "handle_compliance",
            "support": "handle_support",
            "general": "handle_general"
        }
        
        return routes.get(self.state.intent, "handle_general")
    
    @listen("handle_purchase")
    def handle_purchase(self) -> Dict[str, Any]:
        """Processa solicitação de compra"""
        
        # Criar crew especializado
        from crewai import Crew, Task
        
        # Task de análise de compra
        purchase_task = Task(
            description=f"""
            Cliente quer comprar Bitcoin:
            Mensagem: {self.state.message}
            
            Providencie:
            1. Cotação atualizada
            2. Verificação de compliance se necessário
            3. Instruções claras para pagamento
            4. Informações de segurança relevantes
            """,
            expected_output="Proposta completa de compra com todos os detalhes",
            agent=self.supervisor.cotacao_agent
        )
        
        # Crew focado em vendas
        sales_crew = Crew(
            agents=[
                self.supervisor.cotacao_agent,
                self.supervisor.compliance_agent
            ],
            tasks=[purchase_task],
            process=Process.sequential
        )
        
        result = sales_crew.kickoff()
        self.state.agent_responses["purchase"] = str(result)
        
        return {"status": "quote_provided"}
    
    @listen(or_("handle_purchase", "handle_sale", "handle_compliance", "handle_support"))
    def prepare_final_response(self) -> str:
        """Prepara resposta final consolidada"""
        
        # Compilar todas as respostas
        final_response = self.supervisor.format_response(
            "\n".join(self.state.agent_responses.values())
        )
        
        # Salvar no banco
        self.db.log_interaction(
            customer_id=self.state.customer_id,
            message=final_response,
            direction="outbound"
        )
        
        # Atualizar status
        self.state.resolution_status = "completed"
        
        return final_response
    
    def _analyze_priority(self) -> str:
        """Analisa prioridade baseado em histórico e valor"""
        
        if not self.state.history:
            return "normal"
            
        # Calcular valor total histórico
        total_value = sum(
            h.get("amount", 0) 
            for h in self.state.history 
            if h.get("type") == "transaction"
        )
        
        # VIP se já transacionou mais de 100k
        if total_value > 100000:
            return "vip"
        elif total_value > 50000:
            return "high"
        else:
            return "normal"
```

### 5. Integração WhatsApp (api/webhooks/whatsapp.py)

```python
# api/webhooks/whatsapp.py
from fastapi import FastAPI, Request, HTTPException
from twilio.twiml.messaging_response import MessagingResponse
from agents.flows.customer_flow import RioPortoCustomerFlow
import asyncio
import logging

app = FastAPI()
logger = logging.getLogger(__name__)

# Flow instance
flow = RioPortoCustomerFlow()

@app.post("/webhook/whatsapp")
async def whatsapp_webhook(request: Request):
    """Webhook para receber mensagens do WhatsApp via Twilio"""
    
    try:
        # Parse dados do Twilio
        form_data = await request.form()
        
        from_number = form_data.get('From', '').replace('whatsapp:', '')
        message_body = form_data.get('Body', '')
        
        if not from_number or not message_body:
            raise HTTPException(status_code=400, detail="Dados inválidos")
        
        # Processar mensagem com o flow
        response = await asyncio.to_thread(
            flow.kickoff,
            phone=from_number,
            message=message_body
        )
        
        # Criar resposta Twilio
        resp = MessagingResponse()
        resp.message(response)
        
        return str(resp)
        
    except Exception as e:
        logger.error(f"Erro no webhook WhatsApp: {str(e)}")
        
        # Resposta de erro amigável
        resp = MessagingResponse()
        resp.message(
            "Desculpe, tivemos um problema técnico. "
            "Por favor, tente novamente em alguns instantes ou "
            "ligue para: +55 21 34000-3259"
        )
        
        return str(resp)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "rioporto-agents"}
```

### 6. Script Principal (agents/main.py)

```python
# agents/main.py
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import logging
from datetime import datetime

# Configurar paths
ROOT_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT_DIR))

# Carregar variáveis de ambiente
load_dotenv(ROOT_DIR / '.env.local')

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f'logs/agents_{datetime.now():%Y%m%d}.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def test_system():
    """Testa o sistema com mensagens exemplo"""
    
    from agents.flows.customer_flow import RioPortoCustomerFlow
    
    test_messages = [
        "Olá, quero comprar R$ 5.000 em Bitcoin",
        "Como declaro Bitcoin no imposto de renda?",
        "Qual carteira vocês recomendam para iniciantes?",
        "Qual a cotação atual do Bitcoin?",
        "Quero vender 0.5 BTC",
        "Preciso de ajuda com minha carteira"
    ]
    
    flow = RioPortoCustomerFlow()
    
    for msg in test_messages:
        logger.info(f"\nTestando: {msg}")
        logger.info("-" * 50)
        
        try:
            response = flow.kickoff(
                phone="+5521999999999",
                message=msg
            )
            logger.info(f"Resposta:\n{response}")
        except Exception as e:
            logger.error(f"Erro: {str(e)}")
        
        logger.info("=" * 50)

def start_api():
    """Inicia API FastAPI"""
    import uvicorn
    
    logger.info("Iniciando API dos agentes...")
    
    uvicorn.run(
        "api.webhooks.whatsapp:app",
        host="0.0.0.0",
        port=8001,
        reload=True
    )

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Rio Porto P2P Multi-Agent System')
    parser.add_argument('command', choices=['test', 'api'], help='Comando a executar')
    
    args = parser.parse_args()
    
    if args.command == 'test':
        test_system()
    elif args.command == 'api':
        start_api()
```

### 7. Docker Compose para Produção

```yaml
# docker-compose.agents.yml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  agents-api:
    build:
      context: .
      dockerfile: Dockerfile.agents
    ports:
      - "8001:8001"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=${DATABASE_URL}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
    depends_on:
      - redis
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

volumes:
  redis_data:
```

### 8. Testes Automatizados

```python
# tests/agents/test_supervisor.py
import pytest
from agents.core.supervisor import RioPortoSupervisor

class TestSupervisor:
    def test_process_purchase_message(self):
        supervisor = RioPortoSupervisor()
        
        response = supervisor.process_message(
            "Quero comprar R$ 10.000 em Bitcoin"
        )
        
        assert "cotação" in response.lower()
        assert "R$" in response
        assert "Bitcoin" in response
        
    def test_process_compliance_message(self):
        supervisor = RioPortoSupervisor()
        
        response = supervisor.process_message(
            "Preciso declarar Bitcoin no IR?"
        )
        
        assert "imposto" in response.lower() or "declarar" in response.lower()
        assert "IN 1888" in response or "Receita" in response
        
    def test_process_support_message(self):
        supervisor = RioPortoSupervisor()
        
        response = supervisor.process_message(
            "Qual carteira hardware você recomenda?"
        )
        
        assert "carteira" in response.lower() or "wallet" in response.lower()
        assert any(wallet in response for wallet in ["Ledger", "Trezor", "Coldcard"])
```

## 🚀 Deploy e Monitoramento

### Deploy no Render.com

```bash
# render.yaml
services:
  - type: web
    name: rioporto-agents
    env: python
    buildCommand: "pip install -r requirements-agents.txt"
    startCommand: "python agents/main.py api"
    envVars:
      - key: OPENAI_API_KEY
        sync: false
      - key: DATABASE_URL
        fromDatabase:
          name: rioporto-db
          property: connectionString
      
  - type: redis
    name: rioporto-redis
    ipAllowList: []
    
databases:
  - name: rioporto-db
    databaseName: rioporto
    user: rioporto
```

### Monitoramento com Grafana

```python
# agents/monitoring.py
from prometheus_client import Counter, Histogram, Gauge
import time

# Métricas
message_counter = Counter('agent_messages_total', 'Total messages processed', ['agent', 'intent'])
response_time = Histogram('agent_response_seconds', 'Response time in seconds', ['agent'])
active_conversations = Gauge('agent_active_conversations', 'Active conversations')

def track_metrics(agent_name: str, intent: str):
    """Decorator para tracking de métricas"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            start = time.time()
            
            active_conversations.inc()
            message_counter.labels(agent=agent_name, intent=intent).inc()
            
            try:
                result = func(*args, **kwargs)
                return result
            finally:
                duration = time.time() - start
                response_time.labels(agent=agent_name).observe(duration)
                active_conversations.dec()
                
        return wrapper
    return decorator
```

## 📝 Próximos Passos

1. **Implementar sistema completo**
   - [ ] Setup ambiente desenvolvimento
   - [ ] Implementar todos os agentes
   - [ ] Integrar com WhatsApp Business API
   - [ ] Testes end-to-end

2. **Otimizações**
   - [ ] Cache inteligente com Redis
   - [ ] Rate limiting por cliente
   - [ ] Circuit breaker para APIs externas
   - [ ] Retry com backoff exponencial

3. **Features avançadas**
   - [ ] Voice notes via WhatsApp
   - [ ] Imagens de gráficos de mercado
   - [ ] Notificações proativas
   - [ ] A/B testing de respostas

4. **Segurança**
   - [ ] Criptografia end-to-end
   - [ ] Auditoria completa
   - [ ] Compliance LGPD
   - [ ] Backup automático

---

**Este padrão fornece:**
- ✅ Sistema robusto e escalável
- ✅ Fácil manutenção e extensão
- ✅ Performance otimizada
- ✅ Experiência excepcional ao cliente
- ✅ Conformidade regulatória

**Tempo estimado**: 3-4 semanas para implementação completa com testes

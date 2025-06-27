# 🚀 Setup Rápido - Sistema Multi-Agente Rio Porto P2P

## 📋 Pré-requisitos

- Python 3.10+
- Node.js 18+
- Redis
- PostgreSQL (ou Supabase)
- Conta Twilio (para WhatsApp)
- API Key OpenAI

## 🔧 Instalação Passo a Passo

### 1. Clone e Configure o Ambiente

```bash
# No diretório do projeto
cd D:\Projetos\rioporto-site

# Criar ambiente virtual Python
python -m venv venv-agents

# Ativar ambiente (Windows)
venv-agents\Scripts\activate

# Ativar ambiente (Linux/Mac)
source venv-agents/bin/activate

# Instalar dependências
pip install -r requirements-agents.txt
```

### 2. Criar arquivo requirements-agents.txt

```txt
# Core
crewai==0.1.0
crewai[tools]==0.1.0
langchain-openai==0.1.0
langchain-community==0.1.0

# APIs e Integrações
python-dotenv==1.0.0
requests==2.31.0
twilio==8.10.0
fastapi==0.109.0
uvicorn[standard]==0.27.0

# Database
redis==5.0.1
psycopg2-binary==2.9.9
sqlalchemy==2.0.25

# Utils
pydantic==2.5.0
pyyaml==6.0.1
python-multipart==0.0.6
aiofiles==23.2.1

# Monitoring
prometheus-client==0.19.0
python-json-logger==2.0.7

# Testing
pytest==7.4.4
pytest-asyncio==0.23.3
httpx==0.26.0
```

### 3. Configurar Variáveis de Ambiente

```bash
# Criar arquivo .env.agents
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...  # Opcional

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Database
DATABASE_URL=postgresql://user:pass@localhost/rioporto
REDIS_URL=redis://localhost:6379/0

# Supabase (se usar)
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# APIs Bitcoin
BINANCE_API_KEY=...  # Opcional
MERCADO_BITCOIN_API_KEY=...  # Opcional

# Configurações
ENVIRONMENT=development
LOG_LEVEL=INFO
```

### 4. Estrutura de Diretórios

```bash
# Criar estrutura
mkdir -p agents/{core,tools,flows,config}
mkdir -p api/{webhooks,routes,middleware}
mkdir -p tests/agents
mkdir -p logs
mkdir -p data/cache
```

### 5. Configuração Inicial dos Agentes

```yaml
# agents/config/agents.yaml
supervisor:
  role: "Supervisor de Atendimento Rio Porto P2P"
  goal: "Coordenar atendimento eficiente e resolver problemas dos clientes"
  backstory: "Experiente supervisor com 10 anos no mercado cripto"
  llm: "gpt-4"
  temperature: 0.3
  allow_delegation: true

cotacao_specialist:
  role: "Especialista em Cotação Bitcoin"
  goal: "Fornecer cotações precisas e orientar sobre melhores momentos"
  backstory: "Trader certificado com análise técnica avançada"
  llm: "gpt-4"
  temperature: 0.1
  tools:
    - bitcoin_price_tool
    - market_analysis_tool
    - fee_calculator_tool

compliance_specialist:
  role: "Oficial de Compliance"
  goal: "Garantir conformidade legal e orientar sobre impostos"
  backstory: "Advogado especializado em cripto e legislação brasileira"
  llm: "gpt-3.5-turbo"
  temperature: 0.2
  tools:
    - compliance_checker_tool
    - tax_calculator_tool

suporte_specialist:
  role: "Especialista em Segurança"
  goal: "Educar sobre segurança e resolver problemas técnicos"
  backstory: "White hat hacker e especialista em blockchain"
  llm: "gpt-3.5-turbo"
  temperature: 0.4
  tools:
    - wallet_analyzer_tool
    - security_checker_tool
```

## 🏃‍♂️ Executar o Sistema

### Modo Desenvolvimento

```bash
# Terminal 1: Redis
redis-server

# Terminal 2: API dos Agentes
python agents/main.py api

# Terminal 3: Testes
python agents/main.py test
```

### Modo Produção com Docker

```bash
# Build e run
docker-compose -f docker-compose.agents.yml up -d

# Ver logs
docker-compose -f docker-compose.agents.yml logs -f agents-api

# Parar
docker-compose -f docker-compose.agents.yml down
```

## 🧪 Testar o Sistema

### 1. Teste Local Simples

```python
# test_local.py
from agents.flows.customer_flow import RioPortoCustomerFlow

# Criar flow
flow = RioPortoCustomerFlow()

# Testar mensagem
response = flow.kickoff(
    phone="+5521999999999",
    message="Quero comprar R$ 1000 em Bitcoin"
)

print(response)
```

### 2. Teste via API

```bash
# Teste health check
curl http://localhost:8001/health

# Teste webhook WhatsApp (simular)
curl -X POST http://localhost:8001/webhook/whatsapp \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=whatsapp:+5521999999999&Body=Qual a cotação do Bitcoin?"
```

### 3. Teste com Twilio CLI

```bash
# Instalar Twilio CLI
npm install -g twilio-cli

# Login
twilio login

# Enviar mensagem teste
twilio api:core:messages:create \
  --from "whatsapp:+14155238886" \
  --to "whatsapp:+5521999999999" \
  --body "Teste do sistema multi-agente"
```

## 📊 Monitoramento

### Prometheus Metrics

```python
# agents/metrics.py
from prometheus_client import start_http_server, Counter, Histogram, Gauge
import time

# Iniciar servidor de métricas
start_http_server(8002)

# Métricas customizadas
messages_processed = Counter('rioporto_messages_total', 'Total messages processed')
response_time = Histogram('rioporto_response_seconds', 'Response time in seconds')
active_chats = Gauge('rioporto_active_chats', 'Number of active chats')
```

### Logs Estruturados

```python
# agents/logging_config.py
import logging
from pythonjsonlogger import jsonlogger

# Configurar JSON logger
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)

logger = logging.getLogger()
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)

# Uso
logger.info("message_processed", extra={
    "customer_id": "123",
    "intent": "buy",
    "amount": 1000,
    "response_time": 2.5
})
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Redis Connection Error
```bash
# Verificar se Redis está rodando
redis-cli ping

# Se não, iniciar
redis-server
```

#### 2. OpenAI Rate Limit
```python
# Adicionar retry com backoff
from tenacity import retry, wait_exponential, stop_after_attempt

@retry(
    wait=wait_exponential(multiplier=1, min=4, max=10),
    stop=stop_after_attempt(3)
)
def call_openai():
    # sua chamada aqui
```

#### 3. WhatsApp não recebe mensagens
```bash
# Verificar webhook Twilio
twilio phone-numbers:update +14155238886 \
  --sms-url="https://your-domain.com/webhook/whatsapp"
```

## 🔒 Segurança

### Checklist de Segurança

- [ ] Todas as API keys em variáveis de ambiente
- [ ] HTTPS em produção
- [ ] Rate limiting configurado
- [ ] Logs sem dados sensíveis
- [ ] Backup automático do banco
- [ ] Monitoramento de anomalias
- [ ] Validação de inputs
- [ ] Sanitização de outputs

### Rate Limiting

```python
# api/middleware/rate_limit.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100 per hour", "10 per minute"]
)

# Aplicar no endpoint
@app.post("/webhook/whatsapp")
@limiter.limit("5 per minute")
async def whatsapp_webhook(request: Request):
    # ...
```

## 📈 Métricas de Sucesso

### KPIs para Monitorar

1. **Tempo de Resposta**: < 3 segundos
2. **Taxa de Resolução**: > 80% sem intervenção humana
3. **Satisfação do Cliente**: > 4.5/5
4. **Uptime**: > 99.9%
5. **Custo por Interação**: < R$ 0.50

### Dashboard Sugerido

```python
# agents/dashboard.py
import streamlit as st
import pandas as pd
from datetime import datetime, timedelta

st.title("Rio Porto P2P - Dashboard Agentes")

# Métricas em tempo real
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("Mensagens Hoje", "1,234", "+12%")
    
with col2:
    st.metric("Tempo Médio", "2.3s", "-0.5s")
    
with col3:
    st.metric("Taxa Resolução", "87%", "+3%")
    
with col4:
    st.metric("Clientes Ativos", "456", "+23")

# Gráficos
st.line_chart(messages_per_hour)
st.bar_chart(intents_distribution)
```

## 🎯 Próximos Passos

1. **Configurar Twilio Sandbox** para WhatsApp
2. **Treinar agentes** com dados reais
3. **Implementar A/B testing** de prompts
4. **Adicionar suporte** para áudio/imagens
5. **Criar dashboard** de analytics

## 📚 Recursos Adicionais

- [Documentação CrewAI](https://docs.crewai.io)
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [OpenAI Best Practices](https://platform.openai.com/docs/guides/best-practices)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)

---

**Dúvidas?** Consulte os exemplos nos arquivos de padrões ou abra uma issue no repositório.

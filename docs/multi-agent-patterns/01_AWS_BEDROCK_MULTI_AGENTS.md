# AWS Bedrock Multi-Agent Patterns

## 🎯 Visão Geral
AWS Bedrock oferece um sistema robusto para orquestração de múltiplos agentes com suporte nativo para hierarquia supervisor-subordinado.

## 📦 Instalação
```bash
pip install boto3
pip install amazon-bedrock-agent-runtime
```

## 🔧 Configuração Inicial

### 1. Importações e Setup Básico
```python
import boto3
import os
import json
import time
from datetime import datetime

# Clientes AWS
sts_client = boto3.client('sts')
session = boto3.session.Session()
bedrock_client = boto3.client('bedrock-runtime')

account_id = sts_client.get_caller_identity()["Account"]
region = session.region_name

# Modelos suportados
agent_foundation_models = [
    'anthropic.claude-3-5-sonnet-20240620-v1:0',
    'anthropic.claude-3-sonnet-20240229-v1:0',
    'anthropic.claude-3-haiku-20240307-v1:0'
]
```

### 2. Definir Helper para Agentes
```python
import sys
sys.path.insert(0, ".")
sys.path.insert(1, "..")

from utils.bedrock_agent_helper import AgentsForAmazonBedrock
agents = AgentsForAmazonBedrock()
```

## 🤖 Padrão 1: Agente Supervisor com Sub-Agentes

### Criar Agente Supervisor
```python
# Nome único para o agente
resource_suffix = "rioporto-p2p"
supervisor_agent_name = f"rioporto-supervisor-{resource_suffix}"

# Criar o supervisor
supervisor_agent = agents.create_agent(
    supervisor_agent_name,
    """
    Você é um supervisor de atendimento ao cliente da Rio Porto P2P.
    Você gerencia agentes especializados em:
    - Cotação de Bitcoin
    - Suporte técnico de carteiras
    - Compliance e documentação
    """,
    """
    Você é o ponto central de atendimento da Rio Porto P2P.
    Analise as solicitações dos clientes e direcione para o agente especializado correto.
    Nunca tente responder diretamente sobre assuntos técnicos específicos.
    Sempre delegue para o agente apropriado baseado na natureza da consulta.
    """,
    agent_foundation_models[0],
    agent_collaboration='SUPERVISOR_ROUTER'
)
```

### Criar Sub-Agentes Especializados

#### Agente de Cotação
```python
cotacao_agent_name = f"rioporto-cotacao-{resource_suffix}"

cotacao_agent = agents.create_agent(
    cotacao_agent_name,
    """
    Você é um especialista em cotação de Bitcoin da Rio Porto P2P.
    Você fornece cotações precisas e atualizadas.
    """,
    """
    Forneça cotações de Bitcoin em tempo real.
    Explique taxas, spreads e condições de negociação.
    Sempre mencione o valor mínimo de R$100 para transações.
    Use a API de cotação quando disponível.
    """,
    agent_foundation_models[0]
)
```

#### Agente de Suporte Técnico
```python
suporte_agent_name = f"rioporto-suporte-{resource_suffix}"

suporte_agent = agents.create_agent(
    suporte_agent_name,
    """
    Você é um especialista em autocustódia e carteiras de Bitcoin.
    Você ajuda clientes com questões técnicas.
    """,
    """
    Auxilie clientes com:
    - Configuração de carteiras (hot e cold wallets)
    - Boas práticas de segurança
    - Recuperação de senhas e seeds
    - Transferências e confirmações na blockchain
    Sempre priorize a segurança do cliente.
    """,
    agent_foundation_models[0]
)
```

#### Agente de Compliance
```python
compliance_agent_name = f"rioporto-compliance-{resource_suffix}"

compliance_agent = agents.create_agent(
    compliance_agent_name,
    """
    Você é um especialista em compliance e regulamentação cripto.
    """,
    """
    Oriente sobre:
    - Declaração de imposto de renda
    - IN 1888 da Receita Federal
    - Documentação necessária para transações
    - Limites e obrigações legais
    Sempre mencione que isto é orientação geral e recomende consultar um contador.
    """,
    agent_foundation_models[0]
)
```

### Associar Sub-Agentes ao Supervisor
```python
# Criar aliases para os agentes
cotacao_alias_id, cotacao_alias_arn = agents.create_agent_alias(
    cotacao_agent[0], 'v1'
)
suporte_alias_id, suporte_alias_arn = agents.create_agent_alias(
    suporte_agent[0], 'v1'
)
compliance_alias_id, compliance_alias_arn = agents.create_agent_alias(
    compliance_agent[0], 'v1'
)

# Lista de sub-agentes
sub_agents_list = [
    {
        'sub_agent_alias_arn': cotacao_alias_arn,
        'sub_agent_instruction': """
        Delegue consultas sobre preços, cotações, taxas e condições de compra/venda 
        de Bitcoin para o Agente de Cotação.
        """,
        'sub_agent_association_name': 'CotacaoBitcoinAgent',
        'relay_conversation_history': 'TO_COLLABORATOR'
    },
    {
        'sub_agent_alias_arn': suporte_alias_arn,
        'sub_agent_instruction': """
        Delegue questões técnicas sobre carteiras, segurança, transferências e 
        autocustódia para o Agente de Suporte Técnico.
        """,
        'sub_agent_association_name': 'SuporteTecnicoAgent',
        'relay_conversation_history': 'TO_COLLABORATOR'
    },
    {
        'sub_agent_alias_arn': compliance_alias_arn,
        'sub_agent_instruction': """
        Delegue perguntas sobre impostos, regulamentação, documentação e 
        conformidade legal para o Agente de Compliance.
        """,
        'sub_agent_association_name': 'ComplianceAgent',
        'relay_conversation_history': 'TO_COLLABORATOR'
    }
]

# Associar os sub-agentes
supervisor_alias_id, supervisor_alias_arn = agents.associate_sub_agents(
    supervisor_agent[0], sub_agents_list
)
```

## 🔧 Padrão 2: Agentes com Action Groups (Lambda Functions)

### Definir Funções do Agente
```python
functions_def = [
    {
        "name": "get_bitcoin_quote",
        "description": "Obter cotação atual do Bitcoin em Reais",
        "parameters": {
            "amount_brl": {
                "description": "Valor em Reais para cotação",
                "required": False,
                "type": "string"
            },
            "operation": {
                "description": "Tipo de operação: compra ou venda",
                "required": True,
                "type": "string"
            }
        }
    },
    {
        "name": "calculate_fees",
        "description": "Calcular taxas para uma transação",
        "parameters": {
            "amount": {
                "description": "Valor da transação",
                "required": True,
                "type": "string"
            },
            "payment_method": {
                "description": "Método de pagamento: PIX, TED, etc",
                "required": True,
                "type": "string"
            }
        }
    }
]
```

### Criar Lambda Function
```python
%%writefile rioporto_functions.py
import boto3
import json
import os
import requests
from decimal import Decimal

def get_named_parameter(event, name):
    return next(item for item in event['parameters'] if item['name'] == name)['value']
    
def populate_function_response(event, response_body):
    return {
        'response': {
            'actionGroup': event['actionGroup'], 
            'function': event['function'],
            'functionResponse': {
                'responseBody': {
                    'TEXT': {'body': str(response_body)}
                }
            }
        }
    }

def get_bitcoin_quote(amount_brl=None, operation='compra'):
    # Aqui você integraria com sua API real de cotação
    # Este é um exemplo simulado
    base_price = 250000.00  # R$ 250.000 por BTC
    
    if operation == 'compra':
        price = base_price * 1.02  # 2% spread
    else:
        price = base_price * 0.98
    
    if amount_brl:
        btc_amount = float(amount_brl) / price
        return {
            "operation": operation,
            "btc_price": price,
            "amount_brl": amount_brl,
            "btc_amount": f"{btc_amount:.8f}",
            "fee": "2%",
            "minimum": "R$ 100,00"
        }
    
    return {
        "operation": operation,
        "btc_price": price,
        "fee": "2%",
        "minimum": "R$ 100,00"
    }

def calculate_fees(amount, payment_method):
    amount_float = float(amount.replace('R$', '').replace(',', ''))
    
    fees = {
        "PIX": 0.0,  # Sem taxa para PIX
        "TED": 10.0,  # R$ 10 fixo
        "DOC": 15.0   # R$ 15 fixo
    }
    
    fee = fees.get(payment_method.upper(), 0.0)
    total = amount_float + fee
    
    return {
        "amount": amount,
        "payment_method": payment_method,
        "fee": f"R$ {fee:.2f}",
        "total": f"R$ {total:.2f}"
    }

def lambda_handler(event, context):
    print(event)
    
    function = event.get('function', '')
    
    if function == 'get_bitcoin_quote':
        amount_brl = get_named_parameter(event, "amount_brl") if "amount_brl" in str(event) else None
        operation = get_named_parameter(event, "operation")
        result = get_bitcoin_quote(amount_brl, operation)
    elif function == 'calculate_fees':
        amount = get_named_parameter(event, "amount")
        payment_method = get_named_parameter(event, "payment_method")
        result = calculate_fees(amount, payment_method)
    else:
        result = f"Erro: função '{function}' não reconhecida"

    response = populate_function_response(event, result)
    print(response)
    return response
```

### Associar Action Group ao Agente
```python
lambda_name = f"rioporto-functions-{resource_suffix}"

resp = agents.add_action_group_with_lambda(
    agent_name=cotacao_agent_name,
    lambda_function_name=lambda_name,
    source_code_file="rioporto_functions.py",
    agent_functions=functions_def,
    agent_action_group_name="cotacao_actions",
    agent_action_group_description="Funções para cotação e cálculo de taxas"
)
```

## 📊 Padrão 3: Knowledge Base para Agentes

### Criar Knowledge Base
```python
from utils.knowledge_base import BedrockKnowledgeBase

kb_name = 'rioporto-kb'
kb_description = "Base de conhecimento sobre Bitcoin, P2P e autocustódia"
bucket_name = f'rioporto-kb-{account_id}-{resource_suffix}'

# Configurar data source
data = [{"type": "S3", "bucket_name": bucket_name}]

knowledge_base = BedrockKnowledgeBase(
    kb_name=kb_name,
    kb_description=kb_description,
    data_sources=data,
    chunking_strategy="FIXED_SIZE",
    suffix=resource_suffix
)

# Criar ou recuperar KB
kb_id, ds_id = kb.create_or_retrieve_knowledge_base(
    kb_name, kb_description, bucket_name
)
```

### Associar KB ao Agente
```python
kb_response = agents.associate_kb_with_agent(
    agent_id=suporte_agent[0],
    description="Base de conhecimento com guias sobre segurança, carteiras e boas práticas",
    kb_id=kb_id
)

time.sleep(30)  # Aguardar associação
```

## 🚀 Executar Agentes

### Invocar Supervisor
```python
response = agents.invoke(
    "Quero comprar R$ 500 em Bitcoin e preciso saber sobre impostos",
    supervisor_agent[0],
    enable_trace=True
)
print(response)
```

### Invocar Agente Específico
```python
# Cotação direta
response = agents.invoke(
    "Qual a cotação para comprar R$ 1000 em Bitcoin?",
    cotacao_agent[0],
    enable_trace=True
)
print(response)
```

## 💡 Melhores Práticas

1. **Hierarquia Clara**: Defina responsabilidades específicas para cada agente
2. **Instruções Detalhadas**: Seja explícito sobre quando delegar
3. **Context Passing**: Use `relay_conversation_history` para manter contexto
4. **Error Handling**: Implemente tratamento de erros em Lambda functions
5. **Monitoring**: Use `enable_trace=True` para debug

## 🔐 Segurança

```python
# Sempre valide inputs
def validate_amount(amount_str):
    try:
        amount = float(amount_str.replace('R$', '').replace(',', ''))
        if amount < 100:
            return None, "Valor mínimo é R$ 100"
        if amount > 1000000:
            return None, "Valor máximo é R$ 1.000.000"
        return amount, None
    except:
        return None, "Valor inválido"

# Use variáveis de ambiente
BITCOIN_API_KEY = os.environ.get('BITCOIN_API_KEY')
WHATSAPP_TOKEN = os.environ.get('WHATSAPP_TOKEN')
```

## 📝 Exemplo Completo: Sistema Rio Porto P2P

```python
# Sistema completo com 3 agentes trabalhando em conjunto
class RioPortoMultiAgentSystem:
    def __init__(self):
        self.setup_agents()
        
    def setup_agents(self):
        # Criar supervisor e sub-agentes
        # ... código anterior ...
        
    def process_customer_request(self, message):
        """Processar solicitação do cliente via WhatsApp"""
        
        # Invocar supervisor
        response = agents.invoke(
            message,
            self.supervisor_agent_id,
            enable_trace=True
        )
        
        # Log para análise
        self.log_interaction(message, response)
        
        return response
        
    def log_interaction(self, input_msg, output_msg):
        """Salvar interação para análise e melhoria"""
        timestamp = datetime.now().isoformat()
        log_entry = {
            "timestamp": timestamp,
            "input": input_msg,
            "output": output_msg,
            "agents_involved": self.extract_agents_from_trace(output_msg)
        }
        # Salvar em DynamoDB ou outro storage
        
# Uso
system = RioPortoMultiAgentSystem()
response = system.process_customer_request(
    "Olá, quero comprar Bitcoin mas não sei como declarar no IR"
)
```

---

**Padrão AWS Bedrock é ideal para**: Sistemas enterprise com necessidade de compliance, auditoria completa e integração nativa com serviços AWS.

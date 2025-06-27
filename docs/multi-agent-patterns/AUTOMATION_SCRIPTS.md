# 🚀 Scripts de Automação e Deploy

## 📁 Estrutura de Scripts

```
scripts/
├── setup/
│   ├── install.sh           # Instalação completa
│   ├── setup-env.sh         # Configurar ambiente
│   └── verify-deps.sh       # Verificar dependências
├── development/
│   ├── run-local.sh         # Executar localmente
│   ├── test-agents.sh       # Testar agentes
│   └── watch-logs.sh        # Monitorar logs
├── deployment/
│   ├── deploy-docker.sh     # Deploy Docker
│   ├── deploy-cloud.sh      # Deploy cloud
│   └── rollback.sh          # Rollback
└── monitoring/
    ├── health-check.sh      # Verificar saúde
    └── collect-metrics.sh   # Coletar métricas
```

## 🔧 Scripts de Setup

### 1. Script de Instalação Completa

```bash
#!/bin/bash
# scripts/setup/install.sh

echo "🚀 Rio Porto P2P - Instalação do Sistema Multi-Agente"
echo "=================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar comando
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 não está instalado${NC}"
        return 1
    else
        echo -e "${GREEN}✅ $1 instalado${NC}"
        return 0
    fi
}

# 1. Verificar pré-requisitos
echo -e "\n${YELLOW}1. Verificando pré-requisitos...${NC}"
check_command python3 || exit 1
check_command pip3 || exit 1
check_command redis-cli || echo -e "${YELLOW}⚠️  Redis não instalado (opcional para desenvolvimento)${NC}"
check_command docker || echo -e "${YELLOW}⚠️  Docker não instalado (necessário para produção)${NC}"

# 2. Criar ambiente virtual
echo -e "\n${YELLOW}2. Criando ambiente virtual...${NC}"
python3 -m venv venv-agents
source venv-agents/bin/activate || source venv-agents/Scripts/activate

# 3. Atualizar pip
echo -e "\n${YELLOW}3. Atualizando pip...${NC}"
pip install --upgrade pip

# 4. Instalar dependências
echo -e "\n${YELLOW}4. Instalando dependências...${NC}"
pip install -r requirements-agents.txt

# 5. Criar estrutura de diretórios
echo -e "\n${YELLOW}5. Criando estrutura de diretórios...${NC}"
mkdir -p agents/{core,tools,flows,config}
mkdir -p api/{webhooks,routes,middleware}
mkdir -p tests/agents
mkdir -p logs
mkdir -p data/cache
mkdir -p docs/api
mkdir -p scripts/{setup,development,deployment,monitoring}

# 6. Copiar arquivos de configuração
echo -e "\n${YELLOW}6. Configurando ambiente...${NC}"
if [ ! -f .env.agents ]; then
    cp .env.example .env.agents
    echo -e "${YELLOW}⚠️  Criado .env.agents - Configure suas variáveis!${NC}"
fi

# 7. Verificar configuração
echo -e "\n${YELLOW}7. Verificando configuração...${NC}"
python3 scripts/setup/verify-deps.py

echo -e "\n${GREEN}✅ Instalação concluída!${NC}"
echo -e "\nPróximos passos:"
echo "1. Configure as variáveis em .env.agents"
echo "2. Execute: source venv-agents/bin/activate"
echo "3. Execute: python agents/main.py test"
```

### 2. Script de Configuração de Ambiente

```bash
#!/bin/bash
# scripts/setup/setup-env.sh

echo "🔧 Configurando variáveis de ambiente"
echo "===================================="

# Função para ler input seguro
read_secret() {
    echo -n "$1: "
    read -s value
    echo
    echo "$value"
}

# Criar .env.agents se não existir
if [ ! -f .env.agents ]; then
    touch .env.agents
fi

# Configurar OpenAI
echo "Configurando OpenAI..."
if grep -q "OPENAI_API_KEY" .env.agents; then
    echo "✅ OPENAI_API_KEY já configurada"
else
    key=$(read_secret "Digite sua OpenAI API Key")
    echo "OPENAI_API_KEY=$key" >> .env.agents
fi

# Configurar Twilio
echo -e "\nConfigurando Twilio..."
if grep -q "TWILIO_ACCOUNT_SID" .env.agents; then
    echo "✅ Twilio já configurado"
else
    echo "Deixe em branco para pular a configuração do WhatsApp"
    sid=$(read_secret "Twilio Account SID")
    if [ ! -z "$sid" ]; then
        echo "TWILIO_ACCOUNT_SID=$sid" >> .env.agents
        
        token=$(read_secret "Twilio Auth Token")
        echo "TWILIO_AUTH_TOKEN=$token" >> .env.agents
        
        echo -n "Twilio WhatsApp Number (ex: +14155238886): "
        read number
        echo "TWILIO_WHATSAPP_NUMBER=whatsapp:$number" >> .env.agents
    fi
fi

# Configurar Database
echo -e "\nConfigurando Database..."
echo "1. PostgreSQL local"
echo "2. Supabase"
echo "3. SQLite (desenvolvimento)"
echo -n "Escolha (1-3): "
read db_choice

case $db_choice in
    1)
        echo -n "PostgreSQL URL: "
        read db_url
        echo "DATABASE_URL=$db_url" >> .env.agents
        ;;
    2)
        echo -n "Supabase URL: "
        read supabase_url
        echo "SUPABASE_URL=$supabase_url" >> .env.agents
        
        key=$(read_secret "Supabase Anon Key")
        echo "SUPABASE_ANON_KEY=$key" >> .env.agents
        ;;
    3)
        echo "DATABASE_URL=sqlite:///data/rioporto.db" >> .env.agents
        ;;
esac

# Configurar Redis
echo -e "\nConfigurando Redis..."
echo -n "Redis URL (default: redis://localhost:6379/0): "
read redis_url
redis_url=${redis_url:-redis://localhost:6379/0}
echo "REDIS_URL=$redis_url" >> .env.agents

# Ambiente
echo -e "\nConfigurando ambiente..."
echo "1. development"
echo "2. staging"  
echo "3. production"
echo -n "Escolha (1-3): "
read env_choice

case $env_choice in
    1) echo "ENVIRONMENT=development" >> .env.agents ;;
    2) echo "ENVIRONMENT=staging" >> .env.agents ;;
    3) echo "ENVIRONMENT=production" >> .env.agents ;;
esac

echo -e "\n✅ Configuração concluída!"
echo "Arquivo .env.agents foi atualizado"
```

### 3. Script de Verificação

```python
#!/usr/bin/env python3
# scripts/setup/verify-deps.py

import sys
import os
import importlib
from pathlib import Path

print("🔍 Verificando dependências Python...")
print("=" * 40)

# Dependências obrigatórias
required_packages = [
    ("crewai", "CrewAI"),
    ("langchain", "LangChain"),
    ("fastapi", "FastAPI"),
    ("redis", "Redis"),
    ("pydantic", "Pydantic"),
    ("dotenv", "python-dotenv"),
]

# Verificar cada pacote
missing = []
for package, name in required_packages:
    try:
        importlib.import_module(package)
        print(f"✅ {name} instalado")
    except ImportError:
        print(f"❌ {name} NÃO instalado")
        missing.append(name)

# Verificar variáveis de ambiente
print("\n🔍 Verificando variáveis de ambiente...")
print("=" * 40)

env_file = Path(".env.agents")
if env_file.exists():
    from dotenv import load_dotenv
    load_dotenv(".env.agents")
    
    required_vars = [
        "OPENAI_API_KEY",
        "DATABASE_URL",
        "REDIS_URL"
    ]
    
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"✅ {var} configurada")
        else:
            print(f"❌ {var} NÃO configurada")
else:
    print("❌ Arquivo .env.agents não encontrado")

# Resultado final
if missing:
    print(f"\n❌ Instale os pacotes faltando: {', '.join(missing)}")
    sys.exit(1)
else:
    print("\n✅ Todas as dependências instaladas!")
```

## 🏃 Scripts de Desenvolvimento

### 1. Executar Localmente

```bash
#!/bin/bash
# scripts/development/run-local.sh

echo "🚀 Iniciando sistema Multi-Agente (Desenvolvimento)"
echo "================================================"

# Ativar ambiente virtual
source venv-agents/bin/activate || source venv-agents/Scripts/activate

# Verificar Redis
if command -v redis-cli &> /dev/null; then
    if ! redis-cli ping > /dev/null 2>&1; then
        echo "⚠️  Redis não está rodando. Iniciando..."
        redis-server --daemonize yes
    fi
fi

# Executar em modo desenvolvimento
export ENVIRONMENT=development
export LOG_LEVEL=DEBUG

# Iniciar API
echo "📡 Iniciando API..."
python agents/main.py api &
API_PID=$!

# Aguardar inicialização
sleep 5

# Verificar saúde
echo "🏥 Verificando saúde do sistema..."
curl -s http://localhost:8001/health | jq . || echo "⚠️  Sistema pode estar com problemas"

echo -e "\n✅ Sistema rodando!"
echo "API: http://localhost:8001"
echo "Docs: http://localhost:8001/docs"
echo -e "\nPressione Ctrl+C para parar"

# Aguardar interrupção
wait $API_PID
```

### 2. Testar Agentes

```bash
#!/bin/bash
# scripts/development/test-agents.sh

echo "🧪 Testando Sistema Multi-Agente"
echo "================================"

# Ativar ambiente
source venv-agents/bin/activate || source venv-agents/Scripts/activate

# Executar testes unitários
echo -e "\n📋 Testes Unitários"
python -m pytest tests/agents/unit -v

# Executar testes de integração
echo -e "\n🔗 Testes de Integração"
python -m pytest tests/agents/integration -v

# Executar teste de carga
echo -e "\n💪 Teste de Carga"
python tests/agents/load_test.py

# Executar teste end-to-end
echo -e "\n🎯 Teste End-to-End"
python tests/agents/e2e_test.py

# Relatório de cobertura
echo -e "\n📊 Cobertura de Código"
python -m pytest --cov=agents --cov-report=html tests/

echo -e "\n✅ Testes concluídos!"
echo "Relatório de cobertura: htmlcov/index.html"
```

## 🚀 Scripts de Deploy

### 1. Deploy com Docker

```bash
#!/bin/bash
# scripts/deployment/deploy-docker.sh

echo "🐳 Deploy com Docker"
echo "==================="

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não instalado"
    exit 1
fi

# Build da imagem
echo "🔨 Construindo imagem..."
docker build -t rioporto-agents:latest -f Dockerfile.agents .

# Parar container antigo
echo "🛑 Parando container antigo..."
docker stop rioporto-agents 2>/dev/null || true
docker rm rioporto-agents 2>/dev/null || true

# Iniciar novo container
echo "🚀 Iniciando novo container..."
docker run -d \
    --name rioporto-agents \
    -p 8001:8001 \
    --env-file .env.agents \
    -v $(pwd)/logs:/app/logs \
    --restart unless-stopped \
    rioporto-agents:latest

# Verificar status
sleep 5
if docker ps | grep -q rioporto-agents; then
    echo "✅ Container rodando!"
    docker logs rioporto-agents --tail 20
else
    echo "❌ Falha ao iniciar container"
    docker logs rioporto-agents
    exit 1
fi
```

### 2. Deploy para Cloud

```bash
#!/bin/bash
# scripts/deployment/deploy-cloud.sh

echo "☁️  Deploy para Cloud"
echo "==================="

# Detectar plataforma
if [ -f "render.yaml" ]; then
    PLATFORM="render"
elif [ -f "railway.toml" ]; then
    PLATFORM="railway"
elif [ -f "fly.toml" ]; then
    PLATFORM="fly"
elif [ ! -z "$HEROKU_APP_NAME" ]; then
    PLATFORM="heroku"
else
    echo "❌ Plataforma não detectada"
    exit 1
fi

echo "🎯 Plataforma detectada: $PLATFORM"

# Executar testes antes do deploy
echo "🧪 Executando testes..."
./scripts/development/test-agents.sh || exit 1

# Deploy específico por plataforma
case $PLATFORM in
    render)
        echo "🚀 Deploy para Render..."
        # Render detecta automaticamente
        git push origin main
        ;;
        
    railway)
        echo "🚀 Deploy para Railway..."
        railway up
        ;;
        
    fly)
        echo "🚀 Deploy para Fly.io..."
        flyctl deploy
        ;;
        
    heroku)
        echo "🚀 Deploy para Heroku..."
        git push heroku main
        heroku logs --tail &
        ;;
esac

# Aguardar deploy
echo "⏳ Aguardando deploy..."
sleep 60

# Verificar saúde
echo "🏥 Verificando saúde..."
if [ ! -z "$DEPLOY_URL" ]; then
    curl -s "$DEPLOY_URL/health" | jq .
fi

echo "✅ Deploy concluído!"
```

### 3. Script de Rollback

```bash
#!/bin/bash
# scripts/deployment/rollback.sh

echo "⏪ Rollback do Sistema"
echo "====================="

# Verificar último backup
BACKUP_DIR="backups/$(date -d '1 day ago' +%Y%m%d)"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Backup não encontrado"
    exit 1
fi

echo "📦 Backup encontrado: $BACKUP_DIR"

# Confirmar rollback
echo -n "Confirmar rollback? (s/N): "
read confirm

if [ "$confirm" != "s" ]; then
    echo "❌ Rollback cancelado"
    exit 0
fi

# Executar rollback
echo "🔄 Executando rollback..."

# Docker
if command -v docker &> /dev/null; then
    docker stop rioporto-agents
    docker run -d \
        --name rioporto-agents-rollback \
        -p 8001:8001 \
        --env-file $BACKUP_DIR/.env.agents \
        rioporto-agents:$(cat $BACKUP_DIR/version.txt)
fi

# Database
if [ -f "$BACKUP_DIR/database.sql" ]; then
    echo "🗄️  Restaurando database..."
    psql $DATABASE_URL < $BACKUP_DIR/database.sql
fi

echo "✅ Rollback concluído!"
```

## 📊 Scripts de Monitoramento

### 1. Health Check

```bash
#!/bin/bash
# scripts/monitoring/health-check.sh

echo "🏥 Health Check - Sistema Multi-Agente"
echo "====================================="

# Função para checar serviço
check_service() {
    local name=$1
    local url=$2
    local expected=$3
    
    response=$(curl -s -o /dev/null -w "%{http_code}" $url)
    
    if [ "$response" = "$expected" ]; then
        echo "✅ $name: OK"
        return 0
    else
        echo "❌ $name: ERRO (HTTP $response)"
        return 1
    fi
}

# Checar API principal
check_service "API Principal" "http://localhost:8001/health" "200"

# Checar Redis
if redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis: OK"
else
    echo "❌ Redis: ERRO"
fi

# Checar Database
python -c "
import os
from sqlalchemy import create_engine
try:
    engine = create_engine(os.getenv('DATABASE_URL'))
    engine.connect()
    print('✅ Database: OK')
except:
    print('❌ Database: ERRO')
"

# Checar memória
echo -e "\n📊 Uso de Recursos:"
echo "CPU: $(top -bn1 | grep '%Cpu' | awk '{print $2}')"
echo "Memória: $(free -h | grep Mem | awk '{print $3 "/" $2}')"
echo "Disco: $(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 ")"}')"

# Checar logs de erro
echo -e "\n📝 Últimos erros:"
tail -n 20 logs/*.log | grep -E "ERROR|CRITICAL" | tail -5 || echo "Nenhum erro recente"
```

### 2. Coletor de Métricas

```python
#!/usr/bin/env python3
# scripts/monitoring/collect-metrics.py

import requests
import json
import redis
from datetime import datetime
from pathlib import Path

def collect_metrics():
    """Coleta métricas do sistema"""
    
    metrics = {
        "timestamp": datetime.now().isoformat(),
        "api": {},
        "agents": {},
        "redis": {},
        "business": {}
    }
    
    # Métricas da API
    try:
        response = requests.get("http://localhost:8001/metrics")
        metrics["api"] = response.json()
    except:
        metrics["api"]["status"] = "error"
    
    # Métricas do Redis
    try:
        r = redis.Redis.from_url("redis://localhost:6379/0")
        info = r.info()
        metrics["redis"] = {
            "used_memory": info["used_memory_human"],
            "connected_clients": info["connected_clients"],
            "total_commands": info["total_commands_processed"]
        }
    except:
        metrics["redis"]["status"] = "error"
    
    # Métricas de negócio (simulado)
    metrics["business"] = {
        "messages_today": 1234,
        "active_customers": 456,
        "conversion_rate": 0.15,
        "avg_response_time": 2.3
    }
    
    # Salvar métricas
    metrics_file = Path(f"metrics/metrics_{datetime.now():%Y%m%d_%H%M%S}.json")
    metrics_file.parent.mkdir(exist_ok=True)
    
    with open(metrics_file, "w") as f:
        json.dump(metrics, f, indent=2)
    
    print(f"✅ Métricas coletadas: {metrics_file}")
    
    # Alertas
    if metrics.get("api", {}).get("response_time", 0) > 5:
        print("⚠️  ALERTA: Tempo de resposta alto!")
    
    if metrics.get("redis", {}).get("used_memory", "0MB") > "100MB":
        print("⚠️  ALERTA: Uso alto de memória Redis!")

if __name__ == "__main__":
    collect_metrics()
```

## 🔄 Cron Jobs

### Configuração de Cron

```bash
# Adicionar ao crontab com: crontab -e

# Health check a cada 5 minutos
*/5 * * * * /path/to/scripts/monitoring/health-check.sh >> /path/to/logs/health.log 2>&1

# Coleta de métricas a cada hora
0 * * * * /path/to/scripts/monitoring/collect-metrics.py

# Backup diário às 3AM
0 3 * * * /path/to/scripts/backup/daily-backup.sh

# Limpeza de logs antigas (domingo às 2AM)
0 2 * * 0 find /path/to/logs -name "*.log" -mtime +30 -delete

# Restart automático se necessário (a cada 30 min)
*/30 * * * * /path/to/scripts/monitoring/auto-restart.sh
```

## 🎯 Makefile para Facilitar

```makefile
# Makefile

.PHONY: help install dev test deploy clean

help:
	@echo "Comandos disponíveis:"
	@echo "  make install    - Instalar dependências"
	@echo "  make dev        - Executar em desenvolvimento"
	@echo "  make test       - Executar testes"
	@echo "  make deploy     - Deploy para produção"
	@echo "  make clean      - Limpar arquivos temporários"

install:
	@./scripts/setup/install.sh

dev:
	@./scripts/development/run-local.sh

test:
	@./scripts/development/test-agents.sh

deploy:
	@./scripts/deployment/deploy-cloud.sh

clean:
	@find . -type f -name "*.pyc" -delete
	@find . -type d -name "__pycache__" -delete
	@rm -rf .pytest_cache
	@rm -rf htmlcov
	@echo "✅ Limpeza concluída"

# Comandos adicionais
docker-build:
	@docker build -t rioporto-agents:latest -f Dockerfile.agents .

docker-run:
	@./scripts/deployment/deploy-docker.sh

health:
	@./scripts/monitoring/health-check.sh

metrics:
	@python scripts/monitoring/collect-metrics.py

backup:
	@./scripts/backup/daily-backup.sh
```

## 📝 Aliases Úteis

```bash
# Adicionar ao ~/.bashrc ou ~/.zshrc

# Atalhos Rio Porto
alias rp-dev="cd /path/to/rioporto-site && make dev"
alias rp-test="cd /path/to/rioporto-site && make test"
alias rp-logs="tail -f /path/to/rioporto-site/logs/*.log"
alias rp-health="cd /path/to/rioporto-site && make health"
alias rp-deploy="cd /path/to/rioporto-site && make deploy"

# Funções úteis
rp-chat() {
    curl -X POST http://localhost:8001/webhook/whatsapp \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "From=whatsapp:+5521999999999&Body=$1"
}

rp-metrics() {
    watch -n 60 'cd /path/to/rioporto-site && make metrics'
}
```

---

**Com estes scripts, o deploy e manutenção do sistema multi-agente ficam automatizados e profissionais!** 🚀

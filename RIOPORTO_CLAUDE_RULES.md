# RIOPORTO CLAUDE RULES - Documento de Referência do Projeto

## 🚨 REGRAS FUNDAMENTAIS DO PROJETO

### Regras de Interação
- **Sempre** utilizar o MCP do Context7 para documentação atualizada
- **Sempre** ler o README.md do projeto para entender a estrutura
- Comunicação em **Português Brasileiro**

### Git Operations
- **NUNCA** executar comandos Git (add, commit, push) a menos que seja escrito explicitamente "fazer push"
- Se escrito "no git", não realizar NENHUMA ação Git

### Localhost
- Reiniciar localhost **apenas** quando absolutamente necessário
- Evitar interrupções desnecessárias

### Padrões de Desenvolvimento
- Usar **sempre** cores, estilos e espaçamentos do **Shadcn UI** (https://ui.shadcn.com/docs)
- **NÃO** mudar conteúdo ou layouts, exceto quando explicitamente pedido
- **NÃO** adicionar comentários no código
- Código profissional, estruturado para fácil manutenção e debug
- Seguir padrão **OWASP Top 10** para segurança (https://owasp.org/)

## 📋 INFORMAÇÕES DO PROJETO

### Dados Básicos
- **Domínio:** www.rioporto.com
- **Pasta Local:** D:\Projetos\rioporto-site
- **Idioma:** Português Brasileiro
- **Empresa:** RIO PORTO MEDIAÇÃO LTDA (RIO PORTO P2P)
- **CNPJ:** 11.741.563/0001-57
- **Endereço:** Av. Marechal Câmara, 160, sala 1107, Centro, Rio de Janeiro, CEP 20020-907
- **Telefone/WhatsApp:** +55 21 3400-3259

### Stack Tecnológico
- **Frontend:** React com Next.js 15
- **Backend:** Node.js (API Routes do Next.js)
- **Database:** Supabase (versão gratuita inicial)
- **Autenticação:** Resend (OTP)
- **Versionamento:** GitHub
- **Hospedagem:** Vercel (gratuita inicial)
- **UI Components:** Shadcn UI
- **Estilização:** Tailwind CSS

### Referência de Design
- Usar **fort.exchange** como referência direta de design, UX e funcionalidades
- Visual profissional e estruturado
- Alta credibilidade visual
- Dark Mode nativo

## 🎯 REQUISITOS DO PROJETO

### 1. Páginas Principais

#### Página Institucional
- Clara e objetiva
- Informações sobre a empresa

#### Página de Serviços
1. **P2P (Peer-to-Peer)**
   - Compra e venda direta de Bitcoin e stablecoins
   - Processo: Cliente → Rio Porto → Bitcoin na wallet do cliente
   - Processo: Bitcoin do cliente → Rio Porto → R$ na conta do cliente

2. **Consultoria**
   - Segurança digital
   - Adoção do padrão Bitcoin
   - Recebíveis em BTC
   - Mineração doméstica
   - Projetos relacionados

#### Blog Educativo
- **90%** conteúdo sobre Bitcoin
- **5%** Stablecoins (USDC, USDT, BRL via Pix)
- **5%** estratégias tradicionais ligadas ao Bitcoin (Coinbase, Circle, MSTR, MSTY)

### 2. Funcionalidades Essenciais

#### Formulário de Cotação/Contato
- Integração com WhatsApp
- Integração com Zendesk
- Processo simplificado para mobile

#### Sistema KYC
- Similar ao MyKYC (cadastro.io)
- Para pessoas físicas e jurídicas
- Interface mobile-first

#### Área de Cursos
- **Cursos Gratuitos:**
  - Como comprar Bitcoin com ou sem a Rio Porto P2P
- **Cursos Pagos:**
  - Segurança para dispositivos (R$ 99,00)
  - Bitcoin 7 dias (R$ 499,00)
  - Estratégia contábil (R$ 199,00)
  - Wallet de aço (R$ 299,00)
  - Mineração residencial (R$ 99,00)
  - Mineração com energia limpa (R$ 899,00)
  - Lista de P2P concorrentes (R$ 499,00)
  - Guia de privacidade (R$ 499,00)
  - Kit ferramentas Bitcoiners (R$ 99,00)
  - BTC de graça - primeiros 50 (R$ 299,00)
- **Integração Hotmart** para pagamentos tradicionais
- **25% desconto** para pagamentos em Bitcoin (carteira própria)

### 3. Área Administrativa

#### Autenticação
- Desenvolvimento: Login/senha
- Produção: OTP via Resend

#### Níveis de Acesso
1. **Nível 1**
   - Cursos gratuitos
   - Blog completo
   - Negociação até R$ 4.999
   - Comissão: 3,5%

2. **Nível 2**
   - Cursos gratuitos
   - Blog completo
   - Negociação até R$ 50.000
   - Comissão: 2,5%

3. **Nível 3**
   - Todos os cursos (gratuitos e pagos)
   - Blog completo
   - Negociação até R$ 50.000
   - Comissão: 1,5%

#### Tabela de Comissões P2P
- Até R$ 4.999: **3,5%**
- R$ 5.000 até R$ 50.000: **2,5%**
- R$ 50.001 até R$ 100.000: **1,5%**
- Acima de R$ 100.000: **Negociável**

### 4. Funcionalidades Adicionais
- **Assistente Virtual IA** (Claude) para dúvidas preliminares
- **Integração Google Maps API** para avaliações reais
- **Dark Mode** nativo
- **Mobile-first** design

## 📁 ESTRUTURA DE PASTAS PROPOSTA

```
rioporto-site/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── cadastro/
│   ├── (marketing)/
│   │   ├── page.tsx (home)
│   │   ├── sobre/
│   │   ├── servicos/
│   │   ├── blog/
│   │   └── contato/
│   ├── (platform)/
│   │   ├── dashboard/
│   │   ├── cotacao/
│   │   ├── kyc/
│   │   └── cursos/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── usuarios/
│   │   ├── transacoes/
│   │   └── cursos/
│   ├── api/
│   │   ├── auth/
│   │   ├── kyc/
│   │   ├── cotacao/
│   │   ├── bitcoin/
│   │   └── admin/
│   └── layout.tsx
├── components/
│   ├── ui/ (shadcn)
│   ├── layout/
│   ├── forms/
│   ├── kyc/
│   └── dashboard/
├── lib/
│   ├── supabase/
│   ├── resend/
│   ├── bitcoin/
│   └── utils/
├── hooks/
├── types/
├── public/
└── styles/
```

## 🔒 SEGURANÇA E PERFORMANCE

### Segurança
- Implementar padrões OWASP Top 10
- Autenticação robusta com OTP
- Validação de dados em todas as camadas
- HTTPS obrigatório
- Rate limiting nas APIs

### Performance (Otimização de Custos)
- Usar ISR (Incremental Static Regeneration) para páginas públicas
- Cache agressivo no Vercel
- Otimização de imagens com next/image
- Lazy loading de componentes pesados
- Edge functions para operações simples
- Monitoramento de uso do Supabase

### Implementação Bitcoin
- Usar biblioteca como bitcoinjs-lib
- HD Wallets para gerenciamento de endereços
- Webhook para confirmações de transações
- Sistema de notificações para pagamentos

### Esquema de Cores Implementado
- **Light Mode**: Esquema Slate do Shadcn (ajustado 28/12 - mais suave)
- **Dark Mode**: Esquema Neutral com destaques Orange-600
- Classes CSS customizadas para Bitcoin:
  - `.bitcoin-gradient`
  - `.bitcoin-text`
  - `.bitcoin-hover`
  - `.bitcoin-border`
  - `.bitcoin-bg`
  - `.bitcoin-bg-soft`

## 📝 WORKFLOW DE DESENVOLVIMENTO

1. **Sempre** ler este documento antes de começar
2. **Sempre** verificar Context7 para documentação atualizada
3. **Nunca** fazer alterações de layout sem solicitação
4. **Sempre** priorizar mobile-first
5. **Sempre** seguir os padrões do Shadcn UI

## 🎨 DIRETRIZES DE UI/UX

- Design limpo e profissional
- Foco em conversão
- CTAs claros e destacados
- Formulários simplificados
- Feedback visual imediato
- Animações sutis e funcionais

---

**ÚLTIMA ATUALIZAÇÃO:** 29/12/2024
**VERSÃO:** 1.3

## 📄 DOCUMENTAÇÃO ADICIONAL

1. `RESUMO_PROJETO_ATUAL.md` - Estado atual detalhado
2. `PROBLEMAS_AUTH_PERSISTENTES.md` - Bugs críticos de auth
3. `INSTRUCOES_RESOLVER_AUTH.md` - Como resolver os bugs
4. `SUPABASE_SETUP_GUIDE.md` - Guia completo Supabase
5. `TROUBLESHOOTING.md` - Solução de problemas
6. `LEIA_PRIMEIRO.md` - Resumo executivo do estado atual

## 📊 PROGRESSO DO DESENVOLVIMENTO

### ✅ Implementado
1. **Estrutura Base**
   - Next.js 14 configurado
   - Tailwind CSS + Shadcn UI
   - TypeScript configurado
   - Dark Mode funcional
   - Esquema de cores personalizado:
     - Light: Slate (cinzas azulados)
     - Dark: Neutral + Orange-600 (Bitcoin)

2. **Páginas Estáticas**
   - Home
   - Serviços
   - Sobre
   - Contato

3. **Formulário de Cotação P2P** ✨
   - Página /cotacao completa
   - Cálculo automático com comissões
   - Integração WhatsApp
   - API Route funcional
   - Alerta KYC para valores > R$ 5.000
   - Integração com autenticação

4. **API de Criptomoedas** 🆕
   - Integração com CoinGecko API
   - Preço do Bitcoin em tempo real
   - Busca de 300+ criptomoedas
   - Autocomplete inteligente
   - Cache e otimização

5. **Sistema de Autenticação com Supabase** ✅
   - Login/Cadastro funcionais
   - AuthContext com Supabase
   - Dashboard do usuário
   - Integração com formulário de cotação
   - Header com menu de usuário
   - Proteção de rotas
   - Middleware configurado
   - Dados persistidos no banco

6. **Banco de Dados Supabase** ✅
   - Tabela profiles (usuários)
   - Tabela transactions (P2P)
   - Tabela kyc_documents
   - RLS configurado
   - Triggers automáticos
   - Políticas de segurança

7. **Blog Educativo** ✅ (29/12/2024)
   - Página principal com listagem de artigos
   - Página individual para cada post
   - Sistema de categorias funcionando
   - Busca em tempo real
   - 10 artigos iniciais (90% Bitcoin)
   - Design responsivo

### 🔄 Próximos Passos
- Sistema KYC completo (aguardando pesquisa)
- Sistema de Cursos
- Dashboard Admin
- Páginas de Perfil/Transações
- Melhorias no Blog (CMS, comentários)

### 📝 Pendente
- Integração Resend (OTP)
- Integração Hotmart
- Sistema Bitcoin completo
- Assistente IA
- Email de confirmação Supabase
- Storage bucket para KYC
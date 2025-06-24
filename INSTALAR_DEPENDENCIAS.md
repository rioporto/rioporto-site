# INSTALAÇÃO DE DEPENDÊNCIAS - RIO PORTO P2P

## Dependências já instaladas:

```bash
# Framework e React
next@14.1.0
react@18.2.0
react-dom@18.2.0

# UI Components (Shadcn/ui e Radix)
@radix-ui/react-accordion@1.1.2
@radix-ui/react-alert-dialog@1.0.5
@radix-ui/react-avatar@1.1.10
@radix-ui/react-checkbox@1.0.4
@radix-ui/react-dialog@1.0.5
@radix-ui/react-dropdown-menu@2.1.15
@radix-ui/react-label@2.0.2
@radix-ui/react-popover@1.0.7
@radix-ui/react-progress@1.0.3
@radix-ui/react-radio-group@1.1.3
@radix-ui/react-scroll-area@1.0.5
@radix-ui/react-select@2.0.0
@radix-ui/react-separator@1.0.3
@radix-ui/react-slot@1.0.2
@radix-ui/react-switch@1.0.3
@radix-ui/react-tabs@1.0.4
@radix-ui/react-toast@1.1.5
@radix-ui/react-tooltip@1.0.7

# Utilitários
class-variance-authority@0.7.0
clsx@2.1.0
tailwind-merge@2.2.0
tailwindcss-animate@1.0.7

# Formulários e Validação
react-hook-form@7.48.2
@hookform/resolvers@3.3.4
zod@3.22.4

# Supabase
@supabase/supabase-js@2.50.0
@supabase/ssr@0.6.1

# Outros
lucide-react@0.311.0 (ícones)
next-themes@0.2.1 (dark mode)
date-fns@3.2.0 (datas)
react-hot-toast@2.4.1 (notificações)
```

## NOVAS DEPENDÊNCIAS PARA O BLOG:

```bash
npm install marked @types/marked
```

## Para instalar tudo de uma vez:

```bash
npm install
```

## Dependências de desenvolvimento (já instaladas):

```bash
# TypeScript
typescript@5.3.3
@types/node@20.11.5
@types/react@18.2.48
@types/react-dom@18.2.18

# CSS
tailwindcss@3.4.1
autoprefixer@10.4.17
postcss@8.4.33

# Linting
eslint@8.56.0
eslint-config-next@14.1.0
```

## APIs Externas (configurar chaves no .env.local):

- **CoinGecko API** - Para cotações de criptomoedas (gratuita, sem chave)
- **Supabase** - Banco de dados e autenticação
- **Resend** - Para envio de emails (ainda não implementado)

## Estrutura do .env.local:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui

# Resend (quando implementar)
RESEND_API_KEY=sua_chave_aqui
```
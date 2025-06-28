# Rio Porto P2P - Plataforma de Negociação P2P de Bitcoin

Plataforma completa para compra e venda de Bitcoin através de negociação peer-to-peer (P2P), com foco em segurança, privacidade e experiência do usuário.

## 🚀 Funcionalidades

- **Sistema de Cotação P2P** - Formulário inteligente com integração WhatsApp
- **Minicurso Gratuito** - Manual completo com vídeo aulas sobre negociação P2P
- **Lead Capture** - Sistema automatizado com envio de emails via Resend
- **Autenticação Completa** - Login, cadastro e perfil de usuário
- **Dashboard Administrativo** - Gestão de cotações e leads

## 🛠️ Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Type safety em todo o projeto
- **Tailwind CSS** - Estilização moderna e responsiva
- **Supabase** - Backend as a Service (Auth + Database)
- **Resend** - Envio de emails transacionais
- **Vimeo** - Hospedagem de vídeos do minicurso

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/rioporto-site.git

# Entre no diretório
cd rioporto-site

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Execute o projeto
npm run dev
```

## 🔧 Configuração

Crie um arquivo `.env.local` com as seguintes variáveis:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service

# Resend
RESEND_API_KEY=sua_api_key_resend
RESEND_FROM_EMAIL=noreply@seudominio.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📱 URLs Principais

- `/` - Homepage
- `/cotacao` - Sistema de cotação P2P
- `/minicurso-gratis` - Landing page do minicurso
- `/cursos` - Lista de cursos disponíveis
- `/blog` - Artigos e conteúdo educativo

## 🚀 Deploy

O projeto está configurado para deploy automático na Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seu-usuario/rioporto-site)

## 📄 Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados.

---

Desenvolvido com ❤️ pela equipe Rio Porto P2P

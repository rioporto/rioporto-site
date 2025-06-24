# Rio Porto P2P - Plataforma de Negociação de Criptomoedas

## 🚀 Sobre o Projeto

Rio Porto P2P é uma plataforma completa para negociação peer-to-peer de Bitcoin e criptomoedas, com foco em segurança, simplicidade e educação financeira.

### ✨ Principais Funcionalidades

- **Sistema P2P Completo** - Compra e venda de Bitcoin com cálculo automático de taxas
- **Blog Educativo** - Conteúdo sobre Bitcoin, criptomoedas e educação financeira
- **Sistema de Autenticação** - Login seguro com Supabase
- **Painel Administrativo** - Gestão de usuários e conteúdo
- **Dark Mode** - Interface adaptável com tema claro/escuro
- **Mobile First** - Design responsivo para todos os dispositivos

## 🛠️ Tecnologias Utilizadas

- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização utility-first
- **[Shadcn/ui](https://ui.shadcn.com/)** - Componentes UI modernos
- **[Supabase](https://supabase.com/)** - Backend as a Service
- **[Vercel](https://vercel.com/)** - Hospedagem e deploy

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- NPM ou Yarn
- Conta no Supabase

### Passo a passo

1. Clone o repositório:
```bash
git clone https://github.com/SEU_USUARIO/rioporto-site.git
cd rioporto-site
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase
```

4. Execute o projeto:
```bash
npm run dev
```

5. Acesse `http://localhost:3000`

## 🗄️ Configuração do Banco de Dados

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute os scripts SQL na seguinte ordem:
   - `supabase_setup.sql` - Estrutura base
   - `supabase_blog_setup.sql` - Sistema de blog
   - `supabase_blog_data_migration.sql` - Dados iniciais

## 🌐 Deploy

### Deploy no Vercel

1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy!

## 📁 Estrutura do Projeto

```
rioporto-site/
├── app/                    # App Router do Next.js
│   ├── (auth)/            # Páginas de autenticação
│   ├── (marketing)/       # Páginas públicas
│   ├── (platform)/        # Área autenticada
│   └── api/               # API Routes
├── components/            # Componentes React
├── contexts/              # Context API
├── lib/                   # Utilitários e configurações
├── types/                 # TypeScript types
└── public/                # Assets estáticos
```

## 🔧 Scripts Disponíveis

```bash
npm run dev        # Desenvolvimento
npm run build      # Build de produção
npm run start      # Iniciar produção
npm run lint       # Verificar código
npm run type-check # Verificar tipos
```

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

Rio Porto P2P - [www.rioporto.com](https://www.rioporto.com)

---

Desenvolvido com ❤️ pela equipe Rio Porto

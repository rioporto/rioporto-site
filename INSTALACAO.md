# 🚀 INSTRUÇÕES DE INSTALAÇÃO E EXECUÇÃO

## Pré-requisitos

- Node.js 18+ instalado
- NPM ou Yarn
- Git (opcional)

## Passo a Passo

### 1. Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

ou se preferir usar yarn:

```bash
yarn install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Por enquanto, o projeto rodará sem as variáveis configuradas.

### 3. Executar o Projeto

Para rodar em modo de desenvolvimento:

```bash
npm run dev
```

ou

```bash
yarn dev
```

### 4. Acessar o Projeto

Abra o navegador e acesse:
- http://localhost:3000

## 🎯 O que já está funcionando:

✅ Estrutura base do Next.js 14  
✅ Sistema de rotas organizadas  
✅ Dark Mode funcional  
✅ Layout responsivo  
✅ Páginas criadas:
   - Home
   - Serviços
   - Contato
   - Sobre
✅ Header com navegação mobile  
✅ Footer com informações da empresa  
✅ Componentes Shadcn UI configurados  
✅ TypeScript configurado  
✅ Tailwind CSS configurado  

## 📝 Próximos Passos:

1. Configurar Supabase
2. Implementar sistema de autenticação
3. Criar páginas de Blog e Cursos
4. Implementar sistema KYC
5. Criar área administrativa
6. Integrar APIs externas

## 🐛 Troubleshooting

Se encontrar algum erro:

1. Certifique-se de que todas as dependências foram instaladas
2. Delete a pasta `node_modules` e o arquivo `package-lock.json`
3. Execute `npm install` novamente
4. Reinicie o servidor de desenvolvimento

---

**Desenvolvido seguindo as regras do RIOPORTO_CLAUDE_RULES.md**
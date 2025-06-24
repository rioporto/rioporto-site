# 🔧 TROUBLESHOOTING - RIO PORTO P2P

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### 1. Erro de Módulo não Encontrado
```
Module not found: Can't resolve '@/components/ui/...'
```
**Solução:**
```bash
npx shadcn-ui@latest add [component-name]
# Exemplo:
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
```

### 2. Erro de Autenticação Supabase
```
AuthApiError: Invalid login credentials
```
**Soluções:**
- Verificar .env.local tem as chaves corretas
- Confirmar que o usuário existe no Supabase
- Verificar se o email foi confirmado (se habilitado)

### 3. Erro de CORS/Fetch
```
Failed to fetch
```
**Soluções:**
- Verificar se a URL do Supabase está correta
- Confirmar que está usando HTTPS
- Verificar configurações de CORS no Supabase

### 4. Erro de Tipos TypeScript
```
Type 'string' is not assignable to type...
```
**Solução:**
```bash
# Regenerar tipos do Supabase
npx supabase gen types typescript --linked > types/supabase.ts
```

### 5. Dark Mode não Funciona
**Soluções:**
- Limpar cache do navegador
- Verificar se ThemeProvider está no layout.tsx
- Confirmar que globals.css tem as variáveis CSS

### 6. Dados não Aparecem no Dashboard
**Possíveis Causas:**
- RLS bloqueando acesso
- Profile não foi criado
- useEffect não carregou dados

**Debug:**
```typescript
// No console do navegador
const { data, error } = await supabase
  .from('profiles')
  .select('*')
console.log({ data, error })
```

### 7. Transação não é Salva
**Verificar:**
- Usuário está logado?
- API está retornando sucesso?
- Verificar logs do Supabase

### 8. Componente Radix UI não Funciona
```bash
# Instalar dependências faltantes
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-avatar
npm install @radix-ui/react-select
# etc...
```

## 📋 CHECKLIST DE VERIFICAÇÃO

### Ao Iniciar o Projeto:
- [ ] `.env.local` existe e tem as chaves
- [ ] `npm install` foi executado
- [ ] Supabase está online
- [ ] Tabelas foram criadas no Supabase

### Ao Testar Autenticação:
- [ ] Email de teste é válido
- [ ] Senha tem pelo menos 6 caracteres
- [ ] Profile é criado automaticamente
- [ ] Cookies estão habilitados

### Ao Fazer Deploy:
- [ ] Variáveis de ambiente configuradas
- [ ] URLs de redirect atualizadas no Supabase
- [ ] CORS configurado para domínio de produção

## 🔍 COMANDOS DE DEBUG

```bash
# Ver erros de build
npm run build

# Limpar cache do Next.js
rm -rf .next
npm run dev

# Ver logs do Supabase
npx supabase db logs --tail

# Testar conexão com Supabase
npx supabase status
```

## 💡 DICAS RÁPIDAS

1. **Sempre verifique o console do navegador** - erros de client
2. **Verifique o terminal** - erros de servidor
3. **Use o Supabase Dashboard** - ver dados e logs
4. **Network tab** - verificar requisições
5. **React DevTools** - inspecionar estado

## 🆘 AINDA COM PROBLEMAS?

1. Verifique os arquivos de documentação:
   - `SUPABASE_SETUP_GUIDE.md`
   - `RESUMO_PROJETO_ATUAL.md`
   - `RIOPORTO_CLAUDE_RULES.md`

2. Confira se seguiu todos os passos de configuração

3. Tente recriar o componente/arquivo problemático

4. Reinicie o servidor de desenvolvimento

---

Mantenha este arquivo atualizado com novos problemas e soluções!
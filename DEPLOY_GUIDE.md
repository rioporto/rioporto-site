# 🚀 GUIA DE DEPLOY - GITHUB + VERCEL

## 📋 CONFIGURAÇÃO INICIAL (Fazer apenas uma vez)

### 1️⃣ CONECTAR AO GITHUB

```bash
# Abrir terminal na pasta do projeto
cd D:\Projetos\rioporto-site

# Inicializar git (se ainda não foi feito)
git init

# Adicionar o repositório remoto
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# Verificar se está conectado
git remote -v
```

### 2️⃣ PRIMEIRO PUSH

```bash
# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit: Rio Porto P2P Platform"

# Renomear branch principal (se necessário)
git branch -M main

# Enviar para o GitHub
git push -u origin main
```

### 3️⃣ CONFIGURAR VERCEL

1. **Acesse [vercel.com](https://vercel.com)**
2. **Clique em "New Project"**
3. **Importe o repositório do GitHub**
4. **Configure:**
   - Framework Preset: `Next.js`
   - Root Directory: `./` (deixar vazio)
   - Build Command: `npm run build` (padrão)
   - Output Directory: `.next` (padrão)

5. **IMPORTANTE - Adicionar Variáveis de Ambiente:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
   ```

6. **Clique em "Deploy"**

---

## 🔄 DEPLOYS FUTUROS (Uso diário)

### OPÇÃO 1: Usar o script (Recomendado)

```bash
# No Windows (duplo clique ou terminal):
git-push.bat

# No Linux/Mac:
chmod +x git-push.sh
./git-push.sh
```

### OPÇÃO 2: Comandos manuais

```bash
# Verificar mudanças
git status

# Adicionar mudanças
git add .

# Commit
git commit -m "Descrição das mudanças"

# Push
git push
```

---

## 📌 COMANDOS ÚTEIS

### Ver histórico
```bash
git log --oneline -10
```

### Desfazer último commit (antes do push)
```bash
git reset --soft HEAD~1
```

### Ver branches
```bash
git branch -a
```

### Atualizar do GitHub
```bash
git pull
```

---

## ⚠️ IMPORTANTE

### Arquivos que NÃO devem ir para o GitHub:
- `.env.local` (variáveis secretas)
- `node_modules/` (dependências)
- `.next/` (build)
- Qualquer arquivo com senhas

### Sempre antes de fazer push:
1. ✅ Testar localmente (`npm run dev`)
2. ✅ Verificar se não há erros
3. ✅ Revisar os arquivos modificados
4. ✅ Escrever mensagem de commit clara

---

## 🆘 PROBLEMAS COMUNS

### "Permission denied"
```bash
# Verificar se está logado no Git
git config --global user.email "seu-email@gmail.com"
git config --global user.name "Seu Nome"
```

### "Failed to push"
```bash
# Atualizar primeiro
git pull --rebase
git push
```

### Vercel não fez deploy
1. Verificar logs no dashboard do Vercel
2. Conferir variáveis de ambiente
3. Ver se o build passou localmente: `npm run build`

---

## 🎯 WORKFLOW RECOMENDADO

1. **Desenvolver** → Fazer mudanças localmente
2. **Testar** → `npm run dev` e verificar
3. **Commit** → Usar `git-push.bat`
4. **Aguardar** → Vercel faz deploy automático (2-3 min)
5. **Verificar** → Acessar site em produção

---

## 📱 URLS DO PROJETO

- **Desenvolvimento:** http://localhost:3000
- **Produção:** https://seu-projeto.vercel.app
- **GitHub:** https://github.com/seu-usuario/seu-repo
- **Vercel Dashboard:** https://vercel.com/dashboard

---

**Dica:** Salve este arquivo para consultas futuras! 📌

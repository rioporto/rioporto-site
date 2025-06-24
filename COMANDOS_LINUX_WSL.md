# 🚀 COMANDOS PARA LINUX/WSL/UBUNTU

## Para limpar cache e reiniciar:

### Opção 1: Comando direto (RECOMENDADO)
```bash
rm -rf .next && rm -rf node_modules/.cache && npm run dev
```

### Opção 2: Usar o script
```bash
# Primeiro, torne o script executável:
chmod +x clean-start.sh

# Depois execute:
./clean-start.sh
```

### Opção 3: Comandos separados
```bash
# Limpar cache do Next.js
rm -rf .next

# Limpar cache do node_modules
rm -rf node_modules/.cache

# Iniciar servidor
npm run dev
```

## 🔧 Para resolver erros de build:

```bash
# Se tiver problemas, faça uma limpeza completa:
rm -rf .next
rm -rf node_modules/.cache
npm install
npm run dev
```

## 📋 Atalho permanente (opcional):

Adicione ao seu `~/.bashrc` ou `~/.zshrc`:

```bash
alias cleanstart='rm -rf .next && rm -rf node_modules/.cache && npm run dev'
```

Depois recarregue:
```bash
source ~/.bashrc
# ou
source ~/.zshrc
```

Agora pode usar apenas:
```bash
cleanstart
```

---

**Use o comando direto da Opção 1 para simplicidade!** 🚀

# ✅ COMANDOS PARA LINUX/WSL - CORRIGIDO!

## 🚀 Formas de limpar cache e reiniciar:

### 1. **Usando npm scripts (MAIS FÁCIL!)**
```bash
# Limpar cache e iniciar desenvolvimento
npm run clean:dev

# Ou apenas limpar cache
npm run clean
```

### 2. **Comando direto**
```bash
rm -rf .next && rm -rf node_modules/.cache && npm run dev
```

### 3. **Tornar o script executável**
```bash
# Dar permissão
chmod +x clean-start.sh

# Executar
./clean-start.sh
```

## 📋 Scripts disponíveis no package.json:

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run clean` - Limpa cache
- `npm run clean:dev` - Limpa cache E inicia servidor

## 🔧 Se tiver erro de build:

```bash
# Limpeza completa
npm run clean
npm install
npm run dev
```

## ✅ Sistema Funcionando:

1. **Admin de Comentários** - `/admin/comments`
2. **Comentários Mascarados** - Preview para visitantes
3. **Login/Logout** - Funcionando
4. **Build** - Sem erros!

---

**Use `npm run clean:dev` para simplicidade!** 🚀

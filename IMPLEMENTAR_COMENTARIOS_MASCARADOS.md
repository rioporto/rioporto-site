# 🔧 COMO IMPLEMENTAR OS COMENTÁRIOS MASCARADOS

## Passo a Passo

### 1. Abra o arquivo do artigo do blog:
```
app/(marketing)/blog/[slug]/page.tsx
```

### 2. Encontre a linha de importação (linha ~11):
```tsx
import { BlogComments } from "@/components/blog/comments"
```

### 3. Mude para:
```tsx
import { BlogComments } from "@/components/blog/comments-masked"
```

### 4. Pronto! 🎉

## O que mudará:

### Para visitantes (não logados):
- ✅ Veem quantos comentários existem
- ✅ Veem preview dos comentários (80 caracteres)
- ✅ Nome aparece como "Usuário Rio Porto"
- ✅ Botão para fazer login e ler tudo
- ✅ Contador de respostas

### Para usuários logados:
- ✅ Tudo funciona normalmente
- ✅ Veem comentários completos
- ✅ Podem comentar e responder

## Exemplo Visual:

**Não logado:**
```
┌─────────────────────────────────────┐
│ 👤 Usuário Rio Porto                │
│ 22 de janeiro às 14:30              │
│                                     │
│ "Este artigo é muito esclarece..."  │
│                                     │
│ ┌─────────────────────────────┐     │
│ │ 🔒 Faça login para ler      │     │
│ │    e interagir               │     │
│ │ [Fazer Login] [Criar Conta] │     │
│ └─────────────────────────────┘     │
└─────────────────────────────────────┘
```

**Logado:**
```
┌─────────────────────────────────────┐
│ 👤 João Silva                       │
│ 22 de janeiro às 14:30              │
│                                     │
│ "Este artigo é muito esclarecedor!  │
│ Aprendi bastante sobre Bitcoin e    │
│ como funciona o P2P. Obrigado!"     │
│                                     │
│ [💬 Responder]                      │
└─────────────────────────────────────┘
```

## Personalização:

### Mudar tamanho do preview:
No arquivo `components/blog/comments-masked.tsx`:
```tsx
const maxPreviewLength = 80 // Mude para 100, 120, etc
```

### Mudar texto do usuário mascarado:
```tsx
// Linha ~152
{shouldMask ? "Usuário Rio Porto" : (comment.user?.name || "Usuário Anônimo")}
```

## Benefícios:

1. **📈 Aumenta Cadastros** - Cria curiosidade
2. **💬 Prova Social** - Mostra que há discussão
3. **🔒 Conteúdo Exclusivo** - Valor para membros
4. **🎯 Engajamento** - Incentiva participação

---

**Perfeito para P2P onde confiança é essencial!**

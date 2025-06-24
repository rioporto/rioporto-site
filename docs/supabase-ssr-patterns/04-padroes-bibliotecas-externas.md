# 📝 Padrões para Bibliotecas Externas

## 🔧 Marked.js (Markdown Parser)

### Versões e Mudanças Importantes:

#### Marked v5+ (versão atual)
- **IMPORTANTE:** `marked()` agora retorna uma Promise!
- Use async/await para renderizar

```typescript
// ✅ CORRETO - Versão 5+
import { marked } from 'marked'

async function renderMarkdown(content: string) {
  const html = await marked(content)
  element.innerHTML = html
}

// Em useEffect:
useEffect(() => {
  async function render() {
    if (element && content) {
      const html = await marked(content)
      element.innerHTML = html
    }
  }
  render()
}, [content])
```

#### Marked v4 e anteriores
```typescript
// ❌ OBSOLETO - Versão 4 e anteriores
const html = marked(content) // Sícrono
element.innerHTML = html
```

### Opções Disponíveis (v5+):
```typescript
marked.setOptions({
  gfm: true,          // GitHub Flavored Markdown
  breaks: true,       // Quebras de linha como <br>
  pedantic: false,    // Não usar o modo pedante
  // ❌ NÃO EXISTEM MAIS:
  // smartLists: true  - Removido
  // smartypants: true - Removido
})
```

## 🔧 Next.js Image Component

### Quando usar <img> vs <Image>:

#### Use `<img>` quando:
- Imagens externas sem dimensões conhecidas
- Conteúdo dinâmico (Markdown renderizado)
- SVGs inline

```typescript
// ✅ OK para conteúdo dinâmico
<img src={dynamicUrl} alt={alt} className="rounded-lg" />
```

#### Use `<Image>` quando:
- Imagens locais
- Dimensões conhecidas
- Precisa de otimização

```typescript
// ✅ Melhor para imagens estáticas
import Image from 'next/image'

<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={100}
  priority
/>
```

## 🔧 React Hook Dependencies

### useEffect com funções:

```typescript
// ❌ EVITE - ESLint vai reclamar
useEffect(() => {
  loadData()
}, []) // Missing dependency: loadData

// ✅ OPÇÃO 1 - Função dentro do useEffect
useEffect(() => {
  async function loadData() {
    // ...
  }
  loadData()
}, [])

// ✅ OPÇÃO 2 - useCallback
const loadData = useCallback(async () => {
  // ...
}, [dependencies])

useEffect(() => {
  loadData()
}, [loadData])

// ✅ OPÇÃO 3 - Desabilitar regra (use com cuidado)
useEffect(() => {
  loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])
```

## 🔧 TypeScript com Supabase

### Sempre tipar as respostas:

```typescript
// ❌ EVITE
const { data } = await supabase.from('table').select()

// ✅ MELHOR
interface MyType {
  id: string
  name: string
}

const { data } = await supabase
  .from('table')
  .select()
  .returns<MyType[]>()
```

## 🔧 Variáveis de Ambiente

### Next.js Pattern:

```typescript
// ✅ Cliente (browser)
process.env.NEXT_PUBLIC_SUPABASE_URL

// ✅ Servidor apenas
process.env.SUPABASE_SERVICE_KEY

// ❌ NUNCA exponha chaves privadas
process.env.NEXT_PUBLIC_SECRET_KEY // PERIGO!
```

---

**Última atualização:** 24/06/2025
**Use estes padrões para evitar erros comuns!**

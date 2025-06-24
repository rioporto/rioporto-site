# 🔧 Gerar Tipos TypeScript do Supabase Automaticamente

## Opção 1: Usando Supabase CLI (Recomendado)

### 1. Instalar Supabase CLI

```bash
# Windows (usando Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# macOS
brew install supabase/tap/supabase

# Linux
brew install supabase/tap/supabase

# Ou via NPM
npm install -g supabase
```

### 2. Login no Supabase

```bash
supabase login
```

### 3. Inicializar projeto local

```bash
# Na raiz do projeto
supabase init
```

### 4. Conectar ao projeto remoto

```bash
# Substitua pelo ID do seu projeto (encontre em Settings > General)
supabase link --project-ref your-project-id
```

### 5. Gerar tipos

```bash
supabase gen types typescript --linked > types/supabase.ts
```

## Opção 2: Usando Ferramenta Online

1. Acesse o dashboard do seu projeto Supabase
2. Vá em **Settings > API**
3. Role até **Generating Types**
4. Clique em **Generate types**
5. Copie o conteúdo gerado
6. Cole em `/types/supabase.ts`

## Opção 3: Script NPM Automatizado

### 1. Instalar dependência

```bash
npm install --save-dev supabase
```

### 2. Adicionar script no package.json

```json
{
  "scripts": {
    "gen:types": "supabase gen types typescript --project-id $SUPABASE_PROJECT_ID --schema public > types/supabase.ts"
  }
}
```

### 3. Criar arquivo .env com ID do projeto

```env
SUPABASE_PROJECT_ID=your-project-id-here
```

### 4. Executar

```bash
npm run gen:types
```

## 📝 Estrutura dos Tipos Gerados

Os tipos gerados incluirão:

```typescript
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          level: Database["public"]["Enums"]["user_level"]
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          created_at: string
          updated_at: string
        }
        Insert: {
          // tipos para inserção
        }
        Update: {
          // tipos para atualização
        }
      }
      // outras tabelas...
    }
    Views: {
      // views se houver
    }
    Functions: {
      // funções se houver
    }
    Enums: {
      kyc_status: "pending" | "approved" | "rejected"
      user_level: "1" | "2" | "3"
      transaction_type: "buy" | "sell"
      transaction_status: "pending" | "processing" | "completed" | "cancelled"
      document_type: "rg" | "cnh" | "passport" | "proof_of_residence" | "selfie"
    }
  }
}
```

## 🔄 Atualização Automática

### GitHub Action para atualizar tipos automaticamente

Crie `.github/workflows/update-types.yml`:

```yaml
name: Update Supabase Types

on:
  schedule:
    - cron: '0 0 * * 1' # Toda segunda-feira
  workflow_dispatch: # Permite execução manual

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Supabase CLI
        run: |
          npm install -g supabase
          
      - name: Generate types
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_PROJECT_ID: ${{ secrets.SUPABASE_PROJECT_ID }}
        run: |
          supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > types/supabase.ts
          
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add types/supabase.ts
          git commit -m "chore: update supabase types" || exit 0
          git push
```

## 🎯 Uso dos Tipos

### No cliente Supabase

```typescript
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Em queries

```typescript
// Tipos automáticos!
const { data: profiles } = await supabase
  .from('profiles')
  .select('*')
  .eq('level', '3') // TypeScript sabe que só aceita '1', '2' ou '3'

// data é tipado como Profile[] automaticamente
```

### Em componentes

```typescript
import { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type Transaction = Database['public']['Tables']['transactions']['Row']

interface Props {
  profile: Profile
  transactions: Transaction[]
}
```

## 🚀 Benefícios

1. **Type Safety**: Erros de tipo em tempo de compilação
2. **Autocomplete**: IntelliSense completo no VS Code
3. **Refactoring**: Mudanças no banco refletem nos tipos
4. **Documentação**: Tipos servem como documentação
5. **Menos Bugs**: Reduz erros em produção

## 📌 Dicas

- Sempre regenere os tipos após mudanças no schema
- Commite o arquivo de tipos no Git
- Use os tipos em todo o projeto
- Configure o CI/CD para validar tipos
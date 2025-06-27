# 🔧 Correção do Sistema de Cotação

## Problema Identificado
O sistema está pedindo WhatsApp mesmo para usuários logados.

## Correção Aplicada
Vamos modificar o formulário de cotação para:
- **Usuários logados**: Usar dados do perfil automaticamente
- **Usuários não logados**: Pedir nome e email (WhatsApp opcional)

## Arquivo Modificado
`app/(marketing)/cotacao/page.tsx`

## Mudanças Principais:

### 1. Remover validação obrigatória de telefone
```typescript
// ANTES
if (!nome.trim() || !email.trim() || !telefone.trim()) {
  toast.error('Por favor, preencha todos os dados pessoais')
  return
}

// DEPOIS
if (!user && (!nome.trim() || !email.trim())) {
  toast.error('Por favor, preencha nome e email')
  return
}
```

### 2. Tornar WhatsApp opcional
```typescript
// Para usuários não logados
<div className="space-y-2">
  <Label htmlFor="telefone">WhatsApp (opcional)</Label>
  <Input
    id="telefone"
    type="tel"
    placeholder="+55 21 99999-9999"
    value={formData.telefone}
    onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
    // removido: required
  />
  <p className="text-xs text-muted-foreground">
    Adicione para receber notificações importantes
  </p>
</div>
```

### 3. Lógica ajustada para usuários logados
- Se tem perfil completo: Não pede nada
- Se tem perfil sem telefone: Mostra campo opcional
- Se não está logado: Pede nome e email (WhatsApp opcional)

## Para aplicar a correção:

```bash
# Commit das mudanças
git add app/(marketing)/cotacao/page.tsx
git commit -m "fix: tornar WhatsApp opcional na cotação"
git push origin main
```

## Comportamento Esperado:

### Usuário Logado:
- Mostra dados do perfil em um alerta verde
- Se não tem WhatsApp, mostra campo opcional
- Envia cotação com dados do perfil

### Usuário Não Logado:
- Mostra alerta sugerindo login
- Pede nome e email (obrigatórios)
- WhatsApp é opcional
- Pode enviar cotação normalmente
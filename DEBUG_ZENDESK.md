# 🔧 Debug do Zendesk

## Para testar o problema:

### 1. Abra o Console do navegador (F12)

### 2. Acesse a página de cotação:
https://rioporto-site.vercel.app/cotacao

### 3. No Console, execute estes comandos para debug:

```javascript
// Verificar se o Zendesk está carregado
console.log('window.zE existe?', typeof window.zE !== 'undefined');

// Verificar elementos do Zendesk na página
console.log('Elementos Zendesk:', {
  launcher: document.querySelector('#launcher'),
  widget: document.querySelector('.zEWidget-launcher'),
  frame: document.querySelector('iframe[title*="zendesk"]'),
  todos: document.querySelectorAll('[class*="zE"], [id*="zendesk"]')
});

// Tentar forçar abertura
if (window.zE) {
  window.zE('webWidget', 'show');
  setTimeout(() => {
    window.zE('webWidget', 'open');
    console.log('Tentativa de abrir executada');
  }, 1000);
} else {
  console.log('window.zE não existe!');
}

// Verificar se há erros de CSP ou CORS
console.log('Erros no console relacionados ao Zendesk?');
```

### 4. Verificações importantes:

1. **O widget aparece no canto inferior direito?**
   - Se SIM: O Zendesk está carregando
   - Se NÃO: Problema no carregamento

2. **Há erros no console?**
   - Procure por erros relacionados a:
     - Content Security Policy (CSP)
     - CORS
     - Failed to load resource
     - Zendesk

3. **A chave do Zendesk está correta?**
   - Verifique em: https://rioportop2p.zendesk.com
   - Admin → Canais → Widget Web

### 5. Possíveis causas:

1. **Bloqueador de anúncios/scripts**
   - Teste em janela anônima
   - Desative extensões

2. **Problema de carregamento**
   - Widget demora para carregar
   - Conflito com outros scripts

3. **Configuração do Zendesk**
   - Widget pode estar desabilitado
   - Restrições de domínio

### 6. Solução temporária:

Se o widget não está aparecendo, adicione este link direto no site:

```html
<a href="https://rioportop2p.zendesk.com/hc/pt-br/requests/new" target="_blank">
  Abrir Suporte
</a>
```

Ou use o chat direto:
```
https://rioportop2p.zendesk.com/chat
```

## Compartilhe os resultados!

Execute os comandos acima e compartilhe:
1. O que aparece no console
2. Se o widget está visível
3. Quaisquer erros encontrados

Com essas informações, posso criar uma solução específica!
# 🚨 INSTRUÇÕES DE DEBUG - PÁGINA DE COTAÇÃO

## Para verificar o que está acontecendo:

### 1. **Abra o Console do Navegador (F12)**
   - Vá para a aba "Console"
   - Recarregue a página de cotação
   - Veja se há erros em vermelho

### 2. **Teste as APIs diretamente no navegador:**

   **API de Teste (deve funcionar sempre):**
   ```
   http://localhost:3000/api/test
   ```
   
   **Preço do Bitcoin:**
   ```
   http://localhost:3000/api/crypto?action=bitcoin-price
   ```
   
   **Busca de Criptomoedas:**
   ```
   http://localhost:3000/api/crypto?action=search&q=bitcoin
   ```

### 3. **Verificar Network (Rede)**
   - No DevTools (F12), vá para aba "Network"
   - Recarregue a página
   - Veja se as requisições para `/api/crypto` estão retornando 200 (sucesso) ou erro

### 4. **Possíveis Soluções:**

   **Se nada aparece no console:**
   - Verifique se o servidor Next.js está rodando (`npm run dev`)
   - Tente parar (Ctrl+C) e reiniciar o servidor

   **Se aparecer erro de CORS:**
   - O middleware já deve resolver, mas reinicie o servidor

   **Se aparecer erro 429 (Too Many Requests):**
   - A API gratuita do CoinGecko tem limite
   - O sistema usará valores de fallback

### 5. **Solução Temporária:**
   
   Se a API externa continuar falhando, o sistema já está configurado para:
   - Usar preço padrão de R$ 250.000 para Bitcoin
   - Mostrar "Valor de referência" em vez de "Dados em tempo real"
   - Permitir busca manual com lista de criptos populares

## 📝 Informações para Relatar:

Se o problema persistir, me informe:
1. Qual erro aparece no console?
2. O que aparece quando acessa `/api/test`?
3. O select de criptomoeda está vazio ou mostra "Bitcoin (BTC) Recomendado"?

---

**Com essas informações, posso fazer ajustes mais específicos!**
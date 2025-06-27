# 🎓 Como Testar o Minicurso "Bitcoin P2P"

## 📍 Onde está o Minicurso?

O minicurso está integrado ao sistema de Lead Capture e pode ser acessado de duas formas:

### 1. 🏠 Pela Home (Lead Capture)

1. **Acesse**: https://rioporto-site.vercel.app
2. **Aguarde**: 3 segundos para o popup aparecer
3. **Preencha** o formulário:
   - Nome completo
   - Email
   - WhatsApp (opcional)
4. **Clique** em "Quero o Minicurso Grátis!"
5. **Receba** o link por email OU acesse direto

### 2. 🔗 Acesso Direto (Para Teste)

Se você já se cadastrou antes, pode acessar diretamente:
```
https://rioporto-site.vercel.app/minicurso?token=SEU_TOKEN_AQUI
```

Para encontrar seu token:
1. Faça login em: https://rioporto-site.vercel.app/login
2. Vá para o dashboard
3. O sistema redirecionará automaticamente

## 📚 Conteúdo do Minicurso

### Módulos Disponíveis:

1. **Introdução ao Bitcoin P2P**
   - O que é P2P?
   - Vantagens do modelo
   - Como funciona

2. **Como Escolher uma Exchange P2P**
   - Critérios de segurança
   - Reputação
   - Taxas e limites

3. **Segurança em Transações P2P**
   - Verificação de identidade
   - Escrow
   - Red flags

4. **Métodos de Pagamento**
   - PIX
   - Transferência bancária
   - Outros métodos

5. **Como Precificar seu Bitcoin**
   - Spread de mercado
   - Análise de concorrência
   - Estratégias

6. **Evitando Golpes e Fraudes**
   - Golpes comuns
   - Como se proteger
   - O que fazer se for vítima

7. **Dicas Avançadas para Traders P2P**
   - Automação
   - Gestão de risco
   - Construindo reputação

## 🎵 Recursos do Minicurso

### Áudios Narrados
- Cada módulo tem áudio profissional
- Controles de reprodução
- Pode ler ou ouvir

### Sistema de Tracking
- Progresso salvo automaticamente
- Tempo gasto em cada módulo
- Áudios reproduzidos
- Certificado ao completar (futuro)

### Interface
- Design moderno e responsivo
- Navegação entre módulos
- Indicador de progresso
- Modo escuro disponível

## 🧪 Como Testar Completamente

### 1. Teste o Lead Capture
```bash
# Em navegador anônimo para testar como novo usuário
1. Acesse a home
2. Aguarde o popup (3 segundos)
3. Preencha e envie o formulário
4. Verifique se recebeu o email (se configurado)
```

### 2. Teste a Navegação
- Clique em cada módulo
- Reproduza os áudios
- Navegue com "Anterior" e "Próximo"
- Teste em mobile e desktop

### 3. Teste o Tracking
- Passe tempo em cada módulo
- Reproduza áudios parcialmente
- Saia e volte para ver se salvou progresso
- Verifique o console para logs de tracking

### 4. Teste de Performance
- Carregamento dos áudios
- Transição entre módulos
- Responsividade da interface

## 🛠️ Debug e Logs

### No Console do Navegador (F12)
```javascript
// Você verá logs como:
"Tracking: Iniciando sessão do minicurso"
"Tracking: Visualizando página X"
"Tracking: Áudio reproduzido - Módulo X"
"Tracking: Progresso atualizado"
```

### Verificar Dados no Supabase
As atividades são salvas na tabela `minicurso_activities`

## 🎯 Checklist de Testes

- [ ] Popup aparece após 3 segundos
- [ ] Formulário aceita dados
- [ ] Redirecionamento funciona
- [ ] Todos os 7 módulos carregam
- [ ] Áudios reproduzem corretamente
- [ ] Navegação funciona
- [ ] Progresso é salvo
- [ ] Interface responsiva
- [ ] Modo escuro funciona
- [ ] Tracking registra atividades

## 🐛 Problemas Comuns

### "Token inválido"
- O token expira ou é inválido
- Solução: Refazer o cadastro no lead capture

### Áudios não carregam
- Verificar se estão em: `/public/audio/minicurso/`
- Nomes: `modulo-1.mp3` até `modulo-7.mp3`

### Tracking não funciona
- Verificar console para erros
- Confirmar que está logado (para salvar progresso)

## 📱 Links Úteis

- **Home**: https://rioporto-site.vercel.app
- **Login**: https://rioporto-site.vercel.app/login
- **Dashboard**: https://rioporto-site.vercel.app/dashboard
- **Admin**: https://rioporto-site.vercel.app/admin

---

**Dica**: Para melhor experiência de teste, use uma janela anônima para simular um novo usuário!
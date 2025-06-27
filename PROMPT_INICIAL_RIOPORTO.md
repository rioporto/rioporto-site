# 🚀 PROMPT INICIAL - RIO PORTO P2P

## Para iniciar novo chat no Claude Desktop, use:

```
Olá! Estou continuando o projeto Rio Porto P2P - Chat #14.

CONTEXTO ATUAL:
- Projeto em: D:\Projetos\rioporto-site
- Sistema de comentários 100% completo ✅
- Minicurso 95% completo (falta gerar áudios)
- Sistema de email 90% (falta configurar serviço)
- Zendesk conta criada, pronto para integrar
- WhatsApp bloqueado pela Meta

TRABALHO PENDENTE:
1. Gerar 9 arquivos de áudio para o minicurso (voz masculina)
2. Configurar Zendesk (conta já existe)
3. Implementar tracking de progresso do minicurso
4. Configurar serviço de email (Resend)
5. Deploy das alterações

Por favor, leia o PROJETO_MASTER.md para contexto completo.
Uso Claude Desktop no Windows + CLAUDE CODE no terminal Ubuntu no Cursor quando necessário.

Como podemos continuar?
```

## 📋 Informações Essenciais

### Stack Tecnológica
- Next.js 14.2.30 (App Router)
- TypeScript 5.3.3
- Tailwind CSS + Shadcn/ui
- Supabase (PostgreSQL + Auth)
- Vercel (Deploy)
- Zendesk (Suporte - em implementação)

### URLs Importantes
- **Produção**: https://rioporto-site.vercel.app
- **GitHub**: https://github.com/rioporto/rioporto-site
- **Supabase**: projeto `ncxilaqbmlituutruqqs`

### Status Atual (Chat #13)
- ✅ Sistema P2P completo
- ✅ Blog com comentários e admin
- ✅ Lead capture funcional
- ✅ Minicurso online (falta áudio)
- ✅ Dashboard admin
- 🔄 Zendesk (0%)
- 🔄 Email (90%)
- 🔜 Sistema de Cursos
- 🔜 Sistema KYC

### Trabalho Realizado Hoje
1. **Player de Áudio**: Componente completo com todos controles
2. **Sistema de Email**: Templates e API prontos
3. **Componentes UI**: Sheet, Switch, Slider
4. **Scripts de Áudio**: Gerador automático criado

### Comandos Frequentes
```bash
# Desenvolvimento
npm run dev
npm run type-check
npm run build

# Gerar áudios (Windows)
cd scripts
setup-audio.bat

# Gerar áudios (Linux/Mac)
cd scripts
./setup-audio.sh

# Deploy
git add -A
git commit -m "feat: descrição"
git push origin main
```

### Contatos
- **Admin**: johnnyhelder@gmail.com
- **WhatsApp**: +55 21 2018-7776
- **Suporte**: Em breve via Zendesk

### Arquivos Principais
1. `PROJETO_MASTER.md` - Documentação principal (LER PRIMEIRO!)
2. `MINICURSO_STATUS.md` - Status detalhado do minicurso
3. `ZENDESK_INTEGRACAO.md` - Plano de integração
4. `EMAIL_CONFIGURATION_GUIDE.md` - Guia de email
5. `AUDIO_GENERATION_GUIDE.md` - Como gerar áudios
6. `/scripts/generate-audio.py` - Script de geração de áudios
7. `/app/minicurso/page.tsx` - Página do minicurso

### Próximos Passos Imediatos

#### 1. Gerar Áudios (30 min)
```bash
cd scripts
# Windows:
setup-audio.bat
# ou manualmente:
pip install edge-tts
python generate-audio.py
```

#### 2. Configurar Zendesk (1-2h)
- Widget no site
- Webhooks com Supabase
- Automações básicas
- Testes

#### 3. Tracking de Progresso (1h)
- Registrar tempo por página
- Taxa de conclusão
- Analytics detalhado

#### 4. Deploy (30 min)
- Testar localmente
- Commit e push
- Verificar em produção

## 💡 Dicas para o Claude

1. **SEMPRE leia** PROJETO_MASTER.md primeiro
2. **Use artifacts** para códigos grandes
3. **Minicurso**: Não é PDF, é online com áudio
4. **Suporte**: Zendesk substituirá WhatsApp
5. **Áudios**: Usar voz masculina pt-BR-Antonio
6. **Email**: Resend é o serviço recomendado
7. **Deploy**: Sempre testar antes de fazer push

## 🎯 Prioridades por Sprint

### Sprint Atual (Chat #13-14)
1. ✅ Player de áudio
2. ✅ Sistema de email
3. 🔄 Gerar áudios
4. 🔄 Zendesk básico
5. 🔄 Tracking minicurso

### Próximo Sprint
1. Newsletter double opt-in
2. Dashboard métricas
3. PWA support
4. Otimizações SEO

### Fase 3 (Cursos)
1. Upload de vídeos
2. Área do aluno
3. Certificados
4. Gamificação

### Fase 4 (KYC)
1. Upload documentos
2. Validação automática
3. Dashboard compliance
4. Integração bureaus

## 🚨 Lembretes Importantes

1. **WhatsApp**: Bloqueado pela Meta (falsa acusação ICO)
2. **Zendesk**: Conta já criada, pronta para integrar
3. **Áudios**: 9 arquivos MP3, voz masculina
4. **Email**: Falta apenas configurar Resend
5. **Deploy**: Vercel automático via GitHub

---

**Última atualização**: 29/01/2025 - Chat #13
# 📝 VARIÁVEIS DE AMBIENTE PARA PRODUÇÃO - VERCEL

## ⚠️ IMPORTANTE:
Configure estas variáveis no painel do Vercel em:
Settings → Environment Variables

## 🔧 VARIÁVEIS OBRIGATÓRIAS:

### Supabase (já configuradas no .env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://ncxilaqbmlituutruqqs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### App URL (OPCIONAL - não mais necessária após correção)
```
# Não é mais necessária após a correção do logout
# NEXT_PUBLIC_APP_URL=https://rioporto-site.vercel.app
```

### Email (Resend)
```
RESEND_API_KEY=re_XnMasRgC_CDDHtCo3anZHUuBnfkgbeZSA
RESEND_FROM_EMAIL=noreply@rioporto.com
```

### WhatsApp Business
```
WHATSAPP_BUSINESS_NUMBER=5521340003259
```

## 📌 NOTAS:
1. A variável `NEXT_PUBLIC_APP_URL` não é mais necessária após a correção do logout
2. As variáveis do Google Maps, Hotmart e Bitcoin podem ser adicionadas quando necessário
3. Sempre use o prefixo `NEXT_PUBLIC_` para variáveis que precisam ser acessíveis no cliente

## 🔒 SEGURANÇA:
- NUNCA commite o arquivo `.env.local` no Git
- Use variáveis diferentes para desenvolvimento e produção
- Mantenha as service keys seguras (não use NEXT_PUBLIC_ para elas)

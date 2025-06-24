# WHATSAPP BUSINESS API - VARIÁVEIS

# Adicione estas variáveis ao seu arquivo .env.local

# WhatsApp Business - Número oficial
WHATSAPP_BUSINESS_NUMBER="+5521340003259"

# WhatsApp Cloud API (Meta/Facebook)
WHATSAPP_ACCESS_TOKEN="seu_access_token_aqui"
WHATSAPP_PHONE_NUMBER_ID="seu_phone_number_id_aqui"
WHATSAPP_BUSINESS_ACCOUNT_ID="seu_business_account_id_aqui"

# Webhook Verify Token (pode ser qualquer string segura)
WHATSAPP_VERIFY_TOKEN="rioporto_verify_token_2025"

# URL do App (para webhooks)
NEXT_PUBLIC_APP_URL="https://rioporto-site.vercel.app"

# Exemplo de configuração no Meta Business:
# 1. Acesse: https://business.facebook.com/
# 2. Vá para WhatsApp > Configurações > API
# 3. Configure o webhook URL: https://rioporto-site.vercel.app/api/whatsapp/webhook
# 4. Use o verify token acima
# 5. Inscreva-se nos eventos: messages, message_status
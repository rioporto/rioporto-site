# Configuração WhatsApp Business API
# Para usar com a API oficial do WhatsApp (Cloud API)

# 1. Crie um app no Facebook Developers
# https://developers.facebook.com

# 2. Configure o WhatsApp Business API
# https://developers.facebook.com/docs/whatsapp/cloud-api/get-started

# 3. Obtenha as credenciais:
WHATSAPP_ACCESS_TOKEN=seu_token_permanente_aqui
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id_aqui
WHATSAPP_BUSINESS_ACCOUNT_ID=seu_business_account_id_aqui
WHATSAPP_VERIFY_TOKEN=rioporto_verify_token_2025
WHATSAPP_BUSINESS_NUMBER=+552120187776

# IMPORTANTE: 
# - Use um número de telefone dedicado para a API (não pode ser usado no app WhatsApp comum)
# - O token de acesso deve ser permanente (não o temporário)
# - Configure webhooks se quiser receber mensagens

# Para obter token permanente:
# 1. Vá para Facebook Developers > Seu App > WhatsApp > Configuração
# 2. Gere um token de acesso permanente
# 3. Configure o número de telefone do WhatsApp Business

# Documentação completa:
# https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages

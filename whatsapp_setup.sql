-- whatsapp_setup.sql
-- Tabelas para o sistema WhatsApp Business

-- Tabela de mensagens do WhatsApp
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_number VARCHAR(20) NOT NULL,
  to_number VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'text' CHECK (type IN ('text', 'image', 'audio', 'document')),
  direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  message_id VARCHAR(255),
  user_id UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de cotações enviadas
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number VARCHAR(20) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('buy', 'sell')),
  crypto VARCHAR(10) NOT NULL DEFAULT 'BTC',
  amount DECIMAL(20, 8) NOT NULL,
  brl_value DECIMAL(20, 2) NOT NULL,
  fee DECIMAL(20, 2) NOT NULL,
  total DECIMAL(20, 2) NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'confirmed', 'expired', 'cancelled')),
  user_id UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de conversas (sessões)
CREATE TABLE IF NOT EXISTS public.whatsapp_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  last_message_at TIMESTAMPTZ,
  last_message TEXT,
  context JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'waiting', 'closed')),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_whatsapp_messages_from ON public.whatsapp_messages(from_number);
CREATE INDEX idx_whatsapp_messages_to ON public.whatsapp_messages(to_number);
CREATE INDEX idx_whatsapp_messages_created ON public.whatsapp_messages(created_at DESC);
CREATE INDEX idx_quotations_phone ON public.quotations(phone_number);
CREATE INDEX idx_quotations_status ON public.quotations(status);
CREATE INDEX idx_quotations_created ON public.quotations(created_at DESC);
CREATE INDEX idx_conversations_phone ON public.whatsapp_conversations(phone_number);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_whatsapp_messages_updated_at
  BEFORE UPDATE ON public.whatsapp_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_quotations_updated_at
  BEFORE UPDATE ON public.quotations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.whatsapp_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS (Row Level Security)
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;

-- Policies para admin ver tudo
CREATE POLICY "Admins podem ver todas as mensagens" 
  ON public.whatsapp_messages FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins podem gerenciar cotações" 
  ON public.quotations FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins podem gerenciar conversas" 
  ON public.whatsapp_conversations FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

-- Policies para usuários verem suas próprias cotações
CREATE POLICY "Usuários podem ver suas cotações" 
  ON public.quotations FOR SELECT 
  USING (
    auth.uid() = user_id
  );

-- Função para expirar cotações antigas
CREATE OR REPLACE FUNCTION public.expire_old_quotations()
RETURNS void AS $$
BEGIN
  UPDATE public.quotations
  SET status = 'expired'
  WHERE status = 'pending'
    AND valid_until < NOW();
END;
$$ LANGUAGE plpgsql;

-- Comentários nas tabelas
COMMENT ON TABLE public.whatsapp_messages IS 'Histórico de mensagens do WhatsApp';
COMMENT ON TABLE public.quotations IS 'Cotações enviadas via WhatsApp';
COMMENT ON TABLE public.whatsapp_conversations IS 'Conversas/sessões do WhatsApp';
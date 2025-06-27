-- ========================================
-- SISTEMA DE LEAD CAPTURE - RIO PORTO P2P
-- ========================================
-- Execute este SQL no Supabase

-- 1. Tabela de Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Dados pessoais
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  whatsapp VARCHAR(20) NOT NULL,
  
  -- Segmentação
  experience_level VARCHAR(50) CHECK (experience_level IN ('iniciante', 'intermediario', 'avancado')),
  interest VARCHAR(50) CHECK (interest IN ('comprar', 'vender', 'ambos')),
  
  -- Origem
  lead_source VARCHAR(100) NOT NULL DEFAULT 'ebook',
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  referrer_url TEXT,
  landing_page TEXT,
  
  -- Controle
  email_verified BOOLEAN DEFAULT FALSE,
  whatsapp_verified BOOLEAN DEFAULT FALSE,
  lead_score INT DEFAULT 10,
  
  -- Engagement
  ebook_downloaded BOOLEAN DEFAULT FALSE,
  ebook_downloaded_at TIMESTAMPTZ,
  last_interaction_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de eventos de tracking
CREATE TABLE IF NOT EXISTS lead_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  session_id VARCHAR(100),
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de configurações do popup
CREATE TABLE IF NOT EXISTS popup_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  
  -- Triggers
  show_after_seconds INT DEFAULT 30,
  show_after_scroll_percent INT DEFAULT 50,
  show_after_pages INT DEFAULT 2,
  show_on_exit_intent BOOLEAN DEFAULT TRUE,
  
  -- Frequência
  hide_for_days INT DEFAULT 7, -- Não mostrar novamente por X dias
  max_shows_per_session INT DEFAULT 1,
  
  -- Conteúdo
  title TEXT NOT NULL,
  subtitle TEXT,
  ebook_title VARCHAR(255) NOT NULL,
  ebook_url TEXT NOT NULL,
  ebook_cover_url TEXT,
  benefits JSONB, -- Array de benefícios
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Índices para performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_whatsapp ON leads(whatsapp);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_lead_events_lead_id ON lead_events(lead_id);
CREATE INDEX idx_lead_events_session_id ON lead_events(session_id);
CREATE INDEX idx_lead_events_created_at ON lead_events(created_at DESC);

-- 5. RLS Policies
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE popup_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para leads
CREATE POLICY "Admins podem ver todos os leads" ON leads
FOR SELECT USING (
  auth.uid() IN (
    SELECT id FROM auth.users WHERE email IN ('johnnyhelder@gmail.com', 'admin@rioporto.com')
  )
);

CREATE POLICY "Público pode inserir leads" ON leads
FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários podem ver próprios dados" ON leads
FOR SELECT USING (
  auth.uid() IN (
    SELECT id FROM auth.users WHERE email = leads.email
  )
);

-- Políticas para eventos
CREATE POLICY "Público pode inserir eventos" ON lead_events
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins podem ver eventos" ON lead_events
FOR SELECT USING (
  auth.uid() IN (
    SELECT id FROM auth.users WHERE email IN ('johnnyhelder@gmail.com', 'admin@rioporto.com')
  )
);

-- Políticas para configurações
CREATE POLICY "Público pode ler configurações ativas" ON popup_settings
FOR SELECT USING (active = true);

CREATE POLICY "Admins podem gerenciar configurações" ON popup_settings
FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM auth.users WHERE email IN ('johnnyhelder@gmail.com', 'admin@rioporto.com')
  )
);

-- 6. Inserir configuração padrão do popup
INSERT INTO popup_settings (
  name,
  title,
  subtitle,
  ebook_title,
  ebook_url,
  ebook_cover_url,
  benefits
) VALUES (
  'ebook_bitcoin_2025',
  '📘 E-book Grátis: Guia Definitivo do Bitcoin',
  'Descubra os segredos dos maiores investidores de Bitcoin do Brasil',
  'Guia Definitivo: Como Comprar Bitcoin com Segurança em 2025',
  '/ebooks/guia-bitcoin-2025.pdf',
  '/images/ebook-cover.jpg',
  '["✓ 50 páginas de conteúdo exclusivo", "✓ Estratégias dos profissionais", "✓ Checklist de segurança", "✓ Bônus: Planilha de controle"]'::jsonb
);

-- 7. Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_popup_settings_updated_at BEFORE UPDATE ON popup_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. View para dashboard
CREATE OR REPLACE VIEW lead_stats AS
SELECT 
  COUNT(*) as total_leads,
  COUNT(DISTINCT DATE(created_at)) as days_active,
  COUNT(CASE WHEN email_verified THEN 1 END) as verified_emails,
  COUNT(CASE WHEN whatsapp IS NOT NULL THEN 1 END) as with_whatsapp,
  COUNT(CASE WHEN ebook_downloaded THEN 1 END) as downloads,
  AVG(lead_score) as avg_lead_score,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as leads_today,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as leads_week
FROM leads;

-- Grant acesso à view
GRANT SELECT ON lead_stats TO authenticated;

SELECT 'Sistema de Lead Capture criado com sucesso!' as status;
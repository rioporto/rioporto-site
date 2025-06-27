-- Adicionar campos para integração do minicurso na tabela de leads
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS access_token UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS access_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS downloaded_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;

-- Criar índice para busca rápida por token
CREATE INDEX IF NOT EXISTS idx_leads_access_token ON leads(access_token);

-- Criar função para gerar link de acesso único
CREATE OR REPLACE FUNCTION generate_access_link(lead_id UUID)
RETURNS TEXT AS $$
DECLARE
  token UUID;
  base_url TEXT := 'https://rioporto.com/minicurso';
BEGIN
  -- Buscar ou gerar novo token
  SELECT access_token INTO token FROM leads WHERE id = lead_id;
  
  -- Renovar token se necessário
  UPDATE leads 
  SET 
    access_token = COALESCE(access_token, gen_random_uuid()),
    token_expires_at = NOW() + INTERVAL '30 days'
  WHERE id = lead_id
  RETURNING access_token INTO token;
  
  RETURN base_url || '?token=' || token::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Criar tabela para rastreamento de atividades do minicurso
CREATE TABLE IF NOT EXISTS minicurso_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- 'page_view', 'download', 'completion'
  page_id VARCHAR(50), -- ID da página visualizada
  duration_seconds INTEGER, -- Tempo gasto na página
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_minicurso_activities_lead_id ON minicurso_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_minicurso_activities_created_at ON minicurso_activities(created_at);

-- RLS para as tabelas
ALTER TABLE minicurso_activities ENABLE ROW LEVEL SECURITY;

-- Política para permitir que o sistema registre atividades
CREATE POLICY "Sistema pode inserir atividades" ON minicurso_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para admin visualizar todas as atividades
CREATE POLICY "Admin pode ver todas as atividades" ON minicurso_activities
  FOR SELECT
  TO authenticated
  USING (
    auth.email() IN ('johnnyhelder@gmail.com', 'admin@rioporto.com')
  );

-- Comentários explicativos
COMMENT ON COLUMN leads.access_token IS 'Token único para acesso ao minicurso';
COMMENT ON COLUMN leads.token_expires_at IS 'Data de expiração do token de acesso';
COMMENT ON COLUMN leads.last_accessed_at IS 'Última vez que o lead acessou o minicurso';
COMMENT ON COLUMN leads.access_count IS 'Número de vezes que o lead acessou o minicurso';
COMMENT ON COLUMN leads.downloaded_at IS 'Data do primeiro download do PDF';
COMMENT ON COLUMN leads.download_count IS 'Número de vezes que o PDF foi baixado';
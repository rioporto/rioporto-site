-- Criar tabela de leads primeiro
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    whatsapp TEXT,
    lead_source TEXT,
    access_token TEXT UNIQUE,
    token_expires_at TIMESTAMPTZ,
    minicurso_access_count INTEGER DEFAULT 0,
    course_progress INTEGER DEFAULT 0,
    last_page_viewed TEXT,
    course_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_access_token ON leads(access_token);
CREATE INDEX idx_leads_created_at ON leads(created_at);

-- Tabela para eventos dos leads
CREATE TABLE IF NOT EXISTS lead_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_lead_events_lead_id ON lead_events(lead_id);
CREATE INDEX idx_lead_events_event_type ON lead_events(event_type);
CREATE INDEX idx_lead_events_created_at ON lead_events(created_at);

-- Tabela para rastrear atividades do minicurso
CREATE TABLE IF NOT EXISTS minicurso_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('page_view', 'audio_play', 'audio_complete', 'course_complete')),
    page_id TEXT,
    duration_seconds INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_minicurso_activities_lead_id ON minicurso_activities(lead_id);
CREATE INDEX idx_minicurso_activities_type ON minicurso_activities(activity_type);
CREATE INDEX idx_minicurso_activities_created_at ON minicurso_activities(created_at);

-- Tabela para armazenar tickets do Zendesk
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    zendesk_id BIGINT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT NOT NULL,
    subject TEXT,
    status TEXT,
    priority TEXT,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    solved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_user_email ON support_tickets(user_email);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_created_at ON support_tickets(created_at);

-- RLS Policies
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE minicurso_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Política para leads (público pode inserir para se cadastrar)
CREATE POLICY "Anyone can create leads" ON leads
    FOR INSERT WITH CHECK (true);

-- Política para leads verem seus próprios dados
CREATE POLICY "Leads can view own data" ON leads
    FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Política para admin ver todos os leads
CREATE POLICY "Admins can view all leads" ON leads
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE email IN ('johnnyhelder@gmail.com', 'admin@rioporto.com')
        )
    );

-- Política para lead_events
CREATE POLICY "Anyone can create lead events" ON lead_events
    FOR INSERT WITH CHECK (true);

-- Política para minicurso_activities (apenas a própria lead pode ver suas atividades)
CREATE POLICY "Leads can view their own activities" ON minicurso_activities
    FOR SELECT USING (lead_id IN (
        SELECT id FROM leads WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    ));

-- Política para support_tickets (usuários podem ver seus próprios tickets)
CREATE POLICY "Users can view their own tickets" ON support_tickets
    FOR SELECT USING (
        user_id = auth.uid() OR 
        user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON leads 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at 
    BEFORE UPDATE ON support_tickets 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

-- View para estatísticas de leads (opcional)
CREATE OR REPLACE VIEW lead_stats AS
SELECT 
    COUNT(*) as total_leads,
    COUNT(DISTINCT DATE(created_at)) as days_active,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as verified_emails,
    COUNT(CASE WHEN whatsapp IS NOT NULL THEN 1 END) as with_whatsapp,
    COUNT(CASE WHEN minicurso_access_count > 0 THEN 1 END) as accessed_minicurso,
    AVG(course_progress) as avg_course_progress,
    COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as leads_today,
    COUNT(CASE WHEN DATE(created_at) >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as leads_week
FROM leads;
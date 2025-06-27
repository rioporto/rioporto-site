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

-- Adicionar colunas de progresso na tabela leads
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS course_progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_page_viewed TEXT,
ADD COLUMN IF NOT EXISTS course_completed_at TIMESTAMPTZ;

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
ALTER TABLE minicurso_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Política para minicurso_activities (apenas a própria lead pode ver suas atividades)
CREATE POLICY "Leads can view their own activities" ON minicurso_activities
    FOR SELECT USING (lead_id IN (
        SELECT id FROM leads WHERE auth.uid() = id
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

CREATE TRIGGER update_support_tickets_updated_at 
    BEFORE UPDATE ON support_tickets 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();
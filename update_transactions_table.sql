-- Atualização da tabela transactions para incluir dados do cliente
-- Execute este script no Supabase SQL Editor

-- Adicionar colunas para dados do cliente (caso não sejam usuários cadastrados)
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_transactions_customer_email ON transactions(customer_email);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Criar tabela de notificações para tracking
CREATE TABLE IF NOT EXISTS quotation_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id),
  notification_type TEXT NOT NULL, -- 'whatsapp', 'email', 'sms'
  status TEXT NOT NULL, -- 'sent', 'failed', 'pending'
  recipient TEXT NOT NULL,
  message TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para notificações
CREATE INDEX IF NOT EXISTS idx_notifications_transaction_id ON quotation_notifications(transaction_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON quotation_notifications(status);

-- RLS para notificações (apenas admin pode ver)
ALTER TABLE quotation_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin pode ver todas notificações" ON quotation_notifications
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Comentários nas colunas para documentação
COMMENT ON COLUMN transactions.customer_name IS 'Nome do cliente para cotações sem cadastro';
COMMENT ON COLUMN transactions.customer_email IS 'Email do cliente para cotações sem cadastro';
COMMENT ON COLUMN transactions.customer_phone IS 'WhatsApp do cliente para cotações sem cadastro';
COMMENT ON TABLE quotation_notifications IS 'Registro de notificações enviadas para cotações';
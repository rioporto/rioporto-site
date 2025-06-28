-- supabase/migrations/create_quotations_table_safe.sql
-- Migração segura que verifica se a tabela já existe

-- Criar tabela de cotações (apenas se não existir)
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Tipo de operação
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('compra', 'venda')),
  
  -- Informações da moeda
  moeda VARCHAR(10) NOT NULL,
  crypto_name VARCHAR(100) NOT NULL,
  
  -- Valores
  valor_brl DECIMAL(15, 2) NOT NULL,
  valor_crypto DECIMAL(20, 8) NOT NULL,
  price_at_time DECIMAL(15, 2) NOT NULL, -- Preço no momento da cotação
  
  -- Dados do cliente
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  wallet VARCHAR(200),
  observacoes TEXT,
  
  -- Status e tracking
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
  contacted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar índices apenas se não existirem
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_quotations_user_id') THEN
    CREATE INDEX idx_quotations_user_id ON public.quotations(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_quotations_status') THEN
    CREATE INDEX idx_quotations_status ON public.quotations(status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_quotations_created_at') THEN
    CREATE INDEX idx_quotations_created_at ON public.quotations(created_at DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_quotations_email') THEN
    CREATE INDEX idx_quotations_email ON public.quotations(email);
  END IF;
END $$;

-- RLS (Row Level Security) - apenas se não estiver ativado
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'quotations' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Políticas RLS (criar apenas se não existirem)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quotations' 
    AND policyname = 'Users can view own quotations'
  ) THEN
    CREATE POLICY "Users can view own quotations" ON public.quotations
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quotations' 
    AND policyname = 'Users can create quotations'
  ) THEN
    CREATE POLICY "Users can create quotations" ON public.quotations
      FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quotations' 
    AND policyname = 'Admin can view all quotations'
  ) THEN
    CREATE POLICY "Admin can view all quotations" ON public.quotations
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Função para atualizar updated_at (criar apenas se não existir)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger (criar apenas se não existir)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_quotations_updated_at'
  ) THEN
    CREATE TRIGGER update_quotations_updated_at 
      BEFORE UPDATE ON public.quotations 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Comentários na tabela
COMMENT ON TABLE public.quotations IS 'Tabela de cotações solicitadas pelos clientes';
COMMENT ON COLUMN public.quotations.tipo IS 'Tipo da operação: compra ou venda';
COMMENT ON COLUMN public.quotations.status IS 'Status da cotação: pending, contacted, completed, cancelled';
COMMENT ON COLUMN public.quotations.price_at_time IS 'Preço da criptomoeda no momento da solicitação';

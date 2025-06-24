-- ========================================
-- SCRIPT COMPLETO DE CONFIGURAÇÃO SUPABASE
-- RIO PORTO P2P
-- ========================================

-- 1. CRIAR ENUMS
-- ========================================

-- Enum para status KYC
CREATE TYPE kyc_status AS ENUM ('pending', 'approved', 'rejected');

-- Enum para níveis de usuário
CREATE TYPE user_level AS ENUM ('1', '2', '3');

-- Enum para tipo de transação
CREATE TYPE transaction_type AS ENUM ('buy', 'sell');

-- Enum para status da transação
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'cancelled');

-- Enum para tipo de documento
CREATE TYPE document_type AS ENUM ('rg', 'cnh', 'passport', 'proof_of_residence', 'selfie');

-- 2. CRIAR TABELAS
-- ========================================

-- Tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  level user_level DEFAULT '1',
  kyc_status kyc_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de transações
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type transaction_type NOT NULL,
  crypto_currency TEXT NOT NULL,
  crypto_amount DECIMAL(20, 8) NOT NULL,
  brl_amount DECIMAL(15, 2) NOT NULL,
  exchange_rate DECIMAL(15, 2) NOT NULL,
  commission_rate DECIMAL(5, 4) NOT NULL,
  commission_amount DECIMAL(15, 2) NOT NULL,
  wallet_address TEXT,
  status transaction_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de documentos KYC
CREATE TABLE kyc_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  document_type document_type NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CRIAR FUNÇÕES
-- ========================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Função para criar perfil automaticamente quando usuário se cadastra
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. CRIAR TRIGGERS
-- ========================================

-- Trigger para atualizar updated_at na tabela profiles
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar updated_at na tabela transactions
CREATE TRIGGER update_transactions_updated_at 
  BEFORE UPDATE ON transactions
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para criar perfil quando novo usuário se cadastra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION handle_new_user();

-- 5. CRIAR ÍNDICES PARA PERFORMANCE
-- ========================================

CREATE INDEX transactions_user_id_idx ON transactions(user_id);
CREATE INDEX transactions_status_idx ON transactions(status);
CREATE INDEX transactions_created_at_idx ON transactions(created_at DESC);
CREATE INDEX kyc_documents_user_id_idx ON kyc_documents(user_id);

-- 6. HABILITAR ROW LEVEL SECURITY (RLS)
-- ========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

-- 7. CRIAR POLÍTICAS DE SEGURANÇA
-- ========================================

-- Políticas para profiles
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert for authentication" 
  ON profiles FOR INSERT 
  WITH CHECK (true);

-- Políticas para transactions
CREATE POLICY "Users can view own transactions" 
  ON transactions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions" 
  ON transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Políticas para kyc_documents
CREATE POLICY "Users can view own documents" 
  ON kyc_documents FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload own documents" 
  ON kyc_documents FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 8. CRIAR STORAGE BUCKETS (executar no dashboard)
-- ========================================
-- Nota: Storage buckets devem ser criados via dashboard do Supabase
-- 1. Vá em Storage
-- 2. Crie um bucket chamado 'kyc-documents'
-- 3. Configure as políticas de acesso

-- 9. INSERIR DADOS DE TESTE (OPCIONAL)
-- ========================================

-- Criar usuário admin de teste (ajuste o ID conforme necessário)
-- INSERT INTO profiles (id, email, name, level, kyc_status) 
-- VALUES (
--   'seu-user-id-aqui', 
--   'admin@rioporto.com', 
--   'Admin Rio Porto',
--   '3',
--   'approved'
-- );

-- 10. VIEWS ÚTEIS (OPCIONAL)
-- ========================================

-- View para dashboard de transações
CREATE OR REPLACE VIEW transaction_summary AS
SELECT 
  t.*,
  p.name as user_name,
  p.email as user_email,
  p.level as user_level
FROM transactions t
JOIN profiles p ON t.user_id = p.id;

-- Grant acesso à view
GRANT SELECT ON transaction_summary TO authenticated;

-- ========================================
-- FIM DO SCRIPT
-- ========================================

-- Para verificar se tudo foi criado corretamente:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT * FROM pg_policies WHERE tablename IN ('profiles', 'transactions', 'kyc_documents');
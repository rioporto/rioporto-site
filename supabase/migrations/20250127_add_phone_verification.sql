-- Tabela para armazenar códigos OTP
CREATE TABLE IF NOT EXISTS phone_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone TEXT NOT NULL,
    code TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    verified BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    attempts INTEGER DEFAULT 0
);

-- Índices para performance
CREATE INDEX idx_phone_verifications_phone ON phone_verifications(phone);
CREATE INDEX idx_phone_verifications_user_id ON phone_verifications(user_id);
CREATE INDEX idx_phone_verifications_expires_at ON phone_verifications(expires_at);

-- Adicionar coluna de verificação no perfil
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMPTZ;

-- Função para limpar OTPs expirados
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
    DELETE FROM phone_verifications
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE phone_verifications ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem seus próprios OTPs
CREATE POLICY "Users can view own OTPs" ON phone_verifications
    FOR SELECT USING (user_id = auth.uid());

-- Política para service role inserir OTPs
CREATE POLICY "Service role can manage OTPs" ON phone_verifications
    FOR ALL USING (auth.role() = 'service_role');

-- Função RPC para incrementar tentativas de OTP
CREATE OR REPLACE FUNCTION increment_otp_attempts(phone_param TEXT)
RETURNS void AS $
BEGIN
  UPDATE phone_verifications
  SET attempts = attempts + 1
  WHERE phone = phone_param
    AND verified = false
    AND expires_at > NOW()
  ORDER BY created_at DESC
  LIMIT 1;
END;
$ LANGUAGE plpgsql;
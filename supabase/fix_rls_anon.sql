-- supabase/fix_rls_anon.sql
-- Corrigir RLS para permitir usuários anônimos

-- 1. Verificar o papel anônimo do Supabase
SELECT current_setting('request.jwt.claims', true)::json->>'role' as current_role;

-- 2. Remover todas as políticas existentes
DROP POLICY IF EXISTS "Anyone can create quotations" ON quotations;
DROP POLICY IF EXISTS "Users can create quotations" ON quotations;
DROP POLICY IF EXISTS "Users can update own quotations" ON quotations;
DROP POLICY IF EXISTS "Users can view own quotations" ON quotations;
DROP POLICY IF EXISTS "Usuarios podem ver suas cotacoes" ON quotations;
DROP POLICY IF EXISTS "Admins podem gerenciar cotações" ON quotations;

-- 3. Criar política específica para INSERT que inclui role anon
CREATE POLICY "Public can create quotations" ON quotations
    FOR INSERT 
    TO public
    WITH CHECK (true);

-- 4. Criar política para usuários verem suas próprias cotações
CREATE POLICY "Users can view own quotations" ON quotations
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- 5. Criar política para anônimos verem cotações sem user_id
CREATE POLICY "Anon can view own quotations" ON quotations
    FOR SELECT
    TO anon
    USING (user_id IS NULL);

-- 6. Garantir que RLS está habilitado
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- 7. Verificar políticas criadas
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'quotations'
ORDER BY policyname;

-- 8. Testar inserção como anônimo
-- INSERT INTO quotations (type, crypto, amount, brl_value, fee, total, phone_number, valid_until, status, nome, email)
-- VALUES ('buy', 'BTC', 0.001, 250.00, 6.25, 256.25, '+5511999999999', now() + interval '1 day', 'pending', 'Teste Anon', 'teste@example.com');

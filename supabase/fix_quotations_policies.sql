-- supabase/fix_quotations_policies.sql
-- Corrigir políticas RLS para permitir criação de cotações

-- 1. Remover política existente que pode estar bloqueando
DROP POLICY IF EXISTS "Users can create quotations" ON quotations;
DROP POLICY IF EXISTS "Anyone can create quotations" ON quotations;

-- 2. Criar nova política que permite QUALQUER pessoa criar cotação
CREATE POLICY "Anyone can create quotations" ON quotations
    FOR INSERT 
    WITH CHECK (true);

-- 3. Verificar se RLS está habilitado
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- 4. Listar todas as políticas para confirmar
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'quotations'
ORDER BY policyname;

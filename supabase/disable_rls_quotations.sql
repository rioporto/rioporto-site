-- supabase/disable_rls_quotations.sql
-- Desabilitar RLS temporariamente para testes

-- ATENÇÃO: Isso remove toda segurança da tabela!
-- Use apenas para teste e reative depois

-- Desabilitar RLS
ALTER TABLE quotations DISABLE ROW LEVEL SECURITY;

-- Verificar status
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'quotations';

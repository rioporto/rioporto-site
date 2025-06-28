-- supabase/check_constraints.sql
-- Verificar as constraints da tabela quotations

-- 1. Ver estrutura da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'quotations'
ORDER BY ordinal_position;

-- 2. Ver as constraints
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'quotations'::regclass;

-- 3. Ver as políticas RLS
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'quotations';

-- 4. Verificar valores únicos no campo type
SELECT DISTINCT type, COUNT(*) 
FROM quotations 
GROUP BY type;

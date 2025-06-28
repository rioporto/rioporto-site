-- supabase/migrations/check_quotations_structure.sql
-- Script para verificar e corrigir a estrutura da tabela quotations

-- 1. Primeiro, vamos ver a estrutura atual da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'quotations'
ORDER BY ordinal_position;

-- 2. Verificar quais índices já existem
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'quotations';

-- 3. Adicionar colunas que estão faltando (se necessário)
DO $$ 
BEGIN
    -- Adicionar coluna email se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quotations' AND column_name = 'email') THEN
        ALTER TABLE public.quotations ADD COLUMN email VARCHAR(255) NOT NULL DEFAULT 'temp@email.com';
        -- Remover o default após adicionar
        ALTER TABLE public.quotations ALTER COLUMN email DROP DEFAULT;
    END IF;
    
    -- Adicionar coluna nome se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quotations' AND column_name = 'nome') THEN
        ALTER TABLE public.quotations ADD COLUMN nome VARCHAR(100) NOT NULL DEFAULT 'Temp Name';
        ALTER TABLE public.quotations ALTER COLUMN nome DROP DEFAULT;
    END IF;
    
    -- Adicionar coluna telefone se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quotations' AND column_name = 'telefone') THEN
        ALTER TABLE public.quotations ADD COLUMN telefone VARCHAR(20);
    END IF;
    
    -- Adicionar coluna wallet se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quotations' AND column_name = 'wallet') THEN
        ALTER TABLE public.quotations ADD COLUMN wallet VARCHAR(200);
    END IF;
    
    -- Adicionar coluna observacoes se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quotations' AND column_name = 'observacoes') THEN
        ALTER TABLE public.quotations ADD COLUMN observacoes TEXT;
    END IF;
    
    -- Adicionar coluna status se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quotations' AND column_name = 'status') THEN
        ALTER TABLE public.quotations ADD COLUMN status VARCHAR(20) DEFAULT 'pending';
        -- Adicionar constraint
        ALTER TABLE public.quotations ADD CONSTRAINT check_status 
            CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled'));
    END IF;
    
    -- Adicionar colunas de tracking se não existirem
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quotations' AND column_name = 'contacted_at') THEN
        ALTER TABLE public.quotations ADD COLUMN contacted_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quotations' AND column_name = 'completed_at') THEN
        ALTER TABLE public.quotations ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- 4. Agora criar os índices que faltam
DO $$ 
BEGIN
    -- Índice para email
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_quotations_email') THEN
        CREATE INDEX idx_quotations_email ON public.quotations(email);
    END IF;
    
    -- Índice para status
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_quotations_status') THEN
        CREATE INDEX idx_quotations_status ON public.quotations(status);
    END IF;
    
    -- Índice para created_at
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_quotations_created_at') THEN
        CREATE INDEX idx_quotations_created_at ON public.quotations(created_at DESC);
    END IF;
    
    -- Índice para user_id
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_quotations_user_id') THEN
        CREATE INDEX idx_quotations_user_id ON public.quotations(user_id);
    END IF;
END $$;

-- 5. Verificar estrutura final
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'quotations'
ORDER BY ordinal_position;

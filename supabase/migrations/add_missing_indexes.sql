-- supabase/migrations/add_missing_indexes.sql
-- Adicionar índices que ainda podem estar faltando

-- Criar índices apenas se não existirem
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
    
    -- Índice para type (tipo de operação)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_quotations_type') THEN
        CREATE INDEX idx_quotations_type ON public.quotations(type);
    END IF;
    
    -- Índice para phone_number
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_quotations_phone') THEN
        CREATE INDEX idx_quotations_phone ON public.quotations(phone_number);
    END IF;
END $$;

-- Habilitar RLS se ainda não estiver
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS se não existirem
DO $$ 
BEGIN
    -- Política para usuários verem suas próprias cotações
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quotations' 
        AND policyname = 'Users can view own quotations'
    ) THEN
        CREATE POLICY "Users can view own quotations" ON public.quotations
            FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    -- Política para criar cotações
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quotations' 
        AND policyname = 'Users can create quotations'
    ) THEN
        CREATE POLICY "Users can create quotations" ON public.quotations
            FOR INSERT WITH CHECK (true);
    END IF;
    
    -- Política para admin
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quotations' 
        AND policyname = 'Admin can manage all quotations'
    ) THEN
        CREATE POLICY "Admin can manage all quotations" ON public.quotations
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                )
            );
    END IF;
END $$;

-- Verificar índices criados
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'quotations'
ORDER BY indexname;

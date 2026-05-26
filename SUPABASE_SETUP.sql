-- ==========================================
-- 1. CRIANDO A TABELA DE CATEGORIAS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  section TEXT NOT NULL DEFAULT 'adult',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitando RLS e permissões de API na tabela de categorias
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.categories TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Permitir tudo para categorias públicas" ON public.categories;
CREATE POLICY "Permitir tudo para categorias públicas" ON public.categories
FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);


-- ==========================================
-- 2. CRIANDO A TABELA DE PRATOS (DISHES)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.dishes (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0.00,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  section TEXT NOT NULL DEFAULT 'adult',
  sort_order INTEGER DEFAULT 0,
  is_customizable BOOLEAN DEFAULT false,
  customization_options JSONB DEFAULT '[]'::jsonb,
  sub_section TEXT,
  size_or_weight TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitando RLS e permissões de API na tabela de pratos
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.dishes TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Permitir tudo para pratos públicos" ON public.dishes;
CREATE POLICY "Permitir tudo para pratos públicos" ON public.dishes
FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);


-- ==========================================
-- 3. CRIANDO A TABELA DE CONFIGURAÇÕES (SETTINGS)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitando RLS e permissões de API na tabela de configurações
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.settings TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Permitir tudo para configurações públicas" ON public.settings;
CREATE POLICY "Permitir tudo para configurações públicas" ON public.settings
FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);


-- ==========================================
-- 4. CRIANDO A TABELA DE PEDIDOS (ORDERS) - Essencial para o histórico
-- ==========================================
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  table_number TEXT,
  items JSONB,
  total NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitando RLS e permissões de API na tabela de pedidos
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.orders TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Permitir tudo para pedidos públicos" ON public.orders;
CREATE POLICY "Permitir tudo para pedidos públicos" ON public.orders
FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
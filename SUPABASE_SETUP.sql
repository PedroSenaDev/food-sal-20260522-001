-- Security Policy Fixes for FoodSal Database Tables
-- Run this SQL batch inside your Supabase Project -> SQL Editor to apply security updates.

-- 1. Enable Row Level Security (RLS) on all core tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing dangerous/unrestricted wildcard policies
DROP POLICY IF EXISTS "Permitir tudo para pratos públicos" ON public.dishes;
DROP POLICY IF EXISTS "Permitir tudo para categorias públicas" ON public.categories;
DROP POLICY IF EXISTS "Permitir tudo para configurações públicas" ON public.settings;
DROP POLICY IF EXISTS "Permitir tudo para pedidos públicos" ON public.orders;

-- 3. CATEGORIES Policies (Public can read-only, Admin can write/all)
CREATE POLICY "Public read-only categories" ON public.categories 
  FOR SELECT USING (true);
CREATE POLICY "Admin full-write categories" ON public.categories 
  FOR ALL TO authenticated USING (true);

-- 4. DISHES Policies (Public can read-only, Admin can write/all)
CREATE POLICY "Public read-only dishes" ON public.dishes 
  FOR SELECT USING (true);
CREATE POLICY "Admin full-write dishes" ON public.dishes 
  FOR ALL TO authenticated USING (true);

-- 5. SETTINGS Policies (Public can read-only, Admin can write/all)
CREATE POLICY "Public read-only settings" ON public.settings 
  FOR SELECT USING (true);
CREATE POLICY "Admin full-write settings" ON public.settings 
  FOR ALL TO authenticated USING (true);

-- 6. ORDERS Policies (Public can INSERT only to protect customer PII, Admin can read/manage all)
CREATE POLICY "Public can submit orders" ON public.orders 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view/manage orders" ON public.orders 
  FOR ALL TO authenticated USING (true);

-- 7. Grant proper Data API privileges to Database Roles (security layer on top of RLS)
GRANT SELECT ON TABLE public.categories TO anon, authenticated;
GRANT ALL ON TABLE public.categories TO service_role;
GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.categories TO authenticated;

GRANT SELECT ON TABLE public.dishes TO anon, authenticated;
GRANT ALL ON TABLE public.dishes TO service_role;
GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.dishes TO authenticated;

GRANT SELECT ON TABLE public.settings TO anon, authenticated;
GRANT ALL ON TABLE public.settings TO service_role;
GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE public.settings TO authenticated;

GRANT INSERT ON TABLE public.orders TO anon, authenticated;
GRANT ALL ON TABLE public.orders TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.orders TO authenticated;
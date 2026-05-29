-- ==========================================
-- FOODSAL - SCRIPT DE SETUP DE SEGURANÇA SQL
-- ==========================================

-- 1. EXTENSÃO DE CRIPTOGRAFIA
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. CRIAÇÃO DO USUÁRIO ADMINISTRADOR NA TABELA AUTH (SE NÃO EXISTIR)
-- E-mail: admin@foodsal.com.br
-- Senha: Foodsal0905@
INSERT INTO auth.users (
  instance_id,
  id,
  provider,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  confirmed_at,
  email_change,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at,
  role
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'd0000000-0000-0000-0000-000000000001',
  'email',
  'admin@foodsal.com.br',
  crypt('Foodsal0905@', gen_salt('bf')),
  now(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  NULL,
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin FoodSal"}',
  false,
  now(),
  now(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  now(),
  '',
  '',
  0,
  NULL,
  '',
  NULL,
  false,
  NULL,
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

-- Cria a identidade correspondente para permitir login via e-mail e senha
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at,
  provider_id
)
VALUES (
  'd0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  jsonb_build_object('sub', 'd0000000-0000-0000-0000-000000000001', 'email', 'admin@foodsal.com.br'),
  'email',
  now(),
  now(),
  now(),
  'admin@foodsal.com.br'
)
ON CONFLICT (id, provider) DO NOTHING;


-- 3. PERMISSÕES E PRIVILÉGIOS (GRANTS)
-- Concede acesso total às tabelas para a role de serviço e admins autenticados
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.categories TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.categories TO authenticated;
GRANT SELECT ON TABLE public.categories TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.dishes TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.dishes TO authenticated;
GRANT SELECT ON TABLE public.dishes TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.settings TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.settings TO authenticated;
GRANT SELECT ON TABLE public.settings TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.orders TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.orders TO authenticated;
GRANT INSERT ON TABLE public.orders TO anon;


-- 4. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;


-- 5. POLÍTICAS DE SEGURANÇA (RLS POLICIES)

-- REMOVE POLÍTICAS PERMISSIVAS ANTIGAS (SE EXISTIREM)
DROP POLICY IF EXISTS "Permitir tudo para categorias públicas" ON public.categories;
DROP POLICY IF EXISTS "Permitir tudo para pratos públicos" ON public.dishes;
DROP POLICY IF EXISTS "Permitir tudo para configurações públicas" ON public.settings;
DROP POLICY IF EXISTS "Permitir tudo para pedidos públicos" ON public.orders;

DROP POLICY IF EXISTS "categorias_select_public" ON public.categories;
DROP POLICY IF EXISTS "categorias_modify_admin" ON public.categories;
DROP POLICY IF EXISTS "pratos_select_public" ON public.dishes;
DROP POLICY IF EXISTS "pratos_modify_admin" ON public.dishes;
DROP POLICY IF EXISTS "settings_select_public" ON public.settings;
DROP POLICY IF EXISTS "settings_modify_admin" ON public.settings;
DROP POLICY IF EXISTS "orders_insert_public" ON public.orders;
DROP POLICY IF EXISTS "orders_admin_access" ON public.orders;


-- TABELA: CATEGORIES
CREATE POLICY "categorias_select_public" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "categorias_modify_admin" ON public.categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- TABELA: DISHES
CREATE POLICY "pratos_select_public" ON public.dishes
  FOR SELECT USING (true);

CREATE POLICY "pratos_modify_admin" ON public.dishes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- TABELA: SETTINGS
CREATE POLICY "settings_select_public" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "settings_modify_admin" ON public.settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- TABELA: ORDERS
-- Clientes anônimos podem apenas INSERIR novos pedidos
CREATE POLICY "orders_insert_public" ON public.orders
  FOR INSERT TO anon WITH CHECK (true);

-- Administradores autenticados podem ler, atualizar e excluir pedidos
CREATE POLICY "orders_admin_access" ON public.orders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
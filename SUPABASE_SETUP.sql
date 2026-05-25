-- 1. CRIAR TABELA DE CATEGORIAS
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  section TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Habilitar acesso público para leitura/escrita simples (Políticas Row Level Security se necessário)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir tudo para categorias públicas" ON categories FOR ALL USING (true) WITH CHECK (true);

-- 2. CRIAR TABELA DE PRATOS (DISHES)
CREATE TABLE IF NOT EXISTS dishes (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  section TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_customizable BOOLEAN DEFAULT false,
  customization_options JSONB DEFAULT '[]'::jsonb,
  sub_section TEXT,
  size_or_weight TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir tudo para pratos públicos" ON dishes FOR ALL USING (true) WITH CHECK (true);

-- 3. CRIAR TABELA DE CONFIGURAÇÕES (SETTINGS)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir tudo para configurações públicas" ON settings FOR ALL USING (true) WITH CHECK (true);


-- ========================================================
-- INSERÇÃO DE DADOS INICIAIS (OPCIONAL/MOCK DATA)
-- ========================================================

-- Inserindo Categorias
INSERT INTO categories (id, name, section, sort_order) VALUES
('cat-monte-seu-pedido', 'Monte seu Pedido', 'adult', 1),
('cat-pratos-individuais', 'Pratos Individuais', 'adult', 2),
('cat-kids', 'Kids', 'adult', 3),
('cat-bebidas', 'Bebidas', 'adult', 4),
('cat-sobremesas', 'Sobremesas', 'adult', 5),
('cat-extras-frutas', 'Extras / Frutas', 'adult', 6)
ON CONFLICT (id) DO NOTHING;

-- Inserindo Pratos Padrão
INSERT INTO dishes (id, category_id, name, description, price, image_url, active, section, sort_order, is_customizable, customization_options, sub_section, size_or_weight) VALUES
('dish-ind-carbonara', 'cat-pratos-individuais', 'Espaguete à Carbonara', 'Tradicional massa italiana com molho cremoso de gemas de ovos, queijo parmesão e guanciale crocante.', 38.00, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80', true, 'adult', 1, false, '[]'::jsonb, NULL, NULL),
('dish-ind-mineira', 'cat-pratos-individuais', 'Espaguete à Mineira', 'Espaguete com couve refogada na manteiga de alho, pedacinhos de linguiça da roça e queijo minas curado.', 34.00, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80', true, 'adult', 2, false, '[]'::jsonb, NULL, NULL),
('dish-beb-sucodetox', 'cat-bebidas', 'Suco Funcional Detox', 'Suco natural feito na hora com couve fresca, abacaxi, gengibre e hortelã. Sem adição de açúcar.', 9.90, 'https://images.unsplash.com/photo-1610970881699-44a5587caa90?auto=format&fit=crop&w=600&q=80', true, 'adult', 1, false, '[]'::jsonb, 'Sucos Funcionais', '350ml'),
('dish-sob-pudim', 'cat-sobremesas', 'Pudim de Leite Condensado', 'Cremoso pudim de leite artesanal super macio, coberto com calda brilhante de caramelo rústico.', 12.00, 'https://images.unsplash.com/photo-1528975604072-b4dc47a18e06?auto=format&fit=crop&w=600&q=80', true, 'adult', 1, false, '[]'::jsonb, NULL, '150g')
ON CONFLICT (id) DO NOTHING;

-- Inserindo Configurações do Sistema
INSERT INTO settings (key, value) VALUES
('whatsappNumber', '5511999999999'),
('businessName', 'FoodSal - Gastronomia & Sabor'),
('welcomeMessage', 'Olá! Gostaria de fazer o seguinte pedido do cardápio digital:'),
('address', 'Av. Paulista, 1000 - São Paulo, SP'),
('currencySymbol', 'R$')
ON CONFLICT (key) DO NOTHING;
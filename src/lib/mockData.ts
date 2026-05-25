export interface CustomizationItem {
  name: string;
  price?: number;
}

export interface CustomizationGroup {
  id: string;
  title: string;
  min: number;
  max: number;
  items: CustomizationItem[];
}

export interface Category {
  id: string;
  name: string;
  section: 'adult' | 'kids'; // kept for backwards compat but consolidated in display
  sortOrder: number;
}

export interface Dish {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  active: boolean;
  section: 'adult' | 'kids';
  sortOrder: number;
  isCustomizable?: boolean;
  customizationOptions?: CustomizationGroup[];
  subSection?: string; // used for beverages (e.g., 'Sucos Funcionais')
  sizeOrWeight?: string; // used for desserts
}

export interface SystemSettings {
  whatsappNumber: string;
  businessName: string;
  welcomeMessage: string;
  address: string;
  currencySymbol: string;
  welcomeText: string;     // Nova: Texto de Boas-vindas da sidebar
  businessHours: string;   // Nova: Horário de atendimento
  instagramUrl: string;    // Nova: Link do Instagram
}

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-monte-seu-pedido', name: 'Monte seu Pedido', section: 'adult', sortOrder: 1 },
  { id: 'cat-pratos-individuais', name: 'Pratos Individuais', section: 'adult', sortOrder: 2 },
  { id: 'cat-kids', name: 'Kids', section: 'adult', sortOrder: 3 },
  { id: 'cat-bebidas', name: 'Bebidas', section: 'adult', sortOrder: 4 },
  { id: 'cat-sobremesas', name: 'Sobremesas', section: 'adult', sortOrder: 5 },
  { id: 'cat-extras-frutas', name: 'Extras / Frutas', section: 'adult', sortOrder: 6 },
];

export const INITIAL_DISHES: Dish[] = [
  // ========================================================
  // 1. MONTE SEU PEDIDO
  // ========================================================
  {
    id: 'dish-parmegiana-custom',
    categoryId: 'cat-monte-seu-pedido',
    name: 'Parmegiana Personalizado',
    description: 'Monte a sua parmegiana escolhendo a proteína de sua preferência, acompanhamentos deliciosos e saladas.',
    price: 39.90,
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 1,
    isCustomizable: true,
    customizationOptions: [
      {
        id: 'parm-meat',
        title: 'Escolha sua Proteína (Selecione 1)',
        min: 1,
        max: 1,
        items: [
          { name: 'Contra filé' },
          { name: 'Frango' }
        ]
      },
      {
        id: 'parm-sides',
        title: 'Acompanhamentos (Fixos inclusos)',
        min: 3,
        max: 3,
        items: [
          { name: 'Arroz branco (Incluso)' },
          { name: 'Arroz birô-birô (Incluso)' },
          { name: 'Batata frita (Incluso)' }
        ]
      },
      {
        id: 'parm-salads',
        title: 'Adicional de Salada (Opcional - Pago Separado)',
        min: 0,
        max: 1,
        items: [
          { name: 'Mix de Folhas com Frutas', price: 6.00 },
          { name: 'Salada Caesar Clássica', price: 7.50 }
        ]
      }
    ]
  },
  {
    id: 'dish-carne-sol-custom',
    categoryId: 'cat-monte-seu-pedido',
    name: 'Carne de Sol Acebolada',
    description: 'Deliciosa carne de sol acebolada grelhada com opções flexíveis de até 3 acompanhamentos e até 3 saladas.',
    price: 45.90,
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 2,
    isCustomizable: true,
    customizationOptions: [
      {
        id: 'sol-sides',
        title: 'Escolha até 3 Acompanhamentos',
        min: 1,
        max: 3,
        items: [
          { name: 'Arroz branco' },
          { name: 'Arroz birô-birô' },
          { name: 'Feijão caldo' },
          { name: 'Feijão tropeiro' },
          { name: 'Batata frita' },
          { name: 'Espaguete carbonara' },
          { name: 'Espaguete mineira' },
          { name: 'Espaguete alho e óleo' }
        ]
      },
      {
        id: 'sol-salads',
        title: 'Escolha até 3 Saladas',
        min: 0,
        max: 3,
        items: [
          { name: 'Mix de folhas com frutas' },
          { name: 'Cenoura' },
          { name: 'Beterraba' },
          { name: 'Brócolis na manteiga' },
          { name: 'Tomate com cebola roxa' },
          { name: 'Couve-flor na manteiga' },
          { name: 'Repolho roxo' }
        ]
      },
      {
        id: 'sol-fruits',
        title: 'Adicionar Porção de Frutas (Opcional)',
        min: 0,
        max: 3,
        items: [
          { name: 'Manga picada', price: 4.50 },
          { name: 'Melancia em cubos', price: 4.50 },
          { name: 'Morangos frescos', price: 6.00 }
        ]
      }
    ]
  },

  // ========================================================
  // 2. PRATOS INDIVIDUAIS
  // ========================================================
  {
    id: 'dish-ind-carbonara',
    categoryId: 'cat-pratos-individuais',
    name: 'Espaguete à Carbonara',
    description: 'Tradicional massa italiana com molho cremoso de gemas de ovos, queijo parmesão e guanciale crocante.',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 1
  },
  {
    id: 'dish-ind-mineira',
    categoryId: 'cat-pratos-individuais',
    name: 'Espaguete à Mineira',
    description: 'Espaguete com couve refogada na manteiga de alho, pedacinhos de linguiça da roça e queijo minas curado.',
    price: 34.00,
    image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 2
  },
  {
    id: 'dish-ind-bolonhesa',
    categoryId: 'cat-pratos-individuais',
    name: 'Espaguete à Bolonhesa',
    description: 'Massa al dente com generosa porção do nosso clássico molho artesanal de tomates frescos e carne bovina moída.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 3
  },
  {
    id: 'dish-ind-alho-oleo',
    categoryId: 'cat-pratos-individuais',
    name: 'Espaguete Alho e Óleo',
    description: 'Simples e reconfortante espaguete salteado no azeite extravirgem com alho laminado dourado e salsinha fresca.',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 4
  },
  {
    id: 'dish-ind-caesar',
    categoryId: 'cat-pratos-individuais',
    name: 'Salada Caesar',
    description: 'Alface americana crocante, tiras de peito de frango grelhado, croutons caseiros e molho caesar com parmesão.',
    price: 24.00,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 5
  },
  {
    id: 'dish-ind-escondidinho',
    categoryId: 'cat-pratos-individuais',
    name: 'Escondidinho de Carne Seca',
    description: 'Carne seca desfiada bem temperadinha sob purê cremoso de mandioca artesanal, gratinado com queijo de coalho.',
    price: 36.00,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 6
  },
  {
    id: 'dish-ind-batsal',
    categoryId: 'cat-pratos-individuais',
    name: 'Batsal',
    description: 'Batatas rústicas fritas com casca, temperadas com sal de ervas secreto da casa e alecrim fresco.',
    price: 19.00,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 7
  },

  // ========================================================
  // 3. KIDS
  // ========================================================
  {
    id: 'dish-kids-combo1',
    categoryId: 'cat-kids',
    name: 'Combo 1 — Prato Montável',
    description: 'Monte a refeição perfeita para os pequenos escolhendo a proteína principal, acompanhamentos suaves e saladas lúdicas.',
    price: 26.00,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 1,
    isCustomizable: true,
    customizationOptions: [
      {
        id: 'kids-meat',
        title: 'Escolha 1 Proteína',
        min: 1,
        max: 1,
        items: [
          { name: 'Nugget de frango caseiro' },
          { name: 'Bife de Contra Filé em tiras' },
          { name: 'Isca de Frango grelhada' }
        ]
      },
      {
        id: 'kids-sides',
        title: 'Escolha até 3 Acompanhamentos',
        min: 1,
        max: 3,
        items: [
          { name: 'Arroz branco' },
          { name: 'Caldinho de feijão' },
          { name: 'Purê de batata cremoso' },
          { name: 'Batata frita suave' }
        ]
      },
      {
        id: 'kids-salads',
        title: 'Escolha até 3 Saladas',
        min: 0,
        max: 3,
        items: [
          { name: 'Batata inglesa em desenhos' },
          { name: 'Cenoura em formatos divertidos' },
          { name: 'Beterraba in fios coloridos' }
        ]
      }
    ]
  },
  {
    id: 'dish-kids-combo2',
    categoryId: 'cat-kids',
    name: 'Combo 2 — Hambúrguer Infantil',
    description: 'Hambúrguer suculento de blend artesanal no mini pão brioche com queijo prato derretido. Acompanha batata frita smile crocante e anéis de cebola dourados (Onion rings).',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 2
  },

  // ========================================================
  // 4. BEBIDAS
  // ========================================================
  {
    id: 'dish-beb-sucodetox',
    categoryId: 'cat-bebidas',
    name: 'Suco Funcional Detox',
    description: 'Suco natural feito na hora com couve fresca, abacaxi, gengibre e hortelã. Sem adição de açúcar.',
    price: 9.90,
    image: 'https://images.unsplash.com/photo-1610970881699-44a5587caa90?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 1,
    subSection: 'Sucos Funcionais',
    sizeOrWeight: '350ml'
  },
  {
    id: 'dish-beb-sucoenergia',
    categoryId: 'cat-bebidas',
    name: 'Suco Funcional Energia',
    description: 'Suco antioxidante preparado com laranja espremida, cenoura ralada e beterraba natural.',
    price: 10.90,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 2,
    subSection: 'Sucos Funcionais',
    sizeOrWeight: '350ml'
  },
  // Sucos de Polpa
  {
    id: 'dish-beb-polp-acerola',
    categoryId: 'cat-bebidas',
    name: 'Suco de Polpa (Acerola)',
    description: 'Suco de polpa concentrada rica em vitamina C.',
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 3,
    subSection: 'Sucos de Polpa'
  },
  {
    id: 'dish-beb-polp-caju',
    categoryId: 'cat-bebidas',
    name: 'Suco de Polpa (Caju)',
    description: 'Saboroso e encorpado suco de polpa de caju natural.',
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 4,
    subSection: 'Sucos de Polpa'
  },
  {
    id: 'dish-beb-polp-maracuja',
    categoryId: 'cat-bebidas',
    name: 'Suco de Polpa (Maracujá)',
    description: 'Suco relaxante com a tradicional acidez do maracujá.',
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 5,
    subSection: 'Sucos de Polpa'
  },
  // Refrigerantes
  {
    id: 'dish-beb-refri-coca',
    categoryId: 'cat-bebidas',
    name: 'Coca-Cola (Lata)',
    description: 'Refrigerante gelado em lata.',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 6,
    subSection: 'Refrigerantes'
  },
  {
    id: 'dish-beb-refri-guarana',
    categoryId: 'cat-bebidas',
    name: 'Guaraná Antarctica (Lata)',
    description: 'Clássico refrigerante sabor guaraná da floresta amazônica.',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1527960655-2674e306da6c?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 7,
    subSection: 'Refrigerantes'
  },
  // Águas
  {
    id: 'dish-beb-agua-natural',
    categoryId: 'cat-bebidas',
    name: 'Água Mineral sem Gás',
    description: 'Água mineral natural fresca em garrafa.',
    price: 4.00,
    image: 'https://images.unsplash.com/photo-1608885898957-a59911eb9004?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 8,
    subSection: 'Águas'
  },
  {
    id: 'dish-beb-agua-gas',
    categoryId: 'cat-bebidas',
    name: 'Água Mineral com Gás',
    description: 'Água gaseificada cristalina e gelada.',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 9,
    subSection: 'Águas'
  },

  // ========================================================
  // 5. SOBREMESAS
  // ========================================================
  {
    id: 'dish-sob-pudim',
    categoryId: 'cat-sobremesas',
    name: 'Pudim de Leite Condensado',
    description: 'Cremoso pudim de leite artesanal super macio, coberto com calda brilhante de caramelo rústico.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1528975604072-b4dc47a18e06?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 1,
    sizeOrWeight: '150g'
  },
  {
    id: 'dish-sob-petit',
    categoryId: 'cat-sobremesas',
    name: 'Petit Gâteau',
    description: 'Bolinho quente de chocolate belga com recheio cremoso escorrendo, acompanhado de uma bola de sorvete de creme e raspas de chocolate.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 2,
    sizeOrWeight: '180g'
  },
  {
    id: 'dish-sob-mousse',
    categoryId: 'cat-sobremesas',
    name: 'Mousse de Maracujá',
    description: 'Receita caseira e aerada com o equilíbrio perfeito entre doce e azedinho do maracujá fresco.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 3,
    sizeOrWeight: '120g'
  },

  // ========================================================
  // 6. EXTRAS / FRUTAS
  // ========================================================
  {
    id: 'dish-ext-manga',
    categoryId: 'cat-extras-frutas',
    name: 'Porção de Manga Picada',
    description: 'Cubinhos gelados de manga Palmer doce e fresquinha.',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 1
  },
  {
    id: 'dish-ext-melancia',
    categoryId: 'cat-extras-frutas',
    name: 'Porção de Melancia',
    description: 'Fatias doces de melancia fresca e sem sementes para um snack saudável.',
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 2
  },
  {
    id: 'dish-ext-batata',
    categoryId: 'cat-extras-frutas',
    name: 'Porção Extra de Batata Frita',
    description: 'Uma porção inteira extra de batatas fritas sequinhas e crocantes.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 3
  },
  {
    id: 'dish-ext-onion',
    categoryId: 'cat-extras-frutas',
    name: 'Porção de Onion Rings',
    description: 'Anéis de cebola gigantes empanados e fritos até atingir a máxima crocância.',
    price: 14.00,
    image: 'https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 4
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
  whatsappNumber: '5511999999999',
  businessName: 'FoodSal - Gastronomia & Sabor',
  welcomeMessage: 'Olá! Gostaria de fazer o seguinte pedido do cardápio digital:',
  address: 'Av. Paulista, 1000 - São Paulo, SP',
  currencySymbol: 'R$',
  welcomeText: 'Preparamos cada prato com ingredientes selecionados e o máximo carinho para proporcionar uma experiência gastronômica memorável direto na sua mesa.',
  businessHours: 'Quarta a Segunda: 11h30 às 23h | Terça-feira: Fechado',
  instagramUrl: 'https://instagram.com/foodsal'
};
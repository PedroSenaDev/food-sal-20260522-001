export interface Category {
  id: string;
  name: string;
  section: 'adult' | 'kids';
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
}

export interface SystemSettings {
  whatsappNumber: string;
  businessName: string;
  welcomeMessage: string;
  address: string;
  currencySymbol: string;
}

export const INITIAL_CATEGORIES: Category[] = [
  // CARDÁPIO ADULTO
  { id: 'cat-adult-guarnicoes', name: 'Guarnições', section: 'adult', sortOrder: 1 },
  { id: 'cat-adult-espaguetes', name: 'Espaguetes e Pratos', section: 'adult', sortOrder: 2 },
  { id: 'cat-adult-saladas', name: 'Saladas e Verduras', section: 'adult', sortOrder: 3 },
  { id: 'cat-adult-carnes', name: 'Carnes', section: 'adult', sortOrder: 4 },

  // CARDÁPIO INFANTIL
  { id: 'cat-kids-guarnicoes', name: 'Guarnições', section: 'kids', sortOrder: 1 },
  { id: 'cat-kids-saladas', name: 'Saladas & Verduras', section: 'kids', sortOrder: 2 },
  { id: 'cat-kids-carnes', name: 'Carnes', section: 'kids', sortOrder: 3 },
  { id: 'cat-kids-frutas', name: 'Frutas Picadas', section: 'kids', sortOrder: 4 },
];

export const INITIAL_DISHES: Dish[] = [
  // CARDÁPIO ADULTO - Guarnições
  {
    id: 'dish-ad-arroz-br',
    categoryId: 'cat-adult-guarnicoes',
    name: 'Arroz Branco',
    description: 'Arroz agulhinha soltinho, cozido com alho e cebola.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 1
  },
  {
    id: 'dish-ad-arroz-bb',
    categoryId: 'cat-adult-guarnicoes',
    name: 'Arroz Biro Biro',
    description: 'Arroz soltinho com bacon crocante, ovos mexidos, cebola e batata palha caseira.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 2
  },
  {
    id: 'dish-ad-feijao-ca',
    categoryId: 'cat-adult-guarnicoes',
    name: 'Feijão Caldo',
    description: 'Feijão carioca cozido na hora, temperado com alho, cebola e folhas de louro.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1547058886-f14d021c175f?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 3
  },
  {
    id: 'dish-ad-feijao-tr',
    categoryId: 'cat-adult-guarnicoes',
    name: 'Feijão Tropeiro',
    description: 'Feijão com farinha de mandioca, linguiça calabresa, bacon, ovos, couve fresca e temperos.',
    price: 22.00,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 4
  },
  {
    id: 'dish-ad-batata-fr',
    categoryId: 'cat-adult-guarnicoes',
    name: 'Batata Frita',
    description: 'Batatas fritas crocantes por fora e macias por dentro, com um toque de sal.',
    price: 16.00,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 5
  },

  // CARDÁPIO ADULTO - Espaguetes
  {
    id: 'dish-ad-esp-bol',
    categoryId: 'cat-adult-espaguetes',
    name: 'À Bolonhesa',
    description: 'Espaguete al dente ao clássico molho de tomates frescos e carne moída selecionada.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 1
  },
  {
    id: 'dish-ad-esp-carb',
    categoryId: 'cat-adult-espaguetes',
    name: 'Carbonara',
    description: 'Tradicional molho romano com gemas de ovos, queijo parmesão ralado e guanciale crocante.',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 2
  },
  {
    id: 'dish-ad-esp-min',
    categoryId: 'cat-adult-espaguetes',
    name: 'Mineira',
    description: 'Espaguete com couve refogada, pedacinhos de linguiça da roça e queijo minas curado.',
    price: 34.00,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 3
  },
  {
    id: 'dish-ad-esp-alho',
    categoryId: 'cat-adult-espaguetes',
    name: 'Alho e Óleo',
    description: 'Espaguete simples e primoroso, salteado no azeite extravirgem com alho dourado e salsinha.',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 4
  },
  {
    id: 'dish-ad-ris-cam',
    categoryId: 'cat-adult-espaguetes',
    name: 'Risoto de Camarão',
    description: 'Arroz arbóreo cremoso com camarões salteados, queijo parmesão e finalizado com raspas de limão siciliano.',
    price: 54.00,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 5
  },
  {
    id: 'dish-ad-esc-carne',
    categoryId: 'cat-adult-espaguetes',
    name: 'Escondidinho de Carne',
    description: 'Carne de sol desfiada e temperada, sob um purê de mandioca cremoso gratinado com queijo coalho.',
    price: 36.00,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 6
  },

  // CARDÁPIO ADULTO - Saladas e verduras
  {
    id: 'dish-ad-sal-mand',
    categoryId: 'cat-adult-saladas',
    name: 'Mandioca Gratinada em Cubos',
    description: 'Mandioca cozida macia, cortada em cubos e gratinada no forno com queijo parmesão.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 1
  },
  {
    id: 'dish-ad-sal-mix',
    categoryId: 'cat-adult-saladas',
    name: 'Mix de Folhas com Frutas',
    description: 'Alface americana, rúcula e agrião acompanhados de fatias de manga, morango e molho de mostarda e mel.',
    price: 22.00,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 2
  },
  {
    id: 'dish-ad-sal-bat',
    categoryId: 'cat-adult-saladas',
    name: 'Batata Gratinada na Manteiga',
    description: 'Lâminas de batata assadas na manteiga de ervas e salpicadas com queijo parmesão crocante.',
    price: 19.00,
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 3
  },
  {
    id: 'dish-ad-sal-cen',
    categoryId: 'cat-adult-saladas',
    name: 'Fios de Cenoura',
    description: 'Cenoura fresca cortada em fios finos, temperada com limão e azeite.',
    price: 9.00,
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 4
  },
  {
    id: 'dish-ad-sal-bet',
    categoryId: 'cat-adult-saladas',
    name: 'Fios de Beterraba',
    description: 'Beterraba crua ralada em fios finos, rica em nutrientes e saborosa.',
    price: 9.00,
    image: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 5
  },
  {
    id: 'dish-ad-sal-broc',
    categoryId: 'cat-adult-saladas',
    name: 'Brócolis Gratinado na Manteiga',
    description: 'Buquês de brócolis frescos salteados na manteiga e gratinados com muçarela.',
    price: 20.00,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 6
  },
  {
    id: 'dish-ad-sal-pep',
    categoryId: 'cat-adult-saladas',
    name: 'Pepino em Rodelas',
    description: 'Pepino japonês fatiado fininho com toque leve de vinagre de arroz e gergelim.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 7
  },
  {
    id: 'dish-ad-sal-tom',
    categoryId: 'cat-adult-saladas',
    name: 'Tomate com Cebola Roxa',
    description: 'Tomates maduros fatiados com cebola roxa em rodelas, azeite e orégano.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 8
  },
  {
    id: 'dish-ad-sal-couv',
    categoryId: 'cat-adult-saladas',
    name: 'Couve-Flor Gratinada com Ovo',
    description: 'Couve-flor cozida no vapor envolvida em creme de ovos batidos com temperos e gratinada.',
    price: 21.00,
    image: 'https://images.unsplash.com/photo-1568584711271-6c929fb49b60?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 9
  },

  // CARDÁPIO ADULTO - Carnes
  {
    id: 'dish-ad-car-ovo',
    categoryId: 'cat-adult-carnes',
    name: 'Ovo Frito',
    description: 'Ovo caipira com gema mole ou dura, frito no ponto perfeito com uma pitada de flor de sal.',
    price: 5.00,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 1
  },
  {
    id: 'dish-ad-car-fra-pass',
    categoryId: 'cat-adult-carnes',
    name: 'Frango a Passarinho ao Molho de Limão',
    description: 'Pedaços crocantes de frango frito com alho, regados com suco de limão e ervas finas.',
    price: 29.00,
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 2
  },
  {
    id: 'dish-ad-car-fra-parm',
    categoryId: 'cat-adult-carnes',
    name: 'Filé de Frango à Parmigiana',
    description: 'Filé de frango empanado, coberto com molho pomodoro rústico e muita muçarela gratinada.',
    price: 36.00,
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 3
  },
  {
    id: 'dish-ad-car-fra-isca',
    categoryId: 'cat-adult-carnes',
    name: 'Isca de Frango ao Molho de Limão',
    description: 'Tiras de peito de frango grelhadas, envoltas em molho cremoso de limão siciliano.',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 4
  },
  {
    id: 'dish-ad-car-cost',
    categoryId: 'cat-adult-carnes',
    name: 'Costelinha ao Molho Barbecue',
    description: 'Costela suína assada lentamente até soltar do osso, banhada no autêntico molho barbecue defumado.',
    price: 48.00,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 5
  },
  {
    id: 'dish-ad-car-bife-parm',
    categoryId: 'cat-adult-carnes',
    name: 'Bife à Parmigiana',
    description: 'Corte bovino macio empanado na farinha panko, regado com molho artesanal de tomate e muçarela gratinada.',
    price: 44.00,
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6e9473bfc?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 6
  },
  {
    id: 'dish-ad-car-contra',
    categoryId: 'cat-adult-carnes',
    name: 'Contra Filé Acebolado',
    description: 'Bife de contra filé na chapa servido com generosa porção de cebolas caramelizadas.',
    price: 42.00,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 7
  },
  {
    id: 'dish-ad-car-peixe',
    categoryId: 'cat-adult-carnes',
    name: 'Filé de Peixe ao Limão',
    description: 'Filé de peixe branco (tilápia) grelhado com azeite, ervas e regado ao molho de limão.',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 8
  },
  {
    id: 'dish-ad-car-suino',
    categoryId: 'cat-adult-carnes',
    name: 'Bife Suíno Acebolado',
    description: 'Corte de pernil suíno grelhado com tempero especial da casa e cebolas salteadas.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 9
  },
  {
    id: 'dish-ad-car-sol',
    categoryId: 'cat-adult-carnes',
    name: 'Carne de Sol Acebolada',
    description: 'Autêntica carne de sol grelhada na manteiga de garrafa com cebola roxa fatiada.',
    price: 46.00,
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'adult',
    sortOrder: 10
  },

  // CARDÁPIO INFANTIL - Guarnições
  {
    id: 'dish-kd-arroz-br',
    categoryId: 'cat-kids-guarnicoes',
    name: 'Arroz Branco',
    description: 'Arroz soltinho cozido com temperos suaves pensando nos pequenos.',
    price: 9.00,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 1
  },
  {
    id: 'dish-kd-feijao',
    categoryId: 'cat-kids-guarnicoes',
    name: 'Feijão Caldo',
    description: 'Caldinho de feijão saboroso e batido, ideal para crianças.',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1547058886-f14d021c175f?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 2
  },
  {
    id: 'dish-kd-batata',
    categoryId: 'cat-kids-guarnicoes',
    name: 'Batata Frita',
    description: 'Batatas smile ou palito crocantes e douradas.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 3
  },
  {
    id: 'dish-kd-pure',
    categoryId: 'cat-kids-guarnicoes',
    name: 'Purê de Batata',
    description: 'Purê de batata super cremoso, batido com leite e manteiga.',
    price: 11.00,
    image: 'https://images.unsplash.com/photo-1619051805355-a3848a60bb01?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 4
  },
  {
    id: 'dish-kd-panqueca',
    categoryId: 'cat-kids-guarnicoes',
    name: 'Panqueca de Frango',
    description: 'Panqueca macia recheada com frango desfiado cremoso e molho de tomate suave.',
    price: 16.00,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 5
  },

  // CARDÁPIO INFANTIL - Saladas/Verduras
  {
    id: 'dish-kd-sal-desenho',
    categoryId: 'cat-kids-saladas',
    name: 'Batata Inglesa em Desenho',
    description: 'Batatas inglesas cozidas recortadas em formatos divertidos como estrelas e corações.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 1
  },
  {
    id: 'dish-kd-cen-desenho',
    categoryId: 'cat-kids-saladas',
    name: 'Cenoura em Desenhos',
    description: 'Cenoura cozida no vapor cortada de forma lúdica.',
    price: 9.00,
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 2
  },
  {
    id: 'dish-kd-bet-fios',
    categoryId: 'cat-kids-saladas',
    name: 'Beterraba em Fios',
    description: 'Beterraba ralada bem fininha para os pequenos experimentarem cores no prato.',
    price: 9.00,
    image: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 3
  },

  // CARDÁPIO INFANTIL - Carnes
  {
    id: 'dish-kd-nugget',
    categoryId: 'cat-kids-carnes',
    name: 'Nugget',
    description: 'Nuggets de frango caseiros e assados, crocantes e saudáveis.',
    price: 14.00,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 1
  },
  {
    id: 'dish-kd-bife-contra',
    categoryId: 'cat-kids-carnes',
    name: 'Bife de Contra Filé',
    description: 'Bife pequeno de contra filé macio e grelhado, cortado em tiras.',
    price: 22.00,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 2
  },
  {
    id: 'dish-kd-isca-fra',
    categoryId: 'cat-kids-carnes',
    name: 'Isca de Frango',
    description: 'Tiras de peito de frango grelhadas ou empanadas com crosta suave.',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 3
  },

  // CARDÁPIO INFANTIL - Frutas picadas
  {
    id: 'dish-kd-manga',
    categoryId: 'cat-kids-frutas',
    name: 'Manga',
    description: 'Cubos de manga palmer doce, fresquinha e gelada.',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 1
  },
  {
    id: 'dish-kd-banana',
    categoryId: 'cat-kids-frutas',
    name: 'Banana',
    description: 'Banana cortada em rodelas com um salpico opcional de canela.',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 2
  },
  {
    id: 'dish-kd-melancia',
    categoryId: 'cat-kids-frutas',
    name: 'Melancia',
    description: 'Fatias de melancia sem sementes, refrescantes e docinhas.',
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 3
  },
  {
    id: 'dish-kd-maca',
    categoryId: 'cat-kids-frutas',
    name: 'Maçã',
    description: 'Fatias de maçã argentina crocantes, sem casca e prontas para comer.',
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 4
  },
  {
    id: 'dish-kd-laranja',
    categoryId: 'cat-kids-frutas',
    name: 'Laranja',
    description: 'Gomos de laranja pera cortados sem sementes e sem pele branca.',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 5
  },
  {
    id: 'dish-kd-pera',
    categoryId: 'cat-kids-frutas',
    name: 'Pera',
    description: 'Cubinhos de pera macia e sumarenta.',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?auto=format&fit=crop&w=600&q=80',
    active: true,
    section: 'kids',
    sortOrder: 6
  },
];

export const INITIAL_SETTINGS: SystemSettings = {
  whatsappNumber: '5511999999999',
  businessName: 'FoodSal - Gastronomia & Sabor',
  welcomeMessage: 'Olá! Gostaria de fazer o seguinte pedido do cardápio digital:',
  address: 'Av. Paulista, 1000 - São Paulo, SP',
  currencySymbol: 'R$'
};

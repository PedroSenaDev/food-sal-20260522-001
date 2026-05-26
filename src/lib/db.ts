import { createClient } from '@supabase/supabase-js';
import { 
  Category, 
  Dish, 
  SystemSettings, 
  INITIAL_CATEGORIES, 
  INITIAL_DISHES, 
  INITIAL_SETTINGS 
} from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseUrl.startsWith('https://') && 
  !supabaseUrl.includes('your_') && 
  !supabaseUrl.includes('placeholder') &&
  supabaseAnonKey && 
  supabaseAnonKey.length > 30 &&
  !supabaseAnonKey.includes('your_') && 
  !supabaseAnonKey.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const isBrowser = typeof window !== 'undefined';

const STORAGE_KEYS = {
  CATEGORIES: 'foodsal_categories',
  DISHES: 'foodsal_dishes',
  SETTINGS: 'foodsal_settings',
  ORDERS: 'foodsal_orders',
  LOGGED_IN: 'foodsal_logged_in'
};

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  customizations?: string;
}

export interface Order {
  id: string;
  tableNumber: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

// Inicializa o banco do Supabase com os itens iniciais se ele estiver ativo mas totalmente vazio
export async function seedSupabaseDatabase() {
  if (!supabase) return;
  try {
    console.log("Iniciando semeadura automática do Supabase...");
    
    // 1. Cadastra as categorias iniciais
    const catPayloads = INITIAL_CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.name,
      section: cat.section,
      sort_order: cat.sortOrder
    }));
    const { error: catErr } = await supabase.from('categories').insert(catPayloads);
    if (catErr) throw catErr;

    // 2. Cadastra os pratos iniciais
    const dishPayloads = INITIAL_DISHES.map(dish => ({
      id: dish.id,
      category_id: dish.categoryId,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image_url: dish.image,
      active: dish.active,
      section: dish.section,
      sort_order: dish.sortOrder,
      is_customizable: dish.isCustomizable || false,
      customization_options: dish.customizationOptions || [],
      sub_section: dish.subSection || null,
      size_or_weight: dish.sizeOrWeight || null
    }));
    const { error: dishErr } = await supabase.from('dishes').insert(dishPayloads);
    if (dishErr) throw dishErr;

    // 3. Cadastra as configurações iniciais
    const settingsPayloads = Object.entries(INITIAL_SETTINGS).map(([key, value]) => ({
      key,
      value
    }));
    const { error: setErr } = await supabase.from('settings').upsert(settingsPayloads);
    if (setErr) throw setErr;

    console.log("Supabase semeado com sucesso! Agora o banco online está pronto.");
  } catch (err: any) {
    console.error("Erro ao semear dados no Supabase. Verifique se as tabelas existem.", err);
  }
}

// Testa o estado atual de conexão do Supabase para ajudar no diagnóstico do usuário
export async function testSupabaseConnection(): Promise<{ 
  connected: boolean; 
  error?: string; 
  tablesExist?: { categories: boolean; dishes: boolean; settings: boolean; orders: boolean };
  rlsWriteAllowed?: boolean;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return { connected: false, error: 'As chaves do Supabase não estão configuradas ou são inválidas.' };
  }

  const status = {
    connected: true,
    tablesExist: { categories: false, dishes: false, settings: false, orders: false },
    rlsWriteAllowed: false
  };

  try {
    const catCheck = await supabase.from('categories').select('id').limit(1);
    status.tablesExist.categories = !catCheck.error;

    const dishCheck = await supabase.from('dishes').select('id').limit(1);
    status.tablesExist.dishes = !dishCheck.error;

    const settingsCheck = await supabase.from('settings').select('key').limit(1);
    status.tablesExist.settings = !settingsCheck.error;

    const ordersCheck = await supabase.from('orders').select('id').limit(1);
    status.tablesExist.orders = !ordersCheck.error;

    if (catCheck.error || dishCheck.error || settingsCheck.error || ordersCheck.error) {
      const firstError = catCheck.error || dishCheck.error || settingsCheck.error || ordersCheck.error;
      return { 
        ...status, 
        connected: false, 
        error: `Tabelas ausentes ou sem permissão de leitura. Erro: ${firstError?.message}` 
      };
    }

    const testCatId = `test-connection-${Date.now()}`;
    const writeCheck = await supabase.from('categories').insert([{ 
      id: testCatId, 
      name: 'Teste Conexão', 
      section: 'adult', 
      sort_order: 9999 
    }]);

    if (!writeCheck.error) {
      status.rlsWriteAllowed = true;
      await supabase.from('categories').delete().eq('id', testCatId);
    } else {
      return {
        ...status,
        error: `Leitura funcionando, mas Escrita negada por RLS. Erro: ${writeCheck.error.message}`
      };
    }

    return status;
  } catch (err: any) {
    return { connected: false, error: err.message || 'Erro de rede desconhecido ao tentar acessar o Supabase.' };
  }
}

export function initializeLocalStorage() {
  if (!isBrowser) return;

  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DISHES)) {
    localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(INITIAL_DISHES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }
}

export function resetLocalDatabase() {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(INITIAL_DISHES));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  window.location.reload();
}

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        // Se o banco estiver conectado, mas com 0 categorias, roda o semeador automático
        if (data.length === 0) {
          await seedSupabaseDatabase();
          const retry = await supabase
            .from('categories')
            .select('*')
            .order('sort_order', { ascending: true });
          if (retry.data) {
            return retry.data.map(item => ({
              id: item.id,
              name: item.name,
              section: item.section,
              sortOrder: item.sort_order
            }));
          }
        }
        
        return data.map(item => ({
          id: item.id,
          name: item.name,
          section: item.section,
          sortOrder: item.sort_order
        }));
      }
    } catch (e) {
      console.warn("Falha ao ler categorias do Supabase. Usando LocalStorage:", e);
    }
  }

  if (!isBrowser) {
    return INITIAL_CATEGORIES;
  }

  initializeLocalStorage();
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return data ? JSON.parse(data) : INITIAL_CATEGORIES;
}

export async function saveCategory(category: Omit<Category, 'id'> & { id?: string }): Promise<Category> {
  const newId = category.id || `cat-${Date.now()}`;
  const fullCategory: Category = {
    id: newId,
    name: category.name,
    section: category.section,
    sortOrder: category.sortOrder ?? 0
  };

  if (isSupabaseConfigured && supabase) {
    const payload = {
      id: newId,
      name: category.name,
      section: category.section,
      sort_order: category.sortOrder
    };

    if (category.id) {
      const { error } = await supabase
        .from('categories')
        .update({
          name: category.name,
          section: category.section,
          sort_order: category.sortOrder
        })
        .eq('id', category.id);
      
      if (error) {
        console.error("Erro ao editar categoria no Supabase:", error);
        throw new Error(`Erro no Supabase: ${error.message}`);
      }
    } else {
      const { data, error } = await supabase
        .from('categories')
        .insert([payload])
        .select();
      
      if (error) {
        console.error("Erro ao inserir categoria no Supabase:", error);
        throw new Error(`Erro no Supabase: ${error.message}`);
      }
      if (data && data[0]) {
        fullCategory.id = data[0].id;
      }
    }
  }

  // Atualiza LocalStorage apenas como cache local rápido
  if (isBrowser) {
    initializeLocalStorage();
    const categories = await getCategories();
    const index = categories.findIndex(c => c.id === fullCategory.id);

    if (index >= 0) {
      categories[index] = fullCategory;
    } else {
      categories.push(fullCategory);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  return fullCategory;
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Erro ao deletar categoria no Supabase:", error);
      throw new Error(`Erro no Supabase: ${error.message}`);
    }
  }

  if (!isBrowser) return false;

  initializeLocalStorage();
  const categories = await getCategories();
  const filtered = categories.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));

  const dishes = await getDishes();
  const filteredDishes = dishes.filter(d => d.categoryId !== id);
  localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(filteredDishes));

  return true;
}

export async function getDishes(): Promise<Dish[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        return data.map(item => ({
          id: item.id,
          categoryId: item.category_id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          image: item.image_url || '',
          active: item.active,
          section: item.section,
          sortOrder: item.sort_order,
          isCustomizable: item.is_customizable,
          customizationOptions: typeof item.customization_options === 'string' 
            ? JSON.parse(item.customization_options) 
            : item.customization_options || [],
          subSection: item.sub_section,
          sizeOrWeight: item.size_or_weight
        }));
      }
    } catch (e) {
      console.warn("Falha ao ler pratos do Supabase. Usando LocalStorage:", e);
    }
  }

  if (!isBrowser) {
    return INITIAL_DISHES;
  }

  initializeLocalStorage();
  const data = localStorage.getItem(STORAGE_KEYS.DISHES);
  return data ? JSON.parse(data) : INITIAL_DISHES;
}

export async function saveDish(dish: Omit<Dish, 'id'> & { id?: string }): Promise<Dish> {
  const newId = dish.id || `dish-${Date.now()}`;
  const fullDish: Dish = {
    id: newId,
    categoryId: dish.categoryId,
    name: dish.name,
    description: dish.description,
    price: Number(dish.price),
    image: dish.image,
    active: dish.active,
    section: dish.section,
    sortOrder: dish.sortOrder ?? 0,
    isCustomizable: dish.isCustomizable,
    customizationOptions: dish.customizationOptions,
    subSection: dish.subSection,
    sizeOrWeight: dish.sizeOrWeight
  };

  if (isSupabaseConfigured && supabase) {
    const payload = {
      id: newId,
      category_id: dish.categoryId,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image_url: dish.image,
      active: dish.active,
      section: dish.section,
      sort_order: dish.sortOrder,
      is_customizable: dish.isCustomizable || false,
      customization_options: dish.customizationOptions || [],
      sub_section: dish.subSection || null,
      size_or_weight: dish.sizeOrWeight || null
    };

    if (dish.id) {
      const { error } = await supabase
        .from('dishes')
        .update({
          category_id: dish.categoryId,
          name: dish.name,
          description: dish.description,
          price: dish.price,
          image_url: dish.image,
          active: dish.active,
          section: dish.section,
          sort_order: dish.sortOrder,
          is_customizable: dish.isCustomizable || false,
          customization_options: dish.customizationOptions || [],
          sub_section: dish.subSection || null,
          size_or_weight: dish.sizeOrWeight || null
        })
        .eq('id', dish.id);
      
      if (error) {
        console.error("Erro ao editar prato no Supabase:", error);
        throw new Error(`Erro no Supabase: ${error.message}`);
      }
    } else {
      const { data, error } = await supabase
        .from('dishes')
        .insert([payload])
        .select();
      
      if (error) {
        console.error("Erro ao inserir prato no Supabase:", error);
        throw new Error(`Erro no Supabase: ${error.message}`);
      }
      if (data && data[0]) {
        fullDish.id = data[0].id;
      }
    }
  }

  if (isBrowser) {
    initializeLocalStorage();
    const dishes = await getDishes();
    const index = dishes.findIndex(d => d.id === fullDish.id);

    if (index >= 0) {
      dishes[index] = fullDish;
    } else {
      dishes.push(fullDish);
    }

    localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(dishes));
  }

  return fullDish;
}

export async function deleteDish(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('dishes')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Erro ao deletar prato no Supabase:", error);
      throw new Error(`Erro no Supabase: ${error.message}`);
    }
  }

  if (!isBrowser) return false;

  initializeLocalStorage();
  const dishes = await getDishes();
  const filtered = dishes.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(filtered));
  return true;
}

export async function getOrders(): Promise<Order[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        return data.map(item => ({
          id: item.id,
          tableNumber: item.table_number,
          items: typeof item.items === 'string' ? JSON.parse(item.items) : item.items,
          total: Number(item.total),
          createdAt: item.created_at
        }));
      }
    } catch (e) {
      console.warn("Falha ao ler pedidos do Supabase:", e);
    }
  }

  if (!isBrowser) return [];

  initializeLocalStorage();
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
}

export async function saveOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
  const newId = `ord-${Math.floor(1000 + Math.random() * 9000)}`;
  const createdAt = new Date().toISOString();
  const fullOrder: Order = {
    id: newId,
    tableNumber: order.tableNumber,
    items: order.items,
    total: order.total,
    createdAt
  };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('orders')
      .insert([{
        id: newId,
        table_number: order.tableNumber,
        items: JSON.stringify(order.items),
        total: order.total,
        created_at: createdAt
      }]);
    
    if (error) {
      console.error("Erro ao salvar pedido no Supabase:", error);
      throw new Error(`Erro no Supabase: ${error.message}`);
    }
  }

  if (isBrowser) {
    initializeLocalStorage();
    const orders = await getOrders();
    orders.unshift(fullOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  return fullOrder;
}

export async function getSettings(): Promise<SystemSettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const settings: Partial<SystemSettings> = {};
        data.forEach(item => {
          if (item.key in INITIAL_SETTINGS) {
            settings[item.key as keyof SystemSettings] = item.value;
          }
        });
        return { ...INITIAL_SETTINGS, ...settings };
      }
    } catch (e) {
      console.warn("Falha ao ler configurações do Supabase. Usando LocalStorage:", e);
    }
  }

  if (!isBrowser) {
    return INITIAL_SETTINGS;
  }

  initializeLocalStorage();
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : INITIAL_SETTINGS;
}

export async function saveSettings(settings: SystemSettings): Promise<SystemSettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      const promises = Object.entries(settings).map(async ([key, value]) => {
        const { error } = await supabase
          .from('settings')
          .upsert({ key, value });
        if (error) throw error;
      });
      await Promise.all(promises);
    } catch (error: any) {
      console.error("Erro ao salvar configurações no Supabase:", error);
      throw new Error(`Erro no Supabase: ${error.message}`);
    }
  }

  if (isBrowser) {
    initializeLocalStorage();
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  return settings;
}
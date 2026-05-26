import { createClient } from '@supabase/supabase-js';
import { 
  Category, 
  Dish, 
  SystemSettings, 
  INITIAL_CATEGORIES, 
  INITIAL_DISHES, 
  INITIAL_SETTINGS 
} from './mockData';

// Forçamos o fallback com as credenciais reais do seu Supabase para garantir conexão 100% funcional em qualquer ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ovwbrqltrlycbpyylqoq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92d2JycWx0cmx5Y2JweXlscW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MjQ1NjksImV4cCI6MjA5NTMwMDU2OX0.IqqRwKC2vwfoQXTXwxdeor5Z-EkldUnIUlaosSynkJE';

export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseUrl.startsWith('https://') && 
  supabaseAnonKey && 
  supabaseAnonKey.length > 30
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

// Semeia o Supabase se estiver vazio
export async function seedSupabaseDatabase() {
  if (!supabase) return;
  try {
    console.log("Iniciando semeadura automática do Supabase...");
    
    const catPayloads = INITIAL_CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.name,
      section: cat.section,
      sort_order: cat.sortOrder
    }));
    const { error: catErr } = await supabase.from('categories').insert(catPayloads);
    if (catErr) throw catErr;

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

    const settingsPayloads = Object.entries(INITIAL_SETTINGS).map(([key, value]) => ({
      key,
      value
    }));
    const { error: setErr } = await supabase.from('settings').upsert(settingsPayloads);
    if (setErr) throw setErr;

    console.log("Supabase semeado com sucesso!");
  } catch (err: any) {
    console.error("Erro ao semear dados no Supabase:", err);
  }
}

export async function testSupabaseConnection() {
  if (!supabase) return { connected: false, error: 'Supabase não inicializado.' };
  try {
    const { error } = await supabase.from('categories').select('id').limit(1);
    return { connected: !error, error: error?.message };
  } catch (err: any) {
    return { connected: false, error: err.message };
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

export async function getCategories(): Promise<Category[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        if (data.length === 0) {
          const { data: setCheck } = await supabase.from('settings').select('key');
          if (!setCheck || setCheck.length === 0) {
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

  if (!isBrowser) return INITIAL_CATEGORIES;
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

  if (supabase) {
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
      
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('categories')
        .insert([payload]);
      
      if (error) throw error;
    }
  }

  if (isBrowser) {
    initializeLocalStorage();
    const localData = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const categories: Category[] = localData ? JSON.parse(localData) : [];
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
  if (supabase) {
    // 1. Deletamos primeiro todos os pratos vinculados a essa categoria de forma explícita para evitar violação de integridade/chave estrangeira
    const { error: dishesErr } = await supabase
      .from('dishes')
      .delete()
      .eq('category_id', id);
    
    if (dishesErr) throw dishesErr;

    // 2. Agora deletamos a categoria com segurança
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  if (isBrowser) {
    initializeLocalStorage();
    
    const localCats = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const categories: Category[] = localCats ? JSON.parse(localCats) : [];
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories.filter(c => c.id !== id)));

    const localDishes = localStorage.getItem(STORAGE_KEYS.DISHES);
    const dishes: Dish[] = localDishes ? JSON.parse(localDishes) : [];
    localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(dishes.filter(d => d.categoryId !== id)));
  }

  return true;
}

export async function getDishes(): Promise<Dish[]> {
  if (supabase) {
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

  if (!isBrowser) return INITIAL_DISHES;
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

  if (supabase) {
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
        .update(payload)
        .eq('id', dish.id);
      
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('dishes')
        .insert([payload]);
      
      if (error) throw error;
    }
  }

  if (isBrowser) {
    initializeLocalStorage();
    const localData = localStorage.getItem(STORAGE_KEYS.DISHES);
    const dishes: Dish[] = localData ? JSON.parse(localData) : [];
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
  if (supabase) {
    const { error } = await supabase
      .from('dishes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  if (isBrowser) {
    initializeLocalStorage();
    const localData = localStorage.getItem(STORAGE_KEYS.DISHES);
    const dishes: Dish[] = localData ? JSON.parse(localData) : [];
    localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(dishes.filter(d => d.id !== id)));
  }
  return true;
}

export async function getOrders(): Promise<Order[]> {
  if (supabase) {
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

  if (supabase) {
    const { error } = await supabase
      .from('orders')
      .insert([{
        id: newId,
        table_number: order.tableNumber,
        items: JSON.stringify(order.items),
        total: order.total,
        created_at: createdAt
      }]);
    
    if (error) throw error;
  }

  if (isBrowser) {
    initializeLocalStorage();
    const localData = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const orders: Order[] = localData ? JSON.parse(localData) : [];
    orders.unshift(fullOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  return fullOrder;
}

export async function getSettings(): Promise<SystemSettings> {
  if (supabase) {
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

  if (!isBrowser) return INITIAL_SETTINGS;
  initializeLocalStorage();
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : INITIAL_SETTINGS;
}

export async function saveSettings(settings: SystemSettings): Promise<SystemSettings> {
  if (supabase) {
    const promises = Object.entries(settings).map(async ([key, value]) => {
      const { error } = await supabase
        .from('settings')
        .upsert({ key, value });
      if (error) throw error;
    });
    await Promise.all(promises);
  }

  if (isBrowser) {
    initializeLocalStorage();
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  return settings;
}

export async function uploadImage(file: File): Promise<string> {
  const compressImage = (imageFile: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
      };
    });
  };

  const webOptimizedImageBase64 = await compressImage(file);

  const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
  const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

  if (cloudinaryCloudName && cloudinaryUploadPreset) {
    try {
      const formData = new FormData();
      formData.append('file', webOptimizedImageBase64);
      formData.append('upload_preset', cloudinaryUploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.secure_url;
      }
    } catch (e) {
      console.error('Cloudinary upload failed, falling back to optimized lightweight base64', e);
    }
  }

  return webOptimizedImageBase64;
}
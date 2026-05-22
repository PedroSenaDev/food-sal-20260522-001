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

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const isBrowser = typeof window !== 'undefined';

// LocalStorage Keys
const STORAGE_KEYS = {
  CATEGORIES: 'foodsal_categories',
  DISHES: 'foodsal_dishes',
  SETTINGS: 'foodsal_settings',
  LOGGED_IN: 'foodsal_logged_in'
};

// Helper to initialize local storage if empty
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
}

// Reset Database function
export function resetLocalDatabase() {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(INITIAL_DISHES));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  window.location.reload();
}

// ==========================================
// CATEGORIES CRUD
// ==========================================

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        section: item.section,
        sortOrder: item.sort_order
      }));
    } catch (e) {
      console.warn('Failed to fetch categories from Supabase, falling back to local storage', e);
    }
  }

  // Fallback
  initializeLocalStorage();
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return data ? JSON.parse(data) : [];
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
    try {
      const payload = {
        name: category.name,
        section: category.section,
        sort_order: category.sortOrder
      };

      if (category.id) {
        const { error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', category.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('categories')
          .insert([payload])
          .select();
        if (error) throw error;
        if (data && data[0]) {
          fullCategory.id = data[0].id;
        }
      }
      return fullCategory;
    } catch (e) {
      console.error('Supabase saveCategory failed', e);
    }
  }

  // Fallback
  initializeLocalStorage();
  const categories = await getCategories();
  const index = categories.findIndex(c => c.id === category.id);

  if (index >= 0) {
    categories[index] = fullCategory;
  } else {
    categories.push(fullCategory);
  }

  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  return fullCategory;
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Supabase deleteCategory failed', e);
    }
  }

  // Fallback
  initializeLocalStorage();
  const categories = await getCategories();
  const filtered = categories.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));

  // Cascade delete dishes
  const dishes = await getDishes();
  const filteredDishes = dishes.filter(d => d.categoryId !== id);
  localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(filteredDishes));

  return true;
}

// ==========================================
// DISHES CRUD
// ==========================================

export async function getDishes(): Promise<Dish[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return (data || []).map(item => ({
        id: item.id,
        categoryId: item.category_id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        image: item.image_url || '',
        active: item.active,
        section: item.section,
        sortOrder: item.sort_order
      }));
    } catch (e) {
      console.warn('Failed to fetch dishes from Supabase, falling back to local storage', e);
    }
  }

  // Fallback
  initializeLocalStorage();
  const data = localStorage.getItem(STORAGE_KEYS.DISHES);
  return data ? JSON.parse(data) : [];
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
    sortOrder: dish.sortOrder ?? 0
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {
        category_id: dish.categoryId,
        name: dish.name,
        description: dish.description,
        price: dish.price,
        image_url: dish.image,
        active: dish.active,
        section: dish.section,
        sort_order: dish.sortOrder
      };

      if (dish.id) {
        const { error } = await supabase
          .from('dishes')
          .update(payload)
          .eq('id', dish.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('dishes')
          .insert([payload])
          .select();
        if (error) throw error;
        if (data && data[0]) {
          fullDish.id = data[0].id;
        }
      }
      return fullDish;
    } catch (e) {
      console.error('Supabase saveDish failed', e);
    }
  }

  // Fallback
  initializeLocalStorage();
  const dishes = await getDishes();
  const index = dishes.findIndex(d => d.id === dish.id);

  if (index >= 0) {
    dishes[index] = fullDish;
  } else {
    dishes.push(fullDish);
  }

  localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(dishes));
  return fullDish;
}

export async function deleteDish(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('dishes')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Supabase deleteDish failed', e);
    }
  }

  // Fallback
  initializeLocalStorage();
  const dishes = await getDishes();
  const filtered = dishes.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(filtered));
  return true;
}

// ==========================================
// SETTINGS
// ==========================================

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
      console.warn('Failed to fetch settings from Supabase, falling back to local storage', e);
    }
  }

  // Fallback
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
      return settings;
    } catch (e) {
      console.error('Supabase saveSettings failed', e);
    }
  }

  // Fallback
  initializeLocalStorage();
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  return settings;
}

// ==========================================
// IMAGE UPLOAD (Mock / Cloudinary)
// ==========================================

export async function uploadImage(file: File): Promise<string> {
  const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
  const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

  if (cloudinaryCloudName && cloudinaryUploadPreset) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryUploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Cloudinary upload failed');

      const data = await response.json();
      return data.secure_url;
    } catch (e) {
      console.error('Cloudinary upload failed, falling back to base64', e);
    }
  }

  // Fallback: Convert to Base64
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

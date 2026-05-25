'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category, Dish, SystemSettings } from '../lib/mockData';
import { 
  getCategories, 
  getDishes, 
  getSettings, 
  saveCategory as dbSaveCategory, 
  deleteCategory as dbDeleteCategory, 
  saveDish as dbSaveDish, 
  deleteDish as dbDeleteDish, 
  saveSettings as dbSaveSettings,
  initializeLocalStorage
} from '../lib/db';

export interface SelectedCustomization {
  groupTitle: string;
  items: { name: string; price?: number }[];
}

export interface CartItem {
  id: string; // Dynamic unique ID for cart items to allow adding same dish with different options
  dish: Dish;
  quantity: number;
  notes?: string;
  customizations?: SelectedCustomization[];
  customPrice?: number;
}

interface AppContextType {
  categories: Category[];
  dishes: Dish[];
  settings: SystemSettings;
  activeSection: 'adult' | 'kids';
  setActiveSection: (section: 'adult' | 'kids') => void;
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (dish: Dish, quantity?: number, notes?: string, customizations?: SelectedCustomization[], customPrice?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Table
  tableNumber: string | null;
  setTableNumber: (table: string | null) => void;

  // Loading
  isLoading: boolean;
  refreshData: () => Promise<void>;

  // Admin auth
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

  // Mutators
  addOrUpdateCategory: (category: Omit<Category, 'id'> & { id?: string }) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  addOrUpdateDish: (dish: Omit<Dish, 'id'> & { id?: string }) => Promise<void>;
  removeDish: (id: string) => Promise<void>;
  updateSettings: (settings: SystemSettings) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    whatsappNumber: '5511999999999',
    businessName: 'FoodSal',
    welcomeMessage: 'Olá! Gostaria de fazer o seguinte pedido:',
    address: 'Av. Paulista, 1000',
    currencySymbol: 'R$'
  });
  
  const [activeSection, setActiveSection] = useState<'adult' | 'kids'>('adult');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Load initial data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      initializeLocalStorage();
      const [cats, items, config] = await Promise.all([
        getCategories(),
        getDishes(),
        getSettings()
      ]);
      setCategories(cats);
      setDishes(items);
      setSettings(config);
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Check URL parameters for table number
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const table = params.get('mesa') || params.get('table');
      if (table) {
        setTableNumber(table);
      }

      // Check admin login
      const loggedIn = localStorage.getItem('foodsal_logged_in') === 'true';
      setIsAdminLoggedIn(loggedIn);
    }
  }, []);

  // Reset selected category when switching sections
  useEffect(() => {
    setSelectedCategory(null);
  }, [activeSection]);

  // Helper to create a signature key of selected options to aggregate duplicates in cart
  const getCustomizationKey = (customizations?: SelectedCustomization[]) => {
    if (!customizations) return '';
    return JSON.stringify(customizations.map(c => ({
      g: c.groupTitle,
      i: c.items.map(it => it.name).sort()
    })).sort((a, b) => a.g.localeCompare(b.g)));
  };

  // Cart operations
  const addToCart = (dish: Dish, quantity = 1, notes = '', customizations?: SelectedCustomization[], customPrice?: number) => {
    const targetPrice = customPrice !== undefined ? customPrice : dish.price;
    const currentCustomKey = getCustomizationKey(customizations);

    setCart(prev => {
      // Find item with same dish AND same custom selections and notes
      const existingIndex = prev.findIndex(item => 
        item.dish.id === dish.id && 
        getCustomizationKey(item.customizations) === currentCustomKey &&
        (item.notes || '') === (notes || '')
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      // Unique dynamic ID for cart item
      const cartItemId = `${dish.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      return [...prev, { id: cartItemId, dish, quantity, notes, customizations, customPrice: targetPrice }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => 
      prev.map(item => item.id === cartItemId ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.customPrice !== undefined ? item.customPrice : item.dish.price;
    return sum + (price * item.quantity);
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Admin login
  const loginAdmin = (password: string): boolean => {
    if (password === 'admin123' || password === 'foodsal2026') {
      setIsAdminLoggedIn(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('foodsal_logged_in', 'true');
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('foodsal_logged_in');
    }
  };

  // Mutators
  const addOrUpdateCategory = async (category: Omit<Category, 'id'> & { id?: string }) => {
    const saved = await dbSaveCategory(category);
    setCategories(prev => {
      const index = prev.findIndex(c => c.id === saved.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = saved;
        return updated.sort((a, b) => a.sortOrder - b.sortOrder);
      }
      return [...prev, saved].sort((a, b) => a.sortOrder - b.sortOrder);
    });
  };

  const removeCategory = async (id: string) => {
    await dbDeleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
    setDishes(prev => prev.filter(d => d.categoryId !== id));
  };

  const addOrUpdateDish = async (dish: Omit<Dish, 'id'> & { id?: string }) => {
    const saved = await dbSaveDish(dish);
    setDishes(prev => {
      const index = prev.findIndex(d => d.id === saved.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = saved;
        return updated.sort((a, b) => a.sortOrder - b.sortOrder);
      }
      return [...prev, saved].sort((a, b) => a.sortOrder - b.sortOrder);
    });
  };

  const removeDish = async (id: string) => {
    await dbDeleteDish(id);
    setDishes(prev => prev.filter(d => d.id !== id));
  };

  const updateSettings = async (newSettings: SystemSettings) => {
    const saved = await dbSaveSettings(newSettings);
    setSettings(saved);
  };

  return (
    <AppContext.Provider value={{
      categories,
      dishes,
      settings,
      activeSection,
      setActiveSection,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartTotal,
      cartCount,
      tableNumber,
      setTableNumber,
      isLoading,
      refreshData,
      isAdminLoggedIn,
      loginAdmin,
      logoutAdmin,
      addOrUpdateCategory,
      removeCategory,
      addOrUpdateDish,
      removeDish,
      updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
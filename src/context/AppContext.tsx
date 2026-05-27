'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category, Dish, SystemSettings } from '../lib/mockData';
import { 
  getCategories, 
  getDishes, 
  getSettings, 
  getOrders,
  saveOrder as dbSaveOrder,
  saveCategory as dbSaveCategory, 
  deleteCategory as dbDeleteCategory, 
  saveDish as dbSaveDish, 
  deleteDish as dbDeleteDish, 
  saveSettings as dbSaveSettings,
  initializeLocalStorage,
  Order
} from '../lib/db';

export interface SelectedCustomization {
  groupTitle: string;
  items: { name: string; price?: number }[];
}

export interface CartItem {
  id: string; 
  dish: Dish;
  quantity: number;
  notes?: string;
  customizations?: SelectedCustomization[];
  customPrice?: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  categories: Category[];
  dishes: Dish[];
  settings: SystemSettings;
  orders: Order[];
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

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Mutators
  addOrUpdateCategory: (category: Omit<Category, 'id'> & { id?: string }) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  addOrUpdateDish: (dish: Omit<Dish, 'id'> & { id?: string }) => Promise<void>;
  removeDish: (id: string) => Promise<void>;
  updateSettings: (settings: SystemSettings) => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
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
    currencySymbol: 'R$',
    welcomeText: 'Preparamos cada prato com ingredientes selecionados e o máximo carinho.',
    welcomeTitle: 'Seja bem-vindo ao FoodSal!',
    businessHours: 'Quarta a Segunda: 11h30 às 23h',
    instagramUrl: 'https://instagram.com/'
  });
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [activeSection, setActiveSection] = useState<'adult' | 'kids'>('adult');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      initializeLocalStorage();
      const [cats, items, config, ords] = await Promise.all([
        getCategories(),
        getDishes(),
        getSettings(),
        getOrders()
      ]);
      setCategories(cats);
      setDishes(items);
      setSettings(config);
      setOrders(ords);
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const table = params.get('mesa') || params.get('table');
      if (table) {
        setTableNumber(table);
      }

      const loggedIn = localStorage.getItem('foodsal_logged_in') === 'true';
      setIsAdminLoggedIn(loggedIn);
    }
  }, []);

  useEffect(() => {
    setSelectedCategory(null);
  }, [activeSection]);

  const getCustomizationKey = (customizations?: SelectedCustomization[]) => {
    if (!customizations) return '';
    return JSON.stringify(customizations.map(c => ({
      g: c.groupTitle,
      i: c.items.map(it => it.name).sort()
    })).sort((a, b) => a.g.localeCompare(b.g)));
  };

  const addToCart = (dish: Dish, quantity = 1, notes = '', customizations?: SelectedCustomization[], customPrice?: number) => {
    const targetPrice = customPrice !== undefined ? customPrice : dish.price;
    const currentCustomKey = getCustomizationKey(customizations);

    setCart(prev => {
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

      const cartItemId = `${dish.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      return [...prev, { id: cartItemId, dish, quantity, notes, customizations, customPrice: targetPrice }];
    });

    showToast(`Adicionado ao pedido: ${quantity}x ${dish.name}`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    const item = cart.find(i => i.id === cartItemId);
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    if (item) {
      showToast(`${item.dish.name} removido da sacola`, 'info');
    }
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

  const clearCart = () => {
    setCart([]);
    showToast('A sacola de pedidos foi esvaziada', 'info');
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.customPrice !== undefined ? item.customPrice : item.dish.price;
    return sum + (price * item.quantity);
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const loginAdmin = (password: string): boolean => {
    if (password === 'admin123' || password === 'foodsal2026') {
      setIsAdminLoggedIn(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('foodsal_logged_in', 'true');
      }
      showToast('Acesso ao Painel do Gerente autorizado', 'success');
      return true;
    }
    showToast('Senha inválida', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('foodsal_logged_in');
    }
    showToast('Sessão de gerenciamento encerrada', 'info');
  };

  // Mutators estritos: Só atualiza a tela após sucesso real no Supabase
  const addOrUpdateCategory = async (category: Omit<Category, 'id'> & { id?: string }) => {
    try {
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
      showToast(`Categoria "${category.name}" salva com sucesso`, 'success');
    } catch (err: any) {
      console.error("Erro ao salvar categoria:", err);
      showToast('Falha ao sincronizar categoria no servidor', 'error');
      throw err;
    }
  };

  const removeCategory = async (id: string) => {
    try {
      await dbDeleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      setDishes(prev => prev.filter(d => d.categoryId !== id));
      showToast('Categoria excluída definitivamente', 'success');
    } catch (err: any) {
      console.error("Erro ao excluir categoria:", err);
      showToast('Falha ao excluir categoria no servidor', 'error');
      throw err;
    }
  };

  const addOrUpdateDish = async (dish: Omit<Dish, 'id'> & { id?: string }) => {
    try {
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
      showToast(`Prato "${dish.name}" salvo com sucesso`, 'success');
    } catch (err: any) {
      console.error("Erro ao salvar prato:", err);
      showToast('Falha ao salvar prato no servidor', 'error');
      throw err;
    }
  };

  const removeDish = async (id: string) => {
    try {
      await dbDeleteDish(id);
      setDishes(prev => prev.filter(d => d.id !== id));
      showToast('Prato removido do cardápio', 'success');
    } catch (err: any) {
      console.error("Erro ao excluir prato:", err);
      showToast('Erro ao remover o prato do servidor', 'error');
      throw err;
    }
  };

  const updateSettings = async (newSettings: SystemSettings) => {
    try {
      const saved = await dbSaveSettings(newSettings);
      setSettings(saved);
      showToast('Informações do restaurante atualizadas', 'success');
    } catch (err: any) {
      console.error("Erro ao salvar configurações:", err);
      showToast('Falha ao persistir as configurações', 'error');
      throw err;
    }
  };

  const createOrder = async (orderPayload: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    const savedOrder = await dbSaveOrder(orderPayload);
    setOrders(prev => [savedOrder, ...prev]);
    return savedOrder;
  };

  return (
    <AppContext.Provider value={{
      categories,
      dishes,
      settings,
      orders,
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
      toasts,
      showToast,
      removeToast,
      addOrUpdateCategory,
      removeCategory,
      addOrUpdateDish,
      removeDish,
      updateSettings,
      createOrder
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
</dyad-file>

Agora vamos integrar o `ToastContainer` no layout do aplicativo (`src/app/layout.tsx`):

<dyad-write path="src/app/layout.tsx" description="Insere o ToastContainer no corpo raiz da página para que as notificações funcionem globalmente.">
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ToastContainer from "@/components/ToastContainer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "FoodSal - Cardápio Digital Premium",
  description: "Saboreie nossa seleção especial diretamente da sua mesa. Peça de forma rápida e elegante.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${outfit.variable} h-full`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F5E6D3] text-stone-800 antialiased selection:bg-[#C62828] selection:text-white">
        <AppProvider>
          {children}
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
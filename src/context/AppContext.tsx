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

  // Load initial data
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

### 3. Atualizar o Menu Lateral Informativo (`src/components/InfoSidebar.tsx`)
Faremos com que a Sidebar leia todas as informações vindas diretamente da base de dados dinâmica:

<dyad-write path="src/components/InfoSidebar.tsx" description="Atualiza o componente de sidebar para exibir os textos, links de redes e horários vindos das configurações">
'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { X, MapPin, Phone, Clock, ShieldCheck, Globe } from 'lucide-react';
import Link from 'next/link';

interface InfoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoSidebar({ isOpen, onClose }: InfoSidebarProps) {
  const { settings } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click Outside to Close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Info Drawer */}
      <div className="relative w-full max-w-xs h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-350 ease-out">
        
        {/* Header - Styled to match the Main Hero Section */}
        <div className="p-5 flex items-center justify-between bg-brand-darkred text-[#F5E6D3] shadow-md relative overflow-hidden">
          {/* Subtle pattern just like the hero section */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F5E6D3_1.5px,transparent_1.5px)] [background-size:12px_12px]" />
          
          <div className="flex flex-col relative z-10 select-none">
            <span className="font-serif text-2xl font-extrabold tracking-tight text-[#F5E6D3]">
              Food<span className="text-brand-red font-serif font-semibold italic [text-shadow:-0.5px_-0.5px_0_#F5E6D3,0.5px_-0.5px_0_#F5E6D3,-0.5px_0.5px_0_#F5E6D3,0.5px_0.5px_0_#F5E6D3]">Sal</span>
            </span>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#F5E6D3]/80 mt-1">
              Sobre nós
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#F5E6D3] transition-colors cursor-pointer relative z-10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Welcome Intro */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-stone-900">
              Seja bem-vindo ao {settings.businessName.split('-')[0].trim()}!
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {settings.welcomeText || 'Preparamos cada prato com ingredientes selecionados e o máximo carinho para proporcionar uma experiência memorável direto na sua mesa.'}
            </p>
          </div>

          <hr className="border-stone-100" />

          {/* Details Section */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Informações Gerais
            </h4>

            {/* Address */}
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-brand-red/5 text-brand-red shrink-0">
                <MapPin size={16} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-550 block uppercase">Endereço</span>
                <span className="text-xs text-stone-700 font-medium leading-relaxed mt-0.5 block">
                  {settings.address}
                </span>
              </div>
            </div>

            {/* Contact Phone */}
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-brand-red/5 text-brand-red shrink-0">
                <Phone size={16} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-550 block uppercase">Contato / WhatsApp</span>
                <a 
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-darkred font-bold hover:underline leading-relaxed mt-0.5 block"
                >
                  +{settings.whatsappNumber}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-brand-red/5 text-brand-red shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-550 block uppercase">Horário de Atendimento</span>
                <span className="text-xs text-stone-700 font-medium leading-relaxed mt-0.5 block whitespace-pre-line">
                  {settings.businessHours || 'Quarta a Segunda: 11h30 às 23h\nTerça-feira: Fechado'}
                </span>
              </div>
            </div>

          </div>

          <hr className="border-stone-100" />

          {/* Redes Sociais */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Siga-nos nas redes
            </h4>
            <div className="flex gap-3">
              <a 
                href={settings.instagramUrl || '#'} 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-stone-100 hover:bg-brand-red/5 text-stone-600 hover:text-brand-red font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Globe size={14} />
                <span>Instagram</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer with Admin Access */}
        <div className="p-5 border-t border-stone-100 bg-stone-50">
          <Link
            href="/admin"
            className="w-full py-2.5 px-4 rounded-xl border border-stone-200 hover:border-brand-red/20 hover:bg-brand-red/5 text-stone-500 hover:text-brand-darkred text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            onClick={onClose}
          >
            <ShieldCheck size={14} />
            <span>Painel do Gerente</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
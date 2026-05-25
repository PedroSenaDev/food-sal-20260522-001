'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import CategoryNav from '../components/CategoryNav';
import MenuCard from '../components/MenuCard';
import { Search, Loader2, Award, MapPin } from 'lucide-react';

export default function Home() {
  const { 
    dishes, 
    categories, 
    selectedCategory, 
    searchQuery, 
    setSearchQuery, 
    isLoading,
    settings
  } = useApp();

  // Filter logic: unifies display of all categories 1 to 6
  const filteredDishes = dishes.filter(dish => {
    // 1. Filter by active state
    if (!dish.active) return false;
    
    // 2. Filter by category
    if (selectedCategory && dish.categoryId !== selectedCategory) return false;

    // 3. Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesName = dish.name.toLowerCase().includes(query);
      const matchesDesc = dish.description.toLowerCase().includes(query);
      return matchesName || matchesDesc;
    }

    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-darkred text-white py-12 md:py-16 px-4 shrink-0 shadow-lg">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F5E6D3_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center justify-center">
          
          {/* Stylized logo text */}
          <h1 className="font-serif text-5xl md:text-7xl font-extrabold tracking-tight text-[#F5E6D3] drop-shadow-sm select-none">
            Food<span className="text-brand-red font-serif font-semibold italic">Sal</span>
          </h1>

          {/* Subtitle tightly spaced */}
          <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#F5E6D3]/80 mt-3 select-none">
            {settings.businessName.split('-')[1]?.trim() || 'Menu Digital Premium'}
          </p>

          {/* Fine separator line */}
          <div className="w-12 h-[1px] bg-brand-red/40 mt-5" />
          
        </div>
      </section>

      {/* Main Menu Feed */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 pb-24">
        
        {/* Info bar address */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-6 text-center">
          <MapPin size={12} className="text-brand-red" />
          <span>{settings.address}</span>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-md mx-auto relative mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar pratos ou ingredientes..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-stone-250/70 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-805 bg-white/95 shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-450 hover:text-brand-red cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Category horizontal filters */}
        <div className="mb-8">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-3 pl-1">
            Seções do Cardápio
          </div>
          <CategoryNav />
        </div>

        {/* Items Grid organized by categories if 'All' is selected */}
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center text-brand-red space-y-2">
            <Loader2 className="animate-spin" size={32} />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Carregando Cardápio...
            </span>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-stone-450 space-y-2">
            <p className="text-sm font-semibold">Nenhum prato disponível no momento.</p>
            {searchQuery && (
              <p className="text-xs text-stone-400 font-medium">Tente buscar por termos diferentes.</p>
            )}
          </div>
        ) : selectedCategory ? (
          // Individual category display
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {filteredDishes.map(dish => {
              const category = categories.find(c => c.id === dish.categoryId);
              return (
                <MenuCard 
                  key={dish.id} 
                  dish={dish} 
                  categoryName={category?.name} 
                />
              );
            })}
          </div>
        ) : (
          // Organized display: render section-by-section with header titles
          <div className="space-y-12 animate-in fade-in duration-300">
            {categories.map(category => {
              const categoryDishes = filteredDishes.filter(d => d.categoryId === category.id);
              if (categoryDishes.length === 0) return null;

              return (
                <div key={category.id} className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                      {category.name}
                    </h2>
                    <span className="text-[10px] font-bold bg-brand-red/10 text-brand-red px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {categoryDishes.length} {categoryDishes.length === 1 ? 'Item' : 'Itens'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryDishes.map(dish => (
                      <MenuCard 
                        key={dish.id} 
                        dish={dish} 
                        categoryName={category.name} 
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
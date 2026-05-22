'use client';

import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryNav() {
  const { categories, selectedCategory, setSelectedCategory, activeSection } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter categories by active section
  const sectionCategories = categories.filter(c => c.section === activeSection);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (sectionCategories.length === 0) return null;

  return (
    <div className="relative w-full mb-8">
      {/* Scroll Navigation Buttons for Desktop */}
      <div className="absolute inset-y-0 -left-4 flex items-center justify-center pointer-events-none z-10 hidden sm:flex">
        <button
          onClick={() => handleScroll('left')}
          className="p-1.5 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-brand-red shadow-md hover:bg-stone-50 cursor-pointer pointer-events-auto transition-all"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      <div className="absolute inset-y-0 -right-4 flex items-center justify-center pointer-events-none z-10 hidden sm:flex">
        <button
          onClick={() => handleScroll('right')}
          className="p-1.5 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-brand-red shadow-md hover:bg-stone-50 cursor-pointer pointer-events-auto transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Horizontal Scroll Area */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto flex gap-2.5 pb-2 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* 'Todos' category item */}
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider snap-start shrink-0 transition-all duration-300 border cursor-pointer ${
            selectedCategory === null
              ? 'bg-brand-red text-white border-brand-red shadow-md shadow-brand-red/10'
              : 'bg-white text-stone-600 border-stone-200 hover:border-brand-red/20 hover:text-brand-red'
          }`}
        >
          Ver Todos
        </button>

        {sectionCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider snap-start shrink-0 transition-all duration-300 border cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-brand-red text-white border-brand-red shadow-md shadow-brand-red/10'
                : 'bg-white text-stone-600 border-stone-200 hover:border-brand-red/20 hover:text-brand-red'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

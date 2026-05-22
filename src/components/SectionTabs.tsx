'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { UtensilsCrossed, Smile } from 'lucide-react';

export default function SectionTabs() {
  const { activeSection, setActiveSection } = useApp();

  return (
    <div className="w-full max-w-md mx-auto p-1.5 bg-stone-200/60 rounded-2xl border border-stone-300/40 shadow-inner flex mb-6">
      
      {/* Adult Menu Tab */}
      <button
        onClick={() => setActiveSection('adult')}
        className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 font-sans cursor-pointer ${
          activeSection === 'adult'
            ? 'bg-brand-red text-white shadow-md shadow-brand-red/20 scale-[1.02]'
            : 'text-stone-600 hover:text-brand-red hover:bg-white/40'
        }`}
      >
        <UtensilsCrossed size={16} />
        <span>Cardápio Adulto</span>
      </button>

      {/* Kids Menu Tab */}
      <button
        onClick={() => setActiveSection('kids')}
        className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 font-sans cursor-pointer ${
          activeSection === 'kids'
            ? 'bg-brand-darkred text-white shadow-md shadow-brand-darkred/20 scale-[1.02]'
            : 'text-stone-600 hover:text-brand-darkred hover:bg-white/40'
        }`}
      >
        <Smile size={16} />
        <span>Cardápio Infantil</span>
      </button>

    </div>
  );
}

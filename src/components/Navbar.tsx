'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Menu as MenuIcon } from 'lucide-react';
import InfoSidebar from './InfoSidebar';
import Link from 'next/link';

export default function Navbar() {
  const { tableNumber } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-effect border-b border-brand-red/10 shadow-sm transition-all duration-300">
        {/* 
          Aumentamos a altura da barra do header para h-24 no mobile e h-28 em telas maiores 
          para acomodar confortavelmente a logo ampliada e os controles.
        */}
        <div className="max-w-6xl mx-auto px-4 h-24 md:h-28 flex items-center justify-between relative">
          
          {/* Menu Trigger Button on the Left */}
          <div className="flex items-center justify-start w-24 shrink-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 rounded-xl border border-stone-200/80 hover:border-brand-red/25 bg-white text-stone-600 hover:text-brand-red hover:bg-brand-red/5 transition-all cursor-pointer flex items-center justify-center shadow-sm"
              title="Informações do restaurante"
            >
              <MenuIcon size={18} />
            </button>
          </div>

          {/* Center Brand Logo Image */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="block">
              {/* Logo FoodSal ampliada para h-20 no mobile e h-24 no desktop */}
              <img 
                src="/logo.png" 
                alt="Logo FoodSal" 
                className="h-20 md:h-24 w-auto object-contain transition-transform duration-200 active:scale-95" 
              />
            </Link>
          </div>

          {/* Table Section on the Right */}
          <div className="flex items-center justify-end w-24 shrink-0">
            {tableNumber && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-red/5 border border-brand-red/20 shadow-inner whitespace-nowrap">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
                </span>
                <span className="text-xs font-semibold text-brand-darkred font-sans">
                  Mesa {tableNumber}
                </span>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Info Sidebar overlay */}
      <InfoSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
'use client';

import React, { useState } from 'react';
import { Dish } from '../lib/mockData';
import { useApp } from '../context/AppContext';
import { X, ChevronRight } from 'lucide-react';

interface MenuCardProps {
  dish: Dish;
  categoryName?: string;
}

export default function MenuCard({ dish, categoryName }: MenuCardProps) {
  const { settings } = useApp();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const formatPrice = (val: number) => {
    return `${settings.currencySymbol} ${val.toFixed(2)}`;
  };

  return (
    <>
      {/* Dish Card */}
      <div 
        onClick={() => setIsDetailOpen(true)}
        className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/50 hover:border-brand-red/20 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      >
        {/* Dish Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
          {dish.image ? (
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300">
              <span className="font-serif italic text-lg text-stone-400">FoodSal</span>
            </div>
          )}
          
          {/* Price Tag Overlay */}
          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-stone-900/80 backdrop-blur-sm text-white font-bold text-sm tracking-wide shadow-md">
            {formatPrice(dish.price)}
          </div>

          {/* Section Indicator (Kids / Adult) */}
          {dish.section === 'kids' && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-brand-darkred text-white text-[10px] font-bold uppercase tracking-wider shadow">
              Infantil 👶
            </div>
          )}
        </div>

        {/* Dish Information */}
        <div className="flex flex-col flex-1 p-4">
          {categoryName && (
            <span className="text-[10px] font-bold tracking-widest text-brand-red uppercase mb-1">
              {categoryName}
            </span>
          )}
          <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-brand-red transition-colors duration-200 line-clamp-1">
            {dish.name}
          </h3>
          <p className="text-xs text-stone-500 mt-1.5 flex-1 line-clamp-2 leading-relaxed">
            {dish.description || 'Nenhum ingrediente especial adicionado.'}
          </p>

          {/* Bottom Card Control */}
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-stone-100">
            <span className="text-xs font-semibold text-stone-400 group-hover:text-brand-red transition-colors">
              Ver mais detalhes
            </span>
            <ChevronRight size={14} className="text-stone-450 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-64 bg-stone-100">
              {dish.image ? (
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300">
                  <span className="font-serif italic text-2xl text-stone-400">FoodSal</span>
                </div>
              )}
              {/* Close Button */}
              <button
                onClick={() => setIsDetailOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-950/50 hover:bg-stone-950/80 text-white backdrop-blur-sm shadow-md transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {categoryName && (
                    <span className="text-xs font-bold tracking-widest text-brand-red uppercase">
                      {categoryName}
                    </span>
                  )}
                  <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    {dish.name}
                  </h2>
                </div>
                <div className="text-xl font-bold text-brand-red whitespace-nowrap">
                  {formatPrice(dish.price)}
                </div>
              </div>

              <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                {dish.description || 'Prato preparado com ingredientes selecionados de alta qualidade.'}
              </p>

              {/* Action Area */}
              <div className="mt-6 pt-5 border-t border-stone-100 flex justify-end">
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="py-2.5 px-6 rounded-xl bg-brand-red hover:bg-brand-darkred text-white font-bold text-sm tracking-wide shadow-md shadow-brand-red/10 cursor-pointer active:scale-98 transition-all"
                >
                  Fechar Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

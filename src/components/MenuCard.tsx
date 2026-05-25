'use client';

import React, { useState, useEffect } from 'react';
import { Dish, CustomizationGroup } from '../lib/mockData';
import { useApp, SelectedCustomization } from '../context/AppContext';
import { X, ChevronRight, CheckCircle, Info } from 'lucide-react';

interface MenuCardProps {
  dish: Dish;
  categoryName?: string;
}

export default function MenuCard({ dish, categoryName }: MenuCardProps) {
  const { settings, addToCart } = useApp();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Customization selection state
  // key: Group ID, value: array of chosen item names
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [notes, setNotes] = useState('');
  const [currentPrice, setCurrentPrice] = useState(dish.price);
  const [errorMsg, setErrorMsg] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const formatPrice = (val: number) => {
    return `${settings.currencySymbol} ${val.toFixed(2)}`;
  };

  // Reset customizations when modal opens/closes
  useEffect(() => {
    if (isDetailOpen) {
      const initialSelections: Record<string, string[]> = {};
      if (dish.isCustomizable && dish.customizationOptions) {
        dish.customizationOptions.forEach(group => {
          // pre-select fixed options if min requirement and items match
          if (group.min === group.max && group.items.length === group.min) {
            initialSelections[group.id] = group.items.map(item => item.name);
          } else {
            initialSelections[group.id] = [];
          }
        });
      }
      setSelections(initialSelections);
      setNotes('');
      setCurrentPrice(dish.price);
      setErrorMsg('');
    }
  }, [isDetailOpen, dish]);

  // Recalculate price dynamically (sum selected items with configured prices)
  useEffect(() => {
    if (!dish.isCustomizable || !dish.customizationOptions) return;

    let extraPrice = 0;
    Object.entries(selections).forEach(([groupId, items]) => {
      const group = dish.customizationOptions?.find(g => g.id === groupId);
      if (group) {
        items.forEach(itemName => {
          const matchedItem = group.items.find(i => i.name === itemName);
          if (matchedItem && matchedItem.price) {
            extraPrice += matchedItem.price;
          }
        });
      }
    });

    setCurrentPrice(dish.price + extraPrice);
  }, [selections, dish]);

  const handleOptionToggle = (group: CustomizationGroup, itemName: string, isRadio: boolean) => {
    const currentGroupSelections = selections[group.id] || [];

    const exists = currentGroupSelections.includes(itemName);
    if (exists) {
      setSelections(prev => ({
        ...prev,
        [group.id]: currentGroupSelections.filter(n => n !== itemName)
      }));
      setErrorMsg('');
    } else {
      if (isRadio) {
        setSelections(prev => ({
          ...prev,
          [group.id]: [itemName]
        }));
        setErrorMsg('');
      } else {
        // Estritamente limitado ao limite máximo!
        if (currentGroupSelections.length >= group.max) {
          setErrorMsg(`Você pode selecionar no máximo ${group.max} opção(ões) em "${group.title}"`);
          return;
        }
        setSelections(prev => ({
          ...prev,
          [group.id]: [...currentGroupSelections, itemName]
        }));
        setErrorMsg('');
      }
    }
  };

  const handleAddToCart = () => {
    // Validate minimum required selections
    if (dish.isCustomizable && dish.customizationOptions) {
      for (const group of dish.customizationOptions) {
        const chosen = selections[group.id] || [];
        if (chosen.length < group.min) {
          setErrorMsg(`Por favor, selecione pelo menos ${group.min} opção(ões) em "${group.title}"`);
          return;
        }
      }
    }

    // Prepare customized items structure
    const finalizedCustoms: SelectedCustomization[] = [];
    if (dish.isCustomizable && dish.customizationOptions) {
      dish.customizationOptions.forEach(group => {
        const chosenNames = selections[group.id] || [];
        if (chosenNames.length > 0) {
          const itemsWithPrices = chosenNames.map(name => {
            const match = group.items.find(i => i.name === name);
            return { name, price: match?.price };
          });

          finalizedCustoms.push({
            groupTitle: group.title,
            items: itemsWithPrices
          });
        }
      });
    }

    addToCart(dish, 1, notes, finalizedCustoms, currentPrice);
    
    // Play success feedback
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setIsDetailOpen(false);
    }, 1200);
  };

  return (
    <>
      {/* Dish Card */}
      <div 
        onClick={() => setIsDetailOpen(true)}
        className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-stone-200/50 hover:border-brand-red/20 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
      >
        {/* Dish Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
          {dish.image ? (
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300">
              <span className="font-serif italic text-sm text-stone-400">FoodSal</span>
            </div>
          )}
          
          {/* Price Tag Overlay */}
          <div className="absolute bottom-2 right-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-stone-900/80 backdrop-blur-sm text-white font-bold text-xs sm:text-sm tracking-wide shadow-md">
            {formatPrice(dish.price)}
          </div>

          {/* Section Indicator */}
          {dish.isCustomizable ? (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-brand-red text-white text-[9px] font-bold uppercase tracking-wider shadow">
              Personalizável
            </div>
          ) : dish.categoryId === 'cat-kids' ? (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-brand-darkred/90 text-white text-[9px] font-bold uppercase tracking-wider shadow">
              Kids
            </div>
          ) : null}
        </div>

        {/* Dish Information */}
        <div className="flex flex-col flex-1 p-3 sm:p-4">
          {/* Top line with specs if available */}
          {dish.sizeOrWeight && (
            <div className="flex justify-end mb-1">
              <span className="text-[9px] sm:text-[10px] font-bold text-stone-450 bg-stone-100 px-1.5 py-0.5 rounded-md shrink-0">
                {dish.sizeOrWeight}
              </span>
            </div>
          )}
          {/* Fixed height and line-clamp-2 ensures perfect card symmetry for 1 or 2 line titles */}
          <h3 className="font-serif text-[13px] sm:text-base font-bold text-stone-900 group-hover:text-brand-red transition-colors duration-200 line-clamp-2 leading-snug h-10 sm:h-12 flex items-center">
            {dish.name}
          </h3>
          <p className="text-[11px] sm:text-xs text-stone-500 mt-1 flex-1 line-clamp-2 sm:line-clamp-2 leading-relaxed">
            {dish.description}
          </p>

          {/* Bottom Card Control */}
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-stone-100">
            <span className="text-[10px] sm:text-xs font-bold text-brand-red group-hover:text-brand-darkred transition-colors">
              {dish.isCustomizable ? 'Personalizar' : 'Adicionar'}
            </span>
            <ChevronRight size={12} className="text-brand-red group-hover:translate-x-0.5 transition-transform shrink-0" />
          </div>
        </div>
      </div>

      {/* Detail / Customization Modal */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-300 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-48 sm:h-56 bg-stone-100 shrink-0">
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
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-950/50 hover:bg-stone-950/80 text-white backdrop-blur-sm shadow-md transition-all cursor-pointer z-10"
              >
                <X size={20} />
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-[10px] font-bold tracking-widest text-brand-beige uppercase">
                  {categoryName}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold mt-0.5">
                  {dish.name}
                </h2>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              
              {/* Base Description */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                {dish.description}
              </p>

              {/* Customization Options Container */}
              {dish.isCustomizable && dish.customizationOptions && (
                <div className="space-y-6 pt-2 border-t border-stone-100">
                  {dish.customizationOptions.map((group) => {
                    const chosen = selections[group.id] || [];
                    const isRadio = group.min === 1 && group.max === 1;

                    return (
                      <div key={group.id} className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-150">
                        {/* Option group header */}
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xs font-bold text-stone-855 block">{group.title}</span>
                            <span className="text-[10px] text-stone-550 font-semibold block mt-0.5 leading-tight">
                              {isRadio 
                                ? `Selecione 1 opção` 
                                : `Escolha até ${group.max} opção(ões)`}
                            </span>
                            {group.min > 0 && (
                              <span className="text-[9px] text-brand-red font-bold uppercase block mt-1">
                                Obrigatório selecionar pelo menos {group.min}
                              </span>
                            )}
                          </div>
                          
                          {/* Checked Pill */}
                          <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                            chosen.length >= group.min
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {chosen.length} / {group.max} selecionado(s)
                          </div>
                        </div>

                        {/* List of custom options */}
                        <div className="space-y-2">
                          {group.items.map((item) => {
                            const isSelected = chosen.includes(item.name);
                            return (
                              <label
                                key={item.name}
                                onClick={() => handleOptionToggle(group, item.name, isRadio)}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-white border-brand-red ring-1 ring-brand-red shadow-sm'
                                    : 'bg-white border-stone-200 hover:border-stone-300'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {/* Custom Checkbox/Radio graphic */}
                                  <div className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                                    isSelected
                                      ? 'bg-brand-red border-brand-red text-white'
                                      : 'border-stone-300 bg-white'
                                  }`}>
                                    {isSelected && <span className="text-[10px] font-bold">✓</span>}
                                  </div>
                                  <span className="text-xs font-bold text-stone-800">{item.name}</span>
                                </div>

                                {item.price && (
                                  <span className="text-xs font-bold text-brand-red">
                                    + {formatPrice(item.price)}
                                  </span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Cooking notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-750 uppercase tracking-wider flex items-center gap-1.5">
                  <Info size={14} className="text-brand-red" />
                  <span>Observações (Opcional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Ponto da carne, sem salada, tirar cebola, etc."
                  rows={2}
                  maxLength={160}
                  className="w-full p-3 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-xs text-stone-855 resize-none bg-stone-50/50"
                />
              </div>

              {/* Errors notifications */}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xl font-bold animate-pulse">
                  ⚠️ {errorMsg}
                </div>
              )}

            </div>

            {/* Modal Sticky Footer */}
            <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-4 shrink-0">
              <div className="flex flex-col">
                <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Total</span>
                <span className="text-base sm:text-lg font-extrabold text-stone-900 leading-tight">
                  {formatPrice(currentPrice)}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="py-2 px-3.5 rounded-xl border border-stone-250 hover:bg-stone-100 text-stone-600 font-bold text-xs uppercase tracking-wider cursor-pointer transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={addedAnimation}
                  className={`py-2 px-4.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 transition-all duration-300 ${
                    addedAnimation 
                      ? 'bg-emerald-600 shadow-emerald-200' 
                      : 'bg-brand-red hover:bg-brand-darkred shadow-brand-red/10 cursor-pointer active:scale-98'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <CheckCircle size={14} />
                      <span>Adicionado!</span>
                    </>
                  ) : (
                    <span>Adicionar</span>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
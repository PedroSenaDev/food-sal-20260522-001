'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShoppingBag, Trash2, Plus, Minus, Send, MapPin, Hash } from 'lucide-react';

interface TrayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrayModal({ isOpen, onClose }: TrayModalProps) {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartTotal, 
    cartCount, 
    tableNumber, 
    setTableNumber, 
    settings 
  } = useApp();

  const [inputTable, setInputTable] = useState(tableNumber || '');

  if (!isOpen) return null;

  const formatPrice = (val: number) => {
    return `${settings.currencySymbol} ${val.toFixed(2)}`;
  };

  const handleTableChange = (val: string) => {
    setInputTable(val);
    setTableNumber(val || null);
  };

  const handleSendOrder = () => {
    if (cart.length === 0) return;

    // Format WhatsApp message
    const business = settings.businessName;
    const tableStr = inputTable ? `*MESA:* ${inputTable}` : '*MESA:* Não informada (Balcão/Viagem)';
    
    let itemsStr = '';
    cart.forEach(item => {
      itemsStr += `• *${item.quantity}x* ${item.dish.name} (${formatPrice(item.dish.price * item.quantity)})\n`;
      if (item.notes) {
        itemsStr += `  _Obs: ${item.notes}_\n`;
      }
    });

    const totalStr = `*TOTAL:* ${formatPrice(cartTotal)}`;
    
    const message = `${settings.welcomeMessage}\n\n` +
      `*🍴 ${business}* \n` +
      `----------------------------------\n` +
      `📍 ${tableStr}\n` +
      `----------------------------------\n` +
      `*Itens do Pedido:*\n` +
      `${itemsStr}\n` +
      `----------------------------------\n` +
      `${totalStr}\n\n` +
      `_Enviado pelo Cardápio Digital FoodSal_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${settings.whatsappNumber}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click Outside to Close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Cart Drawer */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-350 ease-out">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2 text-stone-900">
            <ShoppingBag size={20} className="text-brand-red" />
            <h2 className="font-serif text-lg font-bold">Meu Pedido</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
              {cartCount} {cartCount === 1 ? 'item' : 'itens'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Table Input Setup */}
          <div className="p-3 bg-[#F5E6D3]/40 border border-brand-red/10 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2 text-brand-darkred">
              <Hash size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Mesa atual:</span>
            </div>
            <input
              type="text"
              value={inputTable}
              onChange={(e) => handleTableChange(e.target.value)}
              placeholder="Nº da Mesa"
              className="w-24 px-3 py-1.5 text-center text-sm font-bold border border-stone-200 focus:border-brand-red rounded-xl outline-none text-stone-800 bg-white"
            />
          </div>

          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-stone-400 space-y-3">
              <ShoppingBag size={48} className="stroke-1 text-stone-300" />
              <p className="text-sm font-sans font-medium text-stone-500">Seu pedido está vazio.</p>
              <button 
                onClick={onClose}
                className="text-xs font-bold text-brand-red underline hover:text-brand-darkred cursor-pointer"
              >
                Voltar para o cardápio
              </button>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {cart.map(item => (
                <div key={item.dish.id} className="py-3 flex gap-3 first:pt-0 last:pb-0">
                  {/* Item Image */}
                  <div className="h-16 w-16 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                    <img
                      src={item.dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80'}
                      alt={item.dish.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-stone-900 truncate">
                        {item.dish.name}
                      </h4>
                      <span className="text-sm font-bold text-brand-red whitespace-nowrap ml-2">
                        {formatPrice(item.dish.price * item.quantity)}
                      </span>
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-stone-500 italic mt-0.5 bg-stone-50 p-1.5 rounded-lg border border-stone-100 line-clamp-1">
                        &ldquo;{item.notes}&rdquo;
                      </p>
                    )}

                    {/* Quantity controllers */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-2 bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                        <button
                          onClick={() => updateCartQuantity(item.dish.id, item.quantity - 1)}
                          className="p-1 rounded text-stone-600 hover:bg-white active:scale-95 cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-6 text-center text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.dish.id, item.quantity + 1)}
                          className="p-1 rounded text-stone-600 hover:bg-white active:scale-95 cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.dish.id)}
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remover item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-stone-100 bg-stone-50 space-y-4">
            <div className="flex justify-between items-center text-stone-900">
              <span className="text-sm font-medium">Subtotal</span>
              <span className="text-lg font-bold text-stone-900">{formatPrice(cartTotal)}</span>
            </div>
            
            <button
              onClick={handleSendOrder}
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#128C7E] active:scale-98 transition-all duration-200 text-white font-bold text-sm tracking-wide rounded-xl shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={16} />
              <span>Enviar para o WhatsApp</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

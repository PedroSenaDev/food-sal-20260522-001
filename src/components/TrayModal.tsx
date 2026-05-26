'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShoppingBag, Trash2, Plus, Minus, Send, ArrowLeft, User, Phone, MapPin, CreditCard, DollarSign } from 'lucide-react';

interface TrayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep = 'cart' | 'details';
type DeliveryType = 'mesa' | 'balcao' | 'delivery';

export default function TrayModal({ isOpen, onClose }: TrayModalProps) {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartTotal, 
    cartCount, 
    tableNumber, 
    settings,
    createOrder,
    clearCart
  } = useApp();

  const [step, setStep] = useState<CheckoutStep>('cart');
  
  // Form States
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('mesa');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [changeFor, setChangeFor] = useState('');
  const [formError, setFormError] = useState('');

  // Reset steps when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('cart');
      setFormError('');
      if (tableNumber) {
        setDeliveryType('mesa');
      } else {
        setDeliveryType('balcao');
      }
    }
  }, [isOpen, tableNumber]);

  if (!isOpen) return null;

  const formatPrice = (val: number) => {
    return `${settings.currencySymbol} ${val.toFixed(2)}`;
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      setFormError('Por favor, informe seu nome completo.');
      return false;
    }
    if (!contact.trim()) {
      setFormError('Por favor, informe um contato de WhatsApp válido.');
      return false;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      setFormError('Por favor, preencha o endereço completo para entrega.');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleSendOrder = async () => {
    if (!validateForm()) return;
    if (cart.length === 0) return;

    // 1. Save REAL order history in database/localStorage
    const orderItems = cart.map(item => {
      const priceToUse = item.customPrice !== undefined ? item.customPrice : item.dish.price;
      
      let customsSummary = '';
      if (item.customizations && item.customizations.length > 0) {
        customsSummary = item.customizations.map(g => 
          `${g.groupTitle}: ${g.items.map(it => it.name).join(', ')}`
        ).join(' | ');
      }

      return {
        name: item.dish.name,
        quantity: item.quantity,
        price: priceToUse,
        notes: item.notes || undefined,
        customizations: customsSummary || undefined
      };
    });

    const deliveryMethodLabel = 
      deliveryType === 'mesa' ? `Mesa ${tableNumber || 'Não informada'}` :
      deliveryType === 'delivery' ? 'Delivery (Entrega)' : 'Retirada no Balcão';

    try {
      await createOrder({
        tableNumber: tableNumber || 'Balcão',
        items: orderItems,
        total: cartTotal
      });
    } catch (e) {
      console.error('Failed to log order in history database', e);
    }

    // 2. Format WhatsApp message
    const business = settings.businessName;
    
    let itemsStr = '';
    cart.forEach(item => {
      const priceToUse = item.customPrice !== undefined ? item.customPrice : item.dish.price;
      itemsStr += `• *${item.quantity}x* ${item.dish.name} (${formatPrice(priceToUse * item.quantity)})\n`;
      
      if (item.customizations && item.customizations.length > 0) {
        item.customizations.forEach(g => {
          const names = g.items.map(it => it.name + (it.price ? ` (+${formatPrice(it.price)})` : '')).join(', ');
          itemsStr += `  _> ${g.groupTitle}:_ ${names}\n`;
        });
      }

      if (item.notes) {
        itemsStr += `  _Obs: ${item.notes}_\n`;
      }
      itemsStr += `\n`;
    });

    let detailsStr = `*👤 CLIENTE:* ${fullName}\n` +
                     `*📞 CONTATO:* ${contact}\n` +
                     `*📍 RECEBIMENTO:* ${deliveryMethodLabel}\n`;

    if (deliveryType === 'delivery') {
      detailsStr += `*🏠 ENDEREÇO:* ${address}\n`;
    }

    detailsStr += `*💳 PAGAMENTO:* ${paymentMethod}\n`;
    if (paymentMethod === 'Dinheiro' && changeFor.trim()) {
      detailsStr += `*💵 TROCO PARA:* ${formatPrice(parseFloat(changeFor) || 0)}\n`;
    }

    const totalStr = `*TOTAL:* ${formatPrice(cartTotal)}`;
    
    const message = `${settings.welcomeMessage}\n\n` +
      `*🍴 ${business}* \n` +
      `----------------------------------\n` +
      `${detailsStr}` +
      `----------------------------------\n` +
      `*Itens do Pedido:*\n\n` +
      `${itemsStr}` +
      `----------------------------------\n` +
      `${totalStr}\n\n` +
      `_Enviado pelo Cardápio Digital FoodSal_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${settings.whatsappNumber}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click Outside to Close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md h-full bg-[#F5E6D3] md:bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-350 ease-out">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200/40 flex items-center justify-between bg-white/85 backdrop-blur shrink-0">
          {step === 'cart' ? (
            <div className="flex items-center gap-2 text-stone-900">
              <ShoppingBag size={18} className="text-brand-red" />
              <h2 className="font-serif text-base font-extrabold tracking-wide">Meu Pedido</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-red/5 text-brand-red">
                {cartCount} {cartCount === 1 ? 'item' : 'itens'}
              </span>
            </div>
          ) : (
            <button
              onClick={() => setStep('cart')}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-brand-red cursor-pointer transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Voltar para sacola</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: CART REVISION */}
        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-stone-400 space-y-3">
                  <ShoppingBag size={40} className="stroke-1 text-stone-300" />
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Sua sacola está vazia</p>
                  <button 
                    onClick={onClose}
                    className="text-xs font-bold text-brand-red underline hover:text-brand-darkred cursor-pointer uppercase tracking-wider"
                  >
                    Ver pratos no cardápio
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {cart.map(item => {
                    const activePrice = item.customPrice !== undefined ? item.customPrice : item.dish.price;
                    return (
                      <div key={item.id} className="py-4 flex gap-3 first:pt-0 last:pb-0">
                        {/* Item Image */}
                        <div className="h-14 w-14 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200/50">
                          <img
                            src={item.dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80'}
                            alt={item.dish.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 flex flex-col min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold text-stone-900 truncate">
                              {item.dish.name}
                            </h4>
                            <span className="text-xs font-extrabold text-brand-red whitespace-nowrap ml-2">
                              {formatPrice(activePrice * item.quantity)}
                            </span>
                          </div>

                          {/* Selected Customizations */}
                          {item.customizations && item.customizations.length > 0 && (
                            <div className="mt-1 bg-stone-50 rounded-lg p-2 border border-stone-100 space-y-0.5 text-[10px] text-stone-500">
                              {item.customizations.map((g, idx) => (
                                <div key={idx} className="leading-tight">
                                  <span className="font-bold text-stone-400">{g.groupTitle}:</span>{' '}
                                  {g.items.map(it => it.name + (it.price ? ` (+${formatPrice(it.price)})` : '')).join(', ')}
                                </div>
                              ))}
                            </div>
                          )}

                          {item.notes && (
                            <p className="text-[10px] text-stone-400 italic mt-1 bg-stone-50 p-1.5 rounded-lg border border-stone-100">
                              &ldquo;{item.notes}&rdquo;
                            </p>
                          )}

                          {/* Quantity controllers */}
                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center gap-1.5 bg-stone-50 rounded-lg p-0.5 border border-stone-200">
                              <button
                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                className="p-1 rounded text-stone-500 hover:bg-white active:scale-90 cursor-pointer"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="text-[11px] font-bold w-5 text-center text-stone-700">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                className="p-1 rounded text-stone-500 hover:bg-white active:scale-90 cursor-pointer"
                              >
                                <Plus size={10} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-stone-400 hover:text-red-650 transition-colors cursor-pointer"
                              title="Remover item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer with checkout action */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-stone-200/40 bg-white shrink-0 space-y-4">
                <div className="flex justify-between items-center text-stone-900">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Subtotal</span>
                  <span className="text-base font-extrabold text-stone-950">{formatPrice(cartTotal)}</span>
                </div>
                
                <button
                  onClick={() => setStep('details')}
                  className="w-full py-3.5 px-4 bg-brand-red hover:bg-brand-darkred active:scale-98 transition-all duration-250 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-brand-red/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Identificar & Finalizar</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: DETAILS FORM */}
        {step === 'details' && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              {/* Form Section Header */}
              <div>
                <h3 className="font-serif text-sm font-extrabold text-stone-900 uppercase tracking-wider">Identificação</h3>
                <p className="text-[11px] text-stone-450 mt-0.5">Preencha abaixo para preparar o seu envio.</p>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest flex items-center gap-1">
                    <User size={12} className="text-brand-red" />
                    <span>Nome Completo</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Como deseja ser chamado?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red bg-white outline-none text-xs text-stone-800 font-semibold"
                  />
                </div>

                {/* WhatsApp Contact */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest flex items-center gap-1">
                    <Phone size={12} className="text-brand-red" />
                    <span>WhatsApp de contato</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Ex: (11) 99999-9999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red bg-white outline-none text-xs text-stone-800 font-semibold"
                  />
                </div>

                <hr className="border-stone-200/50" />

                {/* Delivery Type selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest flex items-center gap-1">
                    <MapPin size={12} className="text-brand-red" />
                    <span>Forma de Entrega</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {tableNumber && (
                      <button
                        type="button"
                        onClick={() => setDeliveryType('mesa')}
                        className={`py-2 px-1 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          deliveryType === 'mesa'
                            ? 'bg-brand-red text-white border-brand-red shadow-sm'
                            : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        Mesa {tableNumber}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setDeliveryType('balcao')}
                      className={`py-2 px-1 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        deliveryType === 'balcao'
                          ? 'bg-brand-red text-white border-brand-red shadow-sm'
                          : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      Balcão
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`py-2 px-1 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        deliveryType === 'delivery'
                          ? 'bg-brand-red text-white border-brand-red shadow-sm'
                          : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      Em Casa
                    </button>
                  </div>
                </div>

                {/* Dynamic Address Field for Delivery */}
                {deliveryType === 'delivery' && (
                  <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                    <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">
                      Endereço Completo para Entrega
                    </label>
                    <textarea
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Rua, número, bairro, complemento..."
                      rows={2}
                      className="w-full p-3 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red bg-white outline-none text-xs text-stone-800 font-semibold resize-none"
                    />
                  </div>
                )}

                <hr className="border-stone-200/50" />

                {/* Payment Methods */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest flex items-center gap-1">
                    <CreditCard size={12} className="text-brand-red" />
                    <span>Forma de Pagamento</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Pix', 'Crédito', 'Débito', 'Dinheiro'].map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2.5 px-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          paymentMethod === method
                            ? 'bg-stone-900 text-white border-stone-950 shadow-sm'
                            : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {method === 'Dinheiro' && <DollarSign size={11} />}
                        <span>{method}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Change needed field for Cash */}
                {paymentMethod === 'Dinheiro' && (
                  <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                    <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">
                      Precisa de troco? (Informe para quanto)
                    </label>
                    <input
                      type="number"
                      value={changeFor}
                      onChange={(e) => setChangeFor(e.target.value)}
                      placeholder="Ex: 50.00"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:border-brand-red bg-white outline-none text-xs text-stone-800 font-semibold"
                    />
                  </div>
                )}

              </div>

              {/* Form Validation Error Message */}
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700 font-bold animate-pulse">
                  ⚠️ {formError}
                </div>
              )}

            </div>

            {/* Sticky Footer: Order Final send */}
            <div className="p-5 border-t border-stone-200/40 bg-white shrink-0 space-y-3">
              <div className="flex justify-between items-center text-stone-900 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total a Pagar</span>
                <span className="text-base font-extrabold text-stone-950">{formatPrice(cartTotal)}</span>
              </div>

              <button
                onClick={handleSendOrder}
                className="w-full py-4 px-4 bg-[#25D366] hover:bg-[#128C7E] active:scale-98 transition-all duration-200 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={14} />
                <span>Enviar para o WhatsApp</span>
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
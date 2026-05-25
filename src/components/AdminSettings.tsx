'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Save, CheckCircle } from 'lucide-react';

export default function AdminSettings() {
  const { settings, updateSettings } = useApp();

  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [welcomeMessage, setWelcomeMessage] = useState(settings.welcomeMessage);
  const [address, setAddress] = useState(settings.address);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);

  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      whatsappNumber,
      businessName,
      welcomeMessage,
      address,
      currencySymbol
    });
    
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Settings Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <Settings className="text-brand-red" size={22} />
              Identidade & Dados do Cardápio
            </h2>
            <p className="text-stone-500 text-xs mt-0.5">
              Personalize o cabeçalho, os textos de envio do WhatsApp e o endereço do restaurante.
            </p>
          </div>
          {showSaveSuccess && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200">
              <CheckCircle size={14} />
              <span>Salvo!</span>
            </span>
          )}
        </div>

        {/* Inputs */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Business Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Nome do Estabelecimento / Cardápio
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex: FoodSal Gourmet"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-800 bg-white"
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                WhatsApp de Recebimento (DDI + DDD)
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Ex: 5511999999999"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-800 bg-white font-mono"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Insira apenas números com o código do país (ex: 55 para o Brasil).
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Currency Symbol */}
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Símbolo de Moeda
              </label>
              <input
                type="text"
                required
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                placeholder="Ex: R$"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-800 bg-white font-bold"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Endereço de Exibição do Estabelecimento
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Av. Paulista, 1000 - São Paulo, SP"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-800 bg-white"
              />
            </div>
          </div>

          {/* Welcome Message */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Mensagem de Saudação enviada ao WhatsApp
            </label>
            <textarea
              required
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="Ex: Olá! Gostaria de fazer o seguinte pedido do cardápio digital:"
              rows={3}
              className="w-full p-3 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-800 resize-none placeholder-stone-400 bg-white"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-6 pt-5 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            className="py-3 px-6 rounded-xl bg-brand-red hover:bg-brand-darkred text-white font-bold text-sm tracking-wide shadow-md shadow-brand-red/10 cursor-pointer flex items-center gap-2"
          >
            <Save size={16} />
            <span>Salvar Alterações</span>
          </button>
        </div>

      </form>

    </div>
  );
}
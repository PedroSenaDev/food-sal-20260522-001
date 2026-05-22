'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Save, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import { resetLocalDatabase } from '../lib/db';

export default function AdminSettings() {
  const { settings, updateSettings } = useApp();

  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [welcomeMessage, setWelcomeMessage] = useState(settings.welcomeMessage);
  const [address, setAddress] = useState(settings.address);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
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

  const handleResetDatabase = () => {
    resetLocalDatabase();
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Settings Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
          <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
            <Settings className="text-brand-red" size={22} />
            Configurações Gerais
          </h2>
          {showSaveSuccess && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200">
              <CheckCircle size={14} />
              <span>Salvo com sucesso!</span>
            </span>
          )}
        </div>

        {/* Inputs */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Business Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Nome do Estabelecimento
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex: FoodSal Gourmet"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-805 bg-white"
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                WhatsApp de Recebimento (DDI + DDD + Número)
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Ex: 5511999999999"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-805 bg-white font-mono"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Insira apenas números com o código do país (55 para Brasil). Ex: 5511999999999.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Currency Symbol */}
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Símbolo Monetário
              </label>
              <input
                type="text"
                required
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                placeholder="Ex: R$, $"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-805 bg-white font-bold"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Endereço do Restaurante
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Av. Paulista, 1000 - São Paulo, SP"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-855 bg-white"
              />
            </div>
          </div>

          {/* Welcome Message */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Mensagem de Saudação do WhatsApp
            </label>
            <textarea
              required
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="Ex: Olá! Gostaria de fazer o seguinte pedido do cardápio digital:"
              rows={3}
              className="w-full p-3 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-855 resize-none placeholder-stone-400 bg-white"
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
            <span>Salvar Configurações</span>
          </button>
        </div>

      </form>

      {/* Danger Zone Card */}
      <div className="bg-red-50 rounded-3xl p-6 border border-red-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-red-800 flex items-center gap-2">
            <AlertTriangle size={18} />
            Zona de Perigo
          </h3>
          <p className="text-red-600 text-xs mt-1 leading-relaxed">
            Ações abaixo alteram as tabelas e dados internos. Tenha cuidado ao prosseguir.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-2xl border border-red-100">
          <div>
            <span className="text-xs font-bold text-stone-800 block">Restaurar Banco de Dados</span>
            <span className="text-[10px] text-stone-500 leading-relaxed block mt-0.5">
              Isso apagará todas as suas alterações e reinicializará o cardápio com os pratos e categorias originais do FoodSal.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="py-2.5 px-4 rounded-xl border border-red-300 hover:bg-red-50 text-red-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <RotateCcw size={14} />
            <span>Restaurar Menu</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
              <AlertTriangle size={24} />
            </div>
            
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Restaurar Cardápio?</h3>
            <p className="text-stone-500 text-xs leading-relaxed mb-6">
              Esta ação excluirá permanentemente todos os pratos, categorias e configurações atuais e restaurará os valores padrão. O site será recarregado.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-2.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 font-semibold text-xs tracking-wider uppercase cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetDatabase}
                className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider uppercase shadow-md cursor-pointer animate-pulse"
              >
                Restaurar Agora
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

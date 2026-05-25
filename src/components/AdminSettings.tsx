'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Save, CheckCircle, Store, MessageSquare, Info, Smartphone } from 'lucide-react';

export default function AdminSettings() {
  const { settings, updateSettings } = useApp();

  // Estados locais dos campos de Configurações
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [address, setAddress] = useState(settings.address);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [welcomeMessage, setWelcomeMessage] = useState(settings.welcomeMessage);

  // Estados dos novos campos do Menu Lateral
  const [welcomeText, setWelcomeText] = useState(settings.welcomeText || '');
  const [businessHours, setBusinessHours] = useState(settings.businessHours || '');
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl || '');

  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      businessName,
      address,
      currencySymbol,
      whatsappNumber,
      welcomeMessage,
      welcomeText,
      businessHours,
      instagramUrl
    });
    
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Bloco 1: Identidade Geral do Restaurante */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-4 mb-5">
            <Store className="text-brand-red" size={20} />
            <h3 className="font-serif text-lg font-bold text-stone-900">Identidade Geral</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Nome do Estabelecimento
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

            <div>
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
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Endereço Físico do Restaurante
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

        {/* Bloco 2: Integração WhatsApp (Envio de Pedidos) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-4 mb-5">
            <Smartphone className="text-brand-red" size={20} />
            <h3 className="font-serif text-lg font-bold text-stone-900">Pedidos no WhatsApp</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Número do WhatsApp (DDI + DDD)
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
                Insira apenas números (ex: 5511...).
              </span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Mensagem de Saudação do WhatsApp
              </label>
              <textarea
                required
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="Olá! Gostaria de fazer o seguinte pedido do cardápio digital:"
                rows={2}
                className="w-full p-3 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-800 resize-none bg-white placeholder-stone-400"
              />
            </div>
          </div>
        </div>

        {/* Bloco 3: Informações do Menu Lateral Informativo */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-4 mb-5">
            <Info className="text-brand-red" size={20} />
            <h3 className="font-serif text-lg font-bold text-stone-900">Menu Lateral (Sobre Nós)</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Texto de Boas-vindas / História
              </label>
              <textarea
                required
                value={welcomeText}
                onChange={(e) => setWelcomeText(e.target.value)}
                placeholder="Preparamos cada prato com ingredientes selecionados e o máximo carinho para proporcionar uma experiência memorável..."
                rows={3}
                className="w-full p-3 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-800 resize-none bg-white placeholder-stone-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Horário de Atendimento (Formatado)
                </label>
                <textarea
                  required
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  placeholder="Quarta a Segunda: 11h30 às 23h&#10;Terça-feira: Fechado"
                  rows={2}
                  className="w-full p-3 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-800 font-sans resize-none bg-white placeholder-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Link do Perfil no Instagram
                </label>
                <input
                  type="text"
                  required
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="Ex: https://instagram.com/seudominio"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-800 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Save Bar */}
        <div className="p-4 md:p-6 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-4">
          <div>
            {showSaveSuccess ? (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
                <CheckCircle size={14} />
                <span>Salvo no Banco de Dados!</span>
              </span>
            ) : (
              <span className="text-xs text-stone-400 font-semibold">
                Altere os campos e clique para atualizar todo o cardápio em tempo real.
              </span>
            )}
          </div>

          <button
            type="submit"
            className="py-3 px-6 rounded-xl bg-brand-red hover:bg-brand-darkred text-white font-bold text-sm tracking-wide shadow-md shadow-brand-red/10 cursor-pointer flex items-center gap-2 shrink-0 transition-colors"
          >
            <Save size={16} />
            <span>Salvar Alterações</span>
          </button>
        </div>

      </form>

    </div>
  );
}
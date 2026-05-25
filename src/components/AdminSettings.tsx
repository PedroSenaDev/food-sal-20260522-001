'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Save, CheckCircle, Info } from 'lucide-react';

export default function AdminSettings() {
  const { settings, updateSettings } = useApp();

  // Estados locais baseados estritamente na identidade do Menu Lateral Informativo
  const [welcomeTitle, setWelcomeTitle] = useState(settings.welcomeTitle || '');
  const [welcomeText, setWelcomeText] = useState(settings.welcomeText || '');
  const [address, setAddress] = useState(settings.address);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [businessHours, setBusinessHours] = useState(settings.businessHours || '');
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl || '');

  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Atualiza todas as configurações de forma persistente no banco de dados / localStorage
    await updateSettings({
      businessName: settings.businessName, // Mantém o nome atual sem precisar de campo no form
      welcomeTitle,
      welcomeText,
      address,
      whatsappNumber,
      businessHours,
      instagramUrl,
      // Mantém fallbacks para manter integridade dos pedidos/moeda do app
      currencySymbol: settings.currencySymbol || 'R$',
      welcomeMessage: settings.welcomeMessage || 'Olá! Gostaria de fazer o seguinte pedido do cardápio digital:'
    });
    
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Dynamic Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-150">
          <div className="flex items-center gap-2">
            <Info className="text-brand-red" size={22} />
            <div>
              <h2 className="font-serif text-lg md:text-xl font-bold text-stone-900">
                Menu Lateral Informativo (Sobre Nós)
              </h2>
              <p className="text-stone-500 text-xs mt-0.5">
                Personalize totalmente os textos e contatos que aparecem para seus clientes na barra lateral.
              </p>
            </div>
          </div>
          {showSaveSuccess && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
              <CheckCircle size={14} />
              <span>Salvo com sucesso!</span>
            </span>
          )}
        </div>

        {/* Inputs Grid */}
        <div className="space-y-5">
          
          {/* Título do Texto de Boas-vindas */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Título do Texto de Boas-vindas
            </label>
            <input
              type="text"
              required
              value={welcomeTitle}
              onChange={(e) => setWelcomeTitle(e.target.value)}
              placeholder="Ex: Seja bem-vindo ao FoodSal!"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-800 bg-white font-semibold"
            />
          </div>

          {/* Texto de Boas-vindas / História */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Texto de Boas-vindas / Descrição do Restaurante
            </label>
            <textarea
              required
              value={welcomeText}
              onChange={(e) => setWelcomeText(e.target.value)}
              placeholder="Preparamos cada prato com ingredientes selecionados e o máximo carinho para proporcionar uma experiência memorável..."
              rows={4}
              className="w-full p-3 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-800 resize-none bg-white placeholder-stone-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Endereço */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Endereço Físico
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

            {/* Contato / WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Contato / WhatsApp de Atendimento
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
                Insira apenas números (com DDI e DDD, ex: 5511999999999).
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Horário de Atendimento */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Horário de Atendimento (Formatado)
              </label>
              <textarea
                required
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                placeholder="Quarta a Segunda: 11h30 às 23h&#10;Terça-feira: Fechado"
                rows={3}
                className="w-full p-3 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-800 font-sans resize-none bg-white placeholder-stone-400"
              />
            </div>

            {/* Instagram Link */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Link do Instagram
              </label>
              <input
                type="text"
                required
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="Ex: https://instagram.com/seudominio"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-800 bg-white"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Insira o link completo do perfil para o botão funcionar perfeitamente.
              </span>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="pt-5 border-t border-stone-150 flex justify-between items-center gap-4">
          <span className="text-xs text-stone-400 font-medium">
            Toda e qualquer alteração neste formulário será persistida e aplicada instantaneamente no menu do cliente.
          </span>
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
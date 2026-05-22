'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Utensils, 
  FolderTree, 
  Eye, 
  TrendingUp, 
  ToggleLeft, 
  ShoppingBag 
} from 'lucide-react';

export default function DashboardStats() {
  const { dishes, categories, settings } = useApp();

  const totalDishes = dishes.length;
  const activeDishes = dishes.filter(d => d.active).length;
  const inactiveDishes = totalDishes - activeDishes;
  const totalCategories = categories.length;

  // Mock numbers for analytics representation
  const mockVisits = 452;
  const mockOrdersSent = 89;
  const mockConversionRate = ((mockOrdersSent / mockVisits) * 100).toFixed(1);

  const stats = [
    { 
      label: 'Total de Pratos', 
      value: totalDishes, 
      sub: `${activeDishes} ativos / ${inactiveDishes} inativos`, 
      icon: Utensils, 
      color: 'bg-brand-red/10 text-brand-red' 
    },
    { 
      label: 'Categorias', 
      value: totalCategories, 
      sub: `${categories.filter(c => c.section === 'adult').length} adult / ${categories.filter(c => c.section === 'kids').length} infantil`, 
      icon: FolderTree, 
      color: 'bg-amber-100 text-amber-800' 
    },
    { 
      label: 'Visitas ao Cardápio', 
      value: mockVisits, 
      sub: 'Simuladas (Últimos 7 dias)', 
      icon: Eye, 
      color: 'bg-blue-100 text-blue-800' 
    },
    { 
      label: 'Pedidos pelo WhatsApp', 
      value: mockOrdersSent, 
      sub: `Taxa de conversão: ${mockConversionRate}%`, 
      icon: ShoppingBag, 
      color: 'bg-emerald-100 text-emerald-800' 
    },
  ];

  // Mock recent orders list for admin feed
  const mockRecentOrders = [
    { id: '1024', mesa: '04', itens: '2x Filé à Parmigiana, 1x Batata Frita', total: 104.00, hora: 'Há 12 min' },
    { id: '1023', mesa: '12', itens: '1x Carbonara, 1x Mix de Folhas com Frutas', total: 60.00, hora: 'Há 25 min' },
    { id: '1022', mesa: 'Balcão', itens: '1x Carne de Sol Acebolada, 2x Arroz Biro Biro', total: 82.00, hora: 'Há 1 hora' },
    { id: '1021', mesa: '02', itens: '1x Nugget (Infantil), 1x Melancia, 1x Suco de Laranja', total: 27.00, hora: 'Há 2 horas' },
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900">
            Olá, Administrador!
          </h2>
          <p className="text-stone-500 mt-1 text-sm md:text-base leading-relaxed">
            Bem-vindo ao painel do seu cardápio digital. Aqui você gerencia pratos, categorias e QR codes.
          </p>
        </div>
        
        <div className="flex gap-3 shrink-0">
          <div className="bg-brand-red text-white py-3 px-5 rounded-2xl shadow-md flex items-center gap-2">
            <TrendingUp size={20} />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold tracking-wider text-red-100">Status do Menu</div>
              <div className="text-sm font-bold">ONLINE & INTEGRADO</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between gap-4"
            >
              <div>
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{stat.label}</span>
                <h3 className="text-3xl font-bold text-stone-900 mt-2 font-serif">{stat.value}</h3>
                <span className="text-xs text-stone-400 block mt-1.5 font-medium">{stat.sub}</span>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} shrink-0`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Row details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Simulated Orders Feed */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm lg:col-span-2">
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
            <ShoppingBag size={18} className="text-brand-red" />
            Últimos Pedidos Recebidos (Mock)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 font-semibold">
                  <th className="pb-3 text-xs uppercase tracking-wider">Mesa</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Itens</th>
                  <th className="pb-3 text-xs uppercase tracking-wider text-right">Total</th>
                  <th className="pb-3 text-xs uppercase tracking-wider text-right">Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {mockRecentOrders.map(order => (
                  <tr key={order.id} className="text-stone-700 hover:bg-stone-50/50">
                    <td className="py-3.5">
                      <span className="font-bold text-brand-darkred bg-brand-red/5 px-2.5 py-1 rounded-lg text-xs">
                        {order.mesa === 'Balcão' ? order.mesa : `Mesa ${order.mesa}`}
                      </span>
                    </td>
                    <td className="py-3.5 font-medium truncate max-w-xs">{order.itens}</td>
                    <td className="py-3.5 text-right font-bold text-stone-950">
                      {settings.currencySymbol} {order.total.toFixed(2)}
                    </td>
                    <td className="py-3.5 text-right text-xs text-stone-400 font-medium">{order.hora}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Configurations summary */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <ToggleLeft size={18} className="text-brand-red" />
            Configuração Rápida
          </h3>
          
          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Nome da Casa:</span>
              <span className="font-bold text-stone-800">{settings.businessName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">WhatsApp:</span>
              <span className="font-bold text-stone-800">{settings.whatsappNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Moeda:</span>
              <span className="font-bold text-stone-800">{settings.currencySymbol} (BRL)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Supabase:</span>
              <span className="font-semibold text-stone-800">Local (Fallbacks ativos)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Cloudinary:</span>
              <span className="font-semibold text-stone-800">Simulador Base64</span>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-[10px] text-stone-400 bg-stone-50 p-2.5 rounded-lg leading-relaxed font-sans">
              ℹ️ O sistema está rodando em modo dual. Para conectar ao seu próprio banco de dados, insira as credenciais no arquivo <code>.env.local</code>.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

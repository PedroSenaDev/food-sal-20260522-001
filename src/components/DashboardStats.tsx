'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Utensils, 
  FolderTree, 
  TrendingUp, 
  ToggleLeft, 
  ShoppingBag,
  DollarSign,
  ClipboardList
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/db';

export default function DashboardStats() {
  const { dishes, categories, settings, orders } = useApp();

  const totalDishes = dishes.length;
  const activeDishes = dishes.filter(d => d.active).length;
  const inactiveDishes = totalDishes - activeDishes;
  const totalCategories = categories.length;

  // Calculando faturamento e volume real de vendas do banco de dados
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageTicket = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  const stats = [
    { 
      label: 'Faturamento Total (Real)', 
      value: `${settings.currencySymbol} ${totalRevenue.toFixed(2)}`, 
      sub: `Média de ${settings.currencySymbol} ${averageTicket.toFixed(2)} por pedido`, 
      icon: DollarSign, 
      color: 'bg-emerald-100 text-emerald-800' 
    },
    { 
      label: 'Pedidos Recebidos', 
      value: totalOrdersCount, 
      sub: 'Total histórico gravado', 
      icon: ShoppingBag, 
      color: 'bg-blue-100 text-blue-800' 
    },
    { 
      label: 'Total de Pratos', 
      value: totalDishes, 
      sub: `${activeDishes} ativos / ${inactiveDishes} inativos`, 
      icon: Utensils, 
      color: 'bg-brand-red/10 text-brand-red' 
    },
    { 
      label: 'Categorias no Menu', 
      value: totalCategories, 
      sub: `${categories.filter(c => c.section === 'adult').length} adult / ${categories.filter(c => c.section === 'kids').length} infantil`, 
      icon: FolderTree, 
      color: 'bg-amber-100 text-amber-800' 
    },
  ];

  // Formata o tempo que passou desde a criação do pedido
  const formatTimeAgo = (isoString: string) => {
    try {
      const orderDate = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - orderDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Agora mesmo';
      if (diffMins < 60) return `Há ${diffMins} min`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
      
      return orderDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    } catch (e) {
      return 'Recentemente';
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900">
            Olá, Administrador!
          </h2>
          <p className="text-stone-500 mt-1 text-sm md:text-base leading-relaxed">
            Bem-vindo ao painel integrado do seu cardápio digital. Todas as estatísticas e comandas abaixo representam dados reais do seu negócio.
          </p>
        </div>
        
        <div className="flex gap-3 shrink-0">
          <div className="bg-brand-red text-white py-3 px-5 rounded-2xl shadow-md flex items-center gap-2">
            <TrendingUp size={20} />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold tracking-wider text-red-100">Status do Banco</div>
              <div className="text-sm font-bold uppercase">
                {isSupabaseConfigured ? 'Supabase Conectado' : 'Local Ativo'}
              </div>
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
                <h3 className="text-2xl font-bold text-stone-900 mt-2 font-serif">{stat.value}</h3>
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
        
        {/* Real Orders History */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm lg:col-span-2">
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-4 flex items-center gap-2 border-b border-stone-100 pb-3">
            <ClipboardList size={18} className="text-brand-red" />
            Últimos Pedidos Recebidos
          </h3>
          
          {orders.length === 0 ? (
            <div className="py-12 text-center text-stone-400">
              <ShoppingBag size={36} className="mx-auto text-stone-300 stroke-1 mb-2" />
              <p className="text-sm font-medium">Nenhum pedido recebido ainda.</p>
              <p className="text-xs text-stone-400 mt-1">Os pedidos feitos no site aparecerão aqui em tempo real.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-stone-150 text-stone-400 font-semibold">
                    <th className="pb-3 text-xs uppercase tracking-wider">Comanda</th>
                    <th className="pb-3 text-xs uppercase tracking-wider">Mesa</th>
                    <th className="pb-3 text-xs uppercase tracking-wider">Itens</th>
                    <th className="pb-3 text-xs uppercase tracking-wider text-right">Total</th>
                    <th className="pb-3 text-xs uppercase tracking-wider text-right">Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {orders.slice(0, 10).map(order => {
                    const itemsSummary = order.items.map(it => `${it.quantity}x ${it.name}`).join(', ');
                    return (
                      <tr key={order.id} className="text-stone-700 hover:bg-stone-50/50">
                        <td className="py-3.5 font-mono text-xs text-stone-500 font-bold">
                          #{order.id}
                        </td>
                        <td className="py-3.5">
                          <span className="font-bold text-brand-darkred bg-brand-red/5 px-2.5 py-1 rounded-lg text-xs">
                            {order.tableNumber === 'Balcão' ? order.tableNumber : `Mesa ${order.tableNumber}`}
                          </span>
                        </td>
                        <td className="py-3.5 font-medium truncate max-w-[200px]" title={itemsSummary}>
                          {itemsSummary}
                        </td>
                        <td className="py-3.5 text-right font-bold text-stone-950">
                          {settings.currencySymbol} {order.total.toFixed(2)}
                        </td>
                        <td className="py-3.5 text-right text-xs text-stone-400 font-medium whitespace-nowrap">
                          {formatTimeAgo(order.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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
              <span className="text-stone-500 font-medium">Sincronização:</span>
              <span className={`font-bold ${isSupabaseConfigured ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isSupabaseConfigured ? 'Supabase Ativo' : 'Local Ativo'}
              </span>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-[10px] text-stone-400 bg-stone-50 p-2.5 rounded-lg leading-relaxed font-sans">
              ℹ️ O cardápio digital está operando de forma 100% dinâmica. Os faturamentos e tickets representam os dados das comandas reais finalizadas pelos clientes.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
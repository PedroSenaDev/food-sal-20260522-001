'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AdminLayout from '../../components/AdminLayout';
import CategoryCrud from '../../components/CategoryCrud';
import DishCrud from '../../components/DishCrud';
import AdminSettings from '../../components/AdminSettings';
import { Lock, ArrowRight, ShieldAlert, Key } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { isAdminLoggedIn, loginAdmin, settings } = useApp();
  const [activeTab, setActiveTab] = useState('categories');
  
  // Login states
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = loginAdmin(password);
    if (!success) {
      setError('Senha incorreta! Dica: use "admin123" ou "foodsal2026"');
    }
  };

  // Render active tab panel
  const renderContent = () => {
    switch (activeTab) {
      case 'categories':
        return <CategoryCrud />;
      case 'dishes':
        return <DishCrud />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <CategoryCrud />;
    }
  };

  // 1. RENDER LOGIN SCREEN (IF NOT AUTHENTICATED)
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F5E6D3] flex flex-col justify-center items-center px-4 font-sans select-none">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="text-xs font-bold text-stone-500 hover:text-brand-red uppercase tracking-wider transition-colors"
          >
            ← Voltar para o Cardápio
          </Link>
        </div>

        {/* Card */}
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-stone-200/80 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
              <Lock size={22} />
            </div>
            
            <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              Acesso Restrito
            </h1>
            <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
              Painel de gerenciamento digital do <span className="font-semibold text-brand-darkred">{settings.businessName}</span>.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-750 uppercase tracking-wider">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-900 font-mono"
                />
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-shake">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <span className="font-semibold leading-normal">{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-brand-red hover:bg-brand-darkred active:scale-98 transition-all duration-200 text-white font-bold text-sm tracking-wider uppercase rounded-xl shadow-md shadow-brand-red/15 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Entrar no Painel</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="pt-2 text-center">
            <span className="text-[10px] text-stone-400 block leading-relaxed max-w-xs mx-auto">
              🔐 Dica para testes: digite a senha padrão <code>admin123</code> ou <code>foodsal2026</code>.
            </span>
          </div>

        </div>

      </div>
    );
  }

  // 2. RENDER ADMIN LAYOUT & ACTIVE VIEW
  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  );
}
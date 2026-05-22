'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  FolderTree, 
  Utensils, 
  QrCode, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Globe
} from 'lucide-react';
import Link from 'next/link';

interface AdminLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export default function AdminLayout({ activeTab, setActiveTab, children }: AdminLayoutProps) {
  const { logoutAdmin, settings } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'categories', label: 'Categorias', icon: FolderTree },
    { id: 'dishes', label: 'Pratos', icon: Utensils },
    { id: 'qrcodes', label: 'QR Codes', icon: QrCode },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <header className="md:hidden w-full h-16 bg-brand-darkred text-white flex items-center justify-between px-4 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold tracking-tight text-white">
            FoodSal <span className="text-brand-beige text-sm font-sans font-medium">Admin</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-white/10 text-white transition-all flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
          >
            <Globe size={16} />
            <span>Cardápio</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-brand-darkred/95 backdrop-blur-md z-20 flex flex-col p-6 animate-in slide-in-from-top duration-300">
          <nav className="flex-1 space-y-3">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3.5 py-4 px-4 rounded-xl text-base font-bold transition-all ${
                    activeTab === item.id
                      ? 'bg-white text-brand-darkred shadow-lg'
                      : 'text-stone-200 hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          
          <button
            onClick={() => {
              logoutAdmin();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3.5 py-4 px-4 rounded-xl text-base font-bold text-red-300 hover:bg-white/10 transition-colors mt-auto border border-red-500/20"
          >
            <LogOut size={20} />
            <span>Sair do Painel</span>
          </button>
        </div>
      )}

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 bg-brand-darkred text-white flex-col shrink-0 border-r border-stone-800 shadow-xl">
        {/* Brand */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-brand-red/20">
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              Food<span className="text-brand-beige">Sal</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-medium text-red-300 -mt-0.5">
              Painel Administrativo
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 mt-4">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[#F5E6D3] text-brand-darkred shadow-md scale-[1.01]'
                    : 'text-red-100 hover:bg-brand-red/20'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-brand-red/20 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-brand-beige hover:bg-brand-red/20 border border-brand-beige/20 transition-all text-center"
          >
            <Globe size={14} />
            <span>Visualizar Cardápio</span>
          </Link>
          
          <button
            onClick={logoutAdmin}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-red-200 hover:bg-red-800/40 hover:text-white transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="hidden md:flex h-20 items-center justify-between px-8 bg-white border-b border-stone-200 shadow-sm shrink-0">
          <h1 className="text-xl font-bold font-serif text-stone-900 capitalize tracking-wide">
            {menuItems.find(item => item.id === activeTab)?.label || 'Painel'}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
              WhatsApp: {settings.whatsappNumber}
            </span>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}

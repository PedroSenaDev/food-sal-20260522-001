'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import AdminLayout from '../../components/AdminLayout';
import CategoryCrud from '../../components/CategoryCrud';
import DishCrud from '../../components/DishCrud';
import AdminSettings from '../../components/AdminSettings';
import { testSupabaseConnection } from '../../lib/db';
import { Lock, ArrowRight, ShieldAlert, Key, Database, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { isAdminLoggedIn, loginAdmin, settings, refreshData } = useApp();
  const [activeTab, setActiveTab] = useState('categories');
  
  // Login states
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Diagnostics states
  const [dbStatus, setDbStatus] = useState<{
    loading: boolean;
    connected: boolean;
    error?: string;
    tablesExist?: { categories: boolean; dishes: boolean; settings: boolean; orders: boolean };
    rlsWriteAllowed?: boolean;
  }>({ loading: true, connected: false });

  const runDiagnostics = async () => {
    setDbStatus(prev => ({ ...prev, loading: true }));
    const result = await testSupabaseConnection();
    setDbStatus({
      loading: false,
      connected: result.connected,
      error: result.error,
      tablesExist: result.tablesExist,
      rlsWriteAllowed: result.rlsWriteAllowed
    });
    // Forçar atualização do app se o DB estiver funcional
    if (result.connected && result.rlsWriteAllowed) {
      refreshData();
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      runDiagnostics();
    }
  }, [isAdminLoggedIn]);

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
      
      {/* Real-time Supabase Diagnostics Banner */}
      <div className="mb-6 bg-white rounded-3xl p-5 border border-stone-200 shadow-sm font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${dbStatus.loading ? 'bg-stone-100 text-stone-400' : dbStatus.connected && dbStatus.rlsWriteAllowed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              <Database size={20} className={dbStatus.loading ? 'animate-pulse' : ''} />
            </div>
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                Conexão com Banco de Dados Global
                {!dbStatus.loading && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans uppercase font-bold ${dbStatus.connected && dbStatus.rlsWriteAllowed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {dbStatus.connected && dbStatus.rlsWriteAllowed ? 'Sincronizado' : 'Modo Offline (LocalStorage)'}
                  </span>
                )}
              </h3>
              
              <div className="text-xs text-stone-500 mt-1 leading-relaxed">
                {dbStatus.loading ? (
                  <span>Testando conexão com o Supabase...</span>
                ) : dbStatus.connected && dbStatus.rlsWriteAllowed ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Tudo certo! Qualquer alteração aparecerá instantaneamente em todos os celulares.
                  </span>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-amber-800 font-bold flex items-center gap-1">
                      <AlertTriangle size={14} className="shrink-0 text-amber-600" />
                      Não foi possível conectar ao banco de dados online. O site continuará funcionando temporariamente de forma offline neste aparelho.
                    </p>
                    {dbStatus.error && (
                      <p className="text-[10px] font-mono bg-stone-100 p-2 rounded-lg border border-stone-200 text-stone-600">
                        {dbStatus.error}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={runDiagnostics}
            disabled={dbStatus.loading}
            className="self-start md:self-center py-2 px-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={dbStatus.loading ? 'animate-spin' : ''} />
            <span>Testar Agora</span>
          </button>
        </div>

        {/* Detailed SQL table checklist if connection failed/incomplete */}
        {!dbStatus.loading && !dbStatus.rlsWriteAllowed && (
          <div className="mt-4 pt-4 border-t border-stone-100 bg-amber-50/50 -mx-5 -mb-5 p-5 rounded-b-3xl">
            <h4 className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-2.5">
              ⚠️ Como resolver esse problema no seu Supabase:
            </h4>
            
            <div className="space-y-3 text-xs text-stone-600 leading-normal">
              <p>
                O Supabase foi configurado com sucesso, mas o banco de dados rejeitou as consultas porque você ainda não executou o arquivo de configuração de tabelas SQL.
              </p>

              <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1.5">
                <span className="font-bold text-stone-800 block text-[11px]">Passo a passo no painel do Supabase:</span>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Abra o seu painel do <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-brand-red font-bold underline">Supabase</a>.</li>
                  <li>Clique em <strong>SQL Editor</strong> no menu lateral esquerdo.</li>
                  <li>Clique em <strong>New Query</strong> (Nova Consulta).</li>
                  <li>No seu projeto local, abra o arquivo <strong>SUPABASE_SETUP.sql</strong>, copie todo o código e cole no SQL Editor do Supabase.</li>
                  <li>Clique no botão <strong>Run</strong> (ou aperte <kbd className="bg-stone-100 px-1 py-0.5 border rounded">Ctrl+Enter</kbd>) no canto inferior direito.</li>
                </ol>
              </div>
              
              {dbStatus.tablesExist && (
                <div className="flex flex-wrap gap-3 pt-1">
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className={dbStatus.tablesExist.categories ? 'text-emerald-600' : 'text-stone-400 font-mono'}>
                      {dbStatus.tablesExist.categories ? '✅' : '❌'} categories
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className={dbStatus.tablesExist.dishes ? 'text-emerald-600' : 'text-stone-400 font-mono'}>
                      {dbStatus.tablesExist.dishes ? '✅' : '❌'} dishes
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className={dbStatus.tablesExist.settings ? 'text-emerald-600' : 'text-stone-400 font-mono'}>
                      {dbStatus.tablesExist.settings ? '✅' : '❌'} settings
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className={dbStatus.tablesExist.orders ? 'text-emerald-600' : 'text-stone-400 font-mono'}>
                      {dbStatus.tablesExist.orders ? '✅' : '❌'} orders
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {renderContent()}
    </AdminLayout>
  );
}
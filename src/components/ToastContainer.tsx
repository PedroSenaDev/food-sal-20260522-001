'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-4 left-4 md:left-auto md:right-6 z-[9999] flex flex-col gap-3 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        // Ícone e cores elegantes de acordo com o tipo
        let Icon = Info;
        let borderColor = 'border-brand-red/20';
        let iconColor = 'text-brand-red';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderColor = 'border-emerald-500/20';
          iconColor = 'text-emerald-600';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderColor = 'border-red-500/20';
          iconColor = 'text-red-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl bg-white/95 border ${borderColor} shadow-lg shadow-stone-900/5 backdrop-blur-md animate-in slide-in-from-top-4 fade-in duration-300 w-full relative overflow-hidden`}
          >
            {/* Linha de progresso sutil no topo */}
            <div className={`absolute top-0 inset-x-0 h-[2px] opacity-40 bg-current ${iconColor}`} />

            <div className={`shrink-0 mt-0.5 ${iconColor}`}>
              <Icon size={18} />
            </div>

            <div className="flex-1">
              <p className="text-xs font-bold text-stone-850 leading-relaxed font-sans pr-4">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-stone-700 transition-colors p-0.5 rounded-md cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
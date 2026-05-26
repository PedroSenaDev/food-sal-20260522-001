'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { X, MapPin, Phone, Clock, ShieldCheck, Globe } from 'lucide-react';
import Link from 'next/link';

interface InfoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoSidebar({ isOpen, onClose }: InfoSidebarProps) {
  const { settings } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click Outside to Close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Info Drawer */}
      <div className="relative w-full max-w-xs h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-350 ease-out">
        
        {/* Header - Styled to match the Main Hero Section */}
        <div className="p-5 flex items-center justify-between bg-brand-darkred text-[#F5E6D3] shadow-md relative overflow-hidden">
          {/* Subtle pattern just like the hero section */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F5E6D3_1.5px,transparent_1.5px)] [background-size:12px_12px]" />
          
          <div className="flex flex-col relative z-10 select-none">
            <span className="font-serif text-2xl font-extrabold tracking-tight text-[#F5E6D3]">
              Food<span className="text-brand-red font-serif font-extrabold [text-shadow:-0.5px_-0.5px_0_#F5E6D3,0.5px_-0.5px_0_#F5E6D3,-0.5px_0.5px_0_#F5E6D3,0.5px_0.5px_0_#F5E6D3]">Sal</span>
            </span>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#F5E6D3]/80 mt-1">
              Sobre nós
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#F5E6D3] transition-colors cursor-pointer relative z-10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Welcome Intro */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-stone-900 leading-tight">
              {settings.welcomeTitle || `Seja bem-vindo ao ${settings.businessName}!`}
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {settings.welcomeText || 'Preparamos cada prato com ingredientes selecionados e o máximo carinho para proporcionar uma experiência memorável direto na sua mesa.'}
            </p>
          </div>

          <hr className="border-stone-100" />

          {/* Details Section */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Informações Gerais
            </h4>

            {/* Address */}
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-brand-red/5 text-brand-red shrink-0">
                <MapPin size={16} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-550 block uppercase">Endereço</span>
                <span className="text-xs text-stone-700 font-medium leading-relaxed mt-0.5 block">
                  {settings.address}
                </span>
              </div>
            </div>

            {/* Contact Phone */}
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-brand-red/5 text-brand-red shrink-0">
                <Phone size={16} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-550 block uppercase">Contato / WhatsApp</span>
                <a 
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-darkred font-bold hover:underline leading-relaxed mt-0.5 block"
                >
                  +{settings.whatsappNumber}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-brand-red/5 text-brand-red shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-550 block uppercase">Horário de Atendimento</span>
                <span className="text-xs text-stone-700 font-medium leading-relaxed mt-0.5 block whitespace-pre-line">
                  {settings.businessHours || 'Quarta a Segunda: 11h30 às 23h\nTerça-feira: Fechado'}
                </span>
              </div>
            </div>

          </div>

          <hr className="border-stone-100" />

          {/* Redes Sociais */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Siga-nos nas redes
            </h4>
            <div className="flex gap-3">
              <a 
                href={settings.instagramUrl || '#'} 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-stone-100 hover:bg-brand-red/5 text-stone-600 hover:text-brand-red font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Globe size={14} />
                <span>Instagram</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer with Admin Access */}
        <div className="p-5 border-t border-stone-100 bg-stone-50">
          <Link
            href="/admin"
            className="w-full py-2.5 px-4 rounded-xl border border-stone-200 hover:border-brand-red/20 hover:bg-brand-red/5 text-stone-500 hover:text-brand-darkred text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            onClick={onClose}
          >
            <ShieldCheck size={14} />
            <span>Painel do Gerente</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
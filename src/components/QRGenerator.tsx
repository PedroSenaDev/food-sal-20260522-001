'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { QrCode, Printer, Link2, Copy, Check } from 'lucide-react';

export default function QRGenerator() {
  const { settings } = useApp();
  const [tableNum, setTableNum] = useState('01');
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const qrValueUrl = `${origin}?mesa=${encodeURIComponent(tableNum)}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=8E1C1C&bgcolor=FFFFFF&data=${encodeURIComponent(qrValueUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrValueUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Imprimir QR Code - Mesa ${tableNum}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
              body { 
                font-family: 'Outfit', sans-serif; 
                text-align: center; 
                padding: 40px 20px; 
                background: #F5E6D3; 
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 90vh;
              }
              .card { 
                border: 2px solid #8E1C1C; 
                padding: 40px; 
                max-width: 350px; 
                background: #ffffff;
                border-radius: 30px; 
                box-shadow: 0 10px 30px rgba(142, 28, 28, 0.15);
              }
              h1 { 
                font-family: 'Playfair Display', serif; 
                color: #8E1C1C; 
                margin: 0 0 5px 0; 
                font-size: 38px; 
                font-weight: 700;
              }
              .subtitle {
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 3px;
                color: #C62828;
                margin-bottom: 25px;
                font-weight: 700;
              }
              p { 
                color: #57534e; 
                font-size: 14px; 
                line-height: 1.5;
                margin: 0 0 30px 0; 
              }
              .qr-container {
                padding: 15px;
                background: #fff;
                border: 1px solid rgba(142, 28, 28, 0.1);
                border-radius: 20px;
                display: inline-block;
                box-shadow: inset 0 2px 8px rgba(0,0,0,0.05);
              }
              .qr { 
                width: 230px; 
                height: 230px; 
                display: block;
              }
              .table-badge { 
                font-size: 24px; 
                font-weight: 700; 
                color: #ffffff; 
                background: #C62828; 
                display: inline-block; 
                padding: 8px 32px; 
                border-radius: 14px; 
                margin-top: 30px; 
                box-shadow: 0 4px 12px rgba(198, 40, 40, 0.3);
              }
              .footer {
                font-size: 10px;
                color: #a8a29e;
                margin-top: 25px;
              }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>FoodSal</h1>
              <div class="subtitle">${settings.businessName.split('-')[1]?.trim() || 'Menu Digital'}</div>
              <p>Escaneie o código abaixo com a câmera do seu celular para realizar seu pedido diretamente da mesa.</p>
              <div class="qr-container">
                <img class="qr" src="${qrImageUrl}" alt="QR Code" />
              </div>
              <div>
                <div class="table-badge">MESA ${tableNum}</div>
              </div>
              <div class="footer">FoodSal - Todos os direitos reservados</div>
            </div>
            <script>
              window.onload = function() { 
                setTimeout(function() {
                  window.print(); 
                  window.close(); 
                }, 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm max-w-4xl mx-auto font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Settings column */}
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
              <QrCode className="text-brand-red" size={24} />
              Gerador de QR Codes
            </h2>
            <p className="text-stone-500 text-sm mt-1 leading-relaxed">
              Crie códigos QR individuais para cada mesa. Seus clientes podem escanear para abrir o cardápio com o número da mesa pré-selecionado.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Número da Mesa
              </label>
              <input
                type="text"
                value={tableNum}
                onChange={(e) => setTableNum(e.target.value)}
                placeholder="Ex: 01, 15, Externa 02"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-stone-800 font-bold"
              />
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-2.5">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Link do QR Code</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={qrValueUrl}
                  className="flex-1 px-3 py-2 bg-stone-200/50 text-stone-500 text-xs rounded-lg select-all border border-stone-200 truncate outline-none font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-600 hover:text-stone-850 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                  title="Copiar Link"
                >
                  {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-5 rounded-xl bg-brand-red hover:bg-brand-darkred text-white font-bold text-sm tracking-wide shadow-md shadow-brand-red/10 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Printer size={18} />
              <span>Imprimir QR Code</span>
            </button>
          </div>
        </div>

        {/* Preview column */}
        <div className="flex justify-center bg-stone-50 p-6 md:p-8 rounded-3xl border border-stone-100 shadow-inner">
          <div className="bg-white border-2 border-brand-darkred/25 p-6 rounded-2xl max-w-sm w-full text-center shadow-md relative group">
            
            <h3 className="font-serif text-2xl font-bold text-brand-darkred">FoodSal</h3>
            <span className="text-[9px] uppercase tracking-widest text-brand-red font-bold -mt-1 block">
              {settings.businessName.split('-')[1]?.trim() || 'Menu Digital'}
            </span>
            
            <p className="text-[11px] text-stone-500 mt-2 mb-4">
              Aponte a câmera do seu celular para pedir
            </p>

            <div className="mx-auto border border-stone-100 p-2.5 rounded-xl inline-block bg-white shadow-sm mb-4">
              <img 
                src={qrImageUrl} 
                alt={`QR Code Mesa ${tableNum}`} 
                className="w-48 h-48 block"
              />
            </div>

            <div>
              <span className="inline-block bg-brand-red text-white text-lg font-bold px-6 py-1.5 rounded-xl shadow-md">
                MESA {tableNum}
              </span>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Category } from '../lib/mockData';
import { Plus, Edit, Trash2, X, FolderHeart, Save, AlertCircle } from 'lucide-react';

export default function CategoryCrud() {
  const { categories, addOrUpdateCategory, removeCategory } = useApp();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [sortOrder, setSortOrder] = useState(0);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setSortOrder(categories.length + 1);
    setIsOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSortOrder(cat.sortOrder);
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addOrUpdateCategory({
      id: editingCategory?.id,
      name: name.trim(),
      section: 'adult', // mantido no schema apenas para compatibilidade interna
      sortOrder
    });

    setIsOpen(false);
  };

  const handleDelete = async (id: string) => {
    await removeCategory(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
            <FolderHeart className="text-brand-red" size={22} />
            Gerenciar Categorias
          </h2>
          <p className="text-stone-500 text-xs mt-0.5">
            Organize seu cardápio ordenando e criando as categorias de pratos.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-2.5 px-4 rounded-xl bg-brand-red text-white hover:bg-brand-darkred font-bold text-xs tracking-wider uppercase shadow-md shadow-brand-red/10 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={16} />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Single Unified List */}
      <div className="border border-stone-150 rounded-2xl p-4 bg-stone-50/50">
        <h3 className="text-xs font-bold text-brand-red uppercase tracking-wider mb-3 pb-2 border-b border-stone-200 flex justify-between items-center">
          <span>Categorias Cadastradas</span>
          <span className="text-[10px] bg-brand-red/10 text-brand-red px-2 py-0.5 rounded-full font-sans">
            {categories.length} categorias
          </span>
        </h3>

        {categories.length === 0 ? (
          <p className="text-xs text-stone-400 text-center py-6">Nenhuma categoria cadastrada.</p>
        ) : (
          <div className="space-y-2">
            {categories.map(cat => (
              <div 
                key={cat.id} 
                className="flex items-center justify-between p-3 bg-white border border-stone-200/60 rounded-xl hover:border-brand-red/20 transition-all shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold bg-stone-100 text-stone-500 h-6 w-6 rounded-md flex items-center justify-center font-mono">
                    {cat.sortOrder}
                  </span>
                  <span className="text-sm font-semibold text-stone-800">{cat.name}</span>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-stone-850 hover:bg-stone-100 cursor-pointer"
                    title="Editar"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(cat.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-650 hover:bg-red-50 cursor-pointer"
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Category Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <form 
            onSubmit={handleSave}
            className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-stone-250 text-stone-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Fields */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Massas rústicas, Bebidas, etc."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-850"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  required
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-850 font-mono"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="py-2.5 px-4 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold text-xs tracking-wider uppercase cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-brand-red hover:bg-brand-darkred text-white font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-md shadow-brand-red/10 cursor-pointer"
              >
                <Save size={14} />
                <span>Salvar Categoria</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation Delete Dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
              <AlertCircle size={24} />
            </div>
            
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Excluir Categoria?</h3>
            <p className="text-stone-500 text-xs leading-relaxed mb-6">
              Esta ação é irreversível. Todos os pratos cadastrados sob esta categoria também serão removidos definitivamente.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="py-2.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 font-semibold text-xs tracking-wider uppercase cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider uppercase shadow-md cursor-pointer"
              >
                Excluir Tudo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
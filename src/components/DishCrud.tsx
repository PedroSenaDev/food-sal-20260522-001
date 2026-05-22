'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Dish, Category } from '../lib/mockData';
import { uploadImage } from '../lib/db';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Utensils, 
  Save, 
  Upload, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function DishCrud() {
  const { dishes, categories, addOrUpdateDish, removeDish, settings } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0.00');
  const [imageUrl, setImageUrl] = useState('');
  const [section, setSection] = useState<'adult' | 'kids'>('adult');
  const [sortOrder, setSortOrder] = useState(0);
  const [active, setActive] = useState(true);

  // Loading and helper state
  const [isUploading, setIsUploading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter states for the list view
  const [listSection, setListSection] = useState<'all' | 'adult' | 'kids'>('all');
  const [listCategory, setListCategory] = useState<string>('all');

  const formatPrice = (val: number) => {
    return `${settings.currencySymbol} ${val.toFixed(2)}`;
  };

  const handleOpenAdd = () => {
    setEditingDish(null);
    setName('');
    const matchingCats = categories.filter(c => c.section === 'adult');
    setCategoryId(matchingCats[0]?.id || '');
    setDescription('');
    setPrice('0.00');
    setImageUrl('');
    setSection('adult');
    setSortOrder(dishes.length + 1);
    setActive(true);
    setIsOpen(true);
  };

  const handleOpenEdit = (dish: Dish) => {
    setEditingDish(dish);
    setName(dish.name);
    setCategoryId(dish.categoryId);
    setDescription(dish.description);
    setPrice(dish.price.toFixed(2));
    setImageUrl(dish.image);
    setSection(dish.section);
    setSortOrder(dish.sortOrder);
    setActive(dish.active);
    setIsOpen(true);
  };

  const handleSectionChange = (sec: 'adult' | 'kids') => {
    setSection(sec);
    // Auto update category select to first matching the new section
    const matchingCats = categories.filter(c => c.section === sec);
    setCategoryId(matchingCats[0]?.id || '');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err) {
      console.error('Failed to upload image', err);
      alert('Erro ao fazer upload da imagem. Usando local mock/fallback.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleActive = async (dish: Dish) => {
    await addOrUpdateDish({
      ...dish,
      active: !dish.active
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;

    await addOrUpdateDish({
      id: editingDish?.id,
      categoryId,
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price) || 0,
      image: imageUrl,
      active,
      section,
      sortOrder
    });

    setIsOpen(false);
  };

  const handleDelete = async (id: string) => {
    await removeDish(id);
    setConfirmDeleteId(null);
  };

  // Filter categories shown in dropdown
  const filteredCategoriesForForm = categories.filter(c => c.section === section);

  // Filter dishes shown in list view
  const filteredDishes = dishes.filter(dish => {
    const matchesSection = listSection === 'all' || dish.section === listSection;
    const matchesCategory = listCategory === 'all' || dish.categoryId === listCategory;
    return matchesSection && matchesCategory;
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
            <Utensils className="text-brand-red" size={22} />
            Gerenciar Pratos do Cardápio
          </h2>
          <p className="text-stone-500 text-xs mt-0.5">
            Cadastre, edite, ative ou desative itens e seus preços.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-2.5 px-4 rounded-xl bg-brand-red text-white hover:bg-brand-darkred font-bold text-xs tracking-wider uppercase shadow-md shadow-brand-red/10 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Novo Prato</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-150 mb-6">
        
        {/* Section Filter */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-stone-500 uppercase mb-1.5">Cardápio</label>
          <div className="flex bg-stone-200 p-0.5 rounded-lg border border-stone-300/40">
            <button
              onClick={() => setListSection('all')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                listSection === 'all' ? 'bg-white text-stone-850 shadow-sm' : 'text-stone-500 hover:text-stone-850'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setListSection('adult')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                listSection === 'adult' ? 'bg-white text-stone-850 shadow-sm' : 'text-stone-500 hover:text-stone-850'
              }`}
            >
              Adulto
            </button>
            <button
              onClick={() => setListSection('kids')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                listSection === 'kids' ? 'bg-white text-stone-850 shadow-sm' : 'text-stone-500 hover:text-stone-850'
              }`}
            >
              Infantil
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-col min-w-[150px]">
          <label className="text-[10px] font-bold text-stone-500 uppercase mb-1.5">Categoria</label>
          <select
            value={listCategory}
            onChange={(e) => setListCategory(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-250 bg-white outline-none focus:border-brand-red text-stone-800"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.section === 'adult' ? 'Adulto' : 'Infantil'})
              </option>
            ))}
          </select>
        </div>

        {/* Count Pill */}
        <div className="ml-auto text-xs font-bold text-stone-400 self-end mb-1">
          Mostrando {filteredDishes.length} de {dishes.length} pratos
        </div>

      </div>

      {/* Dishes Table */}
      {filteredDishes.length === 0 ? (
        <div className="text-center py-12 text-stone-400">
          <Utensils size={40} className="mx-auto stroke-1 text-stone-300 mb-2" />
          <p className="text-sm font-medium">Nenhum prato correspondente encontrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-stone-150 rounded-2xl">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-150 text-stone-500 font-semibold text-xs uppercase">
                <th className="p-4 w-16">Foto</th>
                <th className="p-4">Nome do Prato</th>
                <th className="p-4">Categoria</th>
                <th className="p-4 text-right">Preço</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans text-stone-700">
              {filteredDishes.map(dish => {
                const category = categories.find(c => c.id === dish.categoryId);
                return (
                  <tr key={dish.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="p-4">
                      <div className="h-10 w-10 rounded-lg bg-stone-100 overflow-hidden border border-stone-200">
                        <img
                          src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=80&q=80'}
                          alt={dish.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-stone-900">
                      <div>{dish.name}</div>
                      <div className="text-[10px] text-stone-400 font-medium line-clamp-1 max-w-xs">
                        {dish.description}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                        {category?.name || 'Sem categoria'}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-stone-900">
                      {formatPrice(dish.price)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleActive(dish)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                          dish.active
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-stone-100 text-stone-400 border border-stone-200'
                        }`}
                        title={dish.active ? 'Desativar item' : 'Ativar item'}
                      >
                        {dish.active ? (
                          <>
                            <Eye size={12} />
                            <span>Ativo</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} />
                            <span>Inativo</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => handleOpenEdit(dish)}
                          className="p-2 rounded-lg text-stone-500 hover:text-stone-850 hover:bg-stone-100 cursor-pointer"
                          title="Editar prato"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(dish.id)}
                          className="p-2 rounded-lg text-stone-400 hover:text-red-650 hover:bg-red-50 cursor-pointer"
                          title="Excluir prato"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <form 
            onSubmit={handleSave}
            className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50 shrink-0">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingDish ? 'Editar Prato' : 'Cadastrar Novo Prato'}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-stone-200 text-stone-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Fields - Scrollable */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* Menu Section */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Seção do Cardápio
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleSectionChange('adult')}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                      section === 'adult'
                        ? 'bg-brand-red border-brand-red text-white'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-brand-red/20'
                    }`}
                  >
                    Cardápio Adulto
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSectionChange('kids')}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                      section === 'kids'
                        ? 'bg-brand-darkred border-brand-darkred text-white'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-brand-darkred/20'
                    }`}
                  >
                    Cardápio Infantil
                  </button>
                </div>
              </div>

              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Categoria
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-850 bg-white"
                >
                  {filteredCategoriesForForm.length === 0 ? (
                    <option value="" disabled>Cadastre uma categoria nesta seção primeiro!</option>
                  ) : (
                    filteredCategoriesForForm.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Name & Price */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Nome do Prato
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Filé à Parmigiana"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-850"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Preço (R$)
                  </label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-850 font-bold"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Descrição / Ingredientes
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Filé empanado, coberto com molho de tomate rústico e muçarela gratinada."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-850 resize-none placeholder-stone-400 bg-white"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Foto do Prato
                </label>
                <div className="flex gap-4 items-center">
                  <div className="h-20 w-20 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center relative shrink-0">
                    {isUploading ? (
                      <Loader2 className="animate-spin text-brand-red" size={24} />
                    ) : imageUrl ? (
                      <img src={imageUrl} alt="Upload Preview" className="h-full w-full object-cover" />
                    ) : (
                      <Utensils size={24} className="text-stone-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="py-2.5 px-4 rounded-xl border border-stone-250 hover:bg-stone-50 text-stone-600 font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Upload size={14} />
                      {isUploading ? 'Enviando...' : 'Carregar Imagem'}
                    </button>
                    
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Ou cole uma URL direta da imagem"
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 outline-none text-xs text-stone-600"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Order & Status */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    required
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-850 font-mono"
                  />
                </div>
                
                <div className="flex flex-col justify-end pb-1.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="h-4 w-4 rounded text-brand-red border-stone-300 focus:ring-brand-red accent-brand-red cursor-pointer"
                    />
                    <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Prato Ativo (Disponível)
                    </span>
                  </label>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex gap-3 justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="py-2.5 px-4 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold text-xs tracking-wider uppercase cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="py-2.5 px-5 rounded-xl bg-brand-red hover:bg-brand-darkred text-white font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-md shadow-brand-red/10 cursor-pointer disabled:opacity-50"
              >
                <Save size={14} />
                <span>Salvar Prato</span>
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
            
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Excluir Prato?</h3>
            <p className="text-stone-500 text-xs leading-relaxed mb-6">
              Tem certeza que deseja remover este prato? Esta ação é permanente e removerá o item do cardápio.
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
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

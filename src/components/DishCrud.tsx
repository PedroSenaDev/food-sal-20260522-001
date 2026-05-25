'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Dish, CustomizationGroup } from '../lib/mockData';
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
  Loader2,
  Sliders,
  Sparkles
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
  const [sortOrder, setSortOrder] = useState(0);
  const [active, setActive] = useState(true);
  
  // Customizable attributes
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [customizationOptions, setCustomizationOptions] = useState<CustomizationGroup[]>([]);
  const [subSection, setSubSection] = useState('');
  const [sizeOrWeight, setSizeOrWeight] = useState('');

  // Loading and helper state
  const [isUploading, setIsUploading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter states for the list view
  const [listCategory, setListCategory] = useState<string>('all');

  const formatPrice = (val: number) => {
    return `${settings.currencySymbol} ${val.toFixed(2)}`;
  };

  const handleOpenAdd = () => {
    setEditingDish(null);
    setName('');
    setCategoryId(categories[0]?.id || '');
    setDescription('');
    setPrice('0.00');
    setImageUrl('');
    setSortOrder(dishes.length + 1);
    setActive(true);
    setIsCustomizable(false);
    setCustomizationOptions([]);
    setSubSection('');
    setSizeOrWeight('');
    setIsOpen(true);
  };

  const handleOpenEdit = (dish: Dish) => {
    setEditingDish(dish);
    setName(dish.name);
    setCategoryId(dish.categoryId);
    setDescription(dish.description);
    setPrice(dish.price.toFixed(2));
    setImageUrl(dish.image);
    setSortOrder(dish.sortOrder);
    setActive(dish.active);
    setIsCustomizable(dish.isCustomizable || false);
    setCustomizationOptions(dish.customizationOptions || []);
    setSubSection(dish.subSection || '');
    setSizeOrWeight(dish.sizeOrWeight || '');
    setIsOpen(true);
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

  // ---------------------------------------------------------------------------
  // Customization Editor Handlers
  // ---------------------------------------------------------------------------
  
  const handleAddGroup = () => {
    const newGroup: CustomizationGroup = {
      id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: '',
      min: 0,
      max: 1,
      items: []
    };
    setCustomizationOptions(prev => [...prev, newGroup]);
  };

  const handleRemoveGroup = (groupId: string) => {
    setCustomizationOptions(prev => prev.filter(g => g.id !== groupId));
  };

  const handleGroupTitleChange = (groupId: string, value: string) => {
    setCustomizationOptions(prev => 
      prev.map(g => g.id === groupId ? { ...g, title: value } : g)
    );
  };

  const handleGroupRuleChange = (groupId: string, key: 'min' | 'max', value: number) => {
    setCustomizationOptions(prev => 
      prev.map(g => g.id === groupId ? { ...g, [key]: value } : g)
    );
  };

  const handleAddItemToGroup = (groupId: string) => {
    setCustomizationOptions(prev => 
      prev.map(g => {
        if (g.id === groupId) {
          const newItems = [...g.items, { name: '', price: undefined }];
          return { ...g, items: newItems };
        }
        return g;
      })
    );
  };

  const handleRemoveItemFromGroup = (groupId: string, itemIdx: number) => {
    setCustomizationOptions(prev => 
      prev.map(g => {
        if (g.id === groupId) {
          const newItems = g.items.filter((_, idx) => idx !== itemIdx);
          return { ...g, items: newItems };
        }
        return g;
      })
    );
  };

  const handleItemPropertyChange = (groupId: string, itemIdx: number, key: 'name' | 'price', value: string) => {
    setCustomizationOptions(prev => 
      prev.map(g => {
        if (g.id === groupId) {
          const newItems = g.items.map((it, idx) => {
            if (idx === itemIdx) {
              if (key === 'price') {
                const numericPrice = parseFloat(value);
                return { ...it, price: isNaN(numericPrice) || numericPrice <= 0 ? undefined : numericPrice };
              }
              return { ...it, [key]: value };
            }
            return it;
          });
          return { ...g, items: newItems };
        }
        return g;
      })
    );
  };

  // ---------------------------------------------------------------------------

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;

    // Filter out invalid groups or empty options before saving
    const sanitizedCustomizations = customizationOptions
      .map(group => ({
        ...group,
        items: group.items.filter(it => it.name.trim() !== '')
      }))
      .filter(group => group.title.trim() !== '' && group.items.length > 0);

    await addOrUpdateDish({
      id: editingDish?.id,
      categoryId,
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price) || 0,
      image: imageUrl,
      active,
      section: 'adult', // mantido apenas para compatibilidade de schema
      sortOrder,
      isCustomizable,
      customizationOptions: isCustomizable ? sanitizedCustomizations : [],
      subSection: subSection.trim() || undefined,
      sizeOrWeight: sizeOrWeight.trim() || undefined
    });

    setIsOpen(false);
  };

  const handleDelete = async (id: string) => {
    await removeDish(id);
    setConfirmDeleteId(null);
  };

  // Filter dishes shown in list view
  const filteredDishes = dishes.filter(dish => {
    const matchesCategory = listCategory === 'all' || dish.categoryId === listCategory;
    return matchesCategory;
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
        
        {/* Category Filter */}
        <div className="flex flex-col min-w-[200px]">
          <label className="text-[10px] font-bold text-stone-500 uppercase mb-1.5">Filtrar por Categoria</label>
          <select
            value={listCategory}
            onChange={(e) => setListCategory(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-250 bg-white outline-none focus:border-brand-red text-stone-800"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
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
                <th className="p-4 text-center">Tipo</th>
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
                      {dish.isCustomizable ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-brand-red/10 text-brand-red px-2 py-0.5 rounded-full border border-brand-red/20 uppercase tracking-wide">
                          <Sliders size={10} />
                          Personalizável
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-stone-400">Padrão</span>
                      )}
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
            className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
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
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              
              {/* Category selector & Sub-section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Categoria do Prato
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-850 bg-white"
                  >
                    {categories.length === 0 ? (
                      <option value="" disabled>Cadastre uma categoria primeiro!</option>
                    ) : (
                      categories.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Sub-seção / Agrupamento (Opcional)
                  </label>
                  <input
                    type="text"
                    value={subSection}
                    onChange={(e) => setSubSection(e.target.value)}
                    placeholder="Ex: Sucos de Polpa, Massas Rústicas"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-850"
                  />
                </div>
              </div>

              {/* Name, Price & Weight */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
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
                    Preço Base (R$)
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
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Tamanho / Peso (Opcional)
                  </label>
                  <input
                    type="text"
                    value={sizeOrWeight}
                    onChange={(e) => setSizeOrWeight(e.target.value)}
                    placeholder="Ex: 350ml, 180g"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-850"
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
                  rows={2}
                  className="w-full p-3 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-850 resize-none placeholder-stone-400 bg-white"
                />
              </div>

              {/* Toggle Customizations Mode */}
              <div className="p-4 bg-brand-red/5 rounded-2xl border border-brand-red/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sliders className="text-brand-red" size={20} />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block uppercase">Prato Personalizável (Monte seu Pedido)</span>
                    <span className="text-[10px] text-stone-500 block">Permitir que o cliente escolha guarnições, pontos da carne, etc.</span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isCustomizable}
                    onChange={(e) => setIsCustomizable(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                </label>
              </div>

              {/* Customization Options Constructor */}
              {isCustomizable && (
                <div className="space-y-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                    <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} className="text-brand-red" />
                      Estrutura de Opcionais / Acompanhamentos
                    </span>
                    <button
                      type="button"
                      onClick={handleAddGroup}
                      className="py-1 px-2.5 bg-brand-red/10 hover:bg-brand-red/20 text-brand-red rounded-lg font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} />
                      Adicionar Grupo
                    </button>
                  </div>

                  {customizationOptions.length === 0 ? (
                    <p className="text-xs text-stone-400 text-center py-4 italic">Nenhum grupo de opcionais criado ainda. Clique acima para adicionar.</p>
                  ) : (
                    <div className="space-y-4">
                      {customizationOptions.map((group) => (
                        <div key={group.id} className="p-4 bg-white rounded-xl border border-stone-200 shadow-sm relative space-y-3">
                          
                          {/* Remove Group Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveGroup(group.id)}
                            className="absolute top-3 right-3 p-1 rounded-lg text-stone-400 hover:text-red-650 hover:bg-red-50 cursor-pointer"
                          >
                            <X size={14} />
                          </button>

                          {/* Group Title and Rules */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-2">
                              <label className="text-[9px] font-bold text-stone-500 uppercase">Título do Grupo</label>
                              <input
                                type="text"
                                required
                                value={group.title}
                                onChange={(e) => handleGroupTitleChange(group.id, e.target.value)}
                                placeholder="Ex: Escolha até 3 acompanhamentos"
                                className="w-full px-3 py-1.5 mt-0.5 rounded-lg border border-stone-200 focus:border-brand-red outline-none text-xs text-stone-800 font-bold"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[9px] font-bold text-stone-500 uppercase">Min. escolhas</label>
                                <input
                                  type="number"
                                  min={0}
                                  required
                                  value={group.min}
                                  onChange={(e) => handleGroupRuleChange(group.id, 'min', Number(e.target.value))}
                                  className="w-full px-3 py-1.5 mt-0.5 rounded-lg border border-stone-200 focus:border-brand-red outline-none text-xs text-stone-805 font-mono"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-stone-500 uppercase">Máx. escolhas</label>
                                <input
                                  type="number"
                                  min={1}
                                  required
                                  value={group.max}
                                  onChange={(e) => handleGroupRuleChange(group.id, 'max', Number(e.target.value))}
                                  className="w-full px-3 py-1.5 mt-0.5 rounded-lg border border-stone-200 focus:border-brand-red outline-none text-xs text-stone-805 font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Items Lists */}
                          <div className="space-y-2 pt-2 border-t border-stone-100">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[9px] font-bold text-stone-500 uppercase">Opções do Grupo</span>
                              <button
                                type="button"
                                onClick={() => handleAddItemToGroup(group.id)}
                                className="text-[10px] font-bold text-brand-red hover:underline flex items-center gap-0.5 cursor-pointer"
                              >
                                <Plus size={10} />
                                Adicionar Opção
                              </button>
                            </div>

                            {group.items.length === 0 ? (
                              <p className="text-[11px] text-stone-400 italic py-1 pl-1">Cadastre pelo menos uma opção para este grupo.</p>
                            ) : (
                              <div className="space-y-1.5">
                                {group.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      required
                                      value={item.name}
                                      onChange={(e) => handleItemPropertyChange(group.id, itemIdx, 'name', e.target.value)}
                                      placeholder="Ex: Purê de Batata"
                                      className="flex-1 px-3 py-1 rounded-lg border border-stone-200 text-xs text-stone-750 outline-none focus:border-brand-red"
                                    />
                                    
                                    <div className="w-28 relative">
                                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400 font-mono">
                                        + R$
                                      </span>
                                      <input
                                        type="text"
                                        placeholder="Opcional"
                                        value={item.price !== undefined ? item.price : ''}
                                        onChange={(e) => handleItemPropertyChange(group.id, itemIdx, 'price', e.target.value)}
                                        className="w-full pl-10 pr-2 py-1 rounded-lg border border-stone-200 text-xs text-stone-805 font-bold outline-none focus:border-brand-red"
                                      />
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleRemoveItemFromGroup(group.id, itemIdx)}
                                      className="p-1 rounded text-stone-450 hover:text-red-650 hover:bg-red-50 cursor-pointer"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

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
                    Ordem de Exibição no Menu
                  </label>
                  <input
                    type="number"
                    required
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none text-sm text-stone-855 font-mono"
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
import React, { useState, useEffect } from "react";
import {
  Plus, Search, BookOpen, Loader2, Edit, Trash2, Package, ChevronDown, ChevronRight, XCircle
} from "lucide-react";
import { warehouseApi } from "../api/warehouseApi";
import { masterDataApi } from "../../master-data/api/masterDataApi";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";

export default function RecipeListPage() {
  const { hasPermission } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", product_id: "", batch_size: "", is_active: true, remarks: "",
    items: [{ product_id: "", quantity: "" }]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recRes, prodRes] = await Promise.all([
        warehouseApi.getRecipes(),
        masterDataApi.getProducts()
      ]);
      if (recRes.status === "Success") setRecipes(recRes.data);
      if (prodRes.status === "Success") setProducts(prodRes.data.filter(p => p.is_active));
    } catch { toast.error("Failed to load recipes"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const finishedGoods = products.filter(p => p.type === "finished_good");
  const rawMaterials  = products.filter(p => p.type === "raw_material" || p.type === "packaging_material");

  const filtered = recipes.filter(r => {
    const q = search.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.product?.name.toLowerCase().includes(q);
  });

  const openAddModal = () => {
    setEditingRecipe(null);
    setForm({ name: "", product_id: finishedGoods[0]?.id || "", batch_size: "", is_active: true, remarks: "", items: [{ product_id: rawMaterials[0]?.id || "", quantity: "" }] });
    setIsModalOpen(true);
  };

  const openEditModal = (recipe) => {
    setEditingRecipe(recipe);
    setForm({
      name: recipe.name, product_id: recipe.product_id, batch_size: recipe.batch_size,
      is_active: recipe.is_active, remarks: recipe.remarks || "",
      items: recipe.items.map(i => ({ product_id: i.product_id, quantity: i.quantity }))
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingRecipe) {
        await warehouseApi.updateRecipe(editingRecipe.id, form);
        toast.success("Recipe updated successfully!");
      } else {
        await warehouseApi.createRecipe(form);
        toast.success("Formulation recipe created successfully!");
      }
      fetchData(); setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save recipe");
    } finally { setSubmitting(false); }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Recipe?", text: "This will permanently remove the BOM formulation recipe.",
      icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete Recipe",
      background: document.documentElement.classList.contains("dark") ? "#111827" : "#fff",
      color: document.documentElement.classList.contains("dark") ? "#fff" : "#000",
    }).then(async (r) => {
      if (r.isConfirmed) {
        try { await warehouseApi.deleteRecipe(id); toast.success("Recipe deleted"); fetchData(); }
        catch (err) { toast.error(err.response?.data?.message || "Deletion failed"); }
      }
    });
  };

  return (
    <div className="pb-10 min-h-screen space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="sticky top-4 z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-6 rounded-md border border-gray-100/50 dark:border-gray-800/50 shadow-xl shadow-gray-500/5">
        <div className="space-y-1 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-primary-500" />
            </div>
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 tracking-wider">Manufacturing</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Formulation Recipes (BOM)</h1>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Define Bill of Materials for each finished pesticide product.</p>
        </div>
        <div className="flex-1 max-w-lg mx-6 group relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input type="text" placeholder="Search recipes by name or product..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all" />
        </div>
        {hasPermission("warehouses.create") && (
          <button onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-lg shadow-primary-500/20 transition-all active:scale-95 group flex-shrink-0">
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            New Formulation Recipe
          </button>
        )}
      </div>

      {/* Recipe Cards */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 p-5 animate-pulse">
              <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-64 mb-2" />
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-40" />
            </div>
          ))
        ) : filtered.length > 0 ? (
          filtered.map((recipe) => (
            <div key={recipe.id} className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all">
              {/* Recipe Header Row */}
              <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
                onClick={() => setExpandedId(expandedId === recipe.id ? null : recipe.id)}>
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${recipe.is_active ? "bg-emerald-500" : "bg-gray-300"}`} />
                  <div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{recipe.name}</span>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Finished Product: <span className="font-semibold text-primary-500">{recipe.product?.name}</span>
                      </span>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Batch Size: <span className="font-bold">{recipe.batch_size} {recipe.product?.uom?.name}</span>
                      </span>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {recipe.items?.length || 0} Ingredients
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {hasPermission("warehouses.edit") && (
                    <button onClick={(e) => { e.stopPropagation(); openEditModal(recipe); }}
                      className="p-1.5 hover:bg-primary-500/10 rounded text-gray-400 hover:text-primary-500 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {hasPermission("warehouses.delete") && (
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(recipe.id); }}
                      className="p-1.5 hover:bg-red-500/10 rounded text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {expandedId === recipe.id
                    ? <ChevronDown className="w-4 h-4 text-primary-500" />
                    : <ChevronRight className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              {/* Ingredients Accordion */}
              {expandedId === recipe.id && (
                <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 px-6 py-4">
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Ingredient Configuration</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {recipe.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-md px-4 py-3">
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{item.product?.name}</p>
                          <span className={`text-[9px] font-extrabold uppercase tracking-wider mt-0.5 block ${item.product?.type === "raw_material" ? "text-blue-500" : "text-purple-500"}`}>
                            {item.product?.type?.replace("_", " ")}
                          </span>
                        </div>
                        <span className="text-sm font-black text-gray-900 dark:text-white">
                          {item.quantity} <span className="text-[10px] text-gray-400 font-normal">{item.product?.uom?.name}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 px-6 py-16 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-450">No formulation recipes found. Create your first BOM recipe!</p>
          </div>
        )}
      </div>

      {/* Recipe Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center"><BookOpen className="w-4 h-4 text-primary-500" /></div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  {editingRecipe ? "Edit Formulation Recipe" : "New Formulation Recipe (BOM)"}
                </h3>
                <p className="text-xs text-gray-400 mt-1">Define ingredients and quantities required per batch output.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Recipe Name *</label>
                  <input type="text" required placeholder="e.g. Abamectin 1.8% EC - 100ml Bottle"
                    value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all font-semibold text-gray-850 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Finished Product Output *</label>
                    <select required value={form.product_id} onChange={(e) => setForm(p => ({ ...p, product_id: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 cursor-pointer font-semibold text-gray-850 dark:text-white">
                      <option value="">— Select Finished Product —</option>
                      {finishedGoods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Batch Size (Yield Qty) *</label>
                    <input type="number" step="0.01" required placeholder="e.g. 100 bottles per batch"
                      value={form.batch_size} onChange={(e) => setForm(p => ({ ...p, batch_size: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all font-semibold text-gray-850 dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Remarks</label>
                  <input type="text" placeholder="Optional formulation notes..."
                    value={form.remarks} onChange={(e) => setForm(p => ({ ...p, remarks: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all text-gray-800 dark:text-white" />
                </div>

                {/* Ingredients */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">Ingredient & Packaging Requirements</span>
                    <button type="button" onClick={() => setForm(p => ({ ...p, items: [...p.items, { product_id: rawMaterials[0]?.id || "", quantity: "" }] }))}
                      className="px-3 py-1.5 bg-primary-500/10 text-primary-500 hover:bg-primary-500 hover:text-white rounded text-xs font-bold transition-all flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Add Item
                    </button>
                  </div>
                  <div className="space-y-3">
                    {form.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <select required value={item.product_id}
                          onChange={(e) => { const it = [...form.items]; it[idx].product_id = e.target.value; setForm(p => ({ ...p, items: it })); }}
                          className="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded text-xs font-semibold text-gray-850 dark:text-white">
                          <option value="">— Select Raw/Packaging Material —</option>
                          {rawMaterials.map(p => <option key={p.id} value={p.id}>[{p.type.replace("_", " ")}] {p.name}</option>)}
                        </select>
                        <input type="number" step="0.001" required placeholder="Qty per batch" value={item.quantity}
                          onChange={(e) => { const it = [...form.items]; it[idx].quantity = e.target.value; setForm(p => ({ ...p, items: it })); }}
                          className="w-28 px-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded text-xs font-semibold text-gray-850 dark:text-white" />
                        <button type="button" disabled={form.items.length === 1}
                          onClick={() => setForm(p => ({ ...p, items: p.items.filter((_, i) => i !== idx) }))}
                          className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded disabled:opacity-30 transition-all">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 text-xs font-bold rounded-md hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-md shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2">
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingRecipe ? "Save Recipe" : "Create Recipe"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

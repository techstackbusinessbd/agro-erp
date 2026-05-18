import React, { useState, useEffect } from "react";
import {
  Plus, Search, Factory, Loader2, PlayCircle, CheckCircle, XCircle, Beaker, Layers, Calendar
} from "lucide-react";
import { warehouseApi } from "../api/warehouseApi";
import { masterDataApi } from "../../master-data/api/masterDataApi";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";

export default function ProductionListPage() {
  const { hasPermission } = useAuth();
  const [productions, setProductions] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Create Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createForm, setCreateForm] = useState({
    product_id: "", recipe_id: "", target_qty: "", raw_material_warehouse_id: "",
    finished_goods_warehouse_id: "", production_date: new Date().toISOString().split("T")[0], remarks: ""
  });

  // Start Production Modal
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [activeProduction, setActiveProduction] = useState(null);
  const [startFormItems, setStartFormItems] = useState([]);

  // Complete Production Modal
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [completeForm, setCompleteForm] = useState({ batch_no: "", expiry_date: "", yield_qty: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, recRes, whRes, pRes] = await Promise.all([
        warehouseApi.getProductions(),
        warehouseApi.getRecipes(),
        warehouseApi.getWarehouses(),
        masterDataApi.getProducts()
      ]);
      if (prodRes.status === "Success") setProductions(prodRes.data);
      if (recRes.status === "Success") setRecipes(recRes.data.filter(r => r.is_active));
      if (whRes.status === "Success") setWarehouses(whRes.data);
      if (pRes.status === "Success") setProducts(pRes.data);
    } catch { toast.error("Failed to load production data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredProductions = productions.filter(p => {
    const q = search.toLowerCase();
    return p.production_no.toLowerCase().includes(q) || p.product?.name.toLowerCase().includes(q);
  });

  const handleOpenCreateModal = () => {
    setCreateForm({
      product_id: "", recipe_id: "", target_qty: "",
      raw_material_warehouse_id: warehouses.find(w => w.type === 'raw_material')?.id || "",
      finished_goods_warehouse_id: warehouses.find(w => w.type === 'central_warehouse')?.id || "",
      production_date: new Date().toISOString().split("T")[0], remarks: ""
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await warehouseApi.createProduction(createForm);
      toast.success("Production order created!");
      fetchData(); setIsCreateModalOpen(false);
    } catch (err) { toast.error(err.response?.data?.message || "Failed to create order"); }
    finally { setSubmitting(false); }
  };

  // START PRODUCTION
  const openStartModal = (prod) => {
    setActiveProduction(prod);
    setStartFormItems(prod.items.map(i => ({ id: i.id, product_name: i.product?.name, planned_qty: i.planned_qty, actual_qty: i.planned_qty, batch_no: "" })));
    setStartModalOpen(true);
  };

  const submitStartProduction = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await warehouseApi.startProduction(activeProduction.id, { items: startFormItems });
      toast.success("Production started! Raw materials deducted.");
      fetchData(); setStartModalOpen(false);
    } catch (err) { toast.error(err.response?.data?.message || "Failed to start production"); }
    finally { setSubmitting(false); }
  };

  // COMPLETE PRODUCTION
  const openCompleteModal = (prod) => {
    setActiveProduction(prod);
    setCompleteForm({ batch_no: "FG-" + prod.production_no, expiry_date: "", yield_qty: prod.target_qty });
    setCompleteModalOpen(true);
  };

  const submitCompleteProduction = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await warehouseApi.completeProduction(activeProduction.id, completeForm);
      toast.success("Production completed! Finished goods added to warehouse.");
      fetchData(); setCompleteModalOpen(false);
    } catch (err) { toast.error(err.response?.data?.message || "Failed to complete production"); }
    finally { setSubmitting(false); }
  };

  const handleCancel = (id) => {
    Swal.fire({
      title: "Cancel Production?", icon: "warning", showCancelButton: true,
      confirmButtonText: "Yes, Cancel", confirmButtonColor: "#ef4444"
    }).then(async (res) => {
      if (res.isConfirmed) {
        try { await warehouseApi.cancelProduction(id); toast.success("Order cancelled"); fetchData(); }
        catch (err) { toast.error("Cancellation failed"); }
      }
    });
  };

  return (
    <div className="pb-10 min-h-screen space-y-8 animate-in fade-in">
      <div className="sticky top-4 z-20 flex items-center justify-between bg-white/95 dark:bg-gray-900/95 p-6 rounded-md shadow-xl border border-gray-100 dark:border-gray-800">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-primary-500/10 flex items-center justify-center rounded-lg"><Factory className="text-primary-500" /></div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Batch Production</h1>
            <p className="text-xs text-gray-500">Manage manufacturing orders and formulation</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-1 max-w-md mx-6">
          <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border rounded-md text-sm outline-none focus:border-primary-500" />
        </div>
        {hasPermission("warehouses.create") && (
          <button onClick={handleOpenCreateModal} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white font-bold rounded-md hover:bg-primary-600 transition-colors">
            <Plus className="w-4 h-4" /> New Order
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-md border shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Order No</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Target Qty</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? <tr><td colSpan="5" className="text-center py-10"><Loader2 className="animate-spin mx-auto text-gray-400" /></td></tr>
              : filteredProductions.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4 font-mono text-sm font-bold">{p.production_no}</td>
                <td className="px-6 py-4 font-semibold">{p.product?.name}</td>
                <td className="px-6 py-4 font-black">{p.target_qty} {p.product?.uom?.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full border ${p.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : p.status === 'processing' ? 'bg-blue-100 text-blue-700 border-blue-200' : p.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  {p.status === 'pending' && <button onClick={() => openStartModal(p)} className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded flex items-center gap-1"><PlayCircle className="w-3 h-3"/> Start</button>}
                  {p.status === 'pending' && <button onClick={() => handleCancel(p.id)} className="px-3 py-1 bg-red-100 text-red-600 hover:bg-red-200 text-xs font-bold rounded flex items-center gap-1"><XCircle className="w-3 h-3"/> Cancel</button>}
                  {p.status === 'processing' && <button onClick={() => openCompleteModal(p)} className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Yield</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-lg w-full p-6">
            <h2 className="text-lg font-bold mb-4">New Production Order</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1">Product to Produce</label>
                <select required value={createForm.product_id} onChange={e => {
                  const pid = e.target.value;
                  const rec = recipes.find(r => r.product_id === pid);
                  setCreateForm(p => ({ ...p, product_id: pid, recipe_id: rec?.id || "" }));
                }} className="w-full border p-2 rounded">
                  <option value="">Select...</option>
                  {products.filter(p => p.type === 'finished_good').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1">BOM Recipe</label>
                  <select required value={createForm.recipe_id} onChange={e => setCreateForm(p => ({ ...p, recipe_id: e.target.value }))} className="w-full border p-2 rounded">
                    <option value="">Select Recipe...</option>
                    {recipes.filter(r => r.product_id === createForm.product_id).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Target Yield Qty</label>
                  <input type="number" step="0.01" required value={createForm.target_qty} onChange={e => setCreateForm(p => ({ ...p, target_qty: e.target.value }))} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1">Raw Materials From</label>
                  <select required value={createForm.raw_material_warehouse_id} onChange={e => setCreateForm(p => ({ ...p, raw_material_warehouse_id: e.target.value }))} className="w-full border p-2 rounded">
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Finished Goods To</label>
                  <select required value={createForm.finished_goods_warehouse_id} onChange={e => setCreateForm(p => ({ ...p, finished_goods_warehouse_id: e.target.value }))} className="w-full border p-2 rounded">
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border rounded font-bold text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary-500 text-white rounded font-bold text-sm">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* START MODAL */}
      {startModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-lg font-bold mb-4 text-blue-600">Start Production: {activeProduction?.production_no}</h2>
            <form onSubmit={submitStartProduction}>
              <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                {startFormItems.map((item, idx) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <div className="col-span-5"><label className="text-[10px] font-bold text-gray-500 uppercase">Material</label><p className="font-semibold text-sm">{item.product_name}</p></div>
                    <div className="col-span-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Planned</label><p className="font-mono text-sm">{item.planned_qty}</p></div>
                    <div className="col-span-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Actual Qty</label><input type="number" step="0.01" required value={item.actual_qty} onChange={e => { const items = [...startFormItems]; items[idx].actual_qty = e.target.value; setStartFormItems(items); }} className="w-full border p-1 rounded text-sm" /></div>
                    <div className="col-span-3"><label className="text-[10px] font-bold text-gray-500 uppercase">Lot Batch</label><input type="text" placeholder="Optional" value={item.batch_no} onChange={e => { const items = [...startFormItems]; items[idx].batch_no = e.target.value; setStartFormItems(items); }} className="w-full border p-1 rounded text-sm" /></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setStartModalOpen(false)} className="px-4 py-2 border rounded font-bold text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-500 text-white rounded font-bold text-sm flex items-center gap-2"><PlayCircle className="w-4 h-4"/> Start & Deduct Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPLETE MODAL */}
      {completeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-bold mb-4 text-emerald-600">Yield Finished Goods</h2>
            <form onSubmit={submitCompleteProduction} className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1">New Batch No (FG Lot)</label>
                <input type="text" required value={completeForm.batch_no} onChange={e => setCompleteForm(p => ({ ...p, batch_no: e.target.value }))} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Actual Yield Qty</label>
                <input type="number" step="0.01" required value={completeForm.yield_qty} onChange={e => setCompleteForm(p => ({ ...p, yield_qty: e.target.value }))} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Expiry Date</label>
                <input type="date" required value={completeForm.expiry_date} onChange={e => setCompleteForm(p => ({ ...p, expiry_date: e.target.value }))} className="w-full border p-2 rounded" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setCompleteModalOpen(false)} className="px-4 py-2 border rounded font-bold text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-emerald-500 text-white rounded font-bold text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Load to FG Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  Plus, Search, Edit2, Trash2, Loader2,
  CheckCircle, XCircle, MapPin, Phone, Package, Map, Building2
} from "lucide-react";
import { warehouseApi } from "../api/warehouseApi";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";

const NON_DEPOT_TYPES = ["raw_material", "finished_goods", "cold_storage", "transit", "distribution_center", "quarantine"];

export default function DepotListPage() {
  const { hasPermission } = useAuth();
  const [depots, setDepots] = useState([]);
  const [warehouses, setWarehouses] = useState([]); // central warehouses only
  const [territories, setTerritories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepot, setSelectedDepot] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    code: "", name: "", type: "depot",
    territory_id: "", warehouse_id: "",
    address: "", city: "", phone: "", capacity: "", is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});

  const generateDepotCode = (currentList) => {
    const next = currentList.length + 1;
    return `DPT-${String(next).padStart(3, "0")}`;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [whRes, terRes] = await Promise.all([
        warehouseApi.getWarehouses(),
        warehouseApi.getTerritories(),
      ]);
      const all = whRes.data || [];
      setDepots(all.filter((w) => w.type === "depot"));
      setWarehouses(all);
      setTerritories(terRes.data || []);
    } catch {
      toast.error("Failed to load depots.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredDepots = depots.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase()) ||
    (d.city || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (depot = null) => {
    setSelectedDepot(depot);
    setFormErrors({});
    if (depot) {
      setFormData({
        code: depot.code, name: depot.name, type: "depot",
        territory_id: depot.territory_id || "", warehouse_id: depot.warehouse_id || "",
        address: depot.address || "", city: depot.city || "",
        phone: depot.phone || "", capacity: depot.capacity || "", is_active: depot.is_active,
      });
    } else {
      setFormData({
        code: generateDepotCode(depots), name: "", type: "depot",
        territory_id: "", warehouse_id: "",
        address: "", city: "", phone: "", capacity: "", is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { setIsModalOpen(false); setSelectedDepot(null); };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) errors.code = "Depot code is required";
    if (!formData.name.trim()) errors.name = "Depot name is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    try {
      const payload = {
        ...formData, type: "depot",
        capacity: formData.capacity ? parseFloat(formData.capacity) : null,
        territory_id: formData.territory_id || null,
        warehouse_id: formData.warehouse_id || null,
      };
      if (selectedDepot) {
        await warehouseApi.updateWarehouse(selectedDepot.id, payload);
        toast.success("Depot updated successfully!");
      } else {
        await warehouseApi.createWarehouse(payload);
        toast.success("Depot created successfully!");
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      const errors = err.response?.data?.errors || {};
      if (Object.keys(errors).length) {
        setFormErrors(Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v[0]])));
      } else {
        toast.error(err.response?.data?.message || "Operation failed.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (depot) => {
    const result = await Swal.fire({
      title: "Delete Depot?",
      text: `"${depot.name}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await warehouseApi.deleteWarehouse(depot.id);
      toast.success("Depot deleted.");
      fetchData();
    } catch {
      toast.error("Failed to delete depot.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <span>Warehouse & Territory</span>
            <span>/</span>
            <span className="text-primary-500 font-semibold">Depot Management</span>
          </div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
            Depot Management
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage product distribution depots across territories.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right pr-4 border-r border-gray-200 dark:border-gray-800">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none mt-1">{depots.length}</p>
          </div>
          {hasPermission("warehouses.create") && (
            <button onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-5 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-lg shadow-primary-500/20 transition-all active:scale-95 group">
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Add Depot
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, code, or city..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-md shadow-xl shadow-gray-500/5 border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Depot</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source Warehouse</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Territory</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <td key={i} className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : filteredDepots.length > 0 ? (
                filteredDepots.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-base">🏪</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{d.name}</p>
                          <span className="text-[10px] font-mono font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">{d.code}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {d.warehouse_name ? (
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3 h-3 text-primary-400" />
                          <div>
                            <p className="text-xs font-semibold text-gray-900 dark:text-white">{d.warehouse_name}</p>
                            <span className="text-[10px] font-mono text-gray-400">{d.warehouse_code}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold uppercase tracking-wider">
                          ⚠️ No Source
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {d.territory_name ? (
                        <div className="flex items-center gap-1.5">
                          <Map className="w-3 h-3 text-primary-400" />
                          <div>
                            <p className="text-xs font-semibold text-gray-900 dark:text-white">{d.territory_name}</p>
                            <span className="text-[10px] font-mono text-gray-400">{d.territory_code}</span>
                          </div>
                        </div>
                      ) : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        {d.city && <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300"><MapPin className="w-3 h-3 text-gray-400" />{d.city}</div>}
                        {d.phone && <div className="flex items-center gap-1.5 text-xs text-gray-400"><Phone className="w-3 h-3" />{d.phone}</div>}
                        {!d.city && !d.phone && <span className="text-xs text-gray-400">—</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {d.capacity ? (
                        <div className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{Number(d.capacity).toLocaleString()}</span>
                          <span className="text-[10px] text-gray-400">kg</span>
                        </div>
                      ) : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      {d.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400">
                          <XCircle className="w-3.5 h-3.5" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {hasPermission("warehouses.edit") && (
                          <button onClick={() => handleOpenModal(d)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-500 hover:text-primary-500" title="Edit Depot">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {hasPermission("warehouses.delete") && (
                          <button onClick={() => handleDelete(d)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors text-gray-500 hover:text-red-500" title="Delete Depot">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <span className="text-4xl block mb-3">🏪</span>
                    <p className="text-sm font-semibold text-gray-400">No depots found</p>
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Add your first depot to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
                <span className="text-base">🏪</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  {selectedDepot ? "Edit Depot" : "Add Depot"}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedDepot ? "Update depot details." : "Register a new distribution depot."}
                </p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="p-6 space-y-4">

                {/* Source Warehouse */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    Source Warehouse
                    <span className="ml-2 text-[10px] font-normal text-gray-400">কোন গুদাম থেকে মাল আসবে</span>
                  </label>
                  <select name="warehouse_id" value={formData.warehouse_id} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all cursor-pointer">
                    <option value="">— No Source Warehouse —</option>
                    {warehouses
                      .filter((w) => !selectedDepot || w.id !== selectedDepot.id)
                      .map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.code} — {w.name} ({w.type.replace('_', ' ')})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Territory */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    Territory
                    <span className="ml-2 text-[10px] font-normal text-gray-400">কোন এলাকায় অবস্থিত</span>
                  </label>
                  <select name="territory_id" value={formData.territory_id} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all cursor-pointer">
                    <option value="">— No Territory —</option>
                    {territories.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.code} — {t.name}{t.region ? ` (${t.region})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Code & Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      Code *
                      {!selectedDepot && <span className="ml-2 text-[10px] font-normal text-primary-500 bg-primary-500/10 px-1.5 py-0.5 rounded">Auto</span>}
                    </label>
                    <input type="text" name="code" value={formData.code} onChange={handleInputChange}
                      placeholder="DPT-001"
                      className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${formErrors.code ? "border-red-500" : "border-gray-200 dark:border-gray-800"} rounded-md text-sm outline-none focus:border-primary-500 transition-all font-mono`} />
                    {!selectedDepot && <span className="text-[11px] text-gray-400 mt-1 block">Auto-generated. You can edit if needed.</span>}
                    {formErrors.code && <span className="text-xs text-red-500 mt-1 block">{formErrors.code}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                      placeholder="Bogura Depot"
                      className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${formErrors.name ? "border-red-500" : "border-gray-200 dark:border-gray-800"} rounded-md text-sm outline-none focus:border-primary-500 transition-all`} />
                    {formErrors.name && <span className="text-xs text-red-500 mt-1 block">{formErrors.name}</span>}
                  </div>
                </div>

                {/* City & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                      placeholder="Bogura"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange}
                      placeholder="+880 1XXXXXXXXX"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all" />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                    placeholder="Full address..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all" />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Capacity (kg)</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange}
                    placeholder="E.g. 10000"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all" />
                  <span className="text-[11px] text-gray-400 mt-1 block">Maximum storage capacity in kilograms.</span>
                </div>

                {/* Active */}
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-md border border-gray-200 dark:border-gray-800">
                  <input type="checkbox" id="depot_is_active" name="is_active" checked={formData.is_active} onChange={handleInputChange}
                    className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500 cursor-pointer" />
                  <div>
                    <label htmlFor="depot_is_active" className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer select-none">Active Status</label>
                    <p className="text-xs text-gray-400 leading-tight">Enable this depot for distribution operations.</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3">
                <button type="button" onClick={handleCloseModal}
                  className="px-5 py-2.5 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-800 text-xs font-bold rounded-md transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-md shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {selectedDepot ? "Save Changes" : "Save Depot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

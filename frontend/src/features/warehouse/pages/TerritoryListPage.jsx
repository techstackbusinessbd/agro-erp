import React, { useState, useEffect } from "react";
import {
  Plus, Search, Edit2, Trash2, Map, Loader2,
  CheckCircle, XCircle, Globe
} from "lucide-react";
import { warehouseApi } from "../api/warehouseApi";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";

const BD_REGIONS = [
  "Dhaka", "Chittagong", "Rajshahi", "Khulna",
  "Barishal", "Sylhet", "Rangpur", "Mymensingh",
];

const regionColors = {
  "Dhaka":      "bg-blue-500/10 text-blue-500",
  "Chittagong": "bg-teal-500/10 text-teal-500",
  "Rajshahi":   "bg-purple-500/10 text-purple-500",
  "Khulna":     "bg-emerald-500/10 text-emerald-500",
  "Barishal":   "bg-pink-500/10 text-pink-500",
  "Sylhet":     "bg-amber-500/10 text-amber-500",
  "Rangpur":    "bg-indigo-500/10 text-indigo-500",
  "Mymensingh": "bg-orange-500/10 text-orange-500",
};

export default function TerritoryListPage() {
  const { hasPermission } = useAuth();
  const [territories, setTerritories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    code: "", name: "", region: "", description: "", is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});

  const generateTerritoryCode = (currentList) => {
    const next = currentList.length + 1;
    return `TER-${String(next).padStart(3, "0")}`;
  };

  const fetchTerritories = async () => {
    setLoading(true);
    try {
      const res = await warehouseApi.getTerritories();
      setTerritories(res.data || []);
    } catch {
      toast.error("Failed to load territories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTerritories(); }, []);

  const filteredTerritories = territories.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.code.toLowerCase().includes(search.toLowerCase()) ||
    (t.region || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (territory = null) => {
    setSelectedTerritory(territory);
    setFormErrors({});
    if (territory) {
      setFormData({ code: territory.code, name: territory.name, region: territory.region || "", description: territory.description || "", is_active: territory.is_active });
    } else {
      setFormData({ code: generateTerritoryCode(territories), name: "", region: "", description: "", is_active: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { setIsModalOpen(false); setSelectedTerritory(null); };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) errors.code = "Territory code is required";
    if (!formData.name.trim()) errors.name = "Territory name is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    try {
      if (selectedTerritory) {
        await warehouseApi.updateTerritory(selectedTerritory.id, formData);
        toast.success("Territory updated successfully!");
      } else {
        await warehouseApi.createTerritory(formData);
        toast.success("Territory created successfully!");
      }
      handleCloseModal();
      fetchTerritories();
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

  const handleDelete = async (territory) => {
    const result = await Swal.fire({
      title: "Delete Territory?",
      text: `"${territory.name}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await warehouseApi.deleteTerritory(territory.id);
      toast.success("Territory deleted.");
      fetchTerritories();
    } catch {
      toast.error("Failed to delete territory.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <span>Master Setup</span>
            <span>/</span>
            <span className="text-primary-500 font-semibold">Territory Management</span>
          </div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
            Territory Management
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Define sales regions and distribution territories.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right pr-4 border-r border-gray-200 dark:border-gray-800">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none mt-1">{territories.length}</p>
          </div>
          {hasPermission("territories.create") && (
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-5 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-lg shadow-primary-500/20 transition-all active:scale-95 group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Add Territory
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, code, or region..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-md shadow-xl shadow-gray-500/5 border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Territory</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Region</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Warehouses</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <td key={i} className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : filteredTerritories.length > 0 ? (
                filteredTerritories.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                          <Map className="w-4.5 h-4.5 text-primary-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                          <span className="text-[10px] font-mono font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">
                            {t.code}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {t.region ? (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${regionColors[t.region] || "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                          <Globe className="w-3 h-3" />
                          {t.region}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        (t.warehouses_count || 0) > 0
                          ? "bg-primary-500/10 text-primary-600 dark:text-primary-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                      }`}>
                        {t.warehouses_count || 0} Locations
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {t.description || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {t.is_active ? (
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
                        {hasPermission("territories.edit") && (
                          <button onClick={() => handleOpenModal(t)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-500 hover:text-primary-500" title="Edit Territory">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {hasPermission("territories.delete") && (
                          <button onClick={() => handleDelete(t)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors text-gray-500 hover:text-red-500" title="Delete Territory">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Map className="w-10 h-10 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-400">No territories found</p>
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Add your first territory to get started.</p>
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
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
                <Map className="w-4 h-4 text-primary-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  {selectedTerritory ? "Edit Territory" : "Add Territory"}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedTerritory ? "Update territory details." : "Define a new sales territory."}
                </p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="p-6 space-y-4">
                {/* Code & Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      Code *
                      {!selectedTerritory && (
                        <span className="ml-2 text-[10px] font-normal text-primary-500 bg-primary-500/10 px-1.5 py-0.5 rounded">Auto</span>
                      )}
                    </label>
                    <input type="text" name="code" value={formData.code} onChange={handleInputChange}
                      placeholder="TER-001"
                      className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${formErrors.code ? "border-red-500" : "border-gray-200 dark:border-gray-800"} rounded-md text-sm outline-none focus:border-primary-500 transition-all font-mono`} />
                    {!selectedTerritory && <span className="text-[11px] text-gray-400 mt-1 block">Auto-generated. You can edit if needed.</span>}
                    {formErrors.code && <span className="text-xs text-red-500 mt-1 block">{formErrors.code}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                      placeholder="Dhaka North"
                      className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${formErrors.name ? "border-red-500" : "border-gray-200 dark:border-gray-800"} rounded-md text-sm outline-none focus:border-primary-500 transition-all`} />
                    {formErrors.name && <span className="text-xs text-red-500 mt-1 block">{formErrors.name}</span>}
                  </div>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Region / Division</label>
                  <select name="region" value={formData.region} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all cursor-pointer">
                    <option value="">Select Region</option>
                    {BD_REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange}
                    rows={3} placeholder="Optional description of this territory..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all resize-none" />
                </div>

                {/* Active */}
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-md border border-gray-200 dark:border-gray-800">
                  <input type="checkbox" id="ter_is_active" name="is_active" checked={formData.is_active} onChange={handleInputChange}
                    className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500 cursor-pointer" />
                  <div>
                    <label htmlFor="ter_is_active" className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer select-none">Active Status</label>
                    <p className="text-xs text-gray-400 leading-tight">Enable this territory for dealer and sales assignments.</p>
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
                  {selectedTerritory ? "Save Changes" : "Save Territory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

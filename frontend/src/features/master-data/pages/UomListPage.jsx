import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Ruler,
  Loader2,
  CheckCircle,
  XCircle,
  ChevronRight,
  Scale
} from "lucide-react";
import { masterDataApi } from "../api/masterDataApi";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";

export default function UomListPage() {
  const { hasPermission } = useAuth();
  const [uoms, setUoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUom, setSelectedUom] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    is_active: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchUoms = async () => {
    setLoading(true);
    try {
      const response = await masterDataApi.getUoms();
      if (response.status === "Success" && Array.isArray(response.data)) {
        setUoms(response.data);
      } else {
        setUoms([]);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        window.location.href = '/unauthorized';
      } else {
        toast.error("Failed to load Units of Measurement");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUoms();
  }, []);

  // Filter UOMs locally
  const filteredUoms = uoms.filter((uom) => {
    const query = search.toLowerCase();
    return (
      uom.name.toLowerCase().includes(query) ||
      uom.code.toLowerCase().includes(query)
    );
  });

  const handleOpenModal = (uom = null) => {
    if (uom) {
      setSelectedUom(uom);
      setFormData({
        name: uom.name,
        code: uom.code,
        is_active: uom.is_active
      });
    } else {
      setSelectedUom(null);
      setFormData({
        name: "",
        code: "",
        is_active: true
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUom(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Unit name is required";
    }
    if (!formData.code.trim()) {
      errors.code = "Unit code is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (selectedUom) {
        // Update operation
        const response = await masterDataApi.updateUom(selectedUom.id, formData);
        if (response.data?.status === "Success" || response.status === 200) {
          toast.success("Unit of Measurement updated successfully");
          fetchUoms();
          handleCloseModal();
        }
      } else {
        // Create operation
        const response = await masterDataApi.createUom(formData);
        if (response.status === 201 || response.data?.status === "Success") {
          toast.success("Unit of Measurement created successfully");
          fetchUoms();
          handleCloseModal();
        }
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || "An error occurred while saving the Unit");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "All items utilizing this unit will be affected!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981', // green theme
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      background: document.documentElement.classList.contains('dark') ? '#111827' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await masterDataApi.deleteUom(id);
          Swal.fire(
            'Deleted!',
            'Unit of Measurement has been deleted.',
            'success'
          );
          fetchUoms();
        } catch (error) {
          Swal.fire(
            'Error!',
            error.response?.data?.message || 'Failed to delete Unit of Measurement.',
            'error'
          );
        }
      }
    });
  };

  return (
    <div className="pb-10 min-h-screen space-y-8">
      {/* Premium Sticky Header with Integrated Search */}
      <div className="sticky top-4 z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-6 rounded-md border border-gray-100/50 dark:border-gray-800/50 shadow-xl shadow-gray-500/5 transition-all mb-8">
        <div className="space-y-1 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary-500" />
            </div>
            <span className="text-[10px] font-extrabold text-primary-500 uppercase tracking-[0.2em]">Master Data</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Units of Measurement</h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Quantity & Metric Configurations</p>
        </div>

        {/* Integrated Search Bar */}
        <div className="flex-1 max-w-lg mx-6 group relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by unit name or code (e.g. kg, ltr)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-md text-xs font-bold outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="flex gap-6 pr-6 border-r border-gray-100 dark:border-gray-800">
            <div className="text-right">
              <p className="text-[11px] font-black text-gray-400 tracking-[0.2em] uppercase">Total Units</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mt-1">{uoms.length}</p>
            </div>
          </div>
          {hasPermission("uoms.create") && (
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-3 px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-md shadow-2xl shadow-primary-500/20 transition-all active:scale-95 group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Add Unit (UOM)
            </button>
          )}
        </div>
      </div>

      {/* Modern UOMs Table */}
      <div className="bg-white dark:bg-gray-900 rounded-md shadow-xl shadow-gray-500/5 border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Unit Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Unit Code</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/4"></div></td>
                    <td className="px-6 py-5"><div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-12"></div></td>
                    <td className="px-6 py-5 text-right"><div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredUoms.length > 0 ? (
                filteredUoms.map((uom) => (
                  <tr
                    key={uom.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary-500/5 flex items-center justify-center">
                          <Scale className="w-4 h-4 text-primary-500" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-900 dark:text-white">{uom.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-mono font-bold bg-primary-500/10 text-primary-500 px-2.5 py-1 rounded">
                        {uom.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {uom.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {hasPermission("uoms.edit") && (
                          <button
                            onClick={() => handleOpenModal(uom)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-500"
                            title="Edit UOM"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {hasPermission("uoms.delete") && (
                          <button
                            onClick={() => handleDelete(uom.id)}
                            className="p-2 hover:bg-red-500/10 rounded transition-colors text-gray-500 dark:text-gray-400 hover:text-red-500"
                            title="Delete UOM"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <Scale className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm font-bold text-gray-400">No Units of Measurement found matching query</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over/Modal Manager for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 shadow-2xl transition-all overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                    {selectedUom ? "Modify Unit (UOM)" : "Register Unit (UOM)"}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">
                    {selectedUom ? "Edit metric configuration" : "Create new metric configuration"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleFormSubmit}>
              <div className="p-6 space-y-4">
                {/* Unit Name */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Unit Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="E.g. Kilogram, Litre, Bag"
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${formErrors.name ? "border-red-500" : "border-gray-100 dark:border-gray-800"} rounded-md text-xs font-bold outline-none focus:border-primary-500 transition-all`}
                  />
                  {formErrors.name && (
                    <span className="text-[10px] text-red-500 font-bold mt-1 block">{formErrors.name}</span>
                  )}
                </div>

                {/* Unit Code */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Unit Code *</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="E.g. kg, ltr, bag, pcs"
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${formErrors.code ? "border-red-500" : "border-gray-100 dark:border-gray-800"} rounded-md text-xs font-bold outline-none focus:border-primary-500 transition-all`}
                  />
                  {formErrors.code && (
                    <span className="text-[10px] text-red-500 font-bold mt-1 block">{formErrors.code}</span>
                  )}
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-md border border-gray-100/50 dark:border-gray-800/50">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                  />
                  <div>
                    <label htmlFor="is_active" className="text-xs font-black text-gray-900 dark:text-white cursor-pointer select-none">
                      Active Status
                    </label>
                    <p className="text-[9px] text-gray-400 leading-tight">Available across inventory systems when checked.</p>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-800 text-[10px] uppercase tracking-wider font-extrabold rounded-md transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-[10px] uppercase tracking-wider font-extrabold rounded-md shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {selectedUom ? "Push Changes" : "Save Unit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

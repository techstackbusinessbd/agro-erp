import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Users, 
  Loader2, 
  Edit, 
  Trash2, 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  FileText 
} from "lucide-react";
import { warehouseApi } from "../api/warehouseApi";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";

export default function SupplierListPage() {
  const { hasPermission } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    origin: "local",
    remarks: ""
  });

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await warehouseApi.getSuppliers();
      if (response.status === "Success" && Array.isArray(response.data)) {
        setSuppliers(response.data);
      }
    } catch (error) {
      toast.error("Failed to load suppliers registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleOpenAddModal = () => {
    setEditingSupplier(null);
    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      origin: "local",
      remarks: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (supplier) => {
    setEditingSupplier(supplier);
    setForm({
      name: supplier.name,
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
      origin: supplier.origin,
      remarks: supplier.remarks || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Supplier name is required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingSupplier) {
        await warehouseApi.updateSupplier(editingSupplier.id, form);
        toast.success("Supplier profile updated successfully!");
      } else {
        await warehouseApi.createSupplier(form);
        toast.success("Supplier registered successfully!");
      }
      fetchSuppliers();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save supplier profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete Supplier?",
      text: "This will permanently remove the supplier from your registry.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete Supplier",
      background: document.documentElement.classList.contains("dark") ? "#111827" : "#fff",
      color: document.documentElement.classList.contains("dark") ? "#fff" : "#000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await warehouseApi.deleteSupplier(id);
          toast.success("Supplier deleted successfully");
          fetchSuppliers();
        } catch (error) {
          toast.error(error.response?.data?.message || "Deletion failed");
        }
      }
    });
  };

  const filteredSuppliers = suppliers.filter(s => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      (s.phone && s.phone.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="pb-10 min-h-screen space-y-8 animate-in fade-in duration-500">
      {/* Sticky Header */}
      <div className="sticky top-4 z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-6 rounded-md border border-gray-100/50 dark:border-gray-800/50 shadow-xl shadow-gray-500/5 transition-all">
        <div className="space-y-1 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-primary-500" />
            </div>
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 tracking-wider">Procurement Registry</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Suppliers & Vendors</h1>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Manage directory of local suppliers and foreign shippers for import LCs.</p>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-6 group relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search suppliers by name, code, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {hasPermission("warehouses.create") && (
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-5 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-lg shadow-primary-500/20 transition-all active:scale-95 group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Register Supplier
            </button>
          )}
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white dark:bg-gray-900 rounded-md shadow-xl shadow-gray-500/5 border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendor Code</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supplier Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supplier Origin</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendor Address</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-16"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-32"></div></td>
                    <td className="px-6 py-5"><div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-16"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-24"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-48"></div></td>
                    <td className="px-6 py-5 text-right"><div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-extrabold text-gray-900 dark:text-white">
                        {supplier.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {supplier.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {supplier.origin === "foreign" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-full">
                          <Globe className="w-3 h-3" /> Foreign Shipper
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full">
                          <MapPin className="w-3 h-3" /> Local Vendor
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      {supplier.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                          <Phone className="w-3 h-3 text-gray-450" />
                          {supplier.phone}
                        </div>
                      )}
                      {supplier.email && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                          <Mail className="w-3 h-3 text-gray-450" />
                          {supplier.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-550 dark:text-gray-400 font-semibold block max-w-xs truncate" title={supplier.address}>
                        {supplier.address || "— No Address Recorded —"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {hasPermission("warehouses.edit") && (
                          <button
                            onClick={() => handleOpenEditModal(supplier)}
                            className="p-1.5 hover:bg-primary-500/10 rounded text-gray-400 hover:text-primary-500 transition-colors"
                            title="Edit Profile"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {hasPermission("warehouses.delete") && (
                          <button
                            onClick={() => handleDelete(supplier.id)}
                            className="p-1.5 hover:bg-red-500/10 rounded text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove Supplier"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm font-bold text-gray-450">No supplier vendors found in registry</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supplier Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-2xl transition-all overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    {editingSupplier ? "Edit Supplier Profile" : "Register New Supplier"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Provide vendor logistics references to save profile.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                {/* Supplier Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Supplier / Vendor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter supplier trade name..."
                    value={form.name}
                    onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all font-semibold text-gray-850 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Origin */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Supplier Origin *</label>
                    <select
                      value={form.origin}
                      onChange={(e) => setForm(p => ({ ...p, origin: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all cursor-pointer font-semibold text-gray-850 dark:text-white"
                    >
                      <option value="local">Local Vendor</option>
                      <option value="foreign">Foreign Shipper (Import LC)</option>
                    </select>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +88017..."
                      value={form.phone}
                      onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all font-semibold text-gray-850 dark:text-white"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. supplier@example.com"
                    value={form.email}
                    onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all font-semibold text-gray-850 dark:text-white"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Supplier Address</label>
                  <textarea
                    placeholder="Enter full physical address..."
                    value={form.address}
                    rows="2"
                    onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all text-gray-850 dark:text-white"
                  />
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Remarks / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. key chemicals supplier, specialized in active ingredients..."
                    value={form.remarks}
                    onChange={(e) => setForm(p => ({ ...p, remarks: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all text-gray-850 dark:text-white"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-800 text-xs font-bold rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-md shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingSupplier ? "Save Changes" : "Register Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

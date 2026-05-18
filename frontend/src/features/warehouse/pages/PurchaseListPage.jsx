import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Package,
  TrendingUp,
  FileText,
  DollarSign,
  Briefcase,
  Layers3,
  Globe
} from "lucide-react";
import { warehouseApi } from "../api/warehouseApi";
import { masterDataApi } from "../../master-data/api/masterDataApi";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";

export default function PurchaseListPage() {
  const { hasPermission } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Filters
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filterWarehouse, setFilterWarehouse] = useState("all");

  // Create Modal Form State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createForm, setCreateForm] = useState({
    supplier_id: "",
    warehouse_id: "",
    type: "local",
    purchase_date: new Date().toISOString().split("T")[0],
    lc_no: "",
    lc_date: "",
    conversion_rate: "1.00",
    remarks: "",
    items: [{ product_id: "", quantity: "", rate: "", batch_no: "", expiry_date: "" }]
  });

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [purRes, supRes, whRes, prodRes] = await Promise.all([
        warehouseApi.getPurchases(),
        warehouseApi.getSuppliers(),
        warehouseApi.getWarehouses(),
        masterDataApi.getProducts()
      ]);

      if (purRes.status === "Success" && Array.isArray(purRes.data)) {
        setPurchases(purRes.data);
      }
      if (supRes.status === "Success" && Array.isArray(supRes.data)) {
        setSuppliers(supRes.data);
      }
      if (whRes.status === "Success" && Array.isArray(whRes.data)) {
        // Filter only raw material warehouses if present, otherwise show all
        setWarehouses(whRes.data);
      }
      if (prodRes.status === "Success" && Array.isArray(prodRes.data)) {
        // Load all active products that are raw materials or packaging
        setProducts(prodRes.data.filter(p => p.is_active));
      }
    } catch (error) {
      toast.error("Failed to load procurement registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Multi-dimensional filtering logic
  const filteredPurchases = purchases.filter((p) => {
    const query = search.toLowerCase();
    const matchesSearch = 
      p.purchase_no.toLowerCase().includes(query) ||
      p.supplier?.name.toLowerCase().includes(query) ||
      p.warehouse?.name.toLowerCase().includes(query) ||
      (p.lc_no && p.lc_no.toLowerCase().includes(query));

    const matchesType = selectedType === "all" || p.type === selectedType;
    const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;
    const matchesWarehouse = filterWarehouse === "all" || p.warehouse_id === filterWarehouse;

    return matchesSearch && matchesType && matchesStatus && matchesWarehouse;
  });

  // Modal actions
  const handleOpenCreateModal = () => {
    const rawWh = warehouses.find(w => w.type === "raw_material") || warehouses[0];
    setCreateForm({
      supplier_id: suppliers[0]?.id || "",
      warehouse_id: rawWh?.id || "",
      type: "local",
      purchase_date: new Date().toISOString().split("T")[0],
      lc_no: "",
      lc_date: "",
      conversion_rate: "1.00",
      remarks: "",
      items: [{ product_id: products.filter(p => p.type === "raw_material" || p.type === "packaging_material")[0]?.id || "", quantity: "", rate: "", batch_no: "", expiry_date: "" }]
    });
    setIsCreateModalOpen(true);
  };

  const handleAddItemRow = () => {
    const allowedProds = products.filter(p => p.type === "raw_material" || p.type === "packaging_material");
    setCreateForm(prev => ({
      ...prev,
      items: [...prev.items, { product_id: allowedProds[0]?.id || "", quantity: "", rate: "", batch_no: "", expiry_date: "" }]
    }));
  };

  const handleRemoveItemRow = (index) => {
    if (createForm.items.length === 1) return;
    setCreateForm(prev => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index)
    }));
  };

  const handleItemRowChange = (index, field, value) => {
    const newItems = [...createForm.items];
    newItems[index][field] = value;
    setCreateForm(prev => ({ ...prev, items: newItems }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.supplier_id || !createForm.warehouse_id) {
      toast.error("Please select a vendor supplier and destination warehouse.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await warehouseApi.createPurchase(createForm);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Purchase requisition saved! Status is PENDING receipt.");
        fetchInitialData();
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save procurement requisition");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReceiveStock = async (id, purchaseNo) => {
    Swal.fire({
      title: "Receive Goods?",
      text: `Confirm receipt of invoice items for ${purchaseNo}. This will automatically load physical stock into the warehouse and log batches.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      confirmButtonText: "Yes, Receive Stocks",
      background: document.documentElement.classList.contains("dark") ? "#111827" : "#fff",
      color: document.documentElement.classList.contains("dark") ? "#fff" : "#000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await warehouseApi.receivePurchase(id);
          toast.success("Stock received successfully! Physical stock balance updated.");
          fetchInitialData();
        } catch (error) {
          toast.error(error.response?.data?.message || "Goods receipt failed");
        }
      }
    });
  };

  // Formatted statistics
  const pendingCount = purchases.filter(p => p.status === "pending").length;
  const receivedCount = purchases.filter(p => p.status === "received").length;
  const totalRMValue = purchases.reduce((acc, p) => acc + parseFloat(p.total_amount || 0), 0);

  return (
    <div className="pb-10 min-h-screen space-y-8 animate-in fade-in duration-500">
      {/* Sticky Header */}
      <div className="sticky top-4 z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-6 rounded-md border border-gray-100/50 dark:border-gray-800/50 shadow-xl shadow-gray-500/5 transition-all mb-8">
        <div className="space-y-1 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
              <Briefcase className="w-4.5 h-4.5 text-primary-500" />
            </div>
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 tracking-wider">Raw Material Procurement</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Purchase & Imports Ledger</h1>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Record import LCs or local purchases of raw chemical ingredients and packaging materials.</p>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-6 group relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search purchases by PO/LC no, supplier or warehouse..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {hasPermission("warehouses.create") && (
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-5 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-lg shadow-primary-500/20 transition-all active:scale-95 group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              New Procurement PO/LC
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Pending Deliveries",
            value: `${pendingCount} Purchases`,
            sub: "Invoices awaiting physical receipt",
            color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
          },
          {
            title: "Completed Receipts",
            value: `${receivedCount} Received`,
            sub: "Stock fully loaded to warehouses",
            color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
          },
          {
            title: "Total RM Investment value",
            value: `৳ ${totalRMValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            sub: "Aggregated procurement ledger sum",
            color: "text-primary-500 bg-primary-500/10 border-primary-500/20"
          }
        ].map((card, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-md p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">{card.title}</span>
              <span className="text-xl font-black text-gray-900 dark:text-white leading-none">{card.value}</span>
              <span className="text-[9px] text-gray-400 font-bold block mt-1.5 uppercase">{card.sub}</span>
            </div>
            <div className={`w-12 h-12 rounded border flex items-center justify-center font-black text-lg ${card.color}`}>
              {i === 2 ? "৳" : card.value.split(" ")[0]}
            </div>
          </div>
        ))}
      </div>

      {/* Filters Panel */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-md border border-gray-150 dark:border-gray-800 shadow-xl shadow-gray-500/5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-800/60">
            {[
              { label: "All Procurement Types", value: "all" },
              { label: "Local Purchases", value: "local" },
              { label: "Foreign Import LCs", value: "import" }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setSelectedType(tab.value)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                  selectedType === tab.value
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-450 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {[
              { label: "All Statuses", value: "all" },
              { label: "Pending Receipt", value: "pending" },
              { label: "Goods Received", value: "received" }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setSelectedStatus(tab.value)}
                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  selectedStatus === tab.value
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                    : "bg-transparent text-gray-550 border-gray-200 dark:border-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Warehouse Dropdown Filter */}
        <div className="border-t border-gray-100 dark:border-gray-800/50 pt-4">
          <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Filter by Destination Warehouse</label>
          <select
            value={filterWarehouse}
            onChange={(e) => setFilterWarehouse(e.target.value)}
            className="w-full max-w-md px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-xs font-semibold text-gray-850 dark:text-white"
          >
            <option value="all">— All Warehouses —</option>
            {warehouses.map(w => (
              <option key={w.id} value={w.id}>{w.name} ({w.type.replace('_', ' ')})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-gray-900 rounded-md shadow-xl shadow-gray-500/5 border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purchase No.</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supplier Vendor</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Procurement Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purchase Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Destination Warehouse</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount (BDT)</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-16"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-24"></div></td>
                    <td className="px-6 py-5"><div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-16"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-20"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-24"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-16"></div></td>
                    <td className="px-6 py-5"><div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-12"></div></td>
                    <td className="px-6 py-5 text-right"><div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-mono font-extrabold text-gray-900 dark:text-white">
                          {purchase.purchase_no}
                        </span>
                        {purchase.lc_no && (
                          <span className="text-[10px] font-bold text-primary-500 mt-0.5">
                            LC: {purchase.lc_no}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block">
                        {purchase.supplier?.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                        {purchase.supplier?.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {purchase.type === "import" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-full">
                          <Globe className="w-3.5 h-3.5" /> Import LC
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full">
                          <Package className="w-3.5 h-3.5" /> Local BDT
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-650 dark:text-gray-400">
                      {purchase.purchase_date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-primary-500" />
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {purchase.warehouse?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-extrabold text-gray-900 dark:text-white">
                      ৳ {parseFloat(purchase.total_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      {purchase.status === "pending" ? (
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-full">Pending Receipt</span>
                      ) : (
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white rounded-full">Received</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {purchase.status === "pending" && hasPermission("warehouses.edit") && (
                        <button
                          onClick={() => handleReceiveStock(purchase.id, purchase.purchase_no)}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded transition-all active:scale-95 flex items-center gap-1 ml-auto"
                        >
                          <CheckCircle className="w-3 h-3" /> Receive Goods
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center">
                    <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-bounce" />
                    <p className="text-sm font-bold text-gray-450">No purchase transactions match your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Procurement Modal (LC/Local Wizard) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-2xl transition-all overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Place Raw Material Procurement PO/LC
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Select vendor, transaction types, and chemical lots configuration.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSubmit}>
              <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Purchase Type */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Purchase Type *</label>
                    <select
                      value={createForm.type}
                      onChange={(e) => {
                        const t = e.target.value;
                        setCreateForm(p => ({
                          ...p,
                          type: t,
                          conversion_rate: t === "import" ? "120.00" : "1.00" // Auto set USD rate or BDT
                        }));
                      }}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all cursor-pointer font-semibold text-gray-850 dark:text-white"
                    >
                      <option value="local">Local Purchase (BDT)</option>
                      <option value="import">LC Import (Foreign USD/BDT)</option>
                    </select>
                  </div>

                  {/* Purchase Date */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Purchase Date *</label>
                    <input
                      type="date"
                      required
                      value={createForm.purchase_date}
                      onChange={(e) => setCreateForm(p => ({ ...p, purchase_date: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all font-semibold text-gray-850 dark:text-white"
                    />
                  </div>
                </div>

                {/* Import Details (LC) */}
                {createForm.type === "import" && (
                  <div className="grid grid-cols-3 gap-4 bg-primary-500/5 p-4 rounded-md border border-primary-500/10 animate-in fade-in slide-in-from-top-3">
                    <div>
                      <label className="block text-xs font-semibold text-primary-600 dark:text-primary-400 mb-2">LC Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. LC-98317-2026"
                        value={createForm.lc_no}
                        onChange={(e) => setCreateForm(p => ({ ...p, lc_no: e.target.value }))}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-primary-500/20 rounded text-xs text-gray-850 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary-600 dark:text-primary-400 mb-2">LC Date *</label>
                      <input
                        type="date"
                        required
                        value={createForm.lc_date}
                        onChange={(e) => setCreateForm(p => ({ ...p, lc_date: e.target.value }))}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-primary-500/20 rounded text-xs text-gray-850 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary-600 dark:text-primary-400 mb-2">Conversion Exchange Rate (USD/BDT) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={createForm.conversion_rate}
                        onChange={(e) => setCreateForm(p => ({ ...p, conversion_rate: e.target.value }))}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-primary-500/20 rounded text-xs text-gray-855 dark:text-white font-bold"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Supplier Vendor */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Supplier Vendor *</label>
                    <select
                      value={createForm.supplier_id}
                      onChange={(e) => setCreateForm(p => ({ ...p, supplier_id: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all cursor-pointer font-semibold text-gray-850 dark:text-white"
                      required
                    >
                      <option value="">— Select Vendor —</option>
                      {suppliers
                        .filter(s => createForm.type === "local" ? s.origin === "local" : s.origin === "foreign")
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.code})
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Destination Raw Warehouse */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Destination Warehouse *</label>
                    <select
                      value={createForm.warehouse_id}
                      onChange={(e) => setCreateForm(p => ({ ...p, warehouse_id: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all cursor-pointer font-semibold text-gray-855 dark:text-white"
                      required
                    >
                      <option value="">— Select Warehouse —</option>
                      {warehouses
                        .filter(w => w.type === "raw_material" || w.type === "central_warehouse")
                        .map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name} ({w.type.replace('_', ' ')})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Remarks / Notes</label>
                  <input
                    type="text"
                    placeholder="Enter shipment references, port clearance details..."
                    value={createForm.remarks}
                    onChange={(e) => setCreateForm(p => ({ ...p, remarks: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all text-gray-800 dark:text-white"
                  />
                </div>

                {/* Procurement Line Items */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">Procurement Items Config</span>
                    <button
                      type="button"
                      onClick={handleAddItemRow}
                      className="px-3 py-1.5 bg-primary-500/10 text-primary-500 hover:bg-primary-500 hover:text-white rounded text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Line
                    </button>
                  </div>

                  <div className="space-y-4">
                    {createForm.items.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-end bg-gray-50 dark:bg-gray-800/20 p-3 rounded border border-gray-100 dark:border-gray-800">
                        {/* Product Dropdown */}
                        <div className="flex-1">
                          <label className="block text-[9px] font-extrabold text-gray-400 uppercase mb-1">Product *</label>
                          <select
                            value={item.product_id}
                            onChange={(e) => handleItemRowChange(idx, "product_id", e.target.value)}
                            className="w-full px-2 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs font-semibold text-gray-850 dark:text-white"
                            required
                          >
                            <option value="">— Select Material —</option>
                            {products
                              .filter(p => p.type === "raw_material" || p.type === "packaging_material")
                              .map(p => (
                                <option key={p.id} value={p.id}>
                                  [{p.type.replace('_', ' ')}] {p.name}
                                </option>
                              ))}
                          </select>
                        </div>

                        {/* Qty */}
                        <div className="w-20">
                          <label className="block text-[9px] font-extrabold text-gray-400 uppercase mb-1">Quantity *</label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => handleItemRowChange(idx, "quantity", e.target.value)}
                            className="w-full px-2 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs font-semibold text-gray-850 dark:text-white"
                            required
                          />
                        </div>

                        {/* Rate */}
                        <div className="w-20">
                          <label className="block text-[9px] font-extrabold text-gray-400 uppercase mb-1">
                            {createForm.type === "import" ? "Rate (USD)" : "Rate (BDT)"} *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Rate"
                            value={item.rate}
                            onChange={(e) => handleItemRowChange(idx, "rate", e.target.value)}
                            className="w-full px-2 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs font-semibold text-gray-855 dark:text-white"
                            required
                          />
                        </div>

                        {/* Batch No */}
                        <div className="w-28">
                          <label className="block text-[9px] font-extrabold text-gray-400 uppercase mb-1">Lot Batch No.</label>
                          <input
                            type="text"
                            placeholder="e.g. LOT-CHEM-9"
                            value={item.batch_no}
                            onChange={(e) => handleItemRowChange(idx, "batch_no", e.target.value)}
                            className="w-full px-2 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs text-gray-850 dark:text-white"
                          />
                        </div>

                        {/* Expiry */}
                        <div className="w-28">
                          <label className="block text-[9px] font-extrabold text-gray-400 uppercase mb-1">Expiry Date</label>
                          <input
                            type="date"
                            value={item.expiry_date}
                            onChange={(e) => handleItemRowChange(idx, "expiry_date", e.target.value)}
                            className="w-full px-2 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs text-gray-850 dark:text-white"
                          />
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          disabled={createForm.items.length === 1}
                          onClick={() => handleRemoveItemRow(idx)}
                          className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all mb-0.5"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
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
                  Submit Procurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

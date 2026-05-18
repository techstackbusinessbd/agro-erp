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
  FileText
} from "lucide-react";
import { warehouseApi } from "../api/warehouseApi";
import { masterDataApi } from "../../master-data/api/masterDataApi";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";

export default function StockTransferPage() {
  const { hasPermission } = useAuth();
  const [transfers, setTransfers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Advanced Filters
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [filterDest, setFilterDest] = useState("all");

  // Create Modal Form State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createForm, setCreateForm] = useState({
    source_warehouse_id: "",
    destination_warehouse_id: "",
    remarks: "",
    items: [{ product_id: "", quantity_requested: "" }]
  });

  // Action Modals State
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [actionItems, setActionItems] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [transRes, whRes, prodRes] = await Promise.all([
        warehouseApi.getTransfers(),
        warehouseApi.getWarehouses(),
        masterDataApi.getProducts()
      ]);

      if (transRes.status === "Success" && Array.isArray(transRes.data)) {
        setTransfers(transRes.data);
      }
      if (whRes.status === "Success" && Array.isArray(whRes.data)) {
        setWarehouses(whRes.data);
      }
      if (prodRes.status === "Success" && Array.isArray(prodRes.data)) {
        setProducts(prodRes.data.filter(p => p.is_active));
      }
    } catch (error) {
      toast.error("Failed to load transfer ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Multi-dimensional filtering logic
  const finalFilteredTransfers = transfers.filter((t) => {
    // 1. Search Query
    const query = search.toLowerCase();
    const matchesSearch = 
      t.code.toLowerCase().includes(query) ||
      t.source_warehouse_name.toLowerCase().includes(query) ||
      t.destination_warehouse_name.toLowerCase().includes(query) ||
      t.status.toLowerCase().includes(query);

    // 2. Status Filter
    const matchesStatus = selectedStatus === "all" || t.status === selectedStatus;

    // 3. Source Filter
    const matchesSource = filterSource === "all" || t.source_warehouse_id === filterSource;

    // 4. Destination Filter
    const matchesDest = filterDest === "all" || t.destination_warehouse_id === filterDest;

    return matchesSearch && matchesStatus && matchesSource && matchesDest;
  });

  // Create Modal Actions
  const handleOpenCreateModal = () => {
    const parentWh = warehouses.find(w => w.type !== "depot");
    const childWh = warehouses.find(w => w.type === "depot");
    setCreateForm({
      source_warehouse_id: parentWh?.id || "",
      destination_warehouse_id: childWh?.id || "",
      remarks: "",
      items: [{ product_id: products[0]?.id || "", quantity_requested: "" }]
    });
    setIsCreateModalOpen(true);
  };

  const handleAddItemRow = () => {
    setCreateForm(prev => ({
      ...prev,
      items: [...prev.items, { product_id: products[0]?.id || "", quantity_requested: "" }]
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
    if (!createForm.source_warehouse_id || !createForm.destination_warehouse_id) {
      toast.error("Please select both source and destination warehouses.");
      return;
    }
    if (createForm.source_warehouse_id === createForm.destination_warehouse_id) {
      toast.error("Source and destination locations must be different.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await warehouseApi.createTransfer(createForm);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Internal requisition submitted! Order is now PENDING approval.");
        fetchInitialData();
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create transfer order");
    } finally {
      setSubmitting(false);
    }
  };

  // Status transitions
  const handleApprove = async (id) => {
    Swal.fire({
      title: 'Approve Requisition?',
      text: "This authorizes the supply depot to prepare physical dispatch.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Yes, Approve Request',
      background: document.documentElement.classList.contains('dark') ? '#111827' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await warehouseApi.approveTransfer(id);
          toast.success("Requisition approved successfully!");
          fetchInitialData();
        } catch (error) {
          toast.error(error.response?.data?.message || "Approval failed");
        }
      }
    });
  };

  const handleOpenShipModal = (transfer) => {
    setSelectedTransfer(transfer);
    setActionItems(transfer.items.map(item => ({
      product_id: item.product_id,
      product_code: item.product_code,
      product_name: item.product_name,
      quantity_requested: item.quantity_requested,
      quantity_shipped: item.quantity_requested // Default ship amount to request amount
    })));
    setIsShipModalOpen(true);
  };

  const handleShipSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await warehouseApi.shipTransfer(selectedTransfer.id, { items: actionItems });
      toast.success("Stock Transfer Shipped! Quantities are now In-Transit.");
      fetchInitialData();
      setIsShipModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark order as shipped");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenReceiveModal = (transfer) => {
    setSelectedTransfer(transfer);
    setActionItems(transfer.items.map(item => ({
      product_id: item.product_id,
      product_code: item.product_code,
      product_name: item.product_name,
      quantity_shipped: item.quantity_shipped,
      quantity_received: item.quantity_shipped // Default receive amount to shipped amount
    })));
    setIsReceiveModalOpen(true);
  };

  const handleReceiveSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await warehouseApi.receiveTransfer(selectedTransfer.id, { items: actionItems });
      toast.success("Inventory received! Quantities loaded to destination physical stock.");
      fetchInitialData();
      setIsReceiveModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark order as received");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (id) => {
    Swal.fire({
      title: 'Cancel Transfer Request?',
      text: "This will permanently cancel this stock movement.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Cancel Order',
      background: document.documentElement.classList.contains('dark') ? '#111827' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await warehouseApi.cancelTransfer(id);
          toast.success("Transfer order cancelled");
          fetchInitialData();
        } catch (error) {
          toast.error(error.response?.data?.message || "Cancellation failed");
        }
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full">Pending</span>;
      case "approved":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full">Approved</span>;
      case "shipped":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-full inline-flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> In-Transit</span>;
      case "received":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white rounded-full inline-flex items-center gap-1">Completed</span>;
      case "cancelled":
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20 rounded-full">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 border border-gray-200 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="pb-10 min-h-screen space-y-8">
      {/* Premium Sticky Header */}
      <div className="sticky top-4 z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-6 rounded-md border border-gray-100/50 dark:border-gray-800/50 shadow-xl shadow-gray-500/5 transition-all mb-8">
        <div className="space-y-1 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
              <Truck className="w-4.5 h-4.5 text-primary-500" />
            </div>
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 tracking-wider">Internal Requisitions</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Requisitions & Stock Transfers</h1>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Request and tracking portal for inventory movement across depots and hubs.</p>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-6 group relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search transfer by code, source, destination..."
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
              New Requisition (STO)
            </button>
          )}
        </div>
      </div>

      {/* Dynamic KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: "Pending Requisitions", 
            count: transfers.filter(t => t.status === "pending").length, 
            sub: "Requires approval", 
            color: "text-blue-500 bg-blue-500/10 border-blue-500/20" 
          },
          { 
            title: "Approved / Dispatched", 
            count: transfers.filter(t => t.status === "approved").length, 
            sub: "Awaiting shipping dispatch", 
            color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" 
          },
          { 
            title: "In-Transit Shipments", 
            count: transfers.filter(t => t.status === "shipped").length, 
            sub: "On the logistics road", 
            color: "text-amber-500 bg-amber-500/10 border-amber-500/20" 
          },
          { 
            title: "Completed Transfers", 
            count: transfers.filter(t => t.status === "received").length, 
            sub: "Stocks fully loaded", 
            color: "text-primary-500 bg-primary-500/10 border-primary-500/20" 
          }
        ].map((card, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-md p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">{card.title}</span>
              <span className="text-2xl font-black text-gray-900 dark:text-white leading-none">{card.count} Orders</span>
              <span className="text-[9px] text-gray-400 font-bold block mt-1.5 uppercase">{card.sub}</span>
            </div>
            <div className={`w-12 h-12 rounded border flex items-center justify-center font-black text-lg ${card.color}`}>
              {card.count}
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-md border border-gray-150 dark:border-gray-800 shadow-xl shadow-gray-500/5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-800/60 max-w-3xl">
            {[
              { label: "All Requisitions", value: "all" },
              { label: "Pending Requisition", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "In-Transit", value: "shipped" },
              { label: "Completed", value: "received" },
              { label: "Cancelled", value: "cancelled" }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setSelectedStatus(tab.value)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                  selectedStatus === tab.value
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-450 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Matched Orders: <span className="text-gray-900 dark:text-white font-extrabold">{finalFilteredTransfers.length}</span>
          </div>
        </div>

        {/* Warehouse Dropdown Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800/50 pt-4">
          <div>
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Filter by Supply Source (From)</label>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-xs font-semibold text-gray-800 dark:text-white"
            >
              <option value="all">— All Sources —</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name} ({w.type.replace('_', ' ')})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Filter by Destination (To Depot/WH)</label>
            <select
              value={filterDest}
              onChange={(e) => setFilterDest(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-xs font-semibold text-gray-800 dark:text-white"
            >
              <option value="all">— All Destinations —</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name} ({w.type.replace('_', ' ')})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* STO Table */}
      <div className="bg-white dark:bg-gray-900 rounded-md shadow-xl shadow-gray-500/5 border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">STO Code</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supply Source</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Items count</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-16"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-24"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-6"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-24"></div></td>
                    <td className="px-6 py-5"><div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-12"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-8"></div></td>
                    <td className="px-6 py-5 text-right"><div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : finalFilteredTransfers.length > 0 ? (
                finalFilteredTransfers.map((trans) => (
                  <tr
                    key={trans.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-extrabold text-gray-900 dark:text-white">
                        {trans.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-primary-500" />
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {trans.source_warehouse_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {trans.destination_warehouse_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(trans.status)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-650 dark:text-gray-400">
                      {trans.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {trans.status === "pending" && hasPermission("warehouses.edit") && (
                          <button
                            onClick={() => handleApprove(trans.id)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded transition-all active:scale-95"
                          >
                            Approve
                          </button>
                        )}
                        {trans.status === "approved" && hasPermission("warehouses.edit") && (
                          <button
                            onClick={() => handleOpenShipModal(trans)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded transition-all active:scale-95 flex items-center gap-1"
                          >
                            <Truck className="w-3 h-3" /> Ship Dispatch
                          </button>
                        )}
                        {trans.status === "shipped" && hasPermission("warehouses.edit") && (
                          <button
                            onClick={() => handleOpenReceiveModal(trans)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded transition-all active:scale-95 flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" /> Receive Stock
                          </button>
                        )}
                        {["pending", "approved"].includes(trans.status) && hasPermission("warehouses.edit") && (
                          <button
                            onClick={() => handleCancel(trans.id)}
                            className="p-1.5 hover:bg-red-500/10 rounded text-gray-400 hover:text-red-500"
                            title="Cancel Order"
                          >
                            <XCircle className="w-4.5 h-4.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-bounce" />
                    <p className="text-sm font-bold text-gray-450">No stock requisition orders match your active filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Stock Transfer Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-2xl transition-all overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Place Internal Stock Requisition
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Select supply source and line configurations to place stock demand.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSubmit}>
              <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Source Warehouse */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Supply Source (From) *</label>
                    <select
                      name="source_warehouse_id"
                      value={createForm.source_warehouse_id}
                      onChange={(e) => {
                        const newSource = e.target.value;
                        setCreateForm(p => ({
                          ...p,
                          source_warehouse_id: newSource,
                          destination_warehouse_id: p.destination_warehouse_id === newSource ? "" : p.destination_warehouse_id
                        }));
                      }}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all cursor-pointer font-semibold text-gray-850 dark:text-white"
                      required
                    >
                      <option value="">— Select Source —</option>
                      {warehouses.map((wh) => (
                        <option key={wh.id} value={wh.id}>
                          {wh.name} ({wh.type.replace('_', ' ')})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Destination Warehouse */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Destination (To Depot/WH) *</label>
                    <select
                      name="destination_warehouse_id"
                      value={createForm.destination_warehouse_id}
                      onChange={(e) => setCreateForm(p => ({ ...p, destination_warehouse_id: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all cursor-pointer font-semibold text-gray-855 dark:text-white"
                      required
                    >
                      <option value="">— Select Destination —</option>
                      {warehouses
                        .filter(wh => wh.id !== createForm.source_warehouse_id)
                        .map((wh) => (
                          <option key={wh.id} value={wh.id}>
                            {wh.name} ({wh.type.replace('_', ' ')})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 font-semibold">Remarks / Notes</label>
                  <input
                    type="text"
                    placeholder="Enter transport references, vehicle requirements..."
                    value={createForm.remarks}
                    onChange={(e) => setCreateForm(p => ({ ...p, remarks: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all text-gray-800 dark:text-white"
                  />
                </div>

                {/* Dynamic Line Items */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">Requisition Line Items</span>
                    <button
                      type="button"
                      onClick={handleAddItemRow}
                      className="px-3 py-1.5 bg-primary-500/10 text-primary-500 hover:bg-primary-500 hover:text-white rounded text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Line Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {createForm.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        {/* Product Dropdown */}
                        <div className="flex-1">
                          <select
                            value={item.product_id}
                            onChange={(e) => handleItemRowChange(idx, "product_id", e.target.value)}
                            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-xs font-semibold text-gray-850 dark:text-white"
                            required
                          >
                            <option value="">— Select Product —</option>
                            {products.map(p => (
                              <option key={p.id} value={p.id}>
                                [{p.code}] {p.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Request Qty */}
                        <div className="w-28">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Req Qty"
                            value={item.quantity_requested}
                            onChange={(e) => handleItemRowChange(idx, "quantity_requested", e.target.value)}
                            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-xs text-gray-850 dark:text-white"
                            required
                          />
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          disabled={createForm.items.length === 1}
                          onClick={() => handleRemoveItemRow(idx)}
                          className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ship Verification Modal */}
      {isShipModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-2xl transition-all overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
              <Truck className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Confirm Shipping Qty</h3>
                <p className="text-xs text-gray-400">Specify physical quantity dispatched from source warehouse.</p>
              </div>
            </div>

            <form onSubmit={handleShipSubmit}>
              <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
                {actionItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800/50 pb-3 last:border-b-0">
                    <div>
                      <p className="text-xs font-semibold text-gray-950 dark:text-white">{item.product_name}</p>
                      <span className="text-[10px] text-gray-400">Req: {item.quantity_requested}</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      className="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded text-xs text-gray-850 dark:text-white font-bold"
                      value={item.quantity_shipped}
                      onChange={(e) => {
                        const val = [...actionItems];
                        val[idx].quantity_shipped = e.target.value;
                        setActionItems(val);
                      }}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t flex justify-end gap-3">
                <button type="button" onClick={() => setIsShipModalOpen(false)} className="px-4 py-2 border rounded text-xs font-bold">Cancel</button>
                <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-bold flex items-center gap-1">
                  {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Confirm & Ship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receive Verification Modal */}
      {isReceiveModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-2xl transition-all overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Confirm Received Qty</h3>
                <p className="text-xs text-gray-400">Audit physical quantity loaded at depot site.</p>
              </div>
            </div>

            <form onSubmit={handleReceiveSubmit}>
              <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
                {actionItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800/50 pb-3 last:border-b-0">
                    <div>
                      <p className="text-xs font-semibold text-gray-955 dark:text-white">{item.product_name}</p>
                      <span className="text-[10px] text-gray-400">Shipped: {item.quantity_shipped}</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      className="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded text-xs text-gray-850 dark:text-white font-bold"
                      value={item.quantity_received}
                      onChange={(e) => {
                        const val = [...actionItems];
                        val[idx].quantity_received = e.target.value;
                        setActionItems(val);
                      }}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t flex justify-end gap-3">
                <button type="button" onClick={() => setIsReceiveModalOpen(false)} className="px-4 py-2 border rounded text-xs font-bold">Cancel</button>
                <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-bold flex items-center gap-1">
                  {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Confirm & Receive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

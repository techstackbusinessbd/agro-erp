import React, { useState, useEffect } from "react";
import {
  Search,
  Boxes,
  Loader2,
  TrendingUp,
  Truck,
  Edit2,
  Building2,
  Package
} from "lucide-react";
import { warehouseApi } from "../api/warehouseApi";
import { masterDataApi } from "../../master-data/api/masterDataApi";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";

export default function WarehouseStockPage() {
  const { hasPermission } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Direct adjustment modal state
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  const [adjustForm, setAdjustForm] = useState({
    warehouse_id: "",
    product_id: "",
    physical_qty: ""
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stockRes, whRes, prodRes] = await Promise.all([
        warehouseApi.getStocks(),
        warehouseApi.getWarehouses(),
        masterDataApi.getProducts()
      ]);

      if (stockRes.status === "Success" && Array.isArray(stockRes.data)) {
        setStocks(stockRes.data);
      }
      if (whRes.status === "Success" && Array.isArray(whRes.data)) {
        setWarehouses(whRes.data);
      }
      if (prodRes.status === "Success" && Array.isArray(prodRes.data)) {
        setProducts(prodRes.data.filter(p => p.is_active));
      }
    } catch (error) {
      toast.error("Failed to load inventory balances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredStocks = stocks.filter((stock) => {
    const query = search.toLowerCase();
    return (
      stock.warehouse_name.toLowerCase().includes(query) ||
      stock.warehouse_code.toLowerCase().includes(query) ||
      stock.product_name.toLowerCase().includes(query) ||
      stock.product_code.toLowerCase().includes(query)
    );
  });

  const handleOpenAdjustModal = (stock = null) => {
    if (stock) {
      setAdjustForm({
        warehouse_id: stock.warehouse_id,
        product_id: stock.product_id,
        physical_qty: stock.physical_qty
      });
    } else {
      setAdjustForm({
        warehouse_id: warehouses[0]?.id || "",
        product_id: products[0]?.id || "",
        physical_qty: ""
      });
    }
    setFormErrors({});
    setIsAdjustModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdjustForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!adjustForm.warehouse_id || !adjustForm.product_id || adjustForm.physical_qty === "") {
      toast.error("Please fill in all required fields.");
      return;
    }

    setAdjusting(true);
    try {
      const response = await warehouseApi.adjustStock(adjustForm);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Physical stock level updated successfully");
        fetchData();
        setIsAdjustModalOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to adjust stock level");
    } finally {
      setAdjusting(false);
    }
  };

  // Aggregated card values
  const totalPhysicalItems = stocks.reduce((acc, curr) => acc + curr.physical_qty, 0);
  const totalTransitItems = stocks.reduce((acc, curr) => acc + curr.transit_qty, 0);

  return (
    <div className="pb-10 min-h-screen space-y-8">
      {/* Sticky Header */}
      <div className="sticky top-4 z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-6 rounded-md border border-gray-100/50 dark:border-gray-800/50 shadow-xl shadow-gray-500/5 transition-all mb-8">
        <div className="space-y-1 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
              <Boxes className="w-4.5 h-4.5 text-primary-500" />
            </div>
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 tracking-wider">Warehouse Management</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Inventory Balances</h1>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Monitor real-time Physical vs In-Transit stocks across all supply locations.</p>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-6 group relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search stock by warehouse name, code, or product SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {hasPermission("warehouses.edit") && (
            <button
              onClick={() => handleOpenAdjustModal()}
              className="flex items-center gap-2 px-5 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-lg shadow-primary-500/20 transition-all active:scale-95 group"
            >
              <TrendingUp className="w-4 h-4 transition-transform group-hover:translate-y-[-2px]" />
              Adjust Stock Level
            </button>
          )}
        </div>
      </div>

      {/* High Fidelity KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-md shadow-md flex items-center gap-5">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Physical Stock</p>
            <p className="text-3xl font-extrabold text-gray-955 dark:text-white mt-1 leading-none">
              {totalPhysicalItems.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-md shadow-md flex items-center gap-5">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center animate-pulse">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total In-Transit Stock</p>
            <p className="text-3xl font-extrabold text-gray-955 dark:text-white mt-1 leading-none">
              {totalTransitItems.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-md shadow-md flex items-center gap-5">
          <div className="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Locations</p>
            <p className="text-3xl font-extrabold text-gray-955 dark:text-white mt-1 leading-none">
              {warehouses.length}
            </p>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white dark:bg-gray-900 rounded-md shadow-xl shadow-gray-500/5 border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Warehouse / Depot</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product SKU</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Physical On-Hand</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">In-Transit (Truck)</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Total Book Value</th>
                {hasPermission("warehouses.edit") && (
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Adjust</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/4"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/3"></div></td>
                    <td className="px-6 py-5 text-right"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-16 ml-auto"></div></td>
                    <td className="px-6 py-5 text-right"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-16 ml-auto"></div></td>
                    <td className="px-6 py-5 text-right"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-16 ml-auto"></div></td>
                    {hasPermission("warehouses.edit") && <td className="px-6 py-5 text-right"><div className="h-6 bg-gray-100 dark:bg-gray-800 rounded w-8 ml-auto"></div></td>}
                  </tr>
                ))
              ) : filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
                  <tr
                    key={stock.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary-500/5 flex items-center justify-center">
                          <Building2 className="w-4.5 h-4.5 text-primary-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{stock.warehouse_name}</p>
                          <span className="text-[10px] text-gray-400 font-mono">{stock.warehouse_code}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        stock.warehouse_type === "depot"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-primary-500/10 text-primary-600 dark:text-primary-400"
                      }`}>
                        {stock.warehouse_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{stock.product_name}</p>
                        <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-mono px-1.5 py-0.5 rounded">{stock.product_code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-sm text-emerald-600 dark:text-emerald-400">
                      {stock.physical_qty.toFixed(2)} <span className="text-[10px] font-normal text-gray-400">{stock.uom_code}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      {stock.transit_qty > 0 ? (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                          <Truck className="w-3.5 h-3.5 animate-bounce" /> {stock.transit_qty.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-sm text-gray-900 dark:text-white">
                      {(stock.physical_qty + stock.transit_qty).toFixed(2)} <span className="text-[10px] font-normal text-gray-400">{stock.uom_code}</span>
                    </td>
                    {hasPermission("warehouses.edit") && (
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenAdjustModal(stock)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-500 dark:text-gray-400 hover:text-primary-500"
                          title="Direct Adjust"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <Boxes className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm font-bold text-gray-400">No inventory entries available</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Level Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-2xl transition-all overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Adjust Physical Balance
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Set a base physical inventory level directly. Useful for manual audit adjustments.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAdjustSubmit}>
              <div className="p-6 space-y-4">
                {/* Warehouse */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 font-semibold font-semibold">Location / Warehouse *</label>
                  <select
                    name="warehouse_id"
                    value={adjustForm.warehouse_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all cursor-pointer font-semibold text-gray-800 dark:text-white"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.id}>
                        [{wh.type.toUpperCase()}] {wh.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product SKU */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 font-semibold font-semibold">Product *</label>
                  <select
                    name="product_id"
                    value={adjustForm.product_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all cursor-pointer font-semibold text-gray-800 dark:text-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        [{p.code}] {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Physical Qty */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 font-semibold">New On-Hand Physical Stock *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="physical_qty"
                    value={adjustForm.physical_qty}
                    onChange={handleInputChange}
                    placeholder="Enter absolute physical count, e.g. 5000.00"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all"
                    required
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Important: This is a direct physical override for auditing purposes. It does not affect in-transit amounts.
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-5 py-2.5 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-800 text-xs font-bold rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-md shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2"
                >
                  {adjusting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

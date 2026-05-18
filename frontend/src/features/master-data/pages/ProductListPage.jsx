import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Loader2,
  CheckCircle,
  XCircle,
  FolderOpen,
  Ruler,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { masterDataApi } from "../api/masterDataApi";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";

export default function ProductListPage() {
  const { hasPermission } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Variants & Accordion States
  const [expandedProducts, setExpandedProducts] = useState(new Set());
  const [productVariantsMap, setProductVariantsMap] = useState({});
  const [variantsLoadingMap, setVariantsLoadingMap] = useState({});

  const toggleProductExpand = async (id) => {
    setExpandedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    if (!productVariantsMap[id] && !variantsLoadingMap[id]) {
      setVariantsLoadingMap(prev => ({ ...prev, [id]: true }));
      try {
        const res = await masterDataApi.getVariants(id);
        if (res.status === "Success" && Array.isArray(res.data)) {
          setProductVariantsMap(prev => ({ ...prev, [id]: res.data }));
        }
      } catch (err) {
        toast.error("Failed to load variants");
      } finally {
        setVariantsLoadingMap(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category_id: "",
    uom_id: "",
    description: "",
    is_active: true,
    batch_required: false,
    price: "0.00",
    tax_rate: "0.00",
    variants: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, uomRes] = await Promise.all([
        masterDataApi.getProducts(),
        masterDataApi.getCategories(),
        masterDataApi.getUoms()
      ]);

      if (prodRes.status === "Success" && Array.isArray(prodRes.data)) {
        setProducts(prodRes.data);
      }
      if (catRes.status === "Success" && Array.isArray(catRes.data)) {
        setCategories(catRes.data);
      }
      if (uomRes.status === "Success" && Array.isArray(uomRes.data)) {
        setUoms(uomRes.data);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        window.location.href = '/unauthorized';
      } else {
        toast.error("Failed to load initial master data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const filteredProducts = products.filter((prod) => {
    const query = search.toLowerCase();
    return (
      prod.name.toLowerCase().includes(query) ||
      prod.code.toLowerCase().includes(query) ||
      (prod.category_name && prod.category_name.toLowerCase().includes(query)) ||
      (prod.uom_name && prod.uom_name.toLowerCase().includes(query))
    );
  });

  const handleOpenModal = async (product = null) => {
    setFormErrors({});
    if (product) {
      setSelectedProduct(product);
      setFormData({
        code: product.code,
        name: product.name,
        category_id: product.category_id || "",
        uom_id: product.uom_id || "",
        description: product.description || "",
        is_active: product.is_active,
        batch_required: !!product.batch_required,
        price: product.price || "0.00",
        tax_rate: product.tax_rate || "0.00",
        variants: []
      });
      setIsModalOpen(true);

      try {
        const res = await masterDataApi.getProduct(product.id);
        if (res.status === "Success" && res.data) {
          setFormData(prev => ({
            ...prev,
            variants: res.data.variants || []
          }));
        }
      } catch (err) {
        toast.error("Failed to load product variants");
      }
    } else {
      setSelectedProduct(null);
      // Auto generate code suggestion
      const count = products.length + 1;
      const autoCode = 'PRD-' + String(count).padStart(3, '0');
      setFormData({
        code: autoCode,
        name: "",
        category_id: "",
        uom_id: "",
        description: "",
        is_active: true,
        batch_required: false,
        price: "0.00",
        tax_rate: "0.00",
        variants: [{ pack_size: "", sku_code: "", rate_per_ct: "0.00", commission_rate: "0.00", is_active: true }]
      });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const nextFormData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value
      };

      // Auto-update SKU codes if the product code is changed
      if (name === "code" && prev.variants) {
        nextFormData.variants = prev.variants.map((variant) => {
          const currentSku = variant.sku_code || "";
          const cleanPack = (variant.pack_size || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
          const oldSuggested = prev.code ? `${prev.code}-${cleanPack}` : cleanPack;

          if (!currentSku || currentSku === oldSuggested || currentSku === "") {
            return {
              ...variant,
              sku_code: value ? `${value}-${cleanPack}` : cleanPack
            };
          }
          return variant;
        });
      }

      return nextFormData;
    });
  };

  const handleAddVariantRow = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { pack_size: "", sku_code: "", rate_per_ct: "0.00", commission_rate: "0.00", is_active: true }]
    }));
  };

  const handleRemoveVariantRow = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== index)
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.variants];
      let updatedVariant = { ...updated[index], [field]: value };

      // Auto-generate SKU Code dynamically as they type the Pack Size
      if (field === "pack_size") {
        const cleanPack = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
        const suggestedSku = prev.code ? `${prev.code}-${cleanPack}` : cleanPack;

        const currentSku = updatedVariant.sku_code || "";
        const oldCleanPack = (updated[index].pack_size || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
        const oldSuggested = prev.code ? `${prev.code}-${oldCleanPack}` : oldCleanPack;

        if (!currentSku || currentSku === oldSuggested || currentSku === "") {
          updatedVariant.sku_code = suggestedSku;
        }
      }

      updated[index] = updatedVariant;
      return { ...prev, variants: updated };
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) {
      errors.code = "Product Code is required";
    }
    if (!formData.name.trim()) {
      errors.name = "Product Name is required";
    }

    if (formData.variants && formData.variants.length > 0) {
      const variantErrors = [];
      formData.variants.forEach((v, idx) => {
        if (!v.pack_size || !v.pack_size.trim()) {
          variantErrors[idx] = "Pack size is required";
        }
      });
      if (variantErrors.some(err => !!err)) {
        errors.variants = variantErrors;
        toast.error("Please fill in the Pack Size for all variants.");
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (selectedProduct) {
        // Update operation
        const response = await masterDataApi.updateProduct(selectedProduct.id, formData);
        if (response.status >= 200 && response.status < 300) {
          toast.success("Product updated successfully");
          fetchInitialData();
          handleCloseModal();
        }
      } else {
        // Create operation
        const response = await masterDataApi.createProduct(formData);
        if (response.status >= 200 && response.status < 300) {
          toast.success("Product created successfully");
          fetchInitialData();
          handleCloseModal();
        }
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || "An error occurred while saving the product");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Stocks linked to this product will be affected!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      background: document.documentElement.classList.contains('dark') ? '#111827' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await masterDataApi.deleteProduct(id);
          Swal.fire('Deleted!', 'Product has been deleted.', 'success');
          fetchInitialData();
        } catch (error) {
          Swal.fire('Error!', error.response?.data?.message || 'Failed to delete product.', 'error');
        }
      }
    });
  };

  return (
    <div className="pb-10 min-h-screen space-y-8">
      {/* Premium Sticky Header */}
      <div className="sticky top-4 z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-6 rounded-md border border-gray-100/50 dark:border-gray-800/50 shadow-xl shadow-gray-500/5 transition-all mb-8">
        <div className="space-y-1 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
              <Package className="w-4.5 h-4.5 text-primary-500" />
            </div>
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 tracking-wider">Master Data Management</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Products Catalog</h1>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Define master catalog items for standard unit transfer and inventory control.</p>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-6 group relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search products by code, name, category or unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="flex gap-6 pr-6 border-r border-gray-200 dark:border-gray-800">
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Catalog Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none mt-1">{products.length}</p>
            </div>
          </div>
          {hasPermission("products.create") && (
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-5 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-lg shadow-primary-500/20 transition-all active:scale-95 group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-900 rounded-md shadow-xl shadow-gray-500/5 border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <th className="w-12 px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center"></th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">SKU / Code</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Base UOM</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Base Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Batch Tracking</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-4 mx-auto"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/3"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-2/3"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/3"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/4"></div></td>
                    <td className="px-6 py-5"><div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-12"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-16"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-12"></div></td>
                    <td className="px-6 py-5 text-right"><div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <React.Fragment key={prod.id}>
                    <tr
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleProductExpand(prod.id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-500"
                          title="Toggle Pack Sizes"
                        >
                          {expandedProducts.has(prod.id) ? (
                            <ChevronDown className="w-4.5 h-4.5 text-primary-500 transition-transform" />
                          ) : (
                            <ChevronRight className="w-4.5 h-4.5 text-gray-400 transition-transform" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-bold bg-primary-500/10 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded">
                          {prod.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span>{prod.name}</span>
                          {prod.variants_count > 0 && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary-500/10 text-primary-600 dark:text-primary-400">
                              {prod.variants_count} Variant{prod.variants_count > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {prod.category_name ? (
                          <span className="flex items-center gap-1.5">
                            <FolderOpen className="w-3.5 h-3.5 text-primary-500" />
                            {prod.category_name}
                          </span>
                        ) : (
                          <span className="italic text-gray-300">Unclassified</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {prod.uom_name ? (
                          <span className="flex items-center gap-1.5">
                            <Ruler className="w-3.5 h-3.5 text-primary-500" />
                            {prod.uom_name} ({prod.uom_code})
                          </span>
                        ) : (
                          <span className="italic text-gray-300">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        ৳{parseFloat(prod.price || 0).toFixed(2)}
                        <span className="text-[10px] text-gray-400 block">+{parseFloat(prod.tax_rate || 0).toFixed(1)}% Tax</span>
                      </td>
                      <td className="px-6 py-4">
                        {prod.batch_required ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Batch + Expiry
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-500/10 text-gray-500 dark:text-gray-400">
                            Standard (FIFO)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {prod.is_active ? (
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
                          {hasPermission("products.edit") && (
                            <button
                              onClick={() => handleOpenModal(prod)}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-500"
                              title="Edit Product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {hasPermission("products.delete") && (
                            <button
                              onClick={() => handleDelete(prod.id)}
                              className="p-2 hover:bg-red-500/10 rounded transition-colors text-gray-500 dark:text-gray-400 hover:text-red-500"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Accordion Expanded Panel */}
                    {expandedProducts.has(prod.id) && (
                      <tr className="bg-gray-50/20 dark:bg-gray-900/30">
                        <td colSpan="9" className="px-8 py-4">
                          <div className="bg-gray-50 dark:bg-gray-800/40 rounded border border-gray-200 dark:border-gray-800 p-4 space-y-3">
                            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                Product Variants / Pack Sizes ({prod.variants_count || 0})
                              </span>
                              <span className="text-[10px] font-semibold text-gray-400">
                                Active pricing and sales configuration
                              </span>
                            </div>

                            {variantsLoadingMap[prod.id] ? (
                              <div className="flex items-center justify-center py-6 gap-2 text-xs text-gray-450">
                                <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                                Fetching variants...
                              </div>
                            ) : productVariantsMap[prod.id] && productVariantsMap[prod.id].length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-800">
                                      <th className="py-2 text-[10px] font-semibold text-gray-400 uppercase">Pack Size</th>
                                      <th className="py-2 text-[10px] font-semibold text-gray-400 uppercase">SKU Code</th>
                                      <th className="py-2 text-[10px] font-semibold text-gray-400 uppercase text-right">Rate / Carton</th>
                                      <th className="py-2 text-[10px] font-semibold text-gray-400 uppercase text-right">Commission Rate</th>
                                      <th className="py-2 text-[10px] font-semibold text-gray-400 uppercase text-center">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/40">
                                    {productVariantsMap[prod.id].map((variant) => (
                                      <tr key={variant.id} className="hover:bg-gray-100/20 dark:hover:bg-gray-800/20 transition-all">
                                        <td className="py-2 text-xs font-bold text-gray-850 dark:text-gray-200">{variant.pack_size}</td>
                                        <td className="py-2 text-xs font-mono text-gray-500">{variant.sku_code || "—"}</td>
                                        <td className="py-2 text-xs font-extrabold text-gray-900 dark:text-white text-right">
                                          ৳{parseFloat(variant.rate_per_ct || 0).toFixed(2)}
                                        </td>
                                        <td className="py-2 text-xs font-bold text-primary-600 dark:text-primary-400 text-right">
                                          {parseFloat(variant.commission_rate || 0).toFixed(1)}%
                                        </td>
                                        <td className="py-2 text-xs text-center">
                                          {variant.is_active ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600">
                                              Active
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-red-500/10 text-red-650">
                                              Inactive
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-450 italic py-2">
                                No variants found. Click "Edit Product" to add packaging sizes.
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm font-bold text-gray-400">No products found matching query</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-2xl transition-all overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    {selectedProduct ? "Edit Product Details" : "Add New Product"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Fill in the master catalog properties for stock transfers.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit}>
              <div className="p-6 space-y-4">
                {/* SKU Code */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Product SKU / Code *</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="E.g. PRD-001"
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${formErrors.code ? "border-red-500" : "border-gray-200 dark:border-gray-800"} rounded-md text-sm font-mono focus:border-primary-500 transition-all outline-none`}
                  />
                  {formErrors.code && (
                    <span className="text-xs text-red-500 font-medium mt-1 block">{formErrors.code}</span>
                  )}
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="E.g. High Yield Paddy Seeds v3"
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${formErrors.name ? "border-red-500" : "border-gray-200 dark:border-gray-800"} rounded-md text-sm focus:border-primary-500 transition-all outline-none`}
                  />
                  {formErrors.name && (
                    <span className="text-xs text-red-500 font-medium mt-1 block">{formErrors.name}</span>
                  )}
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Category</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all cursor-pointer font-semibold text-gray-800 dark:text-white"
                  >
                    <option value="">Unclassified</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* UOM Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Unit of Measure (UOM)</label>
                  <select
                    name="uom_id"
                    value={formData.uom_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all cursor-pointer font-semibold text-gray-800 dark:text-white"
                  >
                    <option value="">None</option>
                    {uoms.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter physical details, packaging type or notes..."
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all resize-none"
                  ></textarea>
                </div>

                {/* Pricing & Tax Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Base Unit Price (৳)</label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">GST / VAT Rate (%)</label>
                    <input
                      type="number"
                      name="tax_rate"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.tax_rate}
                      onChange={handleInputChange}
                      placeholder="0.0"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>

                {/* Product Variants / Pack Sizes Section */}
                <div className="border-t border-gray-250 dark:border-gray-800 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">Product Variants / Pack Sizes</h4>
                      <p className="text-[10px] text-gray-400">Define the packaging configurations, carton pricing, and commissions.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVariantRow}
                      className="px-2.5 py-1.5 bg-primary-500/10 text-primary-500 hover:bg-primary-500 hover:text-white rounded text-[10px] font-bold transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Size
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {formData.variants && formData.variants.length > 0 ? (
                      formData.variants.map((variant, idx) => (
                        <div key={idx} className="flex gap-2 items-center bg-gray-50/50 dark:bg-gray-800/30 p-2.5 rounded border border-gray-150 dark:border-gray-800 transition-all">
                          {/* Pack Size */}
                          <div className="flex-1">
                            <label className="block text-[9px] font-semibold text-gray-400 uppercase mb-1">Pack Size *</label>
                            <input
                              type="text"
                              placeholder="e.g. 1kg*20"
                              value={variant.pack_size}
                              onChange={(e) => handleVariantChange(idx, "pack_size", e.target.value)}
                              className={`w-full px-2 py-1.5 bg-white dark:bg-gray-900 border ${formErrors.variants?.[idx] ? "border-red-500" : "border-gray-200 dark:border-gray-850"} rounded text-xs outline-none focus:border-primary-500`}
                              required
                            />
                          </div>

                          {/* SKU Code */}
                          <div className="w-24">
                            <label className="block text-[9px] font-semibold text-gray-400 uppercase mb-1">SKU Code</label>
                            <input
                              type="text"
                              placeholder="SKU"
                              value={variant.sku_code || ""}
                              onChange={(e) => handleVariantChange(idx, "sku_code", e.target.value)}
                              className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 rounded text-xs outline-none focus:border-primary-500 font-mono"
                            />
                          </div>

                          {/* Rate/Carton */}
                          <div className="w-20">
                            <label className="block text-[9px] font-semibold text-gray-400 uppercase mb-1">Rate/CT (৳)</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={variant.rate_per_ct}
                              onChange={(e) => handleVariantChange(idx, "rate_per_ct", e.target.value)}
                              className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 rounded text-xs outline-none focus:border-primary-500 text-right"
                              required
                            />
                          </div>

                          {/* Commission */}
                          <div className="w-16">
                            <label className="block text-[9px] font-semibold text-gray-400 uppercase mb-1">Comm (%)</label>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="100"
                              placeholder="0.0"
                              value={variant.commission_rate}
                              onChange={(e) => handleVariantChange(idx, "commission_rate", e.target.value)}
                              className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 rounded text-xs outline-none focus:border-primary-500 text-right"
                              required
                            />
                          </div>

                          {/* Remove Button */}
                          <div className="self-end pb-0.5">
                            <button
                              type="button"
                              onClick={() => handleRemoveVariantRow(idx)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-all"
                              title="Remove Pack Size"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 bg-gray-50/50 dark:bg-gray-800/20 rounded border border-dashed border-gray-200 dark:border-gray-800">
                        <p className="text-xs text-gray-400 italic">No variants defined. Click "Add Size" to create pack configurations.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Batch Required Checkbox */}
                <div className="flex items-center gap-3 bg-amber-500/5 p-4 rounded-md border border-amber-500/10">
                  <input
                    type="checkbox"
                    id="batch_required"
                    name="batch_required"
                    checked={formData.batch_required}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500 cursor-pointer"
                  />
                  <div>
                    <label htmlFor="batch_required" className="text-sm font-semibold text-amber-600 dark:text-amber-400 cursor-pointer select-none">
                      Batch & Expiry Required
                    </label>
                    <p className="text-xs text-gray-400 leading-tight">Force LOT/batch lot selection and expiry date input on all stock moves.</p>
                  </div>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-md border border-gray-200 dark:border-gray-800">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                  />
                  <div>
                    <label htmlFor="is_active" className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer select-none">
                      Active Status
                    </label>
                    <p className="text-xs text-gray-400 leading-tight">Enable to allow stock transfer orders and stock tracking.</p>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-800 text-xs font-bold rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-md shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {selectedProduct ? "Save Changes" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

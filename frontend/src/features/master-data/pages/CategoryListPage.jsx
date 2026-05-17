import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  FolderOpen,
  Loader2,
  CheckCircle,
  XCircle,
  ChevronRight,
  FileText
} from "lucide-react";
import { masterDataApi } from "../api/masterDataApi";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";

export default function CategoryListPage() {
  const { hasPermission } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    is_active: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await masterDataApi.getCategories();
      if (response.status === "Success" && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        window.location.href = '/unauthorized';
      } else {
        toast.error("Failed to load categories");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories locally for ultra-fast, reactive user experience
  const filteredCategories = categories.filter((cat) => {
    const query = search.toLowerCase();
    return (
      cat.name.toLowerCase().includes(query) ||
      (cat.slug && cat.slug.toLowerCase().includes(query)) ||
      (cat.description && cat.description.toLowerCase().includes(query))
    );
  });

  const handleOpenModal = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug || "",
        description: category.description || "",
        is_active: category.is_active
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        is_active: true
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
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
      errors.name = "Category name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (selectedCategory) {
        // Update operation
        const response = await masterDataApi.updateCategory(selectedCategory.id, formData);
        if (response.status >= 200 && response.status < 300) {
          toast.success("Category updated successfully");
          fetchCategories();
          handleCloseModal();
        }
      } else {
        // Create operation
        const response = await masterDataApi.createCategory(formData);
        if (response.status >= 200 && response.status < 300) {
          toast.success("Category created successfully");
          fetchCategories();
          handleCloseModal();
        }
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || "An error occurred while saving the category");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "All items linked to this category might be affected!",
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
          await masterDataApi.deleteCategory(id);
          Swal.fire(
            'Deleted!',
            'Category has been deleted.',
            'success'
          );
          fetchCategories();
        } catch (error) {
          if (error.response?.status === 404) {
            // Graceful handling for duplicate clicks
            Swal.fire(
              'Deleted!',
              'Category has been deleted.',
              'success'
            );
            fetchCategories();
          } else {
            Swal.fire(
              'Error!',
              error.response?.data?.message || 'Failed to delete category.',
              'error'
            );
          }
        }
      }
    });
  };

  return (
    <div className="pb-10 min-h-screen space-y-8">
      {/* Premium Sticky Header with Integrated Search */}
      <div className="sticky top-4 z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-6 rounded-md border border-gray-100/50 dark:border-gray-800/50 shadow-xl shadow-gray-500/5 transition-all mb-8">
        <div className="space-y-1 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
              <FolderOpen className="w-4.5 h-4.5 text-primary-500" />
            </div>
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 tracking-wider">Master Data Management</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Categories Directory</h1>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Manage and classify your items for seamless inventory control.</p>
        </div>

        {/* Integrated Search Bar */}
        <div className="flex-1 max-w-lg mx-6 group relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search categories by name, slug or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="flex gap-6 pr-6 border-r border-gray-200 dark:border-gray-800">
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none mt-1">{categories.length}</p>
            </div>
          </div>
          {hasPermission("categories.create") && (
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-5 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-lg shadow-primary-500/20 transition-all active:scale-95 group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Add Category
            </button>
          )}
        </div>
      </div>

      {/* Modern Categories Table */}
      <div className="bg-white dark:bg-gray-900 rounded-md shadow-xl shadow-gray-500/5 border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">URL Slug</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-2/3"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4"></div></td>
                    <td className="px-6 py-5"><div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-12"></div></td>
                    <td className="px-6 py-5 text-right"><div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary-500/5 flex items-center justify-center">
                          <FolderOpen className="w-4.5 h-4.5 text-primary-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{cat.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-medium bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded text-gray-600 dark:text-gray-400">
                        {cat.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm truncate">
                        {cat.description || <span className="italic text-gray-300">No description provided</span>}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {cat.is_active ? (
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
                        {hasPermission("categories.edit") && (
                          <button
                            onClick={() => handleOpenModal(cat)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-500"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {hasPermission("categories.delete") && (
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="p-2 hover:bg-red-500/10 rounded transition-colors text-gray-500 dark:text-gray-400 hover:text-red-500"
                            title="Delete Category"
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
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm font-bold text-gray-400">No categories found matching query</p>
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
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-2xl transition-all overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    {selectedCategory ? "Edit Category Details" : "Create New Category"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedCategory ? "Update the name, description, and status of this category." : "Fill in the details below to add a new product category."}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleFormSubmit}>
              <div className="p-6 space-y-4">
                {/* Category Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="E.g. Seeds, Fertilizers"
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${formErrors.name ? "border-red-500" : "border-gray-200 dark:border-gray-800"} rounded-md text-sm outline-none focus:border-primary-500 transition-all`}
                  />
                  {formErrors.name && (
                    <span className="text-xs text-red-500 font-medium mt-1 block">{formErrors.name}</span>
                  )}
                </div>

                {/* Slug (URL friendly - Optional / Auto generated) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Slug (URL Key Path)</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="seeds-and-fertilizers (Optional)"
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${formErrors.slug ? "border-red-500" : "border-gray-200 dark:border-gray-800"} rounded-md text-sm outline-none focus:border-primary-500 transition-all`}
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block leading-tight">
                    Optional: Enter a custom slug or leave blank to automatically generate one from the name.
                  </span>
                  {formErrors.slug && (
                    <span className="text-xs text-red-500 font-medium mt-1 block">{formErrors.slug}</span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide details about this product category..."
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm outline-none focus:border-primary-500 transition-all resize-none"
                  ></textarea>
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
                    <p className="text-xs text-gray-400 leading-tight">Enable this category for use across product managers.</p>
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
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-md shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {selectedCategory ? "Save Changes" : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

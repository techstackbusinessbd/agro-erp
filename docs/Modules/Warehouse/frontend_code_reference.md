# Warehouse Module — Frontend Code Reference

> Quick reference for all frontend source files, component structure, and patterns.

---

## File Structure
```
frontend/src/features/warehouse/
├── api/
│   └── warehouseApi.js
└── pages/
    ├── WarehouseListPage.jsx
    └── TerritoryListPage.jsx
```

---

## API Client: `warehouseApi.js`
```js
import apiClient from '../../../services/apiClient';

export const warehouseApi = {
    getWarehouses:    async ()       => (await apiClient.get('/warehouse/warehouses')).data,
    createWarehouse:  async (data)   => await apiClient.post('/warehouse/warehouses', data),
    updateWarehouse:  async (id, data) => await apiClient.put(`/warehouse/warehouses/${id}`, data),
    deleteWarehouse:  async (id)     => await apiClient.delete(`/warehouse/warehouses/${id}`),

    getTerritories:   async ()       => (await apiClient.get('/warehouse/territories')).data,
    createTerritory:  async (data)   => await apiClient.post('/warehouse/territories', data),
    updateTerritory:  async (id, data) => await apiClient.put(`/warehouse/territories/${id}`, data),
    deleteTerritory:  async (id)     => await apiClient.delete(`/warehouse/territories/${id}`),
};
```

---

## WarehouseListPage.jsx — Key Patterns

### Form State Shape
```js
const [formData, setFormData] = useState({
    code: "", name: "", type: "raw_material",
    address: "", city: "", phone: "", capacity: "", is_active: true,
});
```

### Type Config (Badge colors + icons)
```js
const typeConfig = {
    raw_material:        { label: "Raw Material",        color: "bg-amber-500/10 text-amber-600",   icon: "🌾" },
    finished_goods:      { label: "Finished Goods",      color: "bg-emerald-500/10 text-emerald-600", icon: "📦" },
    depot:               { label: "Depot",               color: "bg-orange-500/10 text-orange-600", icon: "🏪" },
    cold_storage:        { label: "Cold Storage",        color: "bg-blue-500/10 text-blue-600",     icon: "❄️" },
    transit:             { label: "Transit",             color: "bg-purple-500/10 text-purple-600", icon: "🚛" },
    distribution_center: { label: "Distribution Center", color: "bg-rose-500/10 text-rose-600",     icon: "🏭" },
};
```

### Permission Guards
```jsx
{hasPermission("warehouses.create") && <button>Add Warehouse</button>}
{hasPermission("warehouses.edit")   && <button>Edit</button>}
{hasPermission("warehouses.delete") && <button>Delete</button>}
```

### Payload Submit (with float conversion)
```js
const payload = {
    ...formData,
    capacity: formData.capacity ? parseFloat(formData.capacity) : null
};
```

---

## TerritoryListPage.jsx — Key Patterns

### Form State Shape
```js
const [formData, setFormData] = useState({
    code: "", name: "", region: "", description: "", is_active: true,
});
```

### Bangladesh Division List
```js
const BD_REGIONS = [
    "Dhaka", "Chittagong", "Rajshahi", "Khulna",
    "Barishal", "Sylhet", "Rangpur", "Mymensingh",
];
```

### Region Badge Colors
```js
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
```

### Permission Guards
```jsx
{hasPermission("territories.create") && <button>Add Territory</button>}
{hasPermission("territories.edit")   && <button>Edit</button>}
{hasPermission("territories.delete") && <button>Delete</button>}
```

---

## AppRoutes.jsx Additions
```jsx
import WarehouseListPage from '../features/warehouse/pages/WarehouseListPage';
import TerritoryListPage from '../features/warehouse/pages/TerritoryListPage';

// Inside Routes:
<Route element={<ProtectedRoute permission="warehouses.view" />}>
    <Route path="/warehouses" element={<WarehouseListPage />} />
</Route>
<Route element={<ProtectedRoute permission="territories.view" />}>
    <Route path="/territories" element={<TerritoryListPage />} />
</Route>
```

---

## Standard UI Component Patterns Used

### Page Header
```jsx
<h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
    Warehouses & Depots
</h1>
```

### Table Structure
```jsx
<table className="w-full text-left border-collapse">
    <thead>
        <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">...</th>
        </tr>
    </thead>
</table>
```

### Status Badge
```jsx
// Active
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600">
    <CheckCircle className="w-3.5 h-3.5" /> Active
</span>

// Inactive
<span className="... bg-red-500/10 text-red-600">
    <XCircle className="w-3.5 h-3.5" /> Inactive
</span>
```

### Modal Submit Buttons
```jsx
// Cancel
<button type="button" onClick={handleCloseModal} className="... border text-gray-500 ...">Cancel</button>

// Submit
<button type="submit" disabled={saving} className="... bg-primary-500 text-white ...">
    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
    {selectedItem ? "Save Changes" : "Save Warehouse"}
</button>
```

### SweetAlert Delete Confirmation
```js
const result = await Swal.fire({
    title: "Delete Warehouse?",
    text: `"${warehouse.name}" will be permanently removed.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
});
if (!result.isConfirmed) return;
```

### Toast Notifications
```js
toast.success("Warehouse created successfully!");
toast.error("Failed to load warehouses.");
```

### Backend Validation Error Handling
```js
} catch (err) {
    const errors = err.response?.data?.errors || {};
    if (Object.keys(errors).length) {
        setFormErrors(Object.fromEntries(
            Object.entries(errors).map(([k, v]) => [k, v[0]])
        ));
    } else {
        toast.error(err.response?.data?.message || "Operation failed.");
    }
}
```

# Warehouse & Territory Module — Complete Reference Documentation

> **Module Path**: `backend/app/Modules/Warehouse/`  
> **Frontend Path**: `frontend/src/features/warehouse/`  
> **Created**: 2026-05-17  
> **Phase**: 2 (Master Setup Foundation)

---

## Table of Contents
1. [Database Schema](#database-schema)
2. [API Endpoints](#api-endpoints)
3. [Permissions Matrix](#permissions-matrix)
4. [Backend Architecture](#backend-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Sidebar Menu Config](#sidebar-menu-config)
7. [Warehouse Types Reference](#warehouse-types-reference)
8. [Territory Regions Reference](#territory-regions-reference)

---

## Database Schema

### Table: `warehouses`
```sql
CREATE TABLE warehouses (
    id          UUID        PRIMARY KEY,
    code        VARCHAR(50) UNIQUE NOT NULL,       -- e.g. WH-001
    name        VARCHAR(255) NOT NULL,
    type        ENUM(
                  'raw_material',
                  'finished_goods',
                  'depot',
                  'cold_storage',
                  'transit',
                  'distribution_center'
                ) DEFAULT 'raw_material',
    address     VARCHAR(500) NULL,
    city        VARCHAR(100) NULL,
    phone       VARCHAR(20)  NULL,
    capacity    DECIMAL(12,2) NULL,                -- Max capacity in kg
    is_active   BOOLEAN DEFAULT TRUE,
    deleted_at  TIMESTAMP NULL,                    -- Soft deletes
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP
);
```

### Table: `territories`
```sql
CREATE TABLE territories (
    id          UUID        PRIMARY KEY,
    code        VARCHAR(50) UNIQUE NOT NULL,       -- e.g. TER-001
    name        VARCHAR(255) NOT NULL,
    region      VARCHAR(100) NULL,                 -- Bangladesh Division
    description TEXT NULL,
    is_active   BOOLEAN DEFAULT TRUE,
    deleted_at  TIMESTAMP NULL,                    -- Soft deletes
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP
);
```

---

## API Endpoints

**Base URL**: `/api/warehouse/`  
**Auth**: `auth:sanctum` middleware required on all routes.

### Warehouses

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| `GET` | `/api/warehouse/warehouses` | `warehouses.view` | List all warehouses |
| `POST` | `/api/warehouse/warehouses` | `warehouses.create` | Create new warehouse |
| `GET` | `/api/warehouse/warehouses/{id}` | `warehouses.view` | Get single warehouse |
| `PUT` | `/api/warehouse/warehouses/{id}` | `warehouses.edit` | Update warehouse |
| `DELETE` | `/api/warehouse/warehouses/{id}` | `warehouses.delete` | Soft delete warehouse |

#### Request Body — Create/Update Warehouse
```json
{
  "code":     "WH-001",
  "name":     "Central Warehouse",
  "type":     "raw_material",
  "address":  "123 Industrial Area",
  "city":     "Dhaka",
  "phone":    "+880 1700000000",
  "capacity": 50000,
  "is_active": true
}
```

#### Response — Warehouse Resource
```json
{
  "id":         "uuid",
  "code":       "WH-001",
  "name":       "Central Warehouse",
  "type":       "raw_material",
  "address":    "123 Industrial Area",
  "city":       "Dhaka",
  "phone":      "+880 1700000000",
  "capacity":   50000.00,
  "is_active":  true,
  "created_at": "2026-05-17T06:00:00+00:00",
  "updated_at": "2026-05-17T06:00:00+00:00"
}
```

---

### Territories

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| `GET` | `/api/warehouse/territories` | `territories.view` | List all territories |
| `POST` | `/api/warehouse/territories` | `territories.create` | Create new territory |
| `GET` | `/api/warehouse/territories/{id}` | `territories.view` | Get single territory |
| `PUT` | `/api/warehouse/territories/{id}` | `territories.edit` | Update territory |
| `DELETE` | `/api/warehouse/territories/{id}` | `territories.delete` | Soft delete territory |

#### Request Body — Create/Update Territory
```json
{
  "code":        "TER-001",
  "name":        "Dhaka North",
  "region":      "Dhaka",
  "description": "Northern Dhaka sales territory",
  "is_active":   true
}
```

#### Response — Territory Resource
```json
{
  "id":          "uuid",
  "code":        "TER-001",
  "name":        "Dhaka North",
  "region":      "Dhaka",
  "description": "Northern Dhaka sales territory",
  "is_active":   true,
  "created_at":  "2026-05-17T06:00:00+00:00",
  "updated_at":  "2026-05-17T06:00:00+00:00"
}
```

---

## Permissions Matrix

### Permission Group: `Warehouse Management`

| Permission | Super Admin | Admin | Staff |
|------------|:-----------:|:-----:|:-----:|
| `warehouses.view` | ✅ | ✅ | ✅ |
| `warehouses.create` | ✅ | ✅ | ❌ |
| `warehouses.edit` | ✅ | ✅ | ❌ |
| `warehouses.delete` | ✅ | ✅ | ❌ |
| `territories.view` | ✅ | ✅ | ✅ |
| `territories.create` | ✅ | ✅ | ❌ |
| `territories.edit` | ✅ | ✅ | ❌ |
| `territories.delete` | ✅ | ✅ | ❌ |

---

## Backend Architecture

### File Structure
```
backend/app/Modules/Warehouse/
├── Controllers/
│   ├── WarehouseController.php     # CRUD controller
│   └── TerritoryController.php     # CRUD controller
├── Interfaces/
│   ├── WarehouseRepositoryInterface.php
│   └── TerritoryRepositoryInterface.php
├── Models/
│   ├── Warehouse.php               # HasUuids, SoftDeletes
│   └── Territory.php               # HasUuids, SoftDeletes
├── Repositories/
│   ├── WarehouseRepository.php     # extends BaseRepository
│   └── TerritoryRepository.php     # extends BaseRepository
├── Requests/
│   ├── StoreWarehouseRequest.php   # code unique validation
│   ├── UpdateWarehouseRequest.php  # code unique except self
│   ├── StoreTerritoryRequest.php   # code unique validation
│   └── UpdateTerritoryRequest.php  # code unique except self
├── Resources/
│   ├── WarehouseResource.php       # JSON response mapping
│   └── TerritoryResource.php       # JSON response mapping
└── routes/
    └── api.php                     # All 10 routes
```

### Service Provider Registration
**File**: `backend/app/Providers/AppServiceProvider.php`
```php
$this->app->bind(
    \App\Modules\Warehouse\Interfaces\WarehouseRepositoryInterface::class,
    \App\Modules\Warehouse\Repositories\WarehouseRepository::class
);
$this->app->bind(
    \App\Modules\Warehouse\Interfaces\TerritoryRepositoryInterface::class,
    \App\Modules\Warehouse\Repositories\TerritoryRepository::class
);
```

### Route Registration
**File**: `backend/routes/api.php`
```php
require base_path('app/Modules/Warehouse/routes/api.php');
```

---

## Frontend Architecture

### File Structure
```
frontend/src/features/warehouse/
├── api/
│   └── warehouseApi.js             # API client (8 methods)
└── pages/
    ├── WarehouseListPage.jsx        # Full CRUD page
    └── TerritoryListPage.jsx        # Full CRUD page
```

### API Client Methods
**File**: `frontend/src/features/warehouse/api/warehouseApi.js`
```js
warehouseApi.getWarehouses()
warehouseApi.createWarehouse(data)
warehouseApi.updateWarehouse(id, data)
warehouseApi.deleteWarehouse(id)

warehouseApi.getTerritories()
warehouseApi.createTerritory(data)
warehouseApi.updateTerritory(id, data)
warehouseApi.deleteTerritory(id)
```

### Route Configuration
**File**: `frontend/src/routes/AppRoutes.jsx`
```jsx
<Route element={<ProtectedRoute permission="warehouses.view" />}>
    <Route path="/warehouses" element={<WarehouseListPage />} />
</Route>
<Route element={<ProtectedRoute permission="territories.view" />}>
    <Route path="/territories" element={<TerritoryListPage />} />
</Route>
```

---

## Sidebar Menu Config

**File**: `backend/database/seeders/MenuSeeder.php`

```
📦 Warehouse & Territory    (order: 6, permission: warehouses.view)
  ├── 🏭 Warehouses & Depots      path: /warehouses   (permission: warehouses.view)
  └── 🗺️ Territory Management    path: /territories  (permission: territories.view)
```

---

## Warehouse Types Reference

| Enum Value | Display Label | Icon | Color | Use Case |
|------------|--------------|------|-------|----------|
| `raw_material` | Raw Material Warehouse | 🌾 | Amber | বীজ, সার, কীটনাশক স্টোরেজ |
| `finished_goods` | Finished Goods Warehouse | 📦 | Emerald | প্রস্তুত পণ্য গুদাম |
| `depot` | Depot | 🏪 | Orange | বিতরণ ডিপো |
| `cold_storage` | Cold Storage | ❄️ | Blue | ফল/সবজি শীতলীকরণ গুদাম |
| `transit` | Transit Warehouse | 🚛 | Purple | ট্রানজিট/অস্থায়ী স্টোরেজ |
| `distribution_center` | Distribution Center | 🏭 | Rose | কেন্দ্রীয় বিতরণ কেন্দ্র |

---

## Territory Regions Reference

Bangladesh-specific division list used in frontend dropdown:

| Region | Badge Color |
|--------|------------|
| Dhaka | Blue |
| Chittagong | Teal |
| Rajshahi | Purple |
| Khulna | Emerald |
| Barishal | Pink |
| Sylhet | Amber |
| Rangpur | Indigo |
| Mymensingh | Orange |

---

## Migration Files
- `2026_05_17_120000_create_warehouses_table.php`
- `2026_05_17_120001_create_territories_table.php`

## Seeder Files Updated
- `PermissionSeeder.php` — `Warehouse Management` group added
- `MenuSeeder.php` — Sidebar section added

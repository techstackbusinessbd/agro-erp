# Implementation Plan: Enterprise Stock Transfer Order (STO) & In-Transit Tracking

This plan outlines the design and integration of a complete enterprise-grade **Stock Transfer Order (STO)** system in your Agro ERP platform. It models real-world supply chain management (similar to SAP and Odoo) by separating physical stock from transit stock and managing inventory through audited status transitions rather than direct, direct database overrides.

---

## 🎯 Goal Description

Introduce a structured inventory movement workflow that connects your **Central Warehouses**, **Territories**, and **Local Depots**:
1. **Master Products:** A prerequisite module to define catalog items (linkable to Categories and UOMs).
2. **Stock Ledger:** Track `physical_qty` (present inside a warehouse) and `transit_qty` (currently in-transit on a truck/delivery vehicle) per product per location.
3. **Stock Transfer Orders (STO):** Document workflow to transfer inventory:
   * **Draft/Pending:** A Depot manager requests product quantities.
   * **Approved:** Central warehouse approves the request.
   * **Shipped (In-Transit):** Central warehouse ships the products. **Lógica de Transición:** Stock is subtracted from the central warehouse's `physical_qty` and added to the depot's `transit_qty`.
   * **Received:** Depot manager clicks **"Receive"** once physical goods arrive. **Lógica de Transición:** Stock is deducted from the depot's `transit_qty` and added to the depot's `physical_qty`.

---

## ⚠️ User Review Required

> [!IMPORTANT]
> **Database Seeders Reset**
> After running migrations for the new tables (`products`, `stocks`, `stock_transfer_orders`, and `stock_transfer_order_items`), we will update and re-run your `MenuSeeder` and `PermissionSeeder` to register the new navigation tabs: **Products**, **Stock Transfers**, and **Inventory Balances**.

---

## 📂 Proposed Changes

### 1. 🖥️ Backend (Laravel API)

#### [NEW] [Migration: create_products_table](file:///g:/project/agro-erp/backend/database/migrations/2026_05_17_150000_create_products_table.php)
Creates the product catalog.
* `id` (UUID, Primary)
* `code` (string, unique, e.g. PRD-001)
* `name` (string)
* `category_id` (foreign key to categories)
* `uom_id` (foreign key to uoms)
* `is_active` (boolean)

#### [NEW] [Migration: create_stocks_table](file:///g:/project/agro-erp/backend/database/migrations/2026_05_17_150100_create_stocks_table.php)
Tracks actual quantities inside each location.
* `id` (UUID, Primary)
* `warehouse_id` (foreign key to warehouses)
* `product_id` (foreign key to products)
* `physical_qty` (decimal: 12,2)
* `transit_qty` (decimal: 12,2)
* Unique index: `(warehouse_id, product_id)`

#### [NEW] [Migration: create_stock_transfer_orders_table](file:///g:/project/agro-erp/backend/database/migrations/2026_05_17_150200_create_stock_transfer_orders_table.php)
Maintains the STO header and status tracking.
* `id` (UUID, Primary)
* `code` (string, unique, e.g. STO-001)
* `source_warehouse_id` (foreign key to warehouses)
* `destination_warehouse_id` (foreign key to warehouses)
* `status` (enum: `draft`, `pending`, `approved`, `shipped`, `received`, `cancelled`)
* `remarks` (text, nullable)
* `shipped_at`, `received_at` (timestamps)

#### [NEW] [Migration: create_stock_transfer_order_items_table](file:///g:/project/agro-erp/backend/database/migrations/2026_05_17_150300_create_stock_transfer_order_items_table.php)
Maintains item quantities requested vs shipped vs received.
* `id` (UUID, Primary)
* `stock_transfer_order_id` (foreign key to stock_transfer_orders, onDelete cascade)
* `product_id` (foreign key to products)
* `quantity_requested`, `quantity_shipped`, `quantity_received` (decimals)

#### [NEW] [Product Module & STO Module Services / Models / Controllers / Resources]
We will create professional standard REST APIs inside two new subfolders:
* `app/Modules/MasterData` ➡️ Create `Product.php` model, request validations, controller, resource, and routes.
* `app/Modules/Warehouse` ➡️ Create `Stock.php`, `StockTransferOrder.php`, and `StockTransferOrderItem.php` models, requests, resources, and route handlers.

---

### 2. 🎨 Frontend (React + Tailwind)

We will introduce three new pages under `src/features` to give your admin panel a high-end supply chain interface:

#### [NEW] [ProductListPage.jsx](file:///g:/project/agro-erp/frontend/src/features/master-data/pages/ProductListPage.jsx)
Allows admins to create, edit, and manage products. Highly polished list with category/UOM filters.

#### [NEW] [StockTransferPage.jsx](file:///g:/project/agro-erp/frontend/src/features/warehouse/pages/StockTransferPage.jsx)
The core dashboard for STO. Allows:
1. **Depots** to request transfers (interactive form with multi-line items).
2. **Central Warehouses** to review requests, input shipped quantities, and mark as **"Shipped (In-Transit)"**.
3. **Depot Managers** to click **"Receive"**, input actual received quantities, and complete the order.
4. Color-coded enterprise progress stepper: `Draft ➡️ Pending ➡️ Approved ➡️ In Transit ➡️ Completed`.

#### [NEW] [WarehouseStockPage.jsx](file:///g:/project/agro-erp/frontend/src/features/warehouse/pages/WarehouseStockPage.jsx)
A premium inventory dashboard displaying real-time stock balances across all locations. 
* Displays a high-fidelity visual of **Warehouse Stocks** with two distinct indicators: **Physical Stock** vs **In-Transit Stock** (e.g. showcasing a small truck icon next to transit numbers).

---

## 🧪 Verification Plan

### Automated Tests / Validation
1. **Migration Verification:** Run database migrations to ensure foreign key constraints and unique indexes compile and execute perfectly.
2. **STO Status Logic Test:** We will write a validation seeder to trigger the STO lifecycle step-by-step and inspect the database `stocks` table to verify quantities are correctly subtracted, held in transit, and finally added to physical stock upon receiving.

### Manual Verification
1. Open the **Products** screen, add 3 catalog items.
2. Open **Warehouse Stocks**, manually seed/add base stock for a central warehouse.
3. Open **Stock Transfers**, log in as a Depot user, request a transfer, approve/ship it, verify the Central Warehouse's physical stock goes down and Depot's transit stock goes up, then click receive to verify transit goes down and Depot physical goes up.

# Walkthrough: Master Data module (Categories Hierarchy & UOM Conversion Rates)

We have successfully designed, implemented, and verified the advanced features of the Master Data module (Categories Hierarchy & UOM Conversion Rates).

---

## 📸 Interactive Verification
All implemented UI fields, toggles, dropdown lists, and mathematical conversion metrics have been tested interactively via the browser. Below is a video recording of the verification session showing the creation of Parent/Sub-categories and Base/Sub-units (Kilogram and Gram):

![Master Data Features Verification](/C:/Users/khaled.a/.gemini/antigravity/brain/1112e5d8-2949-4e48-ab18-839d5458e00b/master_data_verification_1778995132998.webp)

---

## Key Accomplishments

### 1. Categories Hierarchy (Parent-Child Subcategories)
* **Database & Models**:
  * Added `parent_id` (nullable UUID column) with a self-referential foreign key constraint to the `categories` table: [2026_05_17_102000_create_categories_table.php](file:///g:/project/agro-erp/backend/database/migrations/2026_05_17_102000_create_categories_table.php).
  * Defined `parent()` and `children()` Eloquent relations in the [Category.php](file:///g:/project/agro-erp/backend/app/Modules/MasterData/Models/Category.php) model.
  * Added validation rules in [StoreCategoryRequest.php](file:///g:/project/agro-erp/backend/app/Modules/MasterData/Requests/StoreCategoryRequest.php) and [UpdateCategoryRequest.php](file:///g:/project/agro-erp/backend/app/Modules/MasterData/Requests/UpdateCategoryRequest.php) (including a dynamic validation block preventing circular self-parent reference).
  * Included `parent_id` and `parent_name` in the API JSON mapping resource: [CategoryResource.php](file:///g:/project/agro-erp/backend/app/Modules/MasterData/Resources/CategoryResource.php).
* **React Frontend**:
  * Added a **"Parent Category"** select dropdown in the modal: [CategoryListPage.jsx](file:///g:/project/agro-erp/frontend/src/features/master-data/pages/CategoryListPage.jsx).
  * Rendered beautiful relationship sub-badges (e.g., `Sub-category of: Fertilizers`) in the categories list grid.

### 2. Units of Measurement (UOM) Conversion Rates
* **Database & Models**:
  * Added `is_base` (boolean), `parent_id` (nullable UUID), and `conversion_factor` (decimal) with a self-referential foreign key to the `uoms` table: [2026_05_17_101500_create_uoms_table.php](file:///g:/project/agro-erp/backend/database/migrations/2026_05_17_101500_create_uoms_table.php).
  * Defined `parent()` and `children()` Eloquent relations in the [Uom.php](file:///g:/project/agro-erp/backend/app/Modules/MasterData/Models/Uom.php) model.
  * Built robust validation constraints in [StoreUomRequest.php](file:///g:/project/agro-erp/backend/app/Modules/MasterData/Requests/StoreUomRequest.php) and [UpdateUomRequest.php](file:///g:/project/agro-erp/backend/app/Modules/MasterData/Requests/UpdateUomRequest.php) to ensure only valid conversion factor decimals are entered for sub-units.
  * Included all conversion attributes in [UomResource.php](file:///g:/project/agro-erp/backend/app/Modules/MasterData/Resources/UomResource.php).
* **React Frontend**:
  * Integrated an **"Is Base Unit?"** toggle switch inside the modal: [UomListPage.jsx](file:///g:/project/agro-erp/frontend/src/features/master-data/pages/UomListPage.jsx).
  * Displayed conditional fields for selecting a "Base Unit" and inputting a "Conversion Factor" when the toggle is off.
  * Rendered custom conversion strings in the UOM table grid (e.g., `Base Unit` or `1 g = 0.001 Kilogram`).

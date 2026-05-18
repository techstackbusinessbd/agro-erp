# Warehouse Module — Backend Code Reference

> Quick reference for all backend source files.  
> Use this to understand patterns when building similar modules (e.g. Supplier, Dealer, Product).

---

## Migration: `create_warehouses_table.php`
```php
Schema::create('warehouses', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('code')->unique();
    $table->string('name');
    $table->enum('type', [
        'raw_material', 'finished_goods', 'depot',
        'cold_storage', 'transit', 'distribution_center',
    ])->default('raw_material');
    $table->string('address')->nullable();
    $table->string('city')->nullable();
    $table->string('phone')->nullable();
    $table->decimal('capacity', 12, 2)->nullable();
    $table->boolean('is_active')->default(true);
    $table->softDeletes();
    $table->timestamps();
});
```

## Migration: `create_territories_table.php`
```php
Schema::create('territories', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('code')->unique();
    $table->string('name');
    $table->string('region')->nullable();
    $table->text('description')->nullable();
    $table->boolean('is_active')->default(true);
    $table->softDeletes();
    $table->timestamps();
});
```

---

## Model: `Warehouse.php`
```php
namespace App\Modules\Warehouse\Models;

class Warehouse extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'code', 'name', 'type', 'address', 'city', 'phone', 'capacity', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'capacity'  => 'decimal:2',
    ];
}
```

## Model: `Territory.php`
```php
namespace App\Modules\Warehouse\Models;

class Territory extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = ['code', 'name', 'region', 'description', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];
}
```

---

## Interface: `WarehouseRepositoryInterface.php`
```php
interface WarehouseRepositoryInterface extends EloquentRepositoryInterface
{
    public function find(string $id): ?Warehouse;
    public function create(array $data): Warehouse;
}
```

## Interface: `TerritoryRepositoryInterface.php`
```php
interface TerritoryRepositoryInterface extends EloquentRepositoryInterface
{
    public function find(string $id): ?Territory;
    public function create(array $data): Territory;
}
```

---

## Repository: `WarehouseRepository.php`
```php
class WarehouseRepository extends BaseRepository implements WarehouseRepositoryInterface
{
    public function __construct(Warehouse $model) { parent::__construct($model); }

    public function find(string $id): ?Warehouse { return parent::find($id); }
    public function create(array $data): Warehouse { return parent::create($data); }
}
```

## Repository: `TerritoryRepository.php`
```php
class TerritoryRepository extends BaseRepository implements TerritoryRepositoryInterface
{
    public function __construct(Territory $model) { parent::__construct($model); }

    public function find(string $id): ?Territory { return parent::find($id); }
    public function create(array $data): Territory { return parent::create($data); }
}
```

---

## Service: `WarehouseService.php`
```php
class WarehouseService
{
    public function __construct(protected WarehouseRepositoryInterface $warehouseRepository) {}

    public function getAll(): Collection  { return $this->warehouseRepository->all(); }
    public function store(array $data): Warehouse {
        return DB::transaction(fn() => $this->warehouseRepository->create($data));
    }
    public function show(string $id): Warehouse {
        return $this->warehouseRepository->find($id) ?? abort(404, 'Warehouse not found');
    }
    public function update(string $id, array $data): Warehouse {
        return DB::transaction(function () use ($id, $data) {
            $this->warehouseRepository->update($id, $data);
            return $this->warehouseRepository->find($id);
        });
    }
    public function destroy(string $id): bool {
        return DB::transaction(fn() => $this->warehouseRepository->delete($id));
    }
}
```

---

## Request: `StoreWarehouseRequest.php`
```php
public function rules(): array {
    return [
        'code'     => 'required|string|max:50|unique:warehouses,code',
        'name'     => 'required|string|max:255',
        'type'     => 'required|in:raw_material,finished_goods,depot,cold_storage,transit,distribution_center',
        'address'  => 'nullable|string|max:500',
        'city'     => 'nullable|string|max:100',
        'phone'    => 'nullable|string|max:20',
        'capacity' => 'nullable|numeric|min:0',
        'is_active'=> 'boolean',
    ];
}
```

## Request: `UpdateWarehouseRequest.php`
```php
// Same as Store but with unique exception:
'code' => "required|string|max:50|unique:warehouses,code,{$id}",
```

## Request: `StoreTerritoryRequest.php`
```php
public function rules(): array {
    return [
        'code'        => 'required|string|max:50|unique:territories,code',
        'name'        => 'required|string|max:255',
        'region'      => 'nullable|string|max:100',
        'description' => 'nullable|string',
        'is_active'   => 'boolean',
    ];
}
```

---

## Resource: `WarehouseResource.php`
```php
return [
    'id'         => $this->id,
    'code'       => $this->code,
    'name'       => $this->name,
    'type'       => $this->type,
    'address'    => $this->address,
    'city'       => $this->city,
    'phone'      => $this->phone,
    'capacity'   => $this->capacity ? (float) $this->capacity : null,
    'is_active'  => (bool) $this->is_active,
    'created_at' => $this->created_at?->toIso8601String(),
    'updated_at' => $this->updated_at?->toIso8601String(),
];
```

## Resource: `TerritoryResource.php`
```php
return [
    'id'          => $this->id,
    'code'        => $this->code,
    'name'        => $this->name,
    'region'      => $this->region,
    'description' => $this->description,
    'is_active'   => (bool) $this->is_active,
    'created_at'  => $this->created_at?->toIso8601String(),
    'updated_at'  => $this->updated_at?->toIso8601String(),
];
```

---

## Controller Pattern: `WarehouseController.php`
```php
class WarehouseController extends Controller
{
    use ApiResponse;

    public function __construct(protected WarehouseService $warehouseService) {}

    public function index(): JsonResponse {
        return $this->successResponse(
            WarehouseResource::collection($this->warehouseService->getAll()),
            'Warehouses retrieved successfully.'
        );
    }
    public function store(StoreWarehouseRequest $request): JsonResponse {
        return $this->successResponse(
            new WarehouseResource($this->warehouseService->store($request->validated())),
            'Warehouse created successfully.', 201
        );
    }
    // show(), update(), destroy() follow same pattern
}
```

---

## Routes: `routes/api.php`
```php
Route::prefix('warehouse')->middleware('auth:sanctum')->group(function () {
    Route::get('warehouses',               [WarehouseController::class, 'index'])->middleware('permission:warehouses.view');
    Route::post('warehouses',              [WarehouseController::class, 'store'])->middleware('permission:warehouses.create');
    Route::get('warehouses/{warehouse}',   [WarehouseController::class, 'show'])->middleware('permission:warehouses.view');
    Route::put('warehouses/{warehouse}',   [WarehouseController::class, 'update'])->middleware('permission:warehouses.edit');
    Route::delete('warehouses/{warehouse}',[WarehouseController::class, 'destroy'])->middleware('permission:warehouses.delete');

    Route::get('territories',              [TerritoryController::class, 'index'])->middleware('permission:territories.view');
    Route::post('territories',             [TerritoryController::class, 'store'])->middleware('permission:territories.create');
    Route::get('territories/{territory}',  [TerritoryController::class, 'show'])->middleware('permission:territories.view');
    Route::put('territories/{territory}',  [TerritoryController::class, 'update'])->middleware('permission:territories.edit');
    Route::delete('territories/{territory}',[TerritoryController::class, 'destroy'])->middleware('permission:territories.delete');
});
```

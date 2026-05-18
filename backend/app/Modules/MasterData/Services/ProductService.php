<?php

namespace App\Modules\MasterData\Services;

use App\Modules\MasterData\Models\Product;
use App\Modules\MasterData\Interfaces\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ProductService
{
    public function __construct(protected ProductRepositoryInterface $productRepository)
    {
    }

    public function getAll(): Collection
    {
        return $this->productRepository->all()
            ->load(['category', 'uom'])
            ->loadCount('variants');
    }

    public function store(array $data): Product
    {
        return DB::transaction(function () use ($data) {
            $variants = $data['variants'] ?? [];
            unset($data['variants']);

            $product = $this->productRepository->create($data);

            foreach ($variants as $idx => $variant) {
                $skuCode = $variant['sku_code'] ?? null;
                if (empty($skuCode)) {
                    $cleanPack = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $variant['pack_size']));
                    $skuCode = $product->code . '-' . $cleanPack;
                }

                $product->variants()->create([
                    'pack_size'       => $variant['pack_size'],
                    'sku_code'        => $skuCode,
                    'rate_per_ct'     => $variant['rate_per_ct'] ?? 0,
                    'commission_rate' => $variant['commission_rate'] ?? 0,
                    'is_active'       => $variant['is_active'] ?? true,
                    'sort_order'      => $variant['sort_order'] ?? $idx,
                ]);
            }

            return $product->load(['category', 'uom', 'variants']);
        });
    }

    public function show(string $id): Product
    {
        $product = $this->productRepository->find($id);
        if (!$product) {
            abort(404, 'Product not found');
        }
        return $product->load(['category', 'uom', 'variants']);
    }

    public function update(string $id, array $data): Product
    {
        return DB::transaction(function () use ($id, $data) {
            $variants = $data['variants'] ?? null;
            unset($data['variants']);

            $this->productRepository->update($id, $data);
            $product = $this->productRepository->find($id);

            if ($variants !== null) {
                $existingIds = [];
                foreach ($variants as $idx => $variant) {
                    $skuCode = $variant['sku_code'] ?? null;
                    if (empty($skuCode)) {
                        $cleanPack = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $variant['pack_size']));
                        $skuCode = $product->code . '-' . $cleanPack;
                    }

                    $variantData = [
                        'pack_size'       => $variant['pack_size'],
                        'sku_code'        => $skuCode,
                        'rate_per_ct'     => $variant['rate_per_ct'] ?? 0,
                        'commission_rate' => $variant['commission_rate'] ?? 0,
                        'is_active'       => $variant['is_active'] ?? true,
                        'sort_order'      => $variant['sort_order'] ?? $idx,
                    ];

                    if (!empty($variant['id'])) {
                        $product->variants()->where('id', $variant['id'])->update($variantData);
                        $existingIds[] = $variant['id'];
                    } else {
                        $newVariant = $product->variants()->create($variantData);
                        $existingIds[] = $newVariant->id;
                    }
                }
                $product->variants()->whereNotIn('id', $existingIds)->delete();
            }

            return $product->load(['category', 'uom', 'variants']);
        });
    }

    public function destroy(string $id): bool
    {
        return DB::transaction(function () use ($id) {
            return $this->productRepository->delete($id);
        });
    }
}

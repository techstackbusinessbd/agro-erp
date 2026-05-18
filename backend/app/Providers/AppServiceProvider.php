<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Modules\Core\Interfaces\CompanyRepositoryInterface::class,
            \App\Modules\Core\Repositories\CompanyRepository::class
        );
        $this->app->bind(
            \App\Modules\Core\Interfaces\BranchRepositoryInterface::class,
            \App\Modules\Core\Repositories\BranchRepository::class
        );
        $this->app->bind(
            \App\Modules\Core\Interfaces\UserRepositoryInterface::class,
            \App\Modules\Core\Repositories\UserRepository::class
        );
        $this->app->bind(
            \App\Modules\MasterData\Interfaces\UomRepositoryInterface::class,
            \App\Modules\MasterData\Repositories\UomRepository::class
        );
        $this->app->bind(
            \App\Modules\MasterData\Interfaces\CategoryRepositoryInterface::class,
            \App\Modules\MasterData\Repositories\CategoryRepository::class
        );
        $this->app->bind(
            \App\Modules\Warehouse\Interfaces\WarehouseRepositoryInterface::class,
            \App\Modules\Warehouse\Repositories\WarehouseRepository::class
        );
        $this->app->bind(
            \App\Modules\Warehouse\Interfaces\TerritoryRepositoryInterface::class,
            \App\Modules\Warehouse\Repositories\TerritoryRepository::class
        );
        $this->app->bind(
            \App\Modules\MasterData\Interfaces\ProductRepositoryInterface::class,
            \App\Modules\MasterData\Repositories\ProductRepository::class
        );
        $this->app->bind(
            \App\Modules\Warehouse\Interfaces\StockRepositoryInterface::class,
            \App\Modules\Warehouse\Repositories\StockRepository::class
        );
        $this->app->bind(
            \App\Modules\Warehouse\Interfaces\StockTransferRepositoryInterface::class,
            \App\Modules\Warehouse\Repositories\StockTransferRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Implicitly grant "Super Admin" role all permissions
        // This works in the app by using gate-related functions like auth()->user->can() and @can()
        Gate::before(function ($user, $ability) {
            return $user->hasRole('Super Admin') ? true : null;
        });
    }
}

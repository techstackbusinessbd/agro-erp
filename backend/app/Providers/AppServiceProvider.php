<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}

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

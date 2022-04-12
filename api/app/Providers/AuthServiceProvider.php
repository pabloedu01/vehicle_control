<?php

namespace App\Providers;

use App\Guards\JwtGuard;
use Illuminate\Container\Container;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        /*\Auth::extend('jwt', function (Container $app) {
            return new JwtGuard($app['request']);
        });*/
        
        $this->registerPolicies();
    }
}

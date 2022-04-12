<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     *
     * @var string
     */
    const HOME = '/home';

    /**
     * The controller namespace for the application.
     *
     * When present, controller route declarations will automatically be prefixed with this namespace.
     *
     * @var string|null
     */
    protected $namespace = 'App\\Http\\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        Route::pattern('id', '[0-9]+');
        Route::pattern('slug', '[0-9a-zA-Z_-]+');
        
        $this->configureRateLimiting();

        $this->routes(function () {
            
            $this->mapCustomApiRoutes();
            
            Route::prefix('api')
                ->middleware('api')
                ->namespace($this->namespace)
                ->group(base_path('routes/api.php'));

            /*Route::middleware('web')
                ->namespace($this->namespace)
                ->group(base_path('routes/web.php'));*/
        });
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by(optional($request->user())->id ?: $request->ip());
        });
    }
    
    protected function mapCustomApiRoutes($path = null)
    {
        $routes_path = is_null($path) ? app_path('Http/Routes').DIRECTORY_SEPARATOR : $path;
        
        foreach(scandir($routes_path) as $file)
        {
            if(is_file($routes_path.$file))
            {
                Route::prefix('api')
                     ->middleware(['api'])
                     ->namespace($this->namespace)
                     ->group($routes_path.$file);
            }
            else
            {
                if(!in_array($file, [ '.', '..' ]) && is_dir($routes_path.$file))
                {
                    $this->mapCustomApiRoutes($routes_path.$file.DIRECTORY_SEPARATOR);
                }
            }
        }
    }
}

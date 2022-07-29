<?php

namespace App\Providers;

use Illuminate\Queue\Events\JobFailed;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        if ($this->app->isLocal()) {
            $this->app->register(\Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        /*\URL::forceRootUrl(\Config::get('app.url'));

        if (str_contains(\Config::get('app.url'), 'https://')) {
            \URL::forceScheme('https');
        }*/

        \Queue::failing(function (JobFailed $event) {
            \Log::error('JobFailed. ' . json_encode(['connectionName' => $event->connectionName, 'job' => $event->job, 'exception' => $event->exception]));
        });
    }
}

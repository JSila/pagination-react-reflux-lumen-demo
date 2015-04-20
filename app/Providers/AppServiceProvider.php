<?php namespace App\Providers;

use Illuminate\Pagination\Paginator;
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
        Paginator::currentPathResolver(function()
        {
            return $this->app['request']->url();
        });

        Paginator::currentPageResolver(function()
        {
            return $this->app['request']->input('page');
        });
    }
}

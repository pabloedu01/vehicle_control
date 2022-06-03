<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UserSeeder::class);
        $this->call(CompanySeeder::class);
        $this->call(VehicleBrandSeeder::class);
        $this->call(ChecklistItemSeeder::class);
        $this->call(ChecklistVersionSeeder::class);
        //$this->call(PermissionSeeder::class);
        //$this->call(UserPermissionSeeder::class);
    }
}

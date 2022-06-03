<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;

class VehicleBrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = \DB::table('vehicle_brands')->count();

        if($data == 0)
        {
            $company = Company::whereHas('users', function($query){
                return $query->where('username', '=', 'mcontreras');
            })->first();

            $now = date('Y-m-d H:i:s');
            \DB::table('vehicle_brands')->insert([
                                                     [
                                                         'name'       => 'Chevrolet',
                                                         'code'       => 'chevrolet',
                                                         'active'     => true,
                                                         'company_id' => $company->id,
                                                         'created_at' => $now,
                                                         'updated_at' => $now,
                                                     ],
                                                     [
                                                         'name'       => 'Toyota',
                                                         'code'       => 'toyota',
                                                         'active'     => true,
                                                         'company_id' => $company->id,
                                                         'created_at' => $now,
                                                         'updated_at' => $now,
                                                     ],
                                                 ]);
        }
    }
}

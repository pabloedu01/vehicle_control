<?php

namespace Database\Seeders;

use App\Models\ChecklistItem;
use App\Models\Company;
use App\Models\VehicleBrand;
use App\Models\VehicleBrandChecklistVersion;
use Illuminate\Database\Seeder;

class ChecklistVersionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = \DB::table(VehicleBrandChecklistVersion::getTableName())->count();

        if($data == 0)
        {
            $company = Company::whereHas('users', function($query){
                return $query->where('username', '=', 'mcontreras');
            })->first();

            $version = VehicleBrandChecklistVersion::create([
                                                                'company_id' => $company->id,
                                                                'brand_id'    => VehicleBrand::where('company_id', '=', $company->id)->where('code', '=', 'chevrolet')->first()->id,
                                                                'code'        => 'v1',
                                                                'name'        => 'Versión 1 de prueba',
                                                                'description' => null,
                                                                'active'      => true,
                                                            ]);

            $items = ChecklistItem::select('id')->where('active', '=', true)->get();

            $version->items()->sync($items->keyBy('id')->map(function($item, $key){
                return [ 'position' => $key, 'location' => null, 'type' => null ];
            })->toArray());
        }
    }
}

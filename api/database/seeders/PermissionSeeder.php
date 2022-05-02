<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = \DB::table('permissions')->count();

        if($data == 0)
        {
            \DB::table('permissions')->insert([
                                            [
                                                'name'       => 'test',
                                                'description'      => null,
                                                'code' => 'route.name',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ],
                                        ]);
        }
    }
}

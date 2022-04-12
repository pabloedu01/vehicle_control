<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = \DB::table('users')->count();

        if($data == 0)
        {
            \DB::table('users')->insert([
                                            [
                                                'username'       => 'mcontreras',
                                                'name'      => 'Miguel Contreras',
                                                'password' => bcrypt(123456),
                                                'email' => 'migueljosecontreras@gmail.com',
                                                'phone' => '+584148841858',
                                                'active' => true,
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ],
                                        ]);
        }
    }
}

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
                                                'privilege' => 'admin',
                                                'name'      => 'Miguel Contreras',
                                                'password' => bcrypt(123456),
                                                'email' => 'migueljosecontreras@gmail.com',
                                                'phone' => '+584148841858',
                                                'active' => true,
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ],
                                            [
                                                'username'       => 'pablo',
                                                'privilege' => 'admin',
                                                'name'      => 'Pablo',
                                                'password' => bcrypt(123456),
                                                'email' => 'pablo@gmail.com',
                                                'phone' => null,
                                                'active' => true,
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ],
                                            [
                                                'username'       => 'junior',
                                                'privilege' => 'admin',
                                                'name'      => 'Junior',
                                                'password' => bcrypt(123456),
                                                'email' => 'junior@gmail.com',
                                                'phone' => null,
                                                'active' => true,
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ],
                                        ]);
        }
    }
}

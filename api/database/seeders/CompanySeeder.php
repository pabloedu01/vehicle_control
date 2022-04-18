<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = \DB::table('companies')->count();

        if($data == 0)
        {
            $companyWithCpf = Company::create([
                                           'cpf' => '073715170-67',
                                       ]);
    
            $companyWithCnpj = Company::create([
                                                  'cnpj' => '68.119.835/0001-07',
                                              ]);
    
            $user = User::where('username', '=', 'mcontreras')->first();
            $user->companies()->attach($companyWithCpf->id, [ 'role' => 'owner' ]);
            $user->companies()->attach($companyWithCnpj->id, [ 'role' => 'owner' ]);
        }
    }
}

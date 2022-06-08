<?php

namespace Database\Seeders;

use App\Models\ChecklistItem;
use Illuminate\Database\Seeder;

class ChecklistItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ChecklistItem::truncate();

        $now = date('Y-m-d H:i:s');
        /*
         * string
         * numeric
         * integer
         * boolean
         * */

        \DB::table(ChecklistItem::getTableName())
           ->insert(
               [
                   [
                       'name'        => 'Cliente acompanha inspeção?',
                       'description' => null,
                       'code'        => 'customer-accompanies-inspection',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => true
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],

                   [
                       'name'        => 'Fixação tapete genuíno?',
                       'description' => null,
                       'code'        => 'genuine-carpet-fixing',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => true
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],

                   [
                       'name'        => 'Macaco?',
                       'description' => null,
                       'code'        => 'monkey',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => true
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],

                   [
                       'name'        => 'Triângulo?',
                       'description' => null,
                       'code'        => 'triangle',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => false
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Chave de roda?',
                       'description' => null,
                       'code'        => 'tire-iron',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => true
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Estepe?',
                       'description' => null,
                       'code'        => 'steppe',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => true
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Documento e Livrete de garantia?',
                       'description' => null,
                       'code'        => 'document-and-warranty-booklet',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => true
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Combustível',
                       'description' => null,
                       'code'        => 'fuel',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'integer',
                                                        'rule' => 'required|integer|min:0|max:100',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => 40
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Quilometragem number',
                       'description' => null,
                       'code'        => 'mileage-number',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'numeric',
                                                        'rule' => 'required|numeric',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => 200000
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Condição de limpeza',
                       'description' => null,
                       'code'        => 'cleaning-condition',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'list',
                                                        'rule' => 'required|string',
                                                        'options' => [
                                                            'B,R', 'R'
                                                        ]
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => 'R'
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Veículo oriundo de guincho?',
                       'description' => null,
                       'code'        => 'vehicle-from-tow-truck',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => true
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Pertences pessoais?',
                       'description' => null,
                       'code'        => 'personal-belongings',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'list',
                                                        'rule' => 'required|string',
                                                        'options' => [
                                                            'C,R', 'N'
                                                        ]
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => 'N'
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Tem tapete Genuíno Toyota?',
                       'description' => null,
                       'code'        => 'has-a-genuine-toyota-floor-mat',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => true
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Tem KIT Multimídia?',
                       'description' => null,
                       'code'        => 'has-multimedia-kit',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => true
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Tem Faróis de neblina?',
                       'description' => null,
                       'code'        => 'has-fog-lights',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => true
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Tem Soleira?',
                       'description' => null,
                       'code'        => 'has-threshold',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => true
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Tem Sobrecapa de para-choque?',
                       'description' => null,
                       'code'        => 'has-on-bumper-cover',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => true
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Tem bandeja de porta-malas?',
                       'description' => null,
                       'code'        => 'has-a-trunk-tray',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => true
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Tem engate?',
                       'description' => null,
                       'code'        => 'has-hitch',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => true
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Tem aplique cromado?',
                       'description' => null,
                       'code'        => 'has-chrome-appliqué',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => true
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Tem calha de chuva?',
                       'description' => null,
                       'code'        => 'has-rain-gutter',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => true
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
                   [
                       'name'        => 'Tem rede de porta-malas?',
                       'description' => null,
                       'code'        => 'has-a-trunk-net',
                       'active'      => true,
                       'validation'  => json_encode([
                                                        'type' => 'boolean',
                                                        'rule' => 'required|boolean',
                                                    ]),
                       'preview_data' => json_encode([
                                                         'value' => true
                                                     ]),
                       'created_at'  => $now,
                       'updated_at'  => $now,
                   ],
               ]
           );

        $this->call(ChecklistVersionSeeder::class);
    }
}

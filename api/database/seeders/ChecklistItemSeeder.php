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
        $data = \DB::table(ChecklistItem::getTableName())->count();

        if($data == 0)
        {
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
                           'is_default'  => true,
                           'name'        => 'Cliente acompanha inspeção?',
                           'description' => null,
                           'code'        => 'customer-accompanies-inspection',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],

                       [
                           'is_default'  => true,
                           'name'        => 'Fixação tapete genuíno?',
                           'description' => null,
                           'code'        => 'genuine-carpet-fixing',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],

                       [
                           'is_default'  => true,
                           'name'        => 'Macaco?',
                           'description' => null,
                           'code'        => 'monkey',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],

                       [
                           'is_default'  => true,
                           'name'        => 'Triângulo?',
                           'description' => null,
                           'code'        => 'triangle',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Chave de roda?',
                           'description' => null,
                           'code'        => 'tire-iron',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Estepe?',
                           'description' => null,
                           'code'        => 'steppe',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Documento e Livrete de garantia?',
                           'description' => null,
                           'code'        => 'document-and-warranty-booklet',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Combustível',
                           'description' => null,
                           'code'        => 'fuel',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'integer',
                                                            'rule' => 'required|integer|min:0|max:100',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Quilometragem number',
                           'description' => null,
                           'code'        => 'mileage-number',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'numeric',
                                                            'rule' => 'required|numeric',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Condição de limpeza',
                           'description' => null,
                           'code'        => 'cleaning-condition',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'string',
                                                            'rule' => 'required|string',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Veículo oriundo de guincho?',
                           'description' => null,
                           'code'        => 'vehicle-from-tow-truck',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Pertences pessoais?',
                           'description' => null,
                           'code'        => 'personal-belongings',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'string',
                                                            'rule' => 'required|string',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Tem tapete Genuíno Toyota?',
                           'description' => null,
                           'code'        => 'has-a-genuine-toyota-floor-mat',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Tem KIT Multimídia?',
                           'description' => null,
                           'code'        => 'has-multimedia-kit',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Tem Faróis de neblina?',
                           'description' => null,
                           'code'        => 'has-fog-lights',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Tem Soleira?',
                           'description' => null,
                           'code'        => 'has-threshold',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Tem Sobrecapa de para-choque?',
                           'description' => null,
                           'code'        => 'has-on-bumper-cover',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Tem bandeja de porta-malas?',
                           'description' => null,
                           'code'        => 'has-a-trunk-tray',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Tem engate?',
                           'description' => null,
                           'code'        => 'has-hitch',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Tem aplique cromado?',
                           'description' => null,
                           'code'        => 'has-chrome-appliqué',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Tem calha de chuva?',
                           'description' => null,
                           'code'        => 'has-rain-gutter',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                       [
                           'is_default'  => true,
                           'name'        => 'Tem rede de porta-malas?',
                           'description' => null,
                           'code'        => 'has-a-trunk-net',
                           'active'      => true,
                           'validation'  => json_encode([
                                                            'type' => 'boolean',
                                                            'rule' => 'required|boolean',
                                                        ]),
                           'created_at'  => $now,
                           'updated_at'  => $now,
                       ],
                   ]
               );
        }
    }
}

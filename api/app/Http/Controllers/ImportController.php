<?php

namespace App\Http\Controllers;

use App\Events\Notifications;
use App\Models\ChecklistVersion;
use App\Models\ServiceSchedule;
use App\Imports\DataCompanyImport;
use App\Models\Client;
use App\Models\ClientVehicle;
use App\Models\Company;
use App\Models\TemporalFile;
use App\Models\Vehicle;
use App\Models\VehicleBrand;
use App\Models\VehicleModel;
use Carbon\Carbon;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Symfony\Component\HttpFoundation\Response;

class ImportController extends Controller
{
    private $storage;

    public function __construct()
    {
        $this->storage = \Storage::disk('public');

        if(!$this->storage->exists(TemporalFile::$path))
        {
            $this->storage->makeDirectory(TemporalFile::$path);
        }
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), [
            'file' => 'required|file|mimetypes:application/csv,application/excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,application/vnd.ms-excel',
        ]);

        if($validator->fails())
        {
            return response()->json([
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $file = $request->file('file');

        $checklistVersion = ChecklistVersion::where('code', '=', 'toyota')->first();

        if(is_null($checklistVersion)){
            $checklistVersion = ChecklistVersion::create([
                                                             'code'        => 'toyota',
                                                             'name'        => 'Toyota',
                                                             'active'      => true,
                                                         ]);
        }

        $rows = array_merge(...(new DataCompanyImport)->toArray($file));

        $companiesGroupedById = Company::whereHas('users', function($query){
            return $query->where('users.id', '=', \Auth::user()->id);
        })->get()
                                       ->keyBy('id');

        $brandsGroupedByCompanyAndName = VehicleBrand::whereIn('company_id', $companiesGroupedById->keys()->toArray())
                                                     ->where('code', '=', 'toyota')
                                                     ->get()
                                                     ->groupBy('company_id')->map(function($models){
                return $models->keyBy('code');
            });

        $modelsGroupedByCompanyAndName = VehicleModel::whereIn('company_id', $companiesGroupedById->keys()->toArray())
                                                     ->whereHas('brand', function($query){
                                                         return $query->where('code', '=', 'toyota');
                                                     })
                                                     ->get()->map(function($model){
                $model->key = \Str::slug($model->name);
                return $model;
            })->groupBy('company_id')->map(function($models){
                return $models->keyBy('key');
            });

        $vehiclesGroupedByCompanyAndModelIdAndName = Vehicle::whereIn('company_id', $companiesGroupedById->keys()->toArray())
                                                            ->whereHas('brand', function($query){
                                                                return $query->where('code', '=', 'toyota');
                                                            })
                                                            ->get()->map(function($vehicle){
                $vehicle->key = \Str::slug($vehicle->name);
                return $vehicle;
            })->groupBy('company_id')->map(function($vehicles){
                return $vehicles->groupBy('model_id')->map(function($vehicles){
                    return $vehicles->keyBy('key');
                });
            });

        $clientVehiclesGroupedByCompanyAndModelIdAndName = ClientVehicle::with(['vehicle'])
                                                                        ->whereIn('company_id', $companiesGroupedById->keys()->toArray())
                                                                        ->whereHas('vehicle', function($query){
                                                                            return $query->whereHas('brand', function($query){
                                                                                return $query->where('code', '=', 'toyota');
                                                                            });
                                                                        })
                                                                        ->get()
                                                                        ->map(function($clientVehicle){
                                                                            $clientVehicle->key = \Str::slug(( \Str::slug($clientVehicle->plate) ?? '' ).( \Str::slug($clientVehicle->chasis) ?? '' ));
                                                                            $clientVehicle->model_id = $clientVehicle->vehicle->model_id;

                                                                            return $clientVehicle;
                                                                        })
                                                                        ->groupBy('company_id')->map(function($clientVehicles){
                return $clientVehicles->groupBy('model_id')->map(function($clientVehicles){
                    return $clientVehicles->groupBy('vehicle_id')->map(function($clientVehicles){
                        return $clientVehicles->keyBy('key');
                    });
                });
            });

        $clientsGroupedByCompanyAndName = Client::whereIn('company_id', $companiesGroupedById->keys()->toArray())
                                                ->get()->map(function($client){
                $client->key = \Str::slug($client->name);
                return $client;
            })->groupBy('company_id')->map(function($clients){
                return $clients->keyBy('key');
            });

        foreach($rows as $row)
        {
            $company = @$companiesGroupedById[$row['filial']];

            if($company)
            {
                $code = trim($row['nro_preos']);
                $clientEmail = trim(strtolower($row['endeletronic']));
                $promisedDate = convert_user_date_to_utc(Carbon::createFromFormat('d/m/Y H:i:s', Date::excelToDateTimeObject($row['dtchegada'])->format('d/m/Y').' '.$row['hora'])->format('Y-m-d H:i:s'), $request->utcOffset);

                $client = @$clientsGroupedByCompanyAndName[$company->id][\Str::slug($row['cliente'])];
                $brand = @$brandsGroupedByCompanyAndName[$company->id]['toyota'];
                $model = @$modelsGroupedByCompanyAndName[$company->id][\Str::slug($row['veiculo'])];
                $vehicle = @$vehiclesGroupedByCompanyAndModelIdAndName[$company->id][$model->id][\Str::slug($row['modelo'])];
                $clientVehicle = @$clientVehiclesGroupedByCompanyAndModelIdAndName[$company->id][$model->id][$vehicle->id][\Str::slug($row['placa']).\Str::slug($row['chassis'])];

                if(is_null($client)){
                    $client = Client::create([
                                                 'company_id' => $company->id,
                                                 'document'   => '20916310',
                                                 'name'       => trim($row['cliente']),
                                                 'address'    => null,
                                                 'email'      => $clientEmail,
                                                 'active'     => true,
                                             ]);
                }

                if(is_null($brand)){
                    $brand = VehicleBrand::create([
                                                      'company_id' => $company->id,
                                                      'name'       => 'Toyota',
                                                      'code'       => 'toyota',
                                                      'active'     => true,
                                                  ]);
                }

                if(is_null($model)){
                    $model = VehicleModel::create([
                                                      'company_id' => $company->id,
                                                      'brand_id' => $brand->id,
                                                      'name'       => trim($row['veiculo']),
                                                      'active'     => true,
                                                  ]);
                }

                if(is_null($vehicle)){
                    $vehicle = Vehicle::create([
                                                   'company_id' => $company->id,
                                                   'brand_id'   => $brand->id,
                                                   'model_id'   => $model->id,
                                                   'name'       => trim($row['modelo']),
                                                   'model_year' => trim($row['fab']).'/'.trim($row['mod']),
                                                   'active'     => true,
                                               ]);
                }

                if(is_null($clientVehicle)){
                    $clientVehicle = ClientVehicle::create([
                                                   'company_id' => $company->id,
                                                   'vehicle_id'   => $vehicle->id,
                                                   'chasis'   => trim($row['chassis']),
                                                   'plate'   => trim($row['placa']),
                                                   'mileage' => $row['km']
                                               ]);
                } else {
                    unset($clientVehicle->key);
                    unset($clientVehicle->model_id);

                    $clientVehicle->update(['mileage' => trim($row['km'])]);
                }

                $serviceSchedule = ServiceSchedule::create([
                                            'code'                    => $code,
                                            'promised_date'           => $promisedDate,
                                            'company_id'              => $company->id,
                                            'checklist_version_id'    => $checklistVersion->id,
                                            'technical_consultant_id' => null,
                                            'client_id'               => $client->id,
                                            'client_vehicle_id'       => $clientVehicle->id,
                                        ]);
            }
            else
            {
                event(new Notifications(\Auth::user(), 'La compañia '.$row['filial'].' no existe'));
            }
        }

        return response()->json([
                                    'msg' => trans('general.msg.success'),
                                ],
                                Response::HTTP_OK
        );
    }
}

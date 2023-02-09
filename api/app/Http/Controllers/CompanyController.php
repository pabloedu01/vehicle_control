<?php

namespace App\Http\Controllers;

use App\Models\ClientVehicle;
use App\Models\Company;
use App\Models\MaintenanceReview;
use App\Models\Service;
use App\Models\Vehicle;
use App\Models\VehicleBrandChecklistVersion;
use App\Models\VehicleModel;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CompanyController extends Controller
{
    public function show(Request $request, $id)
    {
        $company = Company::where('id', '=', $id)
                          ->first();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $company,
                                ],
                                Response::HTTP_OK
        );
    }

    public function index(Request $request)
    {
        $vehicles = Vehicle::with('model', 'model.brand')
                           ->where('model_id', '=', $request->model_id)
                           ->get();

        return response()->json([ 'msg' => trans('general.msg.success'), 'data' => $vehicles, ], Response::HTTP_OK);
    }

    public function vehicleModels(Request $request)
    {
        $vehicleModels = VehicleModel::with('brand')
                                     ->where('company_id', '=', $request->company_id)
                                     ->get();
        // search by model name and brand name
        if($request['search'])
        {
            $vehicleModels = VehicleModel::leftJoin('vehicle_brands', 'vehicle_brands.id', '=', 'vehicle_models.brand_id')
                                         ->where('vehicle_models.company_id', '=', $request->company_id)
                                         ->where(function($query) use ($request){
                                             $liked = '%' . strtolower($request->search) . '%';

                                             return $query->where(\DB::raw('lower(vehicle_models.name)'), 'like',  $liked)
                                                          ->orWhere(\DB::raw('lower(vehicle_brands.name)'), 'like',  $liked);
                                         })
                                         ->get();
                                         foreach ($vehicleModels as $vehicleModel) {
                                             $vehicleModel['brand'] = $vehicleModel->brand;
                                         }
        }

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $vehicleModels,
                                ],
                                Response::HTTP_OK
        );
    }

    public function vehicles(Request $request)
    {
        $vehicles = Vehicle::with('model', 'model.brand')
                           ->where('company_id', '=', $request->company_id)
                           ->get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $vehicles,
                                ],
                                Response::HTTP_OK
        );
    }

    public function maintenanceReviews(Request $request)
    {
        $maintenanceReviews = MaintenanceReview::with('model', 'model.brand')
                           ->where('company_id', '=', $request->company_id)
                           ->get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $maintenanceReviews,
                                ],
                                Response::HTTP_OK
        );
    }

    public function services(Request $request)
    {
        $services = Service::where('company_id', '=', $request->company_id)
                           ->get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $services,
                                ],
                                Response::HTTP_OK
        );
    }

    public function clientVehicles(Request $request)
    {
        $clientVehicles = ClientVehicle::with([ 'vehicle', 'vehicle.model', 'vehicle.model.brand' ])
                                       ->where('company_id', '=', $request->company_id)
                                       ->get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $clientVehicles,
                                ],
                                Response::HTTP_OK
        );
    }

    public function vehicleBrandChecklistVersions(Request $request)
    {
        $versions = VehicleBrandChecklistVersion::with('brand')
                                                ->where('company_id', '=', $request->company_id)
                                                ->get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $versions,
                                ],
                                Response::HTTP_OK
        );
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), Company::rules());

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $company = new Company($request->only(Company::getFillables()));

        if(secureSave($company))
        {
            $company->users()->attach(\Auth::user(), [ 'role' => 'owner' ]);

            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $company,
                                    ],
                                    Response::HTTP_CREATED
            );
        }
        else
        {
            return response()->json([
                                        'msg' => trans('general.msg.error'),
                                    ],
                                    Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function update(Request $request, $id)
    {
        $company = Company::where('id', '=', $id)
                          ->first();

        $validator = validate($request->all(), Company::rules($company->id));

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $company->fill($request->only(Company::getFillables()));

        if(secureSave($company))
        {
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $company,
                                    ],
                                    Response::HTTP_CREATED
            );
        }
        else
        {
            return response()->json([
                                        'msg' => trans('general.msg.error'),
                                    ],
                                    Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}

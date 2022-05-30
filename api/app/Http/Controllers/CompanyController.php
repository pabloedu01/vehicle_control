<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Vehicle;
use App\Models\VehicleBrandChecklistVersion;
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
}

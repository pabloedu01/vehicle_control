<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ClientVehicle;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ClientVehicleController extends Controller
{
    public function index(Request $request)
    {
        $clientVehicles = ClientVehicle::with([ 'client', 'vehicle', 'vehicle.model', 'vehicle.model.brand' ])
                                       ->where('client_id', '=', $request->client_id)
                                       ->get();

        $clientVehicles->append('name');

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $clientVehicles,
                                ],
                                Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $clientVehicle = ClientVehicle::with([ 'client', 'vehicle', 'vehicle.model', 'vehicle.model.brand' ])
                                      ->where('id', '=', $id)
                                      ->first();

        $clientVehicle->append('name');

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $clientVehicle,
                                ],
                                Response::HTTP_OK
        );
    }

    public function search(Request $request)
    {
        $clientVehicle = ClientVehicle::whereHas('client', function($query){
            return $query->withoutTrashed();
        })
                                      ->whereHas('company', function($query){
                                          return $query->whereHas('users', function($query){
                                              return $query->where('users.id', '=', \Auth::user()->id);
                                          });
                                      })
                                      ->where(function($query) use ($request){
                                          return $query->where('plate', '=', $request->search)
                                                       ->orWhere('chasis', '=', $request->search);
                                      })
                                      ->first();

        if($clientVehicle)
        {
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $clientVehicle,
                                    ],
                                    Response::HTTP_OK
            );
        }
        else
        {
            return response()->json([
                                        'msg' => trans('general.msg.notFound'),
                                    ],
                                    Response::HTTP_NOT_FOUND
            );
        }
    }

    public function store(Request $request)
    {
        $client = Client::where('id', '=', $request->client_id)->first();

        $request->merge([
                            'company_id' => $client->company_id,
                        ]);

        $validator = validate($request->all(), ClientVehicle::rules(null, $client->company_id));

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $clientVehicle = new ClientVehicle($request->only(ClientVehicle::getFillables()));

        if(secureSave($clientVehicle))
        {
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $clientVehicle,
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
        $clientVehicle = ClientVehicle::where('id', '=', $id)->first();

        $validator = validate($request->all(), ClientVehicle::rules($clientVehicle->id, $clientVehicle->company_id));

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $clientVehicle->fill(collect($request->except([ 'company_id' ]))->only(ClientVehicle::getFillables())->toArray());

        if(!$clientVehicle->hasAppliedChanges() || secureSave($clientVehicle))
        {
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $clientVehicle,
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

    public function destroy(Request $request, $id)
    {
        $clientVehicle = ClientVehicle::where('id', '=', $id)->first();

        if(secureDelete($clientVehicle))
        {
            return response()->json([
                                        'msg' => trans('general.msg.success'),
                                    ],
                                    Response::HTTP_OK
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

<?php

namespace App\Http\Controllers;

use App\Models\Recommendation;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RecommendationController extends Controller
{
    public function index(Request $request)
    {
        $recommendations = Recommendation::with(['vehicle', 'vehicle.model', 'vehicle.model.brand', 'maintenanceReview', 'claimService', 'serviceType'])
                           ->where('company_id', '=', $request->company_id)
                           ->get();

        $recommendations->each(function($recommendation){
            $recommendation->vehicle->append('full_name');
        });

        return response()->json([ 'msg' => trans('general.msg.success'), 'data' => $recommendations, ], Response::HTTP_OK);
    }

    public function show(Request $request, $id)
    {
        $recommendation = Recommendation::with(['vehicle', 'vehicle.model', 'vehicle.model.brand', 'maintenanceReview', 'claimService', 'serviceType', 'services'])
                          ->where('id', '=', $id)
                          ->first();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $recommendation,
                                ],
                                Response::HTTP_OK
        );
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), Recommendation::rules($request->company_id));

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $recommendation = new Recommendation($request->only(Recommendation::getFillables()));

        if(secureSave($recommendation))
        {
            $recommendation->services()->sync(collect($request->services)->keyBy('id')->map(function($item){
                return [ 'value' => @$item['value'] ];
            })->toArray());

            $recommendation->load('services');

            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $recommendation,
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
        $recommendation = Recommendation::where('id', '=', $id)->first();

        $validator = validate($request->all(), Recommendation::rules($recommendation->company_id));

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $recommendation->fill(collect($request->except([ 'company_id' ]))->only(Recommendation::getFillables())->toArray());

        if(!$recommendation->hasAppliedChanges() || secureSave($recommendation))
        {
            $recommendation->services()->sync(collect($request->services)->keyBy('id')->map(function($item){
                return [ 'value' => @$item['value'] ];
            })->toArray());

            $recommendation->load('services');

            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $recommendation,
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
        $recommendation = Recommendation::where('id', '=', $id)->first();

        if(!$recommendation->canBeDeleted())
        {
            return response()->json([
                                        'msg' => trans('general.msg.hasDependencies'),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        if($recommendation->secureDelete())
        {
            return response()->json([
                                        'msg' => trans('general.msg.success'),
                                    ], Response::HTTP_OK
            );
        }
        else
        {
            return response()->json([
                                        'msg' => trans('general.msg.error'),
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}

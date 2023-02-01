<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceReview;
use App\Models\VehicleModel;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MaintenanceReviewController extends Controller
{
    public function index(Request $request)
    {
        $maintenanceReviews = MaintenanceReview::where('model_id', '=', $request->model_id)
                           ->get();

        return response()->json([ 'msg' => trans('general.msg.success'), 'data' => $maintenanceReviews, ], Response::HTTP_OK);
    }

    public function show(Request $request, $id)
    {
        $maintenanceReview = MaintenanceReview::with('model', 'model.brand', 'brand')
                          ->where('id', '=', $id)
                          ->first();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $maintenanceReview,
                                ],
                                Response::HTTP_OK
        );
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), MaintenanceReview::rules());

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $model   = VehicleModel::find($request->model_id);
        $maintenanceReview = new MaintenanceReview($request->merge([ 'company_id' => $model->company_id, 'brand_id' => $model->brand_id ])->only(MaintenanceReview::getFillables()));

        if(secureSave($maintenanceReview))
        {
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $maintenanceReview,
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
        $maintenanceReview = MaintenanceReview::where('id', '=', $id)->first();
        $model   = VehicleModel::find($request->model_id);

        $validator = validate($request->all(), MaintenanceReview::rules());

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $maintenanceReview->fill(collect($request->merge([ 'brand_id' => $model->brand_id ])->except([ 'company_id' ]))->only(MaintenanceReview::getFillables())->toArray());

        if(!$maintenanceReview->hasAppliedChanges() || secureSave($maintenanceReview))
        {
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $maintenanceReview,
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
        $maintenanceReview = MaintenanceReview::where('id', '=', $id)->first();

        if(!$maintenanceReview->canBeDeleted())
        {
            return response()->json([
                                        'msg' => trans('general.msg.hasDependencies'),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        if($maintenanceReview->secureDelete())
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

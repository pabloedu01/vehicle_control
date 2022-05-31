<?php

namespace App\Http\Controllers;

use App\Models\ClaimService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ClaimServiceController extends Controller
{
    public function index(Request $request)
    {
        $claimsService = ClaimService::where('company_id', '=', $request->company_id)
                                     ->get();

        return response()->json(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             [
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              'msg' => trans('general.msg.success'),
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              'data' => $claimsService,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ], Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $claimService = ClaimService::where('id', '=', $id)
                                    ->first();

        return response()->json(   [
                                    'msg' => trans('general.msg.success'),
                                    'data' => $claimService,
                                ], Response::HTTP_OK
        );
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), ClaimService::rules(null, $request->company_id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $claimService = new ClaimService($request->only(ClaimService::getFillables()));

        if(secureSave($claimService))
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                        'data' => $claimService,
                                    ], Response::HTTP_CREATED
            );
        }
        else
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.error'),
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function update(Request $request, $id)
    {
        $claimService = ClaimService::where('id', '=', $id)->first();

        $validator = validate($request->all(), ClaimService::rules($claimService->id, $claimService->company_id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $claimService->fill(collect($request->except([ 'company_id' ]))->only(ClaimService::getFillables())->toArray());

        if(!$claimService->hasAppliedChanges() || secureSave($claimService))
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                        'data' => $claimService,
                                    ], Response::HTTP_CREATED
            );
        }
        else
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.error'),
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function destroy(Request $request, $id)
    {
        $claimService = ClaimService::where('id', '=', $id)->first();

        if(secureDelete($claimService))
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                    ], Response::HTTP_OK
            );
        }
        else
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.error'),
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}

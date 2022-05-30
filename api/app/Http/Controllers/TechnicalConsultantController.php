<?php

namespace App\Http\Controllers;

use App\Models\TechnicalConsultant;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TechnicalConsultantController extends Controller
{
    public function index(Request $request)
    {
        $technicalConsultants = TechnicalConsultant::with('user')
                                                   ->where('company_id', '=', $request->company_id)
                                                   ->get();

        return response()->json([
                                    'msg' => trans('general.msg.success'),
                                    'data' => $technicalConsultants,
                                ],
                                Response::HTTP_OK
        );
    }

    public function availableUsers(Request $request)
    {
        $availableUsers = User::whereHas('companies', function($query) use ($request){
                                        return $query->where('company_id', '=', $request->company_id);
                                    })
                                    ->whereDoesntHave('technicalConsultants', function($query) use ($request){
                                        return $query->where('company_id', '=', $request->company_id);
                                    })
                                    ->get();

        return response()->json([
                                    'msg' => trans('general.msg.success'),
                                    'data' => $availableUsers,
                                ],
                                Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $technicalConsultant = TechnicalConsultant::with('user')
                                                  ->where('id', '=', $id)
                                                  ->first();

        return response()->json([
                                    'msg' => trans('general.msg.success'),
                                    'data' => $technicalConsultant,
                                ],
                                Response::HTTP_OK
        );
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), TechnicalConsultant::rules($request->company_id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $technicalConsultant = new TechnicalConsultant($request->only(TechnicalConsultant::getFillables()));

        if(secureSave($technicalConsultant))
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                        'data' => $technicalConsultant,
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
        $technicalConsultant = TechnicalConsultant::where('id', '=', $id)->first();

        $validator = validate($request->all(), TechnicalConsultant::rules($technicalConsultant->company_id, $technicalConsultant->id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $technicalConsultant->fill(collect($request->except(['company_id']))->only(TechnicalConsultant::getFillables())->toArray());

        if(!$technicalConsultant->hasAppliedChanges() || secureSave($technicalConsultant))
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                        'data' => $technicalConsultant,
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

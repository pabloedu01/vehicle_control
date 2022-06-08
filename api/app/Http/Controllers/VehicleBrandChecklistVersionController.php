<?php

namespace App\Http\Controllers;

use App\Models\VehicleBrand;
use App\Models\VehicleBrandChecklistVersion as Version;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VehicleBrandChecklistVersionController extends Controller
{
    public function index(Request $request)
    {
        $versions = Version::with(['brand','items'])->where('brand_id', '=', $request->brand_id)->get();

        return response()->json([
                                    'msg' => trans('general.msg.success'),
                                    'data' => $versions,
                                ],
                                Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $version = Version::with(['brand','items'])->where('id', '=', $id)
                          ->first();

        return response()->json([
                                    'msg' => trans('general.msg.success'),
                                    'data' => $version,
                                ],
                                Response::HTTP_OK
        );
    }

    public function showReport(Request $request, $id)
    {
        return response()->json([
                                    'msg' => trans('general.msg.success'),
                                    'data' => null,
                                ],
                                Response::HTTP_OK
        );
    }

    public function storeReport(Request $request, $id){
        dd($id,$request->all());
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), Version::rules());

        if($validator->fails())
        {
            return response()->json([
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $brand   = VehicleBrand::find($request->brand_id);
        $version = new Version($request->merge([ 'company_id' => $brand->company_id ])->only(Version::getFillables()));

        if(secureSave($version))
        {
            $version->items()->sync(
                collect($request->checklist)->keyBy('id')->map(function($item){
                    return [ 'position' => @$item['position'], 'location' => @$item['location'], 'type' => @$item['type'] ];
                })->toArray()
            );
            $version->load(['brand','items']);

            return response()->json([
                                        'msg' => trans('general.msg.success'),
                                        'data' => $version,
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
        $version = Version::where('id', '=', $id)->first();

        $validator = validate($request->all(), Version::rules());

        if($validator->fails())
        {
            return response()->json(                                                                                                                                                                     [
                                                                                                                                                                                                          'msg' => trans('general.msg.invalidData'),
                                                                                                                                                                                                          'errors' => $validator->errors(),
                                                                                                                                                                                                      ], Response::HTTP_BAD_REQUEST
            );
        }

        $version->fill(collect($request->except([ 'company_id' ]))->only(Version::getFillables())->toArray());

        if(!$version->hasAppliedChanges() || secureSave($version))
        {
            $version->items()->sync(collect($request->checklist)->keyBy('id')->map(function($item){
                return [ 'position' => @$item['position'], 'location' => @$item['location'], 'type' => @$item['type'] ];
            })->toArray());
            $version->load(['brand','items']);

            return response()->json([
                                        'msg' => trans('general.msg.success'),
                                        'data' => $version,
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
        $version = Version::where('id', '=', $id)->first();

        if(secureDelete($version))
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

<?php

namespace App\Http\Controllers;

use App\Models\ChecklistVersion as Version;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ChecklistVersionController extends Controller
{
    public function index(Request $request)
    {
        $versions = Version::get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $versions,
                                ],
                                Response::HTTP_OK
        );
    }

    public function activeVersions(Request $request)
    {
        $versions = Version::where('active', '=', true)->get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $versions,
                                ],
                                Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $version = Version::where('id', '=', $id)
                          ->first();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $version,
                                ],
                                Response::HTTP_OK
        );
    }

    public function duplicate(Request $request, $id)
    {
        $version = Version::where('id', '=', $id)
                          ->first();

        $newVersion = new Version(collect($version->toArray())->except(['id'])->toArray());
        $newVersion->code = $newVersion->code.'-duplicated-'.strtolower(\Str::random(4));
        $newVersion->name = $newVersion->name.' ('.trans('general.duplicated').')';

        if(secureSave($newVersion)){
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $newVersion,
                                    ],
                                    Response::HTTP_CREATED
            );
        } else {
            return response()->json([
                                        'msg' => trans('general.msg.error'),
                                    ],
                                    Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function storeReport(Request $request, $id)
    {
        $request->merge(['report' => json_decode($request->report,true)]);

        $validator = validate($request->all(), [ 'report' => 'required|array' ]);

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $version         = Version::where('id', '=', $id)->first();
        $version->report = $request->report;

        if(secureSave($version))
        {
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
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

    public function store(Request $request)
    {
        $validator = validate($request->all(), Version::rules());

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $version = new Version($request->only(Version::getFillables()));

        if(secureSave($version))
        {
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
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

        $validator = validate($request->all(), Version::rules($id));

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $version->fill($request->only(Version::getFillables()));

        if(!$version->hasAppliedChanges() || secureSave($version))
        {
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
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

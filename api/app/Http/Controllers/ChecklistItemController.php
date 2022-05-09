<?php

namespace App\Http\Controllers;

use App\Models\ChecklistItem;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ChecklistItemController extends Controller
{
    public function index(Request $request)
    {
        $checklistItems = ChecklistItem::get();

        return response()->json([
                                    'msg'  => '¡Success!',
                                    'data' => $checklistItems,
                                ],
                                Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $checklistItem = ChecklistItem::where('id', '=', $id)
                                      ->first();

        if($checklistItem){
            return response()->json([
                                        'msg'  => '¡Success!',
                                        'data' => $checklistItem,
                                    ],
                                    Response::HTTP_OK
            );
        }
        else
        {
            return response()->json([
                                        'msg' => '¡Not Found!',
                                    ],
                                    Response::HTTP_NOT_FOUND
            );
        }

    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), ChecklistItem::rules());

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => '¡Invalid Data!',
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $checklistItem = new ChecklistItem($request->only(ChecklistItem::getFillables()));

        if(secureSave($checklistItem))
        {
            return response()->json([
                                        'msg'  => '¡Success!',
                                        'data' => $checklistItem,
                                    ],
                                    Response::HTTP_CREATED
            );
        }
        else
        {
            return response()->json([
                                        'msg' => '¡Error!',
                                    ],
                                    Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function update(Request $request, $id)
    {
        $checklistItem = ChecklistItem::where('id', '=', $id)->first();

        if($checklistItem)
        {
            $validator = validate($request->all(), ChecklistItem::rules());

            if($validator->fails())
            {
                return response()->json([
                                            'msg'    => '¡Invalid Data!',
                                            'errors' => $validator->errors(),
                                        ],
                                        Response::HTTP_BAD_REQUEST
                );
            }

            $checklistItem->fill($request->only(ChecklistItem::getFillables()));

            if(!$checklistItem->hasAppliedChanges() || secureSave($checklistItem))
            {
                return response()->json([
                                            'msg'  => '¡Success!',
                                            'data' => $checklistItem,
                                        ],
                                        Response::HTTP_OK
                );
            }
            else
            {
                return response()->json([
                                            'msg' => '¡Error!',
                                        ],
                                        Response::HTTP_INTERNAL_SERVER_ERROR
                );
            }
        }
        else
        {
            return response()->json([
                                        'msg' => '¡Not Found!',
                                    ],
                                    Response::HTTP_NOT_FOUND
            );
        }
    }

    public function destroy(Request $request, $id)
    {
        $checklistItem = ChecklistItem::where('id', '=', $id)->first();

        if($checklistItem)
        {
            if(secureDelete($checklistItem))
            {
                return response()->json([
                                            'msg' => '¡Success!',
                                        ],
                                        Response::HTTP_OK
                );
            }
            else
            {
                return response()->json([
                                            'msg' => '¡Error!',
                                        ],
                                        Response::HTTP_INTERNAL_SERVER_ERROR
                );
            }
        }
        else
        {
            return response()->json([
                                        'msg' => '¡Not Found!',
                                    ],
                                    Response::HTTP_NOT_FOUND
            );
        }

    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $clients = Client::where('company_id', '=', $request->company_id)
                         ->whereNull('deleted_at')
                         ->get();

        return response()->json([
                                    'msg'  => '¡Success!',
                                    'data' => $clients,
                                ],
                                Response::HTTP_OK);
    }

    public function show(Request $request, $id)
    {
        $client = Client::where('id', '=', $id)
                        ->first();

        return response()->json([
                                    'msg'  => '¡Success!',
                                    'data' => $client,
                                ],
                                Response::HTTP_OK
        );
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), Client::rules(null, $request->company_id));

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => '¡Invalid Data!',
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $client = new Client($request->only(Client::getFillables()));

        if(secureSave($client))
        {
            return response()->json([
                                        'msg'  => '¡Success!',
                                        'data' => $client,
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
        $client = Client::where('id', '=', $id)->first();

        $validator = validate($request->all(), Client::rules($client->id, $client->company_id));

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => '¡Invalid Data!',
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $client->fill(collect($request->except([ 'company_id' ]))->only(Client::getFillables())->toArray());

        if(!$client->hasAppliedChanges() || secureSave($client))
        {
            return response()->json([
                                        'msg'  => '¡Success!',
                                        'data' => $client,
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

    public function destroy(Request $request, $id)
    {
        $client = Client::where('id', '=', $id)->first();

        if(secureDelete($client))
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
}

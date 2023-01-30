<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        if($request['search']){
            $products = Product::search($request['search'])->where('company_id', $request->company_id)->get();
        }else {
            $products = Product::where('company_id', '=', $request->company_id)
            ->get();
        }



        return response()->json([
                                    'msg' => trans('general.msg.success'),
                                    'data' => $products,
                                ],
                                Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $product = Product::where('id', '=', $id)
                          ->first();

        return response()->json(   [
                                    'msg' => trans('general.msg.success'),
                                    'data' => $product,
                                ], Response::HTTP_OK
        );
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), Product::rules(null, $request->company_id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $product = new Product($request->only(Product::getFillables()));

        if(secureSave($product))
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                        'data' => $product,
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
        $product = Product::where('id', '=', $id)->first();

        $validator = validate($request->all(), Product::rules($product->id, $product->company_id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $product->fill(collect($request->except([ 'company_id' ]))->only(Product::getFillables())->toArray());

        if(!$product->hasAppliedChanges() || secureSave($product))
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                        'data' => $product,
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
        $product = Product::where('id', '=', $id)->first();

        if(!$product->canBeDeleted())
        {
            return response()->json([
                                        'msg' => trans('general.msg.hasDependencies'),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        if($product->secureDelete())
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

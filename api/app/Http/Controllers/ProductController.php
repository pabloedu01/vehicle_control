<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Log;
use App\Models\Product;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::where('company_id', '=', $request->company_id)
                           ->whereNull('deleted_at')
                           ->get();
        
        return response()->json([
                                    'msg'  => '¡Success!',
                                    'data' => $products,
                                ], Response::HTTP_OK
        );
    }
    
    public function show(Request $request)
    {
        $product = Product::where('id', '=', $request->id)
                           ->first();
        
        return response()->json([
                                    'msg'  => '¡Success!',
                                    'data' => $product,
                                ], Response::HTTP_OK
        );
    }
    
    public function store(Request $request)
    {
        $validator = validate($request->all(), Product::rules(null, $request->company_id));
        
        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => '¡Invalid Data!',
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }
        
        $product = new Product($request->only(Product::getFillables()));
        
        if(secureSave($product))
        {
            return response()->json([
                                        'msg'  => '¡Success!',
                                        'data' => $product,
                                    ], Response::HTTP_CREATED
            );
        }
        else
        {
            return response()->json([
                                        'msg' => '¡Error!',
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    
    public function update(Request $request)
    {
        $product = Product::where('id', '=', $request->id)->first();
        
        $validator = validate($request->all(), Product::rules($product->id, $product->company_id));
        
        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => '¡Invalid Data!',
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }
        
        $product->fill(collect($request->except([ 'company_id' ]))->only(Product::getFillables())->toArray());
        
        if(!$product->hasAppliedChanges() || secureSave($product))
        {
            return response()->json([
                                        'msg'  => '¡Success!',
                                        'data' => $product,
                                    ], Response::HTTP_OK
            );
        }
        else
        {
            return response()->json([
                                        'msg' => '¡Error!',
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    
    public function destroy(Request $request)
    {
        $product = Product::where('id', '=', $request->id)->first();
        
        if(secureDelete($product))
        {
            return response()->json([
                                        'msg' => '¡Success!',
                                    ], Response::HTTP_OK
            );
        }
        else
        {
            return response()->json([
                                        'msg' => '¡Error!',
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}

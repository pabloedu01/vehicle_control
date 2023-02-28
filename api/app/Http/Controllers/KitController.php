<?php

namespace App\Http\Controllers;

use App\Models\Kit;
use App\Models\KitProducts;
use App\Models\KitServices;
use App\Models\Product;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;


class KitController extends Controller
{
    public function index(Request $request)
    {
        $array = [];
        if ($request['search']) {
            $kits = Kit::where('name', 'like', '%' . $request['search'] . '%')
                ->where('company_id', $request['company_id'])
                ->get();
        } else {
            $kits = Kit::where('company_id', $request['company_id'])->get();
        }
        foreach ($kits as $key => $kit) {

            $array[$key]['kit_id'] = $kit->id;
            $array[$key]['name'] = $kit->name;

            $products = [];
            foreach (KitProducts::where('kit_id', $kit->id)->get() as $key => $row) {
                $products[$key]['id'] = $row->id;
                $products[$key]['product_id'] = $row->product_id;
                $products[$key]['quantity'] = $row->quantity;
                $products[$key]['product'] = Product::where('id', $row->product_id)->first();
            }
            $array[$key]['products'] = $products;
            $services = [];
            foreach (KitServices::where('kit_id', $kit->id)->get() as $key2 => $row2) {
                $services[$key2]['id'] = $row2->id;
                $services[$key2]['service_id'] = $row2->service_id;
                $services[$key2]['quantity'] = $row2->quantity;
                $services[$key2]['service'] = Service::where('id', $row2->service_id)->first();
            }
            $array[$key]['services'] = $services;
        }

        return response()->json([
            'msg' => trans('general.msg.success'),
            'total_results' => $kits->count(),
            'current_page' => intval(@$request->current_page && is_numeric($request->current_page) ? $request->current_page : 1),
            'total_pages' => ceil(Kit::where('company_id', $request['company_id'])->limit(null)->offset(0)->count() / (@$request->limit ?? 50)),
            'data' => $array,
        ],
            Response::HTTP_OK
        );

    }
    public function store(Request $request)
    {
        // validade
        $request->validate([
            'name' => 'required',
            'company_id' => 'required',
        ]);


        DB::beginTransaction();
        try {
            $kit = new Kit;
            $kit->company_id = $request->company_id;
            $kit->name = $request->name;
            $kit->save();

            if ($request->products != [] or $request->products != null) {
                foreach ($request->products as $product) {
                    // check product
                    $productcheck = Product::where('id', $product['product_id'])
                                        ->where('company_id',$request->company_id)
                                        ->first();
                    if(!$productcheck){
                        // trow execption
                        throw new \Exception("Product not found in this Company");

                    }else {
                        $kit_product = new KitProducts();
                        $kit_product->kit_id = $kit->id;
                        $kit_product->product_id = $product['product_id'];
                        $kit_product->quantity = $product['quantity'];
                        $kit_product->save();

                    }

                }
            }
            if ($request->services != [] or $request->services != null) {

                foreach ($request->services as $service) {
                    // check service
                    $servicecheck = Service::where('id', $service['service_id'])
                                        ->where('company_id',$request->company_id)
                                        ->first();
                    if(!$servicecheck){
                        // trow execption
                        throw new \Exception("Service not found in this Company");

                    }else {

                    $kit_service = new KitServices();
                    $kit_service->kit_id = $kit->id;
                    $kit_service->service_id = $service['service_id'];
                    $kit_service->quantity = $service['quantity'];
                    $kit_service->save();
                    }
                }
            }

            $kits = Kit::where('company_id', $request['company_id'])
                ->where('id', $kit->id)
                ->get();
            $kits[0]['products'] = $kits[0]->products;
            $kits[0]['services'] = $kits[0]->services;
            foreach ($kits[0]['products'] as $key => $product) {
                $kits[0]['products'][$key]['product_info'] = Product::where('id', $product->product_id)->first();
            }
            foreach ($kits[0]['services'] as $key => $product) {
                $kits[0]['services'][$key]['service_info'] = Service::where('id', $product->product_id)->first();
            }
            DB::commit();
            return response()->json([
                'msg' => trans('general.msg.success'),
                'data' => $kits,
            ],
                Response::HTTP_OK);
        } catch (\Throwable $th) {
           DB::rollBack();
           $message =   $th->getMessage();
              return response()->json([
                'msg' => $message,
                'data' => null,
            ],
                Response::HTTP_OK);
        }


    }
    public function show($id,Request $request)
    {

        $kits = Kit::where('id', $id)->where('company_id',$request['company_id'])->get();
        /// validate if kit of company

        $array = [];
        foreach ($kits as $key => $kit) {

            $array[$key]['kit_id'] = $kit->id;
            $array[$key]['name'] = $kit->name;

            $products = [];
            foreach (KitProducts::where('kit_id', $kit->id)->get() as $key => $row) {
                $products[$key]['kit_id'] = $row->kit_id;
                $products[$key]['quantity'] = $row->quantity;
                $products[$key]['product'] = Product::where('id', $row->product_id)->first();
            }
            $array[$key]['products'] = $products;
            $services = [];
            foreach (KitServices::where('kit_id', $kit->id)->get() as $key => $row) {
                $products[$key]['kit_id'] = $row->kit_id;
                $services[$key]['quantity'] = $row->quantity;
                $services[$key]['service'] = Service::where('id', $row->service_id)->first();
            }
            $array[$key]['services'] = $services;
        }

        return response()->json([
            'msg' => trans('general.msg.success'),
            'data' => $array,
        ],
            Response::HTTP_OK);
    }
    public function update(Request $request)
    {
        // find kit and update

        $kit = Kit::find($request['kit_id']);
        $kit->name = $request['name'];
        $kit->save();

        if ($request->products != [] or $request->products != null) {
            foreach ($request->products as $product) {
                $KitProduct = KitProducts::where('kit_id', $request['kit_id'])->where('service_id', $product['product_id'])->first();
                if ($KitProduct == null) {
                    $KitProduct = new KitProducts();
                    $KitProduct->kit_id = $kit->id;
                    $KitProduct->product_id = $product['product_id'];
                    $KitProduct->quantity = $product['quantity'];
                    $KitProduct->save();
                } else {
                    $KitProduct->quantity = $product['quantity'];
                    $KitProduct->save();
                }
            }
            $products = KitProducts::where('kit_id', $request['kit_id'])->get();
            foreach ($products as $product) {
                $productExist = false;
                foreach ($request['products'] as $productRequest) {
                    if ($productRequest['product_id'] == $product->Product_id) {
                        $ProductExist = true;
                    }
                }
                if ($productExist == false) {
                    $product->delete();
                }
            }
        }

        if ($request->services != [] or $request->services != null) {

            foreach ($request->services as $service) {
                $KitService = KitServices::where('kit_id', $request['kit_id'])->where('service_id', $service['service_id'])->first();
                if ($KitService == null) {
                    $KitService = new KitServices();
                    $KitService->kit_id = $kit->id;
                    $KitService->service_id = $service['service_id'];
                    $KitService->quantity = $service['quantity'];
                    $KitService->save();
                } else {
                    $KitService->quantity = $service['quantity'];
                    $KitService->save();
                }
            }
            $services = KitServices::where('kit_id', $request['kit_id'])->get();
            foreach ($services as $service) {
                $serviceExist = false;
                foreach ($request['services'] as $serviceRequest) {
                    if ($serviceRequest['service_id'] == $service->service_id) {
                        $serviceExist = true;
                    }
                }
                if ($serviceExist == false) {
                    $service->delete();
                }
            }
        }
        return response()->json([
            'msg' => trans('general.msg.success'),
            'data' => $this->show($request['kit_id']),
        ],
            Response::HTTP_OK);
    }
    public function destroy($id)
    {
        // delete kit
        //delete kit products
        //delete kit services

        $kit_products = KitProducts::where('kit_id', $id)->get();
        foreach ($kit_products as $kit_product) {
            $kit_product->delete();
        }
        $kit_services = KitServices::where('kit_id', $id)->get();
        foreach ($kit_services as $kit_service) {
            $kit_service->delete();
        }

        $kit = Kit::find($id);
        $kit->delete();

        return response()->json([
            'msg' => trans('general.msg.success'),
            'data' => '',
        ],
            Response::HTTP_OK);
    }
}

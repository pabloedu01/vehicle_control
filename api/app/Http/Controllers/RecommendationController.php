<?php

namespace App\Http\Controllers;

use App\Models\Recommendation;
use App\Models\RecommendationClaimService;
use App\Models\RecommendationProducts;
use App\Models\RecommendationServices;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class RecommendationController extends Controller
{
    public function index(Request $request)
    {
        if($request['model_id']){
            $recommendations = Recommendation::with(['vehicle', 'vehicle.model', 'vehicle.model.brand', 'maintenanceReview', 'products','products.product','services','services.service','claimService','model'])
                           ->where('company_id', '=', $request['company_id'])
                           ->where('model_id', '=', $request['model_id'])
                           ->get();
        }else {
            $recommendations = Recommendation::with(['vehicle', 'vehicle.model', 'vehicle.model.brand', 'maintenanceReview', 'products','products.product','services','services.service','claimService','model'])
                           ->where('company_id', '=', $request['company_id'])
                           ->get();
        }

        // $recommendations->each(function($recommendation){
        //     $recommendation->vehicle->append('full_name');
        // });

        return response()->json([ 'msg' => trans('general.msg.success'), 'data' => $recommendations, ], Response::HTTP_OK);
    }

    public function show(Request $request, $id)
    {
        $recommendation = Recommendation::with(['vehicle', 'vehicle.model', 'vehicle.model.brand', 'maintenanceReview', 'claimService',  'products','products.product','services','services.service','model'])
                          ->where('id', '=', $id)
                          ->first();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $recommendation,
                                ],
                                Response::HTTP_OK
        );
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), Recommendation::rules($request->company_id));

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }
        DB::beginTransaction();

        try {
       $recomendation = new Recommendation();
        $recomendation->company_id = $request['company_id'];
        $recomendation->name = $request['name'];
        $recomendation->brand_id = $request['brand_id'] ?? null;
        $recomendation->model_id = $request['model_id'] ?? null;
        $recomendation->vehicle_id = $request['vehicle_id'] ?? null;
        $recomendation->maintenance_review_id = $request['maintenance_review_id'];
        $recomendation->os_type_id = $request['os_type_id'];
        $recomendation->save();

            // delete

        if($request['services'] != null or $request['services'] != []) {

            foreach ($request['services'] as $service) {
                // Verifica se ja existe serviços iguais nesta recomendação
                $checkexist = RecommendationServices::where('recommendation_id', $recomendation->id)
                ->where('service_id', $service['service_id'])
                ->first();
                if($checkexist){
                    // trow new exception
                    throw new \Exception("Service has been added in this recomendations");
                }else {
                $recomendationService = new RecommendationServices();
                $recomendationService->recommendation_id = $recomendation->id;
                $recomendationService->service_id = $service['service_id'];
                $recomendationService->quantity = $service['quantity'];
                $recomendationService->save();
                }

            }
        }
        if($request['products'] != null or $request['products'] != []) {
            foreach ($request['products'] as $product) {
                // Verifica se ja existe Produtos iguais nesta recomendação
                $checkexists = RecommendationProducts::where('recommendation_id', $recomendation->id)
                ->where('product_id', $product['product_id'])
                ->first();
                if($checkexists){
                    // trow new exception
                    throw new \Exception("Product has been added in this recomendations");
                }


                $recomendationProduct = new RecommendationProducts();
                $recomendationProduct->recommendation_id = $recomendation->id;
                $recomendationProduct->product_id = $product['product_id'];
                $recomendationProduct->quantity = $product['quantity'];
                $recomendationProduct->save();
            }
        }
        if($request['claim_services'] != null or $request['claim_services'] != []) {
            foreach ($request['claim_services'] as $claimService) {
                $recomendationClaimService = new RecommendationClaimService();
                $recomendationClaimService->recommendation_id = $recomendation->id;
                $recomendationClaimService->claims_service_id = $claimService['claim_service_id'];
                $recomendationClaimService->save();
            }
        }

        DB::commit();



        $show = Recommendation::with(['vehicle', 'vehicle.model', 'vehicle.model.brand', 'maintenanceReview', 'claimService', 'products','products.product','services','services.service','model'])
        ->where('id', '=', $recomendation->id)
        ->first();


       return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $show,
                                    ],
                                    Response::HTTP_CREATED
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'msg'    => trans('general.msg.invalidData'),
                'errors' => $th->getMessage(),
            ],
            Response::HTTP_BAD_REQUEST
);
        }



    }

    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        $recommendation = Recommendation::where('id', $id)->first();
        $recommendation->name = $request['description'];
        $recommendation->vehicle_id = $request['vehicle_id'];
        $recommendation->model_id = $request['model_id'] ?? null;
        $recommendation->brand_id = $request['brand_id'] ?? null;
        $recommendation->maintenance_review_id = $request['maintenance_review_id'];
        $recommendation->service_type_id = $request['service_type_id'];
        $recommendation->save();

        try {

        if($request['services'] != null or $request['services'] != []) {

        /// delete services
        RecommendationServices::where('recommendation_id', $id)->delete();

            foreach ($request['services'] as $service) {
                $checkexist = RecommendationServices::where('recommendation_id', $id)
                ->where('service_id', $service['service_id'])
                ->first();
                if($checkexist){
                    // trow new exception
                    throw new \Exception("Service has been added in this recomendations");
                }else {
                    $recomendationService = new RecommendationServices();
                    $recomendationService->recommendation_id = $id;
                    $recomendationService->service_id = $service['id'];
                    $recomendationService->quantity = $service['quantity'];
                    $recomendationService->save();
                }


        }
        if($request['products'] != null or $request['products'] != []) {
            // delete products
            RecommendationProducts::where('recommendation_id', $id)->delete();

            foreach ($request['products'] as $product) {
                    $checkexists = RecommendationProducts::where('recommendation_id', $id)
                    ->where('product_id', $product['product_id'])
                    ->first();
                if($checkexists){
                    // trow new exception
                    throw new \Exception("Product has been added in this recomendations");
                }
                    $recomendationProduct = new RecommendationProducts();
                    $recomendationProduct->recommendation_id = $id;
                    $recomendationProduct->product_id = $product['id'];
                    $recomendationProduct->quantity = $product['quantity'];
                    $recomendationProduct->save();

            }

        }
        if($request['claim_services'] != null or $request['claim_services'] != []) {
            foreach ($request['claim_services'] as $claimService) {
                $recomendationClaimService = RecommendationClaimService::where('recommendation_id', $id)->where('claims_service_id', $claimService['id'])->first();
                if($recomendationClaimService == null) {
                    $recomendationClaimService = new RecommendationClaimService();
                    $recomendationClaimService->recommendation_id = $id;
                    $recomendationClaimService->claims_service_id = $claimService['id'];
                    $recomendationClaimService->save();
                }
            }
                // verifica se o claim_services recebido esta igual ao claim_service persistido ao final se não deleta o claim_service persistido
                $claimServices = RecommendationClaimService::where('recommendation_id', $id)->get();
                foreach ($claimServices as $claimService) {
                    $claimServiceExist = false;
                    foreach ($request['claim_services'] as $claimServiceRequest) {
                        if($claimServiceRequest['id'] == $claimService->claims_service_id) {
                            $claimServiceExist = true;
                        }
                    }
                    if($claimServiceExist == false) {
                        $claimService->delete();
                    }
                }
         }
        }} catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'msg'    => trans('general.msg.invalidData'),
                'errors' => $th->getMessage(),
            ],
            Response::HTTP_BAD_REQUEST
            );
         }

        DB::commit();
        $show = Recommendation::with(['vehicle', 'vehicle.model', 'vehicle.model.brand', 'maintenanceReview', 'claimService',  'products','products.product','services','services.service','model'])
        ->where('id', '=', $id)
        ->first();


        return response()->json([
                                            'msg'  => trans('general.msg.success'),
                                            'data' => $show,
                                        ],
                                        Response::HTTP_CREATED
                );

    }

    public function destroy(Request $request, $id)
    {
        try {
            $recommendation = Recommendation::where('id', '=', $id)->first();
            if($recommendation){
                    RecommendationServices::where('recommendation_id', '=', $id)->delete();
                    RecommendationProducts::where('recommendation_id', '=', $id)->delete();
                    RecommendationClaimService::where('recommendation_id', '=', $id)->delete();

                    $recommendation->delete();

            }
            return response()->json([
                                        'msg' => trans('general.msg.success'),
                                    ], Response::HTTP_OK
            );
        } catch (\Exception $e) {
            return response()->json([
                                        'msg' => trans('general.msg.error'),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }
    }
}

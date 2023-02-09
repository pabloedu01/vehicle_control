<?php

namespace App\Http\Controllers;

use App\Models\Recommendation;
use App\Models\RecommendationClaimService;
use App\Models\RecommendationProducts;
use App\Models\RecommendationServices;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RecommendationController extends Controller
{
    public function index(Request $request)
    {
        $recommendations = Recommendation::with(['vehicle', 'vehicle.model', 'vehicle.model.brand', 'maintenanceReview', 'claimService', 'serviceType'])
                           ->where('company_id', '=', $request->company_id)
                           ->get();

        $recommendations->each(function($recommendation){
            $recommendation->vehicle->append('full_name');
        });

        return response()->json([ 'msg' => trans('general.msg.success'), 'data' => $recommendations, ], Response::HTTP_OK);
    }

    public function show(Request $request, $id)
    {
        $recommendation = Recommendation::with(['vehicle', 'vehicle.model', 'vehicle.model.brand', 'maintenanceReview', 'claimService', 'serviceType', 'services'])
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

        $recomendation = new Recommendation();
        $recomendation->company_id = $request['company_id'];
        $recomendation->name = $request['name'];
        $recomendation->vehicle_id = $request['vehicle_id'];
        $recomendation->maintenance_review_id = $request['maintenance_review_id'];
        $recomendation->os_type_id = $request['os_type_id'];
        $recomendation->save();

        if($request['services'] != null or $request['services'] != []) {
            foreach ($request['services'] as $service) {
                $recomendationService = new RecommendationServices();
                $recomendationService->recommendation_id = $recomendation->id;
                $recomendationService->service_id = $service['service_id'];
                $recomendationService->quantity = $service['quantity'];
                $recomendationService->save();
            }
        }
        if($request['products'] != null or $request['products'] != []) {
            foreach ($request['products'] as $product) {
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
       return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $recomendation,
                                    ],
                                    Response::HTTP_CREATED
            );

    }

    public function update(Request $request, $id)
    {
        $recommendation = Recommendation::where('id', $request['recommendation_id'])->first();
        $recommendation->name = $request['description'];
        $recommendation->vehicle_id = $request['vehicle_id'];
        $recommendation->maintenance_review_id = $request['maintenance_review_id'];
        $recommendation->service_type_id = $request['service_type_id'];
        $recommendation->save();

        if($request['services'] != null or $request['services'] != []) {
            foreach ($request['services'] as $service) {
                $recomendationService = RecommendationServices::where('recommendation_id', $request['recommendation_id'])->where('service_id', $service['id'])->first();
                if($recomendationService == null) {
                    $recomendationService = new RecommendationServices();
                    $recomendationService->recommendation_id = $recommendation->id;
                    $recomendationService->service_id = $service['id'];
                    $recomendationService->quantity = $service['quantity'];
                    $recomendationService->save();
                } else {
                    $recomendationService->quantity = $service['quantity'];
                    $recomendationService->save();
                }
            }
                // verifica se o services recebido esta igual ao service persistido ao final se não deleta o service persistido
                $services = RecommendationServices::where('recommendation_id', $request['recommendation_id'])->get();
                foreach ($services as $service) {
                    $serviceExist = false;
                    foreach ($request['services'] as $serviceRequest) {
                        if($serviceRequest['id'] == $service->service_id) {
                            $serviceExist = true;
                        }
                    }
                    if($serviceExist == false) {
                        $service->delete();
                    }
                }
        }
        if($request['products'] != null or $request['products'] != []) {
            foreach ($request['products'] as $product) {
                $recomendationProduct = RecommendationProducts::where('recommendation_id', $request['recommendation_id'])->where('product_id', $product['id'])->first();
                if($recomendationProduct == null) {
                    $recomendationProduct = new RecommendationProducts();
                    $recomendationProduct->recommendation_id = $recommendation->id;
                    $recomendationProduct->product_id = $product['id'];
                    $recomendationProduct->quantity = $product['quantity'];
                    $recomendationProduct->save();
                } else {
                    $recomendationProduct->quantity = $product['quantity'];
                    $recomendationProduct->save();
                }
            }
                // verifica se o products recebido esta igual ao product persistido ao final se não deleta o product persistido
                $products = RecommendationProducts::where('recommendation_id', $request['recommendation_id'])->get();
                foreach ($products as $product) {
                    $productExist = false;
                    foreach ($request['products'] as $productRequest) {
                        if($productRequest['id'] == $product->product_id) {
                            $productExist = true;
                        }
                    }
                    if($productExist == false) {
                        $product->delete();
                    }
                }
        }
        if($request['claim_services'] != null or $request['claim_services'] != []) {
            foreach ($request['claim_services'] as $claimService) {
                $recomendationClaimService = RecommendationClaimService::where('recommendation_id', $request['recommendation_id'])->where('claims_service_id', $claimService['id'])->first();
                if($recomendationClaimService == null) {
                    $recomendationClaimService = new RecommendationClaimService();
                    $recomendationClaimService->recommendation_id = $recommendation->id;
                    $recomendationClaimService->claims_service_id = $claimService['id'];
                    $recomendationClaimService->save();
                }
            }
                // verifica se o claim_services recebido esta igual ao claim_service persistido ao final se não deleta o claim_service persistido
                $claimServices = RecommendationClaimService::where('recommendation_id', $request['recommendation_id'])->get();
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
        return response()->json([
                                            'msg'  => trans('general.msg.success'),
                                            'data' => $recommendation,
                                        ],
                                        Response::HTTP_CREATED
                );

    }

    public function destroy(Request $request, $id)
    {
        $recommendation = Recommendation::where('id', '=', $id)->first();

        if(!$recommendation->canBeDeleted())
        {
            return response()->json([
                                        'msg' => trans('general.msg.hasDependencies'),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        if($recommendation->secureDelete())
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

<?php

namespace App\Http\Controllers;

use App\Models\ClaimService;
use App\Models\Product;
use App\Models\Quotation;
use App\Models\QuotationClaimService;
use App\Models\QuotationItens;
use App\Models\QuotationMandatoryItens;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\Quotation as QuotationRequest;

class QuotationController extends Controller
{
    private static $with = [
        'client',
        'client_vehicle',
        'MaintenanceReview',
        'technicalConsultant.user',
    ];
    public function storeQuotation(QuotationRequest $request){
        //validade request and store

        $request->validate([
            'company_id' => 'required',
        ]);
        $consultant =  $request->consultant_id ;

        $quotation = new Quotation();
        $quotation->client_id = $request->client_id;
        $quotation->client_vehicle_id = $request->client_vehicle_id;
        $quotation->maintenance_review_id = $request->maintenance_review_id;
        $quotation->consultant_id =  $consultant;
        $quotation->os_type_id = $request->os_type_id;
        $quotation->company_id = $request->company_id;
        $quotation->user_id = auth()->user()->id;
        $quotation->save();


        if($request->claim_services != null and $request->claim_services != []){
            foreach($request->claim_services as $claim ){
                $quotationClaim = new QuotationClaimService();
                $quotationClaim->quotation_id = $quotation->id;
                $quotationClaim->claim_service_id = $claim['claim_service_id'];
                $quotationClaim->save();
            }
        $quotation['claim_services'] = $quotationClaim;

        }
       if($request->quotation_itens != null and $request->quotation_itens != []){
            foreach($request->quotation_itens as $item){
                $quotationItem = new QuotationItens();
                $quotationItem->quotation_id = $quotation->id;
                $quotationItem->service_id = $item['service_id'];
                $quotationItem->products_id = $item['products_id'];
                $quotationItem->quantity = $item['quantity'];
                $quotationItem->price = $item['price'];
                $quotationItem->price_discount = $item['price_discount'];

                // return $quotationItem;
                $quotationItem->save();
            }
        $quotation['quotation_itens'] = $quotationItem;

        }
        if($request->quotation_mandatory_itens != null and $request->quotation_mandatory_itens != []){
            foreach($request->quotation_mandatory_itens as $mandatory_itens){
                $quotationmandatory_itens = new QuotationMandatoryItens();
                $quotationmandatory_itens->quotation_id = $quotation->id;
                $quotationmandatory_itens->service_id = $mandatory_itens['service_id'];
                $quotationmandatory_itens->products_id = $mandatory_itens['products_id'];
                $quotationmandatory_itens->quantity = $mandatory_itens['quantity'];
                $quotationmandatory_itens->price = $mandatory_itens['price'];
                $quotationmandatory_itens->price_discount = $mandatory_itens['price_discount'];

                // return $quotationItem;
                $quotationmandatory_itens->save();
            }
        $quotation['quotation_mandatory_itens'] = $quotationmandatory_itens;

        }

        // use showQuotation($id)
        $quotation = $this->showQuotation($quotation->id);
        return response()->json([
            'message' => 'Quotation created successfully',
            'Quotation' => $quotation,
        ], 201);

    }

    public function showQuotation($id){
        $quotation = Quotation::find($id);

        if( $quotation->client_vehicle) {
            $quotation->client_vehicle->vehicle;
            // $quotation->client_vehicle->vehicle->brand;
            $quotation->client_vehicle->vehicle->model->brand;
        }
        $quotation->technicalConsultant;
        $quotation->client;
        $quotation->MaintenanceReview;
        if($quotation->MaintenanceReview){
            $quotation->MaintenanceReview->brand;
            $quotation->MaintenanceReview->model;
        }
        $quotation->quotationItens;
        $quotation->quotationClaimService;

        foreach($quotation->quotationClaimService as  $ClaimKey => $claimRow){
            $claimService = ClaimService::find($claimRow->claim_service_id);
            $quotation->quotationClaimService[$ClaimKey]['description'] = $claimService->description;
            $quotation->quotationClaimService[$ClaimKey]['integration_code'] = $claimService->integration_code;
        }
        foreach($quotation->quotationItens as $itemKey => $itemRow){
            if($itemRow->service_id != null) {
                $service = Service::find($itemRow->service_id);
                $quotation->quotationItens[$itemKey]['service'] = $service;
            }else {
                $quotation->quotationItens[$itemKey]['service'] = null;
            }
            if($itemRow->products_id != null) {
                $product = Product::find($itemRow->products_id);
                $quotation->quotationItens[$itemKey]['product'] = $product;
            }else {
                $quotation->quotationItens[$itemKey]['product'] = null;
            }
            $quotation->quotationItens[$itemKey]['total'] = $itemRow['quantity'] * ( $itemRow['price'] - $itemRow['price_discount']);
        }
        foreach($quotation->QuotationMandatoryItens as $mandatoryItemKey => $mandatoryItem) {
            if($mandatoryItem->service_id != null) {
                $service = Service::find($mandatoryItem->service_id);
                $quotation->quotationItens[$itemKey]['service'] = $service;
            }else {
                $quotation->quotationItens[$itemKey]['service'] = null;
            }
            if($mandatoryItem->products_id != null) {
                $product = Product::find($mandatoryItem->products_id);
                $quotation->quotationItens[$itemKey]['product'] = $product;
            }else {
                $quotation->quotationItens[$itemKey]['product'] = null;
            }
            $quotation->quotationItens[$itemKey]['total'] = $mandatoryItem['quantity'] * ( $mandatoryItem['price'] - $mandatoryItem['price_discount']);
        
        }
        // $quotation['maintenance_review'] = $quotation->review;  MaintenanceReview
        // $quotation['quotation_itens'] = $quotation->quotationItens;
        // $quotation['quotation_claims'] = $quotation->quotationClaimService;

        return response()->json([
            'msg'  => trans('general.msg.success'),
            'data' => $quotation,
        ],
        Response::HTTP_OK);

    }
    public function showQuotationItens($id){
        $quotationItens = QuotationItens::where('Quotation_id', $id)->get();


        return response()->json([
            'msg'  => trans('general.msg.success'),
            'data' => $quotationItens,
        ],
        Response::HTTP_OK);
    }


    public function updateQuotation(Request $request) {

        $consultant =  $request->consultant_id ;
        if($request->consultant_id == null){
            $consultant = $request->user()->technicalConsultant->id;
        }
        $request->validate([
            'company_id' => 'required',
        ]);
        $quotation =  Quotation::find($request->quotation_id);
        $quotation->client_id = $request->client_id;
        $quotation->client_vehicle_id = $request->client_vehicle_id;
        $quotation->maintenance_review_id = $request->maintenance_review_id;
        $quotation->os_type_id = $request->os_type_id;
        $quotation->consultant_id =  $consultant;
        $quotation->company_id = $request->company_id;
        $quotation->save();



        QuotationClaimService::where('quotation_id', $request->quotation_id)->delete();
            foreach($request->claim_services as $claim ){
                $quotationClaim = new QuotationClaimService();
                $quotationClaim->quotation_id = $request->quotation_id;
                $quotationClaim->claim_service_id = $claim['claim_service_id'];
                $quotationClaim->save();
            }


        QuotationItens::where('quotation_id', $request->quotation_id)->delete();
            foreach($request->quotation_itens as $item){
                $quotationItem = new QuotationItens();
                $quotationItem->quotation_id = $request->quotation_id;
                $quotationItem->service_id = $item['service_id'];
                $quotationItem->products_id = $item['products_id'];
                $quotationItem->quantity = $item['quantity'];
                $quotationItem->price = $item['price'];
                $quotationItem->price_discount = $item['price_discount'];

                // return $quotationItem;
                $quotationItem->save();
            }
            QuotationMandatoryItens::where('quotation_id',$request->quotation_id)->delete();
                foreach($request->quotation_mandatory_itens as $mandatory_itens){
                    $quotationmandatory_itens = new QuotationMandatoryItens();
                    $quotationmandatory_itens->quotation_id = $quotation->id;
                    $quotationmandatory_itens->service_id = $mandatory_itens['service_id'];
                    $quotationmandatory_itens->products_id = $mandatory_itens['products_id'];
                    $quotationmandatory_itens->quantity = $mandatory_itens['quantity'];
                    $quotationmandatory_itens->price = $mandatory_itens['price'];
                    $quotationmandatory_itens->price_discount = $mandatory_itens['price_discount'];
                    $quotationmandatory_itens->save();
                }
        $quotation['quotation_mandatory_itens'] = $quotationmandatory_itens;
        $quotation['quotation_itens'] = $quotationItem;
        $quotation['claim_services'] = $quotationClaim;

        $quotation = $this->showQuotation($quotation->id);

        return response()->json([
            'message' => 'Quotation updated successfully',
            'Quotation' => $quotation,
        ], 201);


    }
    public function listAll(Request $request) {


        if($request['techinical_consultant_id'] != null){
            $quotations = Quotation::with(collect(self::$with)->take(5)->toArray())
                                           ->list()
                                           ->where('consultant_id', $request['techinical_consultant_id'])
                                           ->get();
        }else if($request['user_login'] != null){
            $quotations = Quotation::with(collect(self::$with)->take(5)->toArray())
                                           ->list()
                                           ->where('user_id', $request['user_login'])
                                           ->get();
        }else {
            $quotations = Quotation::with(collect(self::$with)->take(5)->toArray())
            ->list()
            ->get();
        }
        if($request['search'] != null){
            $quotations = Quotation::leftJoin('clients', 'quotation.client_id', '=', 'clients.id')
            ->leftJoin('client_vehicles', 'quotation.client_vehicle_id', '=', 'client_vehicles.id')
            ->leftJoin('companies', 'quotation.company_id', '=', 'companies.id')
            ->select('quotation.*')
            ->where('quotation.id', 'like', '%'.$request['search'].'%')
            ->orWhere('clients.name', 'like', '%'.$request['search'].'%')
            ->orWhere('clients.document', 'like', '%'.$request['search'].'%')
            ->orWhere('client_vehicles.plate', 'like', '%'.$request['search'].'%')
            ->orWhere('client_vehicles.chasis', 'like', '%'.$request['search'].'%')
         ->get();

         foreach ($quotations as $quotation) {
                $quotation->client;
                $quotation->client_vehicle;
                $quotation->maintenance_review;
                $quotation->technical_consultant;
        }

        }






        foreach($quotations as $key => $quotation){

            $quotations[$key]['QtdPecas'] = QuotationItens::where('quotation_id', $quotation->id)->where('products_id', '!=', null)->count();
            $quotations[$key]['QtdServicos'] = QuotationItens::where('quotation_id', $quotation->id)->where('service_id', '!=', null)->count();
            $quotations[$key]['TotalPecas'] = QuotationItens::where('quotation_id', $quotation->id)->where('products_id', '!=', null)->sum(DB::raw('price * quantity'));
            $quotations[$key]['TotalPecasDesconto'] = QuotationItens::where('quotation_id', $quotation->id)->where('products_id', '!=', null)->sum(DB::raw('price_discount * quantity'));
            $quotations[$key]['TotalServicos'] =  QuotationItens::where('quotation_id', $quotation->id)->where('service_id', '!=', null)->sum(DB::raw('price * quantity'));
            $quotations[$key]['TotalServicosDesconto'] =  QuotationItens::where('quotation_id', $quotation->id)->where('service_id', '!=', null)->sum(DB::raw('price_discount * quantity'));
            $quotations[$key]['TotalGeral'] =  $quotations[$key]['TotalServicos']  + $quotations[$key]['TotalPecas'];
            $quotations[$key]['TotalGeralDesconto'] =  $quotations[$key]['TotalPecasDesconto'] + $quotations[$key]['TotalServicosDesconto'] ;




        }

        return response()->json([
                                    'msg' => trans('general.msg.success'),
                                    'total_results' => $quotations->count(),
                                    'current_page'  => intval(@$request->current_page && is_numeric($request->current_page) ? $request->current_page : 1),
                                    'total_pages'   => ceil(Quotation::list()->limit(null)->offset(0)->count()/( @$request->limit ?? 50 )),
                                    'data'          => $quotations,
                                ],
                                Response::HTTP_OK
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Quotation  $quotation
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request,$id)
    {
        $quotation = Quotation::find($id);
        $quotation->delete();
        return response()->json([
            'message' => 'Quotation deleted successfully',
            'data' => ''
        ], 201);
    }
}

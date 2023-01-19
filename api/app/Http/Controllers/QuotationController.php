<?php

namespace App\Http\Controllers;

use App\Models\ClaimService;
use App\Models\Product;
use App\Models\Quotation;
use App\Models\QuotationClaimService;
use App\Models\QuotationItens;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Response;


class QuotationController extends Controller
{
    private static $with = [
        'client',
        'vehicle',
        'review',
        'technicalConsultant.user',


    ];
    public function storeQuotation(Request $request){
        //validade request and store
        $consultant =  $request->consultant_id ;
        if($request->consultant_id == null){
            $consultant = $request->user()->technicalConsultant->id;
        }
        $request->validate([
            'company_id' => 'required',
        ]);
        $quotation = new Quotation();
        $quotation->client_id = $request->client_id;
        $quotation->vehicle_id = $request->vehicle_id;
        $quotation->maintenance_review_id = $request->maintenance_review_id;
        $quotation->consultant_id =  $consultant;
        $quotation->company_id = $request->company_id;
        $quotation->save();


        if($request->claim_services != null){
            foreach($request->claim_services as $claim ){
                $quotationClaim = new QuotationClaimService();
                $quotationClaim->quotation_id = $quotation->id;
                $quotationClaim->claim_service_id = $claim['claim_service_id'];
                $quotationClaim->save();
            }
        }
       if($request->quotation_itens != null){
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
        }
        $quotation['quotation_itens'] = $quotationItem;
        $quotation['claim_services'] = $quotationClaim;

        // use showQuotation($id)
        $quotation = $this->showQuotation($quotation->id);
        return response()->json([
            'message' => 'Quotation created successfully',
            'Quotation' => $quotation,
        ], 201);

    }

    public function showQuotation($id){
        $quotation = Quotation::find($id);
        $quotation->vehicle;
        $quotation->vehicle->brand;
        $quotation->vehicle->model;
        $quotation->technicalConsultant;
        $quotation->client;
        $quotation->MaintenanceReview;
        $quotation->MaintenanceReview->brand;
        $quotation->MaintenanceReview->model;
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
    public function deleteItens($id){
        $quotationItens = QuotationItens::where('Quotation_id', $id)->get();
        $quotationItens->delete();
        return response()->json([
            'msg'  => trans('general.msg.success'),

        ],    Response::HTTP_OK);

    }
    public function updateItens(Request $request){

        $request->validate([
            'Quotation_id' => 'required',
            'quantity' => 'required',
            'price' => 'required',
        ]);
        QuotationItens::where('Quotation_id', $request->Quotation_id)->delete();

        $quotationItens = QuotationItens::create($request->all());
        return response()->json([
            'message' => 'Quotation created successfully',
            'data' => $quotationItens
        ], 201);
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
        $quotation->vehicle_id = $request->vehicle_id;
        $quotation->maintenance_review_id = $request->maintenance_review_id;
        $quotation->consultant_id =  $consultant;
        $quotation->company_id = $request->company_id;
        $quotation->save();



        QuotationClaimService::where('quotation_id', $request->quotation_id)->delete();
            foreach($request->claim_services as $claim ){
                $quotationClaim = new QuotationClaimService();
                $quotationClaim->quotation_id = $quotation->id;
                $quotationClaim->claim_service_id = $claim['claim_service_id'];
                $quotationClaim->save();
            }


        QuotationItens::where('quotation_id', $request->quotation_id)->delete();
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
        $quotation['claim_services'] = $quotationClaim;
        return response()->json([
            'message' => 'Quotation created successfully',
            'Quotation' => $quotation,
        ], 201);


    }
    public function listAll(Request $request) {

        // $quotations = Quotation::with(collect(self::$with)->take(5)->toArray())
        //                                    ->list()
        //                                    ->get();
        $quotations = Quotation::with(collect(self::$with)->take(5)->toArray())
                                           ->list()
                                           ->get();

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
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Quotation  $quotation
     * @return \Illuminate\Http\Response
     */
    public function show(Quotation $quotation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Quotation  $quotation
     * @return \Illuminate\Http\Response
     */
    public function edit(Quotation $quotation)
    {

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Quotation  $quotation
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Quotation $quotation)
    {
        //
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


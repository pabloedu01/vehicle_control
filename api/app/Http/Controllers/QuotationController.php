<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use App\Models\QuotationItens;
use Illuminate\Http\Request;
use Illuminate\Http\Response;


class QuotationController extends Controller
{
    private static $with = [
        'vehicle',
        'client',
        'technicalConsultant',
        'technicalConsultant.user',
        'maintenance_reviews'

    ];
    public function storeQuotation(Request $request){
        //validade request and store

        $quotation = Quotation::create($request->all());
        return response()->json([
            'message' => 'Quotation created successfully',
            'Quotation' => $quotation
        ], 201);

    }
    public function storeQuotationItens(Request $request){
        //validade request and store
        $request->validate([
            'Quotation_id' => 'required',
            'quantity' => 'required',
            'price' => 'required',
        ]);
        $quotationItens = QuotationItens::create($request->all());
        return response()->json([
            'message' => 'Quotation created successfully',
            'Quotation' => $quotationItens
        ], 201);
    }
    public function showQuotation($id){
        $quotation = Quotation::find($id);
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

        $request->validate([
            'client_id' => 'required',
            'vehicle_id' => 'required',
            'review_id' => 'required',
            'consultant_id' => 'required',
            'observation' => 'required',
        ]);
        $quotation = Quotation::find($request->Quotation_id);
        $quotation->update($request->all());
        return response()->json([
            'message' => 'Quotation updated successfully',
            'data' => $quotation
        ], 201);

    }
    public function listAll(Request $request, $id) {
        $quotations = Quotation::with(collect(self::$with)->take(7)->toArray())
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
    public function destroy(Request $request)
    {
        $quotation = Quotation::find($request->Quotation_id);
        $quotation->delete();
        return response()->json([
            'message' => 'Quotation deleted successfully',
            'data' => ''
        ], 201);
    }
}

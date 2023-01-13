<?php

namespace App\Http\Controllers;

use App\Models\Estimate;
use App\Models\EstimateItens;
use Illuminate\Http\Request;

class EstimateController extends Controller
{
    public function storeEstimate(Request $request){
        //validade request and store
        $request->validate([
            'client_id' => 'required',
            'vehicle_id' => 'required',
            'review_id' => 'required',
            'consultant_id' => 'required',
            'observation' => 'required',
        ]);
        $estimate = Estimate::create($request->all());
        return response()->json([
            'message' => 'Estimate created successfully',
            'estimate' => $estimate
        ], 201);

    }
    public function storeEstimateItens(Request $request){
        //validade request and store
        $request->validate([
            'estimate_id' => 'required',
            'quantity' => 'required',
            'price' => 'required',
        ]);
        $estimateItens = EstimateItens::create($request->all());
        return response()->json([
            'message' => 'Estimate created successfully',
            'estimate' => $estimateItens
        ], 201);
    }
    public function showEstimate($id){
        $estimate = Estimate::find($id);
        return response()->json([
            'msg'  => trans('general.msg.success'),
            'data' => $estimate,
        ],
        Response::HTTP_OK);

    }
    public function showEstimateItens($id){
        $estimateItens = EstimateItens::where('estimate_id', $id)->get();


        return response()->json([
            'msg'  => trans('general.msg.success'),
            'data' => $estimateItens,
        ],
        Response::HTTP_OK);
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
     * @param  \App\Models\Estimate  $estimate
     * @return \Illuminate\Http\Response
     */
    public function show(Estimate $estimate)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Estimate  $estimate
     * @return \Illuminate\Http\Response
     */
    public function edit(Estimate $estimate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Estimate  $estimate
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Estimate $estimate)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Estimate  $estimate
     * @return \Illuminate\Http\Response
     */
    public function destroy(Estimate $estimate)
    {
        //
    }
}

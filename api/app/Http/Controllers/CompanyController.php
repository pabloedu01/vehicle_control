<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CompanyController extends Controller
{
    public function vehicles(Request $request)
    {
        $vehicles = Vehicle::with('model', 'model.brand')
                           ->where('company_id', '=', $request->company_id)
                           ->whereNull('deleted_at')
                           ->get();

        return response()->json(                                 [
                                                                  'msg'  => '¡Success!',
                                                                  'data' => $vehicles,
                                                              ], Response::HTTP_OK
        );
    }
}

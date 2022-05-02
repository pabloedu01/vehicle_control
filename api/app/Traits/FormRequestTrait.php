<?php

namespace App\Traits;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Symfony\Component\HttpFoundation\Response;

trait FormRequestTrait
{
    protected function failedValidation(Validator $validator) {
        throw new HttpResponseException(response()->json([
                                                             'msg'    => '¡Invalid Data!',
                                                             'errors' => $validator->errors(),
                                                         ],
                                                         Response::HTTP_BAD_REQUEST));
    }
}

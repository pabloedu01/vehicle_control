<?php

namespace App\Http\Requests;

use App\Rules\ServiceClaimsOfServiceSchedule;
use App\Traits\FormRequestTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServiceSchedule extends FormRequest
{
    use FormRequestTrait;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        /*
         * todo: debería de filtrar el arreglo de claims_service por si hay registros que no estén correctos
         */

        $company_id = @$this->request->get('company_id');

        return [
            'company_id' => 'required|integer',
            'vehicle_id' => [
                'required', 'integer',
                Rule::exists('vehicles', 'id')->where('company_id', $company_id)
            ],
            'technical_consultant_id' => [
                'nullable', 'integer',
                Rule::exists('technical_consultants', 'id')->where('company_id', $company_id)
            ],
            'client_id' => [
                'nullable', 'integer',
                Rule::exists('clients', 'id')->where('company_id', $company_id)
            ],
            'code' => [
                'nullable', 'string'
            ],
            'promised_date' => [
                'required', 'date_format:Y-m-d H:i:s'
            ],
            'claims_service' => [
                'nullable', 'array', new ServiceClaimsOfServiceSchedule($company_id)
            ]
        ];
    }
}

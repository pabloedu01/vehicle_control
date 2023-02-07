<?php

namespace App\Http\Requests;

use App\Rules\ServiceClaimsOfServiceSchedule;
use App\Traits\FormRequestTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class Recomendation extends FormRequest
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
        $id = @$this->route('id');
        $company_id = @$this->request->get('company_id');

        return [
            'company_id' => 'required|integer',
            'name' => 'required|string',
            'client_vehicle_id' => [
                'nullable', 'integer',
                Rule::exists('client_vehicles', 'id')->where('company_id', $company_id)
            ],
            'maintenance_review_id' => [
                'nullable', 'integer',
                Rule::exists('maintenance_reviews', 'id')->where('company_id', $company_id)
            ],
            'vehicle_model_id' => [
                'nullable', 'integer',
                Rule::exists('vehicle_model', 'id')->where('company_id', $company_id)
            ],
            'os_type_id' => [
                'nullable', 'integer',
                Rule::exists('vehicle_model', 'id')->where('company_id', $company_id)
            ],

        ];
    }
}

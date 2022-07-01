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
        $id = @$this->route('id');
        $company_id = @$this->request->get('company_id');

        return [
            'company_id' => 'required|integer',
            'client_vehicle_id' => [
                'required', 'integer',
                Rule::exists('client_vehicles', 'id')->where('company_id', $company_id)
            ],
            'technical_consultant_id' => [
                'nullable', 'integer',
                Rule::exists('technical_consultants', 'id')->where('company_id', $company_id)
            ],
            'client_id' => [
                'nullable', 'integer',
                Rule::exists('clients', 'id')->where('company_id', $company_id)
            ],
            'checklist_version_id' => [
                'required', 'integer',
                Rule::exists('checklist_versions', 'id')
            ],
            'code' => [
                'nullable', 'string', 'regex:/^[a-zA-Z0-9\-\_]*$/', \App\Models\ServiceSchedule::getUniqueRule($id, ['company_id' => $company_id])
            ],
            'promised_date' => [
                'required', 'date_format:Y-m-d\TH:i:sP'
            ],
            'claims_service' => [
                'nullable', 'array', new ServiceClaimsOfServiceSchedule($company_id)
            ]
        ];
    }
}

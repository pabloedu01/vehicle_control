<?php

namespace App\Http\Requests;

use App\Models\ChecklistVersion;
use App\Rules\ChecklistResults;
use App\Rules\TemporalFile;
use App\Traits\FormRequestTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VehicleService extends FormRequest
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
        $vehicleService = @$this->route('id') ? \App\Models\VehicleService::withoutGlobalScope('joinToData')->find($this->route('id')) : null;
        $company_id = @$this->request->get('company_id');
        #todo: si no viene el brand_id, entonces tomar el brand_id del vehicle_id

        return [
            'company_id' => 'required|integer',
            'vehicle_id' => [
                'nullable', 'integer',
                Rule::exists('vehicles', 'id')->where('company_id', $company_id)
            ],
            'service_schedule_id' => [
                'nullable', 'integer',
                Rule::exists('service_schedules', 'id')->where('company_id', $company_id)
            ],
            'technical_consultant_id' => [
                'required', 'integer',
                Rule::exists('technical_consultants', 'id')->where('company_id', $company_id)
            ],
            'brand_id' => [
                'required', 'integer',
                Rule::exists('vehicle_brands', 'id')->where('company_id', $company_id)
            ],
            'checklist_version_id' => [
                'required', 'integer',
                Rule::exists('checklist_versions', 'id')
            ],
            'client_id' => [
                'nullable', 'integer',
                Rule::exists('clients', 'id')->where('company_id', $company_id)
            ],
            'client_name' => [
                'required_without:client_id', 'nullable', 'string'
            ],
            'client_signature' => [
                'nullable', new TemporalFile
            ],
            'client_signature_date' => [
                'nullable', 'date_format:Y-m-d\TH:i:sP'
            ],
            'technical_consultant_signature' => [
                'nullable',  new TemporalFile
            ],
            'technical_consultant_signature_date' => [
                'nullable', 'date_format:Y-m-d\TH:i:sP'
            ],
            'fuel' => [
                'nullable', 'integer'
            ],
            'mileage' => [
                'nullable', 'integer'
            ],
            'checklist' => [
                'required', 'array', new ChecklistResults($this->request->get('checklist_version_id'))
            ]
        ];
    }
}

<?php

namespace App\Pivots;

use App\Casts\MultipleTemporalFiles;
use App\Casts\TemporalFile;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ChecklistItemStageVehicleService extends Pivot
{
    protected $appends = ['client_signature_base64', 'technical_consultant_signature_base64'];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    protected $fillable = [
        'client_signature',
        'technical_consultant_signature',
        'client_signature_date',
        'technical_consultant_signature_date',
        'completed'
    ];

    protected $casts = [
        'client_signature'               => TemporalFile::class,
        'technical_consultant_signature' => TemporalFile::class,
    ];

    public $filePaths = [
        'client_signature'               => 'vehicle-services/clients/signatures',
        'technical_consultant_signature' => 'vehicle-services/technical-consultants/signatures',
    ];

    public function getClientSignatureBase64Attribute(){
        $gcsDriver  = env('GOOGLE_CLOUD_STORAGE_DRIVER', 'public');
        $gcsStorage = \Storage::disk($gcsDriver);

        return $this->client_signature ? 'data:image/png;base64,'.base64_encode($gcsStorage->get(last(explode($gcsStorage->url(''), $this->client_signature)))) : $this->client_signature;
    }

    public function getTechnicalConsultantSignatureBase64Attribute(){
        $gcsDriver  = env('GOOGLE_CLOUD_STORAGE_DRIVER', 'public');
        $gcsStorage = \Storage::disk($gcsDriver);

        return $this->technical_consultant_signature ? 'data:image/png;base64,'.base64_encode($gcsStorage->get(last(explode($gcsStorage->url(''), $this->technical_consultant_signature)))) : $this->technical_consultant_signature;
    }
}

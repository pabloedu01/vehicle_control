<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuotationClaimService extends Model
{
    use HasFactory;
    protected $table = 'quotations_claim_service';

    use HasFactory;

    protected $fillable = [

        'quotation_id',
        'claim_service_id'

    ];
    public function quotation()
    {
        return $this->belongsTo('App\Models\Quotation', 'quotation_id', 'id')->withTrashed();
    }
    public function claimService()
    {
        return $this->belongsTo('App\Models\ClaimService', 'claim_service_id', 'id')->withTrashed();
    }
}
//>withPivot('active', 'created_by');v'integration_code',
     //   'description'

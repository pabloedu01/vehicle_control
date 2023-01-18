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
}

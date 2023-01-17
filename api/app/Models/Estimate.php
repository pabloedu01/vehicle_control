<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estimate extends Model
{
    protected $table = 'estimate';

    use HasFactory;

    protected $fillable = [
   
        'client_id',
        'vehicle_id',
        'review_id',
        'consultant_id',
        'observation',

    ];
}

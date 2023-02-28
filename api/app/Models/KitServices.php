<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KitServices extends Model
{
    use HasFactory;
    protected $table = 'kit_services';

    protected $fillable = [
        'kit_id',
        'service_id',
        'quantity',
    ];

    public function kit()
    {
        return $this->belongsTo(Kit::class);
    }
    // service
    public function service()
    {
        return $this->belongsTo('App\Models\Service', 'service_id', 'id');

    }


}

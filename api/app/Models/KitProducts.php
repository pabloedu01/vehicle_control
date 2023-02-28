<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KitProducts extends Model
{
    use HasFactory;

    protected $table = 'kit_products';

    protected $fillable = [
        'kit_id',
        'product_id',
        'quantity',
    ];

    public function kit()
    {
        return $this->belongsTo(Kit::class);
    }

    public function product()
    {
        return $this->belongsTo('App\Models\Product', 'product_id', 'id');
    }







}

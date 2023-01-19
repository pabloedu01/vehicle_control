<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuotationItens extends Model
{
    protected $table = 'quotation_itens';

    use HasFactory;

    protected $fillable = [
        'quotation_id',
        'service_id',
        'products_id',
        'price',
        'price_discount',
        'quantity'


    ];
     public function quotation()
     {
         return $this->belongsTo('App\Models\Quotation', 'quotation_id', 'id')->withTrashed();
     }
     public function service()
     {
         return $this->belongsTo('App\Models\Service', 'service_id', 'id')->withTrashed();
     }
     public function product()
     {
         return $this->belongsTo('App\Models\Product', 'product_id', 'id')->withTrashed();
     }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuotationItens extends Model
{
    protected $table = 'quotations_itens';

    use HasFactory;

    protected $fillable = [
        'estimates_id',
        'service_id',
        'products_id',
        'type',
        'price',
        'quantity'
    ];
}

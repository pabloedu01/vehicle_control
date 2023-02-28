<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Kit extends Model
{
    use Searchable;

    use HasFactory;

    protected $table = 'kits';
    protected $fillable = [
        'company_id',
        'name',
    ];

    //rules
    public static function rules($id = null, $company_id = null)
    {
        return [
            'name' => 'required|string|max:255|unique:kits,name,' . $id,
            'company_id' => 'required|exists:companies,id',
        ];
    }

    // has many products
    public function products()
    {
        return $this->hasMany('App\Models\KitProducts', 'kit_id', 'id');
    }
    public function services()
    {
        return $this->hasMany('App\Models\KitServices', 'kit_id', 'id');
    }

    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    public function getProductsAttribute()
    {
        return $this->products()->get();
    }

    public function getServicesAttribute()
    {
        return $this->services()->get();
    }



}

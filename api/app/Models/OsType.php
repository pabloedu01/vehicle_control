<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OsType extends Model
{
    use HasFactory;
    protected $table = 'os_type';

    protected $fillable = [
        'company_id',
        'code',
        'name',
    ];

}

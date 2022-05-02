<?php

namespace App\Models;

class Permission extends Base
{
    protected $table = 'permissions';

    public $forceDeleting = true;

    protected $fillable = [
        'name',
        'description',
        'code',
    ];

    public static function rules()
    {
        return [
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string',
            'code'        => 'required|string|max:45',
        ];
    }
}


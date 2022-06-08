<?php

namespace App\Models;

use App\Casts\Json;

class ChecklistVersion extends Base
{
    protected $table = 'checklist_versions';

    protected $casts = [
        'active' => 'boolean',
        'report' => Json::class
    ];

    protected $fillable = [
        'code',
        'name',
        'description',
        'active',
        'report'
    ];

    public static function rules($id = null)
    {
        return [
            'code'        => [
                'required', 'string',
                self::getUniqueRule($id),
            ],
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string',
            'active'      => 'required|boolean',
            'report'      => 'nullable|array',
        ];
    }
}


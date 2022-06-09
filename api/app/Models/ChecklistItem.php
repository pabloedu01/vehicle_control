<?php

namespace App\Models;

use App\Casts\Json;

class ChecklistItem extends Base
{
    protected $table = 'checklist_items';
    protected $appends = ['formatted_name'];

    protected $casts = [
        'active'     => 'boolean',
        'validation' => Json::class,
        'preview_data' => Json::class,
    ];

    protected $fillable = [
        'name',
        'description',
        'code',
        'active',
        'validation',
        'preview_data'
    ];

    public static function rules()
    {
        return [
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string',
            'code'        => 'nullable|string|max:100',
            'active'      => 'required|boolean',
            'validation'  => 'required|array',
            'preview_data'  => 'required|array',
        ];
    }

    public function getFormattedNameAttribute(){
        return \Str::camel(\Str::slug($this->name, ' '));
    }
}


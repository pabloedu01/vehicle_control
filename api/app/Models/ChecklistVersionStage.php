<?php

namespace App\Models;

use App\Casts\Json;
use App\Rules\ChecklistVersionStages;

class ChecklistVersionStage extends Base
{
    protected $table = 'checklist_version_stages';

    protected $fillable = [
        'name',
        'checklist_version_id',
    ];

    #belongs to
    public function checklistVersion()
    {
        return $this->belongsTo('App\Models\ChecklistVersion', 'checklist_version_id', 'id')->withTrashed();
    }

    #many to many
    public function items()
    {
        return $this->belongsToMany('App\Models\ChecklistItem', 'checklist_item_checklist_version_stage', 'checklist_version_stage_id', 'checklist_item_id')
                    ->withTimestamps()
                    ->withTrashed()
                    ->withoutGlobalScope('orderByCreatedAt')
                    ->orderBy('checklist_item_checklist_version_stage.id');
    }
}


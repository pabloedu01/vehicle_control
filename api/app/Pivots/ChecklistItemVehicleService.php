<?php

namespace App\Pivots;

use App\Casts\MultipleTemporalFiles;
use App\Casts\ValueOfChecklistItem;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ChecklistItemVehicleService extends Pivot
{
    protected $hidden = [
      'created_at',
      'updated_at'
    ];

    protected $casts = [
        'value' => ValueOfChecklistItem::class,
        'evidence' => MultipleTemporalFiles::class
    ];

    public $filePaths = [
      'evidence' => 'vehicle_services/evidences',
      'value' => 'vehicle_services/evidences/checklist_item',
    ];
}

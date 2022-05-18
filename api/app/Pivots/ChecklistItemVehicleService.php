<?php

namespace App\Pivots;

use App\Casts\MultipleTemporalFiles;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ChecklistItemVehicleService extends Pivot
{
    protected $hidden = [
      'created_at',
      'updated_at'
    ];

    protected $casts = [
        'evidence' => MultipleTemporalFiles::class
    ];

    public $filePaths = [
      'evidence' => 'vehicle_services/evidences'
    ];
}

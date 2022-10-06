<?php

namespace App\Casts;

use App\Models\ChecklistItem;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class ValueOfChecklistItem implements CastsAttributes
{
    public function get($model,$key, $value, $attributes)
    {
        $gcsDriver  = env('GOOGLE_CLOUD_STORAGE_DRIVER', 'public');
        $gcsStorage = \Storage::disk($gcsDriver);

        $data = json_decode($value, true);

        if(is_array($data) && count($data) > 0){
            $checklistItem = ChecklistItem::find($model->checklist_item_id);

            if($checklistItem->validation['type'] == 'visualInspection'){
                foreach($data as $step => $item){
                    foreach($item['observations'] as $observationIndex => $observation){
                        foreach($observation['images'] as $index => $file){
                            $data[$step]['observations'][$observationIndex]['images'][$index] = is_string($file) && $gcsStorage->exists($file) ? $gcsStorage->url($file) : null;
                        }
                    }
                }

                return json_encode($data);
            }
        }

        return $value;
    }

    public function set($model, $key, $value, $attributes)
    {
        $gcsDriver    = env('GOOGLE_CLOUD_STORAGE_DRIVER', 'public');
        $gcsStorage   = \Storage::disk($gcsDriver);

        $data = json_decode($value, true);

        if(is_array($data) && count($data) > 0){
            $checklistItem = null;

            if(isset($model->checklist_item_id)){
                $checklistItem = ChecklistItem::withTrashed()->find($model->checklist_item_id);
            } else {
                //todo: éste cast dentro del pivote, utilizado desde un belongs to many, no alcanzo los atributos originales, por lo que realizo ésta pequeña adaptación para forzar la busqueda del checklist item
                $checklist = app('request')->get('checklist');

                if(is_array($checklist)){
                    $item = collect($checklist)->filter(function($item) use ($value){
                        return @$item['value'] === $value;
                    })->first();

                    if($item){
                        $checklistItem = ChecklistItem::withTrashed()->find(@$item['id']);
                    }
                }
            }

            if($checklistItem && $checklistItem->validation['type'] == 'visualInspection'){
                foreach($data as $step => $item){
                    foreach($item['observations'] as $observationIndex => $observation){
                        foreach($observation['images'] as $index => $file){
                            $newValue = \App\Models\TemporalFile::prepare($model, $key, $file);

                            $data[$step]['observations'][$observationIndex]['images'][$index] = $newValue;
                        }
                    }
                }

                return json_encode($data);
            }
        }

        return $value;
    }
}

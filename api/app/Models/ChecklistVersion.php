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

    protected $fieldsToSearchItem = [
      'content', 'printIf'
    ];

    public static function boot()
    {
        parent::boot();

        self::bootSimpleColumns();
    }

    public static function bootSimpleColumns()
    {
        static::addGlobalScope('simpleColumns', function($query){
            return $query->select( array_filter(array_merge(self::getFillables(), [self::getPrimaryKeyName()]), function($column){return $column != 'report';}) );
        });
    }

    public function getItemsAttribute()
    {
        $items = collect();
        $report = $this->formatted_report;

        if($report && isset($report['docElements']) && isset($report['parameters']))
        {
            $docElements = array_values(\Arr::sort($report['docElements'], function($element){
                return $element['y']*100 + $element['x'];
            }));

            $parameters = collect($report['parameters'])->keyBy('name');

            $itemsId = array_unique(array_merge(...array_filter(array_map(function($element) use ($parameters){
                $itemId = [];

                foreach($this->fieldsToSearchItem as $field){
                    if(isset($element[$field]) && $element[$field] && strlen($element[$field]) > 0 && preg_match_all('/(\${)(.*?)(})/', $element[$field], $matches))
                    {
                        if(isset($matches[2]))
                        {
                            foreach($matches[2] as $formattedName){
                                if(isset($parameters[$formattedName]))
                                {
                                    $itemId[] = $parameters[$formattedName]['id'] - 100;//en el frontend se le suma +100 a los id para que no haya choque con las variables que ya existan
                                }
                            }
                        }
                    }
                }

                return $itemId;
            }, $docElements), function($itemId){
                return count($itemId);
            })));

            $checklistItems = ChecklistItem::withTrashed()
                                    ->whereIn('id', $itemsId)
                                    ->get()
                                    ->keyBy('id');

            $checklistItems->append('formatted_name');

            foreach($itemsId as $itemId){
                if(isset($checklistItems[$itemId])){
                    $items->push($checklistItems[$itemId]);
                }
            }
        }

        return $items;
    }

    public function getFormattedReportAttribute(){
        $newReport = null;
        $report = $this->report;

        if($report && isset($report['docElements']) && isset($report['parameters']) && isset($report['styles'])){
            $checklistItems = ChecklistItem::withTrashed()
                                    ->get();

            $checklistItemsGroupedById = $checklistItems->keyBy('id');

            foreach($report['parameters'] as $indexParameter => $parameter){
                if(isset($checklistItemsGroupedById[$parameter['id'] - 100]) && $checklistItemsGroupedById[$parameter['id'] - 100]->formatted_name != $parameter['name']){
                    $report['parameters'][$indexParameter]['name'] = $checklistItemsGroupedById[$parameter['id'] - 100]->formatted_name;

                    foreach($report['docElements'] as $indexDocElement => $docElement){
                        foreach($this->fieldsToSearchItem as $field){
                            if(isset($docElement[$field]) && $docElement[$field] && strlen($docElement[$field]) > 0 && preg_match('/(\${)(.*)(})/', $docElement[$field]))
                            {
                                $report['docElements'][$indexDocElement][$field] = preg_replace('/(\${)('.$parameter['name'].')(})/', '${'.$checklistItemsGroupedById[$parameter['id'] - 100]->formatted_name.'}', $docElement[$field]);
                            }
                        }

                    }
                }
            }

            $newReport = $report;
            $newReport['styles'] = [];
            $index = 0;
            foreach($report['styles'] as $style){
                $newStyleId = 20000 + $index;
                foreach($report['docElements'] as $indexDocElement => $docElement){
                    if(@$docElement['styleId'] == $style['id']){
                        $report['docElements'][$indexDocElement]['styleId'] = $newStyleId;
                    }
                }

                $style['id'] = $newStyleId;

                $newReport['styles'][] = $style;

                $index++;
            }

            $newReport['docElements'] = [];
            $index = 0;
            foreach($report['docElements'] as  $docElement){
                $docElement['id'] = 10000 + $index;

                $newReport['docElements'][] = $docElement;

                $index++;
            }
        }


        return $newReport;
    }

    public static function rules($id = null)
    {
        return [
            'code'        => [
                'required', 'string', 'regex:/^[a-zA-Z0-9\-\_]*$/',
                self::getUniqueRule($id),
            ],
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string',
            'active'      => 'required|boolean',
            'report'      => 'nullable|array',
        ];
    }
}


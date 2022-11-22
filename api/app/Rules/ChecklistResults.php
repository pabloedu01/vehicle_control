<?php

namespace App\Rules;

use App\Models\ChecklistItem;
use App\Models\ChecklistVersion;
use Illuminate\Contracts\Validation\Rule;

class ChecklistResults implements Rule
{
    private $checklist_version_id;
    private $message;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($checklist_version_id)
    {
        $this->checklist_version_id = $checklist_version_id;
        $this->message    = trans('validation.exists');
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param string $attribute
     * @param mixed  $value
     *
     * @return bool
     */
    public function passes($attribute, $value)
    {
        if(!$this->checklist_version_id){
            return false;
        }

        $items = ChecklistItem::withTrashed()
                              ->get();

        $itemsIds = $items->pluck('id')->toArray();
        $valueIds = collect($value)->pluck('id')->toArray();

        if(count(array_diff($valueIds, $itemsIds)) == 0)
        {
            $itemsGroupById = $items->keyBy('id');
            $errors         = [];

            foreach($value as $checklist)
            {
                $item = $itemsGroupById[$checklist['id']];

                try{
                    $validator = validate([
                                              'valuexxxxx'    => @$checklist['value'],
                                              'evidencexxxxx' => @$checklist['evidence'],
                                              'observationsxxxxx' => @$checklist['observations']
                                          ],
                                          [
                                              'valuexxxxx'    => array_map(function($rule){
                                                  if($rule == 'TemporalFile'){
                                                      return new TemporalFile;
                                                  } else {
                                                      return $rule;
                                                  }
                                              }, explode('|', $item->validation['rule'])),
                                              'evidencexxxxx' => [
                                                  'nullable',
                                                  'array',
                                                  new MultipleTemporalFiles,
                                              ],
                                              'observationsxxxxx' => 'nullable|string'
                                          ]);

                    if($validator->fails())
                    {
                        $keys = [
                            'evidencexxxxx' => \Str::slug($item->name, '_', 'es').'_evidence',
                            'valuexxxxx' => \Str::slug($item->name, '_', 'es').'_value',
                            'observationsxxxxx' => \Str::slug($item->name, '_', 'es').'_observation',
                        ];

                        $items = [
                            'evidencexxxxx' => $item->name.' ('.trans('general.evidence').')',
                            'valuexxxxx' => $item->name.' ('.trans('general.value').')',
                            'observationsxxxxx' => $item->name.' ('.trans('general.observations').')',
                        ];

                        $messages = $validator->errors()->getMessages();
                        foreach($messages as $key => $message){
                            $errors[ $keys[$key] ] = array_map(function($data) use ($key,$items){
                                return str_replace($key, $items[$key], $data);
                            },$message);
                        }
                    }
                }catch(\Exception $e){
                    $errors[] = [$e->getMessage()];
                }
            }

            if(count($errors) > 0)
            {
                $this->message = $errors;

                return false;
            }
            else
            {
                return true;
            }
        }
        else
        {
            return false;
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return $this->message;
    }
}

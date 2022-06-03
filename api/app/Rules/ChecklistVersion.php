<?php

namespace App\Rules;

use App\Models\ChecklistItem;
use App\Models\VehicleBrandChecklistVersion;
use Illuminate\Contracts\Validation\Rule;

class ChecklistVersion implements Rule
{
    private $message;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
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
        foreach($value as $checklist)
        {
            if(!isset($checklist['id']))
            {
                $this->message = trans('validation.exists');

                return false;
                break;
            }
        }

        if(compareArrayWithDatabase(collect($value)->pluck('id'), ChecklistItem::class)){
            $items = ChecklistItem::get()->keyBy('id');
            $errors         = [];

            foreach($value as $checklist)
            {
                $validator = validate([
                                          'position'    => @$checklist['position'],
                                          'location' => @$checklist['location'],
                                          'type' => @$checklist['type'],
                                      ],
                                      [
                                          'position'    => 'nullable|integer',
                                          'location' => 'nullable|string',
                                          'type' => 'nullable|string',
                                      ]);

                if($validator->fails())
                {
                    $item = $items[$checklist['id']];
                    $messages = $validator->errors()->getMessages();
                    foreach($messages as $key => $message){
                        $errors[ $checklist['id'] ] = array_map(function($data) use ($key, $item){
                            return str_replace($key, $key.' of '.$item->name, $data);
                        },$message);
                    }
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
        } else {
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

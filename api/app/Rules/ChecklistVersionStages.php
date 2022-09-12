<?php

namespace App\Rules;

use App\Models\ChecklistItem;
use Illuminate\Contracts\Validation\Rule;

class ChecklistVersionStages implements Rule
{
    private $message;
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->message = trans('validation.exists');
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
        $items = ChecklistItem::withTrashed()
                              ->get();

        $itemsIds = $items->pluck('id')->toArray();
        $valueIds = array_merge(...array_map(function($data){return array_column(@$data['list'] ?? [], 'id');},$value));

        if(count(array_diff($valueIds, $itemsIds)) == 0)
        {
            foreach($value as $stage)
            {
                try
                {
                    $validator = validate($stage,
                                          [
                                              'name' => 'required|string',
                                              'id'   => 'required|numeric',
                                              'list' => 'array',
                                          ]);

                    if($validator->fails())
                    {
                        $this->message = $validator->errors();

                        return false;
                        break;
                    }
                }
                catch(\Exception $e)
                {
                    $this->message = [ $e->getMessage() ];

                    return false;
                    break;
                }
            }

            return true;
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

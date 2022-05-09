<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ArrayIdsInDatabase implements Rule
{
    private $modelClass;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($modelClass)
    {
        $this->modelClass = $modelClass;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return compareArrayWithDatabase(collect($value), $this->modelClass);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return trans('validation.exists');
    }
}

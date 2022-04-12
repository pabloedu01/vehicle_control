<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class CNPJ implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
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
        preg_match('/^(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})$/', $value, $matches);
    
        return count($matches) > 0;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return trans('validation.cnpj');
    }
}

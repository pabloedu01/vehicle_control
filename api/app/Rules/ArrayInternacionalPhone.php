<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ArrayInternacionalPhone implements Rule
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
        $valid = true;

        foreach($value as $phone){

            $validator = validate(['phone' => $phone], ['phone' => ['required', new InternacionalPhone]]);

            if($validator->fails()){
                $valid = false;
                break;
            }
        }

        return $valid;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return trans('validation.phone');
    }
}

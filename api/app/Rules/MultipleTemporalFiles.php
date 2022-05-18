<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class MultipleTemporalFiles implements Rule
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
     * @param string $attribute
     * @param mixed  $value
     *
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $values = $value;
        $error  = false;

        if(is_array($values))
        {
            foreach($values as $value)
            {
                if(is_numeric($value))
                {
                    $temporalFile = \App\Models\TemporalFile::where('id', '=', $value)->first();

                    if(!( $temporalFile && \Storage::disk('local')->exists($temporalFile->full_name) ))
                    {
                        $error = true;
                        break;
                    }
                }
                else
                {
                    if(!( is_string($value) && \Storage::disk(env('GOOGLE_CLOUD_STORAGE_DRIVER', 'local'))->exists($value) ))
                    {
                        $error = true;
                        break;
                    }
                }
            }
        }
        else
        {
            /*$error = true;*/
        }

        return !$error;
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

<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class TemporalFile implements Rule
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
        if(is_numeric($value))
        {
            $temporalFile = \App\Models\TemporalFile::where('id', '=', $value)->first();

            return $temporalFile && \Storage::disk('public')->exists($temporalFile->full_name);
        }
        else
        {
            $gcsStorage = \Storage::disk(env('GOOGLE_CLOUD_STORAGE_DRIVER', 'public'));

            return is_string($value) && \Storage::disk(env('GOOGLE_CLOUD_STORAGE_DRIVER', 'public'))->exists(last(explode($gcsStorage->url(''), $value)));
        }
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

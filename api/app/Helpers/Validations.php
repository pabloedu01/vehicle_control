<?php

function has_something($value, $length = 2)
{
    return !is_null($value) && $value != 'null' && (!is_array($value) && strlen($value) > $length || is_array($value) && count($value) > 0);
}

function is_true($value)
{
    return $value === true || $value === 'true' || $value === 'TRUE' || $value === 1 || $value === '1';
}

function is_false($value)
{
    return $value === false || $value === 'false' || $value === 'FALSE' || $value === 0 || $value === '0';
}

function print_is_true($eval, $value, $value_if_false = '')
{
    return (is_true($eval)) ? $value : $value_if_false;
}

function convert_string_to_boolean($value)
{
    return is_true($value) ? true : false;
}

function convert_boolean_to_string($value)
{
    return is_true($value) ? "true" : "false";
}

function validate($data, $rules)
{
    return Validator::make($data, $rules);
}

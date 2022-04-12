<?php

function array_ignore_keys($array, $keys)
{
    $new_array = [];
    
    foreach($array as $key => $value)
    {
        if(!in_array($key, $keys))
        {
            $new_array[$key] = $value;
        }
    }
    
    return $new_array;
}
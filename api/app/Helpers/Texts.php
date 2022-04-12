<?php

function custom_contains($word, $text)
{
    $regexp = null;

    $text = strtolower($text);

    if(is_string($word))
    {
        $regexp = '/('.strtolower($word).')/';

        return preg_match($regexp, $text) === 1 ? true : false;
    }
    else
    {
        $found  = false;
        $length = count($word);

        for($i = 0; $i < $length; $i++)
        {
            $regexp = '/('.strtolower($word[$i]).')/';

            if(!$found && preg_match($regexp, $text) === 1)
            {
                $found = true;

                break;
            }
        }

        return $found;
    }
}

function only_text($text)
{
    return remove_unnecessary_spaces(preg_replace('/[^a-zA-ZáéíóúÁÉÍÓÚñÑ \']/', ' ', $text));
}

function only_numbers($text)
{
    return preg_replace('/[^0-9\.]/', '', str_replace(',', '.', $text));
}

function mb_ucfirst($string, $encoding = 'utf8')
{
    $strlen    = mb_strlen($string, $encoding);
    $firstChar = mb_substr($string, 0, 1, $encoding);
    $then      = mb_substr($string, 1, $strlen - 1, $encoding);

    return mb_strtoupper($firstChar, $encoding).$then;
}

function getNameFromNumberExcel($num) {
    $numeric = ($num - 1) % 26;
    $letter = chr(65 + $numeric);
    $num2 = intval(($num - 1) / 26);
    if ($num2 > 0) {
        return getNameFromNumberExcel($num2) . $letter;
    } else {
        return $letter;
    }
}

function possibleIntegerNumber($number)
{
    if(is_numeric($number))
    {
        $number = str_replace(',', '', $number);

        $parts = explode('.', $number);

        if(intval($parts[count($parts) - 1]) == 0)
        {
            return intval($parts[0]);
        }
        else
        {
            return $number;
        }
    }
    else
    {
        return $number;
    }
}

function camel_case_text($text, $min_qty_char = 4)
{
    $text = strtolower($text);
    $text = trim($text);

    $words      = explode(' ', $text);
    $final_text = '';

    foreach($words as $word)
    {
        if(strlen($word) >= $min_qty_char)
        {
            $final_text = $final_text.' '.mb_ucfirst($word);
        }
        else
        {
            if($word == 'd\'')
            {
                $final_text = $final_text.' D\'';
            }
            else
            {
                $final_text = $final_text.' '.$word;
            }
        }
    }

    return trim($final_text);
}

function print_string_number($number)
{
    $number = intval($number);

    return $number < 10 ? '0'.$number : $number;
}

function slug($text, $separator = '-')
{
    $text = remove_unnecessary_spaces(strtolower($text));

    $characters = [
        'á' => 'a',
        'é' => 'e',
        'í' => 'i',
        'ó' => 'o',
        'ú' => 'u',
        'ñ' => 'n',
        'ç' => 'c',
        'ø' => 'o',
        '$' => 's',
        '&' => 'y',
        'ÿ' => 'y',
        'ä' => 'a',
        'ë' => 'e',
        'ö' => 'o',
        'ü' => 'u',
        'â' => 'a',
        'ê' => 'e',
        'ô' => 'o',
        'û' => 'u',
        'à' => 'a',
        'è' => 'e',
        'ò' => 'o',
        'ù' => 'u',
        'å' => 'a',
    ];

    $text = strtr($text, $characters);// toda coincidencia de caracteres en el text, sera cambiado.
    $text = preg_replace('/[^a-z0-9'.$separator.']/', $separator, $text);// cualquier cosa que no sea letra, numero o guion..se cambiara por -
    $text = preg_replace('/'.$separator.'+/', $separator, $text);//muchos guiones juntos, cambiarlos por uno solo
    $text = trim($text, $separator);// se quita cualquier guion al inicio o final del text

    return $text;
}

function cut_text($text, $characters_qty, $continue = false)
{
    $original_text = $text;

    $text = html_entity_decode(remove_unnecessary_spaces(trim(str_replace([
                                                                              "\r\n",
                                                                              "\r",
                                                                              "\n",
                                                                              "\t",
                                                                              "<br>",
                                                                              "<br/>",
                                                                              "<hr>",
                                                                              "<hr/>",
                                                                              PHP_EOL,
                                                                          ], " ", mb_substr(strip_tags($text), 0, $characters_qty, 'UTF-8')))));


    return ( $continue && strlen($original_text) > $characters_qty ) ? $text.'...' : $text;
}

function remove_unnecessary_spaces($texto)
{
    return trim(preg_replace('/\s+/', ' ', str_replace('&nbsp;', ' ', $texto)));
}

function remove_spaces($text)
{
    return preg_replace('/\s/', ' ', str_replace(' ', '', str_replace('&nbsp;', ' ', $text)));
}

function remove_special_characters($text)
{
    $text = str_replace("á", "a", $text);
    $text = str_replace("é", "e", $text);
    $text = str_replace("í", "i", $text);
    $text = str_replace("ó", "o", $text);
    $text = str_replace("ú", "u", $text);
    $text = str_replace("Á", "A", $text);
    $text = str_replace("É", "E", $text);
    $text = str_replace("Í", "I", $text);
    $text = str_replace("Ó", "O", $text);
    $text = str_replace("Ú", "U", $text);
    $text = str_replace("ñ", "n", $text);
    $text = str_replace("Ñ", "N", $text);

    return $text;
}

function strip_tags_content($text, $tags = '', $invert = false) // quita no solo la etiqueta html sino tambien el contenido dentro de ella
{
    preg_match_all('/<(.+?)[\s]*\/?[\s]*>/si', trim($tags), $tags);

    $tags = array_unique($tags[1]);

    if(is_array($tags) AND count($tags) > 0)
    {
        if($invert == false)
        {
            return preg_replace('@<(?!(?:'.implode('|', $tags).')\b)(\w+)\b.*?>.*?</\1>@si', '', $text);
        }
        else
        {
            return preg_replace('@<('.implode('|', $tags).')\b.*?>.*?</\1>@si', '', $text);
        }
    }
    elseif($invert == false)
    {
        return preg_replace('@<(\w+)\b.*?>.*?</\1>@si', '', $text);
    }

    return $text;
}
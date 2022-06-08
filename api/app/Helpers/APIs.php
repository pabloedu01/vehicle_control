<?php

function callAPI($url = null, $method = 'GET', $postOptions = null, $httpCode = false, $headers = null, $ssl = false, $curlInstance = false)
{
    if($url == null)
    {
        return null;
    }

    // Se inicializa curl con la url a solicitar
    $curl = curl_init($url);

    // Si la llamada es por método POST
    if($method == 'POST' || $method == 'post')
    {
        curl_setopt($curl, CURLOPT_POST, true);

        if($postOptions != null)
        {
            curl_setopt($curl, CURLOPT_POSTFIELDS, $postOptions);
        }
    }

    // Si la llamada es por método POST
    if($method == 'PUT' || $method == 'put')
    {
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");

        if($postOptions != null)
        {
            curl_setopt($curl, CURLOPT_POSTFIELDS, $postOptions);
        }
    }

    // Si la llamada debe hacerse usando ssl
    if($ssl)
    {
        curl_setopt($curl, CURLOPT_SSLVERSION, 3);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    }

    // Si se deben enviar valores en el header
    if($headers != null)
    {
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    }

    // Que la llamada retorne la respuesta
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($curl, CURLOPT_HEADER, false);

    if($curlInstance)
    {
        return $curl;
    }
    else
    {
        //Obtener la respuesta
        $encode_response = curl_exec($curl);

        // Se obtiene el código del status de la respuesta generada por el webservice
        $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        //se obtiene la respuesta de la petición
        $curl_response = curlJSONResponse($encode_response, $http_status);

        // Se cierra la conexión
        curl_close($curl);

        // Si la respuesta fué exitosa
        if($http_status == 200 || $http_status == 201)
        {
            if($httpCode)
            {
                return $http_status;
            }
            else
            {
                return $curl_response;
            }
        }
        else
        {
            return $encode_response;
        }
    }
}

function convert_from_latin1_to_utf8_recursively($dat)
{
    if(is_string($dat))
    {
        return utf8_encode($dat);
    }
    elseif(is_array($dat))
    {
        $ret = [];
        foreach($dat as $i => $d)
        {
            $ret[$i] = convert_from_latin1_to_utf8_recursively($d);
        }

        return $ret;
    }
    elseif(is_object($dat))
    {
        foreach($dat as $i => $d)
        {
            $dat->$i = convert_from_latin1_to_utf8_recursively($d);
        }

        return $dat;
    }
    else
    {
        return $dat;
    }
}

function callMultiAPIs($curls)
{
    //se inicializa
    $m_curl = curl_multi_init();

    //ciclo para incorporar las multiples llamadas
    foreach($curls as $key => $curl)
    {
        curl_multi_add_handle($m_curl, $curl);
    }

    // ejecutar las llamadas
    $running = null;
    do
    {
        curl_multi_exec($m_curl, $running);
    }while($running > 0);

    // obtener las respuestas y quitar las peticiones
    $responses = [];
    foreach($curls as $key => $curl)
    {
        #se obtiene el contenido y su status
        $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        // Si la respuesta fué exitosa
        if($http_status == 200 || $http_status == 201)
        {
            $responses[$key] = curlJSONResponse(curl_multi_getcontent($curl), $http_status);
        }
        else
        {
            $responses[$key] = $http_status;
        }

        curl_multi_remove_handle($m_curl, $curl);
    }

    //cerrar la conexion
    curl_multi_close($m_curl);

    return $responses;
}

function curlJSONResponse($response, $http_status)
{
    // Se decodifica el Json de la respuesta
    $curl_response = json_decode($response, true);

    //a veces por no se regresa bien la respuesta, entonces mejor la depuramos
    if(is_null($curl_response) && ($http_status == 200 || $http_status == 201))
    {
        $curl_response = json_decode(convert_from_latin1_to_utf8_recursively($response), true);
    }

    return $curl_response;
}

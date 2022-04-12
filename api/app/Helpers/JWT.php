<?php

/*
 * Hago ésta functión porque jwt hubo un caso donde cambié un número del signature de "8" a "9"
 * y la petición pasó correctamente, si la cambiaba por otro número, si daba error, pero específicamente con ese pequeño cambio que hice
 * me hizo dudar de la validez de jwt para validar el token, por lo que decidí añadir un extra de validación manual que no le hace daño a nadie
 */
function validate_jwt_signature($token){
    $jwt = get_jwt_parts($token);
    
    $my_signature = base64_url_encode(hash_hmac('sha256', $jwt['header'].'.'.$jwt['payload'], env('JWT_SECRET'), true));
    
    return $jwt['signature'] == $my_signature;
}

function validate_jwt_expire_data($token){
    $payload = get_jwt_payload($token);
    
    $expire_date = $payload['exp'];
    
    return time() <= $expire_date;
}

function get_jwt_payload_data($token){
    return array_ignore_keys(get_jwt_payload($token), ['iss', 'iat', 'exp', 'nbf', 'jti', 'sub', 'prv']);
}

function get_jwt_payload($token){
    return json_decode(base64_decode(get_jwt_parts($token)['payload']),true);
}

function get_jwt_parts($token){
    $token_parts = explode('.', $token);
    
    return [
        'header' => $token_parts[0],
        'payload' => $token_parts[1],
        'signature' => $token_parts[2]
    ];
}
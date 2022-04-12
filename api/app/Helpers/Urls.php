<?php

function base64_url_encode($text)
{
    return str_replace('=', '', str_replace('/', '_', str_replace('+', '-', base64_encode($text))));
}
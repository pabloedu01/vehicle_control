<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RecoverPasswordEmail extends Mailable
{
    use Queueable, SerializesModels;

    protected $data;


    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Recover Password')
                    ->with(array_merge($this->data, ['url' => env('APP_URL_FRONTEND', '').'/change-password/'.$this->data['code']]))
                    ->view('email.recoverPassword');
    }
}

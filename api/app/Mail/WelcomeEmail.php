<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeEmail extends Mailable
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
        return $this->subject('Welcome to our website')
                    ->with(array_merge($this->data, ['url' => env('APP_URL_FRONTEND', '').'/account/activate-user/'.$this->data['code']]))
                    ->view('email.welcome');
    }
}

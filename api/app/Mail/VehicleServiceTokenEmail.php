<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VehicleServiceTokenEmail extends Mailable
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
        return $this->subject('Vehicle Service preview')
                    ->with(array_merge($this->data, [ 'url' => env('APP_URL_FRONTEND', '').'/invite/company/'.$this->data['company_id'].'/'.$this->data['type'].'/'.$this->data['id'].'/checklist/'.$this->data['checklist_id'].'/token/'.$this->data['token'] ]))
                    ->view('email.vehicle-service-token');
    }
}

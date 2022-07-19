<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ChecklistReportEmail extends Mailable
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
        return $this->subject('Checklist Report')
                    ->with($this->data)
                    ->attachFromStorageDisk(env('GOOGLE_CLOUD_STORAGE_DRIVER', 'public'), $this->data['report'], basename($this->data['report']), [
                        'as'   => 'Reporte.pdf',
                        'mime' => 'application/pdf',
                    ])
                    ->view('email.checklistReport');
    }
}

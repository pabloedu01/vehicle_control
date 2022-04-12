<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    protected $data;
    protected $emailClass;
    
    public function __construct($data,$emailClass)
    {
        $this->data = $data;
        $this->emailClass = $emailClass;
    }
    
    public function handle()
    {
        $email = new $this->emailClass(collect($this->data)->except(['to', 'cc', 'bcc'])->toArray());
        
        \Mail::to(env('APP_DEBUG') ? env('MAIL_FROM_ADDRESS_DEBUG') : $this->data['to'])
             ->send($email);
    }
}

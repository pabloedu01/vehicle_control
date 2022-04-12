<?php

use Illuminate\Database\Migrations\Migration;
Use Jenssegers\Mongodb\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('mongodb')->create('logs', function(Blueprint $table){
            $table->id();
            $table->integer('user_id')->nullable();
            $table->string('username', 45);
            $table->string('table', 100)->nullable();
            $table->integer('register_id')->nullable();
            $table->string('action', 10);
            $table->json('data')->nullable();
            $table->timestamp('date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::connection('mongodb')->drop('logs');
    }
}

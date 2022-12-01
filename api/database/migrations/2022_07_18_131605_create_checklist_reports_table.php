<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChecklistReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('checklist_reports', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('vehicle_service_id')->unsigned();
            $table->foreign('vehicle_service_id')->references('id')->on('vehicle_services')->onDelete('cascade');
            $table->string('filename');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('checklist_reports');
    }
}

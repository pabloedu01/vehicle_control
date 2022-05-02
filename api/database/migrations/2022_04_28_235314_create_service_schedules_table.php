<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServiceSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('service_schedules', function (Blueprint $table) {
            $table->id();
            $table->integer('company_id')->unsigned();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->integer('vehicle_id')->unsigned();
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('cascade');
            $table->integer('technical_consultant_id')->nullable();
            $table->integer('client_id')->nullable();
            $table->string('code')->nullable();
            $table->timestamp('promised_date');
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('claim_service_service_schedule', function (Blueprint $table) {
            $table->id();
            $table->integer('service_schedule_id')->unsigned();
            $table->foreign('service_schedule_id')->references('id')->on('service_schedules')->onDelete('cascade');
            $table->integer('claim_service_id')->unsigned();
            $table->foreign('claim_service_id')->references('id')->on('claims_service')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('service_claim_service_service_schedule', function (Blueprint $table) {
            $table->id();
            $table->integer('claim_service_service_schedule_id')->unsigned();
            $table->foreign('claim_service_service_schedule_id')->references('id')->on('claim_service_service_schedule')->onDelete('cascade');
            $table->integer('service_id')->unsigned();
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->double('price',15, 2);
            $table->timestamps();
        });

        Schema::create('product_service_claim_service_service_schedule', function (Blueprint $table) {
            $table->id();
            $table->integer('service_claim_service_service_schedule_id')->unsigned();
            $table->foreign('service_claim_service_service_schedule_id')->references('id')->on('service_claim_service_service_schedule')->onDelete('cascade');
            $table->integer('product_id')->unsigned();
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->double('price',15, 2);
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
        Schema::dropIfExists('product_service_claim_service_service_schedule');
        Schema::dropIfExists('service_claim_service_service_schedule');
        Schema::dropIfExists('claim_service_service_schedule');
        Schema::dropIfExists('service_schedules');
    }
}

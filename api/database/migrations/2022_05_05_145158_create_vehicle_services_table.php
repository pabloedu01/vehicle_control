<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehicleServicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicle_services', function (Blueprint $table) {
            $table->id();

            /*$table->integer('company_id')->unsigned();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');*/
            $table->foreignId('company_id')->constrained('companies')->onDelete('restrict')->onUpdate('restrict');
            $table->bigInteger('version_id')->unsigned();
            $table->foreign('version_id')->references('id')->on('vehicle_brand_checklist_versions')->onDelete('cascade');
            $table->integer('service_schedule_id')->nullable();
            $table->integer('service_order_id')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('vehicle_service_client_data', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('vehicle_service_id')->unsigned();
            $table->foreign('vehicle_service_id')->references('id')->on('vehicle_services')->onDelete('cascade');
            $table->integer('client_id')->nullable();
            $table->string('name')->nullable();
            $table->text('signature')->nullable();
            $table->timestampTz('signature_date')->nullable();
            $table->timestamps();
        });

        Schema::create('vehicle_service_technical_consultant_data', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('vehicle_service_id')->unsigned();
            $table->foreign('vehicle_service_id', 'v_service_t_c_data_v_s_id_foreign')->references('id')->on('vehicle_services')->onDelete('cascade');
            $table->bigInteger('technical_consultant_id')->unsigned();
            $table->foreign('technical_consultant_id', 'v_service_t_c_data_technical_c_id_foreign')->references('id')->on('technical_consultants')->onDelete('cascade');
            $table->text('signature')->nullable();
            $table->timestampTz('signature_date')->nullable();
            $table->timestamps();
        });

        Schema::create('vehicle_service_vehicle_data', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('vehicle_service_id')->unsigned();
            $table->foreign('vehicle_service_id')->references('id')->on('vehicle_services')->onDelete('cascade');
            $table->bigInteger('brand_id')->unsigned();
            $table->foreign('brand_id')->references('id')->on('vehicle_brands')->onDelete('cascade');
            $table->string('plate')->nullable();
            $table->integer('fuel')->default(0)->nullable();
            $table->double('mileage', 10, 2)->default(0)->nullable();
            $table->timestamps();
        });

        Schema::create('checklist_item_vehicle_service', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('checklist_item_id')->unsigned();
            $table->foreign('checklist_item_id')->references('id')->on('checklist_items')->onDelete('cascade');
            $table->bigInteger('vehicle_service_id')->unsigned();
            $table->foreign('vehicle_service_id')->references('id')->on('vehicle_services')->onDelete('cascade');
            $table->string('value');
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
        Schema::dropIfExists('checklist_item_vehicle_service');
        Schema::dropIfExists('vehicle_service_client_data');
        Schema::dropIfExists('vehicle_service_technical_consultant_data');
        Schema::dropIfExists('vehicle_service_vehicle_data');
        Schema::dropIfExists('vehicle_services');
    }
}

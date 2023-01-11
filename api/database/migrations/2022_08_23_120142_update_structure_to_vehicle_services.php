<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateStructureToVehicleServices extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('vehicle_service_client_data', function (Blueprint $table) {
            $table->dropColumn('signature');
            $table->dropColumn('signature_date');
        });

        Schema::table('vehicle_service_technical_consultant_data', function (Blueprint $table) {
            $table->dropColumn('signature');
            $table->dropColumn('signature_date');
        });

        Schema::create('checklist_version_stage_vehicle_service', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('checklist_version_stage_id')->unsigned();
            $table->foreign('checklist_version_stage_id', 'c_v_s_vehicle_service_c_version_s_id_foreign')->references('id')->on('checklist_version_stages')->onDelete('cascade');

            $table->bigInteger('vehicle_service_id')->unsigned();
            $table->foreign('vehicle_service_id', 'c_v_stage_v_s_vehicle_s_id_foreign')->references('id')->on('vehicle_services')->onDelete('cascade');

            $table->text('client_signature')->nullable();
            $table->timestampTz('client_signature_date')->nullable();

            $table->text('technical_consultant_signature')->nullable();
            $table->timestampTz('technical_consultant_signature_date')->nullable();

            $table->boolean('completed')->default(false);

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
        Schema::dropIfExists('checklist_version_stage_vehicle_service');
    }
}

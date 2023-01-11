<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnVehicleClientIdToServiceSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::table('service_schedules')->delete();
        \DB::table('vehicle_services')->delete();

        Schema::table('service_schedules', function (Blueprint $table) {
            $table->bigInteger('client_vehicle_id')->unsigned();
            $table->foreign('client_vehicle_id')->references('id')->on('client_vehicles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('service_schedules', function (Blueprint $table) {
            //
        });
    }
}

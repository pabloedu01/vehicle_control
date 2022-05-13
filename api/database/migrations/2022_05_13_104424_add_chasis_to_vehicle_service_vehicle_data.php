<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddChasisToVehicleServiceVehicleData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('vehicle_service_vehicle_data', function (Blueprint $table) {
            $table->integer('vehicle_id')->nullable();
            $table->string('chasis')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('vehicle_service_vehicle_data', function (Blueprint $table) {
            $table->dropColumn('vehicle_id');
            $table->dropColumn('chasis');
        });
    }
}

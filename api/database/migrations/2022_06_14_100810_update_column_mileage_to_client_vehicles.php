<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateColumnMileageToClientVehicles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('client_vehicles', function (Blueprint $table) {
            $table->dropColumn('mileage');
        });

        Schema::table('client_vehicles', function (Blueprint $table) {
            $table->double('mileage', 10, 2)->nullable();
        });

        Schema::table('vehicle_service_vehicle_data', function (Blueprint $table) {
            $table->dropColumn('mileage');
        });

        Schema::table('vehicle_service_vehicle_data', function (Blueprint $table) {
            $table->double('mileage', 10, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('client_vehicles', function (Blueprint $table) {
            //
        });
    }
}

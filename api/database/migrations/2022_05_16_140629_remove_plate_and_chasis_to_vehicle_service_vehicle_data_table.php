<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemovePlateAndChasisToVehicleServiceVehicleDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('vehicle_service_vehicle_data', function (Blueprint $table) {
            $table->dropColumn('plate');
            $table->dropColumn('chasis');
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
            $table->string('plate', 20)->nullable();
            $table->string('chasis', 45)->nullable();
        });
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveColumnsPlateAndChasisToServiceSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('service_schedules', function (Blueprint $table) {
            $table->dropForeign('service_schedules_vehicle_id_foreign');
            $table->dropColumn('vehicle_id');
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

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateColumnVersionIdToVehicleServicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::table('vehicle_services')->delete();

        Schema::table('vehicle_services', function (Blueprint $table) {
            $table->dropForeign('vehicle_services_version_id_foreign');
            $table->dropColumn('version_id');
            $table->bigInteger('checklist_version_id')->unsigned();
            $table->foreign('checklist_version_id')->references('id')->on('checklist_versions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('vehicle_services', function (Blueprint $table) {
            //
        });
    }
}

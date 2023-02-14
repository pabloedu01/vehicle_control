<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterRecomendationOsType extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('recommendations', function (Blueprint $table) {
            $table->dropForeign(['service_type_id']);
            $table->dropColumn('service_type_id');
            $table->dropForeign(['vehicle_id']);
            $table->dropColumn('vehicle_id');
            $table->foreignId('maintenance_review_id')->nullable()->change();
            $table->foreignId('claim_service_id')->nullable()->change();
            $table->foreignId('client_vehicle_id')->nullable()->constrained('client_vehicles');
            $table->foreignId('os_type_id')->nullable()->constrained('os_type');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}

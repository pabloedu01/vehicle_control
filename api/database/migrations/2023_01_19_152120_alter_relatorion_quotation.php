<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterRelatorionQuotation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('client_vehicle', function (Blueprint $table) {
            $table->dropForeign('vehicle_id');
            $table->dropColumn('vehicle_id');
            $table->foreignId('client_vehicle_id')->nullable()->constrained('client_vehicles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('recommendation_service', function (Blueprint $table) {

            $table->dropForeign('client_vehicle_id');
            $table->dropColumn('client_vehicle_id');


        });
    }
}

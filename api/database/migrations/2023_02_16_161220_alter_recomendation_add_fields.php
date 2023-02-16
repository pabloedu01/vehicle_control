<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterRecomendationAddFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('recommendations', function (Blueprint $table) {
            $table->dropForeign(['client_vehicle_id']);
            $table->dropColumn('client_vehicle_id');
            // $table->dropForeign(['vehicle_id']);
            // $table->dropColumn('vehicle_id');

        });
        Schema::table('recommendations', function (Blueprint $table) {
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles');
            $table->foreignId('brand_id')->nullable()->constrained('vehicle_brands');
            $table->foreignId('model_id')->nullable()->constrained('vehicle_models');
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

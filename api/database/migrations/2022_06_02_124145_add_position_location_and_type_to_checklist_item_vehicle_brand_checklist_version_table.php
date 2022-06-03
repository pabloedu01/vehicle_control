<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPositionLocationAndTypeToChecklistItemVehicleBrandChecklistVersionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('checklist_item_vehicle_brand_checklist_version', function(Blueprint $table){
            $table->integer('position')->nullable();
            $table->integer('location')->nullable();
            $table->integer('type')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('checklist_item_vehicle_brand_checklist_version', function(Blueprint $table){
            $table->dropColumn('position');
            $table->dropColumn('location');
            $table->dropColumn('type');
        });
    }
}

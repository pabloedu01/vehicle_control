<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChecklistItemVehicleBrandChecklistVersionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('checklist_item_vehicle_brand_checklist_version', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('item_id')->unsigned();
            $table->foreign('item_id', 'c_item_v_b_checklist_v_v_id_foreign')->references('id')->on('checklist_items')->onDelete('cascade');
            $table->bigInteger('version_id')->unsigned();
            $table->foreign('version_id', 'c_item_vehicle_b_checklist_v_v_id_foreign')->references('id')->on('vehicle_brand_checklist_versions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('checklist_item_vehicle_brand_checklist_version');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChecklistVersionStagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('checklist_version_stages', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('checklist_version_id')->unsigned();
            $table->foreign('checklist_version_id')->references('id')->on('checklist_versions')->onDelete('cascade');
            $table->string('name', 100);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('checklist_item_checklist_version_stage', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('checklist_version_stage_id')->unsigned();
            $table->foreign('checklist_version_stage_id', 'c_i_c_version_s_checklist_v_stage_id_foreign')->references('id')->on('checklist_version_stages')->onDelete('cascade');

            $table->bigInteger('checklist_item_id')->unsigned();
            $table->foreign('checklist_item_id')->references('id')->on('checklist_items')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('checklist_item_checklist_version_stage');
        Schema::dropIfExists('checklist_version_stages');
    }
}

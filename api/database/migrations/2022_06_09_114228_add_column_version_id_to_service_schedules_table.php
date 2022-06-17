<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnVersionIdToServiceSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::table('service_schedules')->truncate();

        Schema::table('service_schedules', function (Blueprint $table) {
            $table->integer('checklist_version_id')->unsigned();
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
        Schema::table('service_schedules', function (Blueprint $table) {
            $table->dropForeign('service_schedules_checklist_version_id_foreign');
            $table->dropColumn('checklist_version_id');
        });
    }
}

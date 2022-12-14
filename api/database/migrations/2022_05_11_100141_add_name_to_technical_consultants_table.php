<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNameToTechnicalConsultantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('technical_consultants', function (Blueprint $table) {
            $table->dropForeign('technical_consultants_user_id_foreign');
            $table->dropIndex('technical_consultants_user_id_foreign');
        });

        Schema::table('technical_consultants', function (Blueprint $table) {
            $table->integer('user_id')->nullable()->change();
            $table->string('name')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('technical_consultants', function (Blueprint $table) {
            //
        });
    }
}

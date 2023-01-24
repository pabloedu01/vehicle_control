<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Dropfkofservices extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('services', function (Blueprint $table) {
            // $table->dropForeign('client_vehicles_client_id_foreign');
            $table->dropColumn('service_type_id');
        });
    }

    /**
     * Reverse the migrations. services_service_type_id_foreign
     *
     * @return void
     */
    public function down()
    {
        Schema::table('services', function (Blueprint $table) {

        });
    }
}

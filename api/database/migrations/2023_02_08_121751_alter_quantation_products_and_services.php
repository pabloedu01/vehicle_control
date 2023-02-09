<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterQuantationProductsAndServices extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('recommendation_products', function (Blueprint $table) {
            // add quantitiy column nullable in double 15 digits and 2 decimals
            $table->double('quantity', 15, 2)->nullable()->after('price');



        });
        Schema::table('recommendation_service', function (Blueprint $table) {
            $table->double('quantity', 15, 2)->nullable()->after('price');

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

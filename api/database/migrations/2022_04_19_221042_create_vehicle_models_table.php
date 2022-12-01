<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehicleModelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicle_models', function (Blueprint $table) {
            $table->id();
            /*$table->integer('company_id')->unsigned();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');*/
            $table->foreignId('company_id')->constrained('companies')->onDelete('restrict')->onUpdate('restrict');
            $table->foreignId('brand_id')->constrained('vehicle_brands')->onDelete('restrict')->onUpdate('restrict');
            /*$table->integer('brand_id')->unsigned();
            $table->foreign('brand_id')->references('id')->on('vehicle_brands')->onDelete('cascade');*/
            $table->string('name');
            $table->boolean('active')->default(true);
            $table->softDeletes();
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
        Schema::dropIfExists('vehicle_models');
    }
}

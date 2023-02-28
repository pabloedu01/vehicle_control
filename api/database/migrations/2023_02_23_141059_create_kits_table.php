<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKitsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('kits', function (Blueprint $table) {
            $table->id();
            // add fk company
            $table->unsignedBigInteger('company_id');
            $table->foreign('company_id')->references('id')->on('companies');
            $table->string('name');
            $table->timestamps();
        });
        // create kit_services
        Schema::create('kit_services', function (Blueprint $table) {
            $table->id();
            // add fk kit
            $table->unsignedBigInteger('kit_id');
            $table->foreign('kit_id')->references('id')->on('kits');
            // add fk service
            $table->unsignedBigInteger('service_id');
            $table->foreign('service_id')->references('id')->on('services');
            $table->double('quantity', 8, 2)->nullable();
            $table->timestamps();
        });
        // create kit_products
        Schema::create('kit_products', function (Blueprint $table) {
            $table->id();
            // add fk kit
            $table->unsignedBigInteger('kit_id');
            $table->foreign('kit_id')->references('id')->on('kits');
            // add fk product
            $table->unsignedBigInteger('product_id');
            $table->foreign('product_id')->references('id')->on('products');
            $table->double('quantity', 8, 2)->nullable();
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
        Schema::dropIfExists('kit_services');
        Schema::dropIfExists('kit_products');
        Schema::dropIfExists('kits');

    }
}

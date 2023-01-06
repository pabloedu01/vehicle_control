<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMantenancesReviewTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('maintenance_reviews', function(Blueprint $table){
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('restrict')->onUpdate('restrict');
            $table->foreignId('brand_id')->constrained('vehicle_brands')->onDelete('restrict')->onUpdate('restrict');
            $table->foreignId('model_id')->constrained('vehicle_models')->onDelete('restrict')->onUpdate('restrict');
            $table->string('name');
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
        Schema::dropIfExists('maintenance_reviews');
    }
}

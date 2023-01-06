<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRecomendationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('restrict')->onUpdate('restrict');
            $table->foreignId('vehicle_id')->constrained('vehicles')->onDelete('restrict')->onUpdate('restrict');
            $table->foreignId('service_type_id')->constrained('service_types')->onDelete('restrict')->onUpdate('restrict');
            $table->foreignId('claim_service_id')->constrained('claims_service')->onDelete('restrict')->onUpdate('restrict');
            $table->foreignId('maintenance_review_id')->constrained('maintenance_reviews')->onDelete('restrict')->onUpdate('restrict');
            $table->string('name');
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('recommendation_service', function (Blueprint $table) {
            $table->id();
            $table->integer('recommendation_id')->unsigned();
            $table->foreign('recommendation_id')->references('id')->on('recommendations')->onDelete('cascade');
            $table->integer('service_id')->unsigned();
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
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
        Schema::dropIfExists('recommendations');
    }
}

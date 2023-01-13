<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEstimatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('estimates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->nullable()->constrained('companies');
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles');
            $table->foreignId('maintenance_review_id')->nullable()->constrained('maintenance_reviews');
            $table->foreignId('consultant_id')->nullable()->constrained('users');
            $table->string('observation')->nullable();
            $table->timestamps();
        });
        Schema::create('estimates_itens', function (Blueprint $table) {
            $table->id();
            $table->foreign('estimates_id')->references('id')->on('estimates')->onDelete('cascade');
            $table->foreignId('service_id')->references('id')->on('services')->nullable();
            $table->foreignId('products_id')->references('id')->on('products')->nullable();
            $table->enum('type', ['service', 'product']);
            $table->double('price', 15,2);
            $table->double('quantity', 15,2);
            $table->double('total',15,2)->virtualAs('price * quantity')->nullable();
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
        Schema::dropIfExists('estimates');
    }
}

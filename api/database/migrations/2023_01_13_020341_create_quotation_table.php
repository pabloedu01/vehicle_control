<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuotationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quotation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->nullable()->constrained('companies');
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles');
            $table->foreignId('client_id')->nullable()->constrained('clients');

            $table->foreignId('maintenance_review_id')->nullable()->constrained('maintenance_reviews');
            $table->foreignId('consultant_id')->nullable()->constrained('users');
            $table->string('observation')->nullable();
            $table->timestamps();
        });
        Schema::create('quotation_itens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quotation_id')->references('id')->on('quotation')->onDelete('cascade');
            $table->foreignId('service_id')->references('id')->on('services')->nullable();
            $table->foreignId('products_id')->references('id')->on('products')->nullable();
            $table->double('price', 15,2);
            $table->double('quantity', 15,2);
           // $table->string('total')->virtualAs('price * quantity')->nullable();
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

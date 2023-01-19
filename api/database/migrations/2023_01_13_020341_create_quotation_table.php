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
            $table->foreignId('company_id')->constrained('companies');
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles');
            $table->foreignId('client_id')->nullable()->constrained('clients');
            $table->foreignId('maintenance_review_id')->nullable()->constrained('maintenance_reviews');
            $table->foreignId('consultant_id')->nullable()->constrained('users');
            $table->timestamps();
        });
        Schema::create('quotation_itens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quotation_id')->references('id')->on('quotation')->onDelete('cascade');
            $table->foreignId('service_id')->nullable()->constrained('services');
            $table->foreignId('products_id')->nullable()->constrained('products');
            $table->double('price', 15,5);
            $table->double('price_discount', 15,5);
            $table->double('quantity', 15,5);
           // $table->string('total')->virtualAs('price * quantity')->nullable();
            $table->timestamps();
        });
        Schema::create('quotations_claim_service', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quotation_id')->references('id')->on('quotation')->onDelete('cascade');
            $table->foreignId('claim_service_id')->references('id')->on('claims_service')->onDelete('cascade');
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

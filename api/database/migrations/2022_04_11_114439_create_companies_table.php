<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompaniesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name',100)->nullable();
            $table->string('cnpj')->nullable();
            $table->string('cpf')->nullable();
            $table->string('country',45)->nullable();
            $table->string('city',45)->nullable();
            $table->string('province',45)->nullable();
            $table->text('address_1')->nullable();
            $table->string('address_2')->nullable();
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
        Schema::dropIfExists('companies');
    }
}

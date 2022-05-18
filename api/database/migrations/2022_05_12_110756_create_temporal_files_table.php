<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTemporalFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /*
         * Primero el archivo se subirá localmente de forma temporal
         * cuando el archivo sea procesado, se enviará a gcs y se eliminará de forma local
         * los archivos temporales serán eliminados cuando tengan más de 24h de su creación
         */
        Schema::create('temporal_files', function (Blueprint $table) {
            $table->id();
            $table->string('myme_type',20);
            $table->string('filename', 100);
            $table->string('original_name',245);
            $table->double('size', 10,2);//kbs
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
        Schema::dropIfExists('temporal_files');
    }
}

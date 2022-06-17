<?php

namespace App\Console\Commands;

use App\Models\TemporalFile;
use Illuminate\Console\Command;

class DeleteTemporalFiles extends Command
{
    private $storage;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'delete-temporal-files';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Eliminar archivos temporales que no hayan sido utilizados.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();

        $this->storage = \Storage::disk('public');
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->past24Hours();

        $allTemporalFiles     = TemporalFile::select([ 'id', 'filename' ])->get();
        $allTemporalFilenames = $allTemporalFiles->pluck('filename')->toArray();

        $physicalFiles = array_map(function($full_name){
            return basename($full_name);
        }, $this->storage->allFiles(TemporalFile::$path));

        $this->physicalFilesWithoutRegisterInDatabase(array_diff($physicalFiles, $allTemporalFilenames));
        $this->temporalFilesWithoutPhysicalFile($allTemporalFiles, array_diff($allTemporalFilenames, $physicalFiles));

        return true;
    }

    private function past24Hours()
    {
        $temporalFiles = TemporalFile::where('created_at', '<=', date('Y-m-d H:i:s', strtotime('-24 hours')))->get();

        foreach($temporalFiles as $temporalFile)
        {
            if($this->storage->exists($temporalFile->full_name))
            {
                $this->storage->delete($temporalFile->full_name);
            }

            secureDelete($temporalFile);
        }
    }

    private function physicalFilesWithoutRegisterInDatabase($physicalFilenames)
    {
        foreach($physicalFilenames as $filename)
        {
            unlink($this->storage->path(TemporalFile::$path.'/'.$filename));
        }
    }

    private function temporalFilesWithoutPhysicalFile($allTemporalFiles, $temporalFiles)
    {
        $allTemporalFilesGroupedByFilename = $allTemporalFiles->keyBy('filename');

        foreach($temporalFiles as $filename)
        {
            secureDelete($allTemporalFilesGroupedByFilename[$filename]);
        }
    }
}

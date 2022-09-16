<?php

namespace App\Http\Controllers;

use App\Models\TemporalFile;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FileUploadController extends Controller
{
    private $storage;

    public function __construct()
    {
        $this->storage = \Storage::disk('public');

        if(!$this->storage->exists(TemporalFile::$path))
        {
            $this->storage->makeDirectory(TemporalFile::$path);
        }
    }

    public function store(Request $request, $type)
    {
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);

        switch($type){
            case 'image':
                $validator = validate($request->all(), [
                    'image' => 'required|file|image',
                ]);

                $file = $request->file('image');
                break;
            case 'excel':
                $validator = validate($request->all(), [
                    'file' => 'required|file|mimetypes:application/csv,application/excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,application/vnd.ms-excel',
                ]);

                $file = $request->file('file');
                break;
            default:
                $validator = validate($request->all(), [
                    'file' => 'required|file',
                ]);

                $file = $request->file('file');
                break;
        }

        if($validator->fails())
        {
            return response()->json([
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        /*if($type == 'image'){
            $image = null;
            try{
                $newWidth = 300;

                $image = \Image::make($file->getRealPath());

                if($image->filesize()/(1000*1000) >= 3){
                    $currentWidth = $image->getWidth();

                    if($currentWidth > $newWidth){
                        $image->resize($newWidth, null, function ($constraint) {
                            $constraint->aspectRatio();
                        });

                        $image->save();
                        //$image->destroy();
                    }
                }
            }catch(\Exception $e){

            }
        }*/

        if($filename = $file->store(TemporalFile::$path))
        {
            $temporalFile = new TemporalFile();

            $temporalFile->myme_type     = $file->getClientMimeType();
            $temporalFile->filename      = basename($filename);
            $temporalFile->original_name = $file->getClientOriginalName();
            $temporalFile->size          = round($file->getSize()/1000, 2);

            if(secureSave($temporalFile))
            {
                return response()->json([
                                            'msg' => trans('general.msg.success'),
                                            'data' => $temporalFile,
                                        ],
                                        Response::HTTP_CREATED
                );
            }
            else
            {
                return response()->json([
                                            'msg' => trans('general.msg.error'),
                                        ],
                                        Response::HTTP_INTERNAL_SERVER_ERROR
                );
            }
        }
        else
        {
            return response()->json([
                                        'msg' => trans('general.msg.fileNotSaved'),
                                    ],
                                    Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\TemporalFile;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FileUploadController extends Controller
{
    private $storage;

    public function __construct()
    {
        $this->storage = \Storage::disk('local');

        if(!$this->storage->exists(TemporalFile::$path))
        {
            $this->storage->makeDirectory(TemporalFile::$path);
        }
    }

    public function storeImage(Request $request)
    {
        $validator = validate($request->all(), [
            'image' => 'required|file|image',
        ]);

        if($validator->fails())
        {
            return response()->json([
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $file = $request->file('image');

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

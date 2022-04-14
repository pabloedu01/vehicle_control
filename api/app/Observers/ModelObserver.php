<?php

namespace App\Observers;


use Schema;
use Illuminate\Database\Eloquent\Model;


class ModelObserver
{
    public function deleting(Model $model)
    {
        if(Schema::setConnection($model->getConnection())->hasColumn($model->getTable(), 'deleted_at'))//soft delete
        {
            try
            {
                $has_many_relationships = array_filter($model->relationships(), function($relation){
                    return $relation['type'] == 'HasMany';/*todo: buscar tambien las relaciones de muchos a muchos y hacer un sync.*/
                });
        
                foreach($has_many_relationships as $relation => $details)
                {
                    foreach($model->{$relation} as $item){
                        $item->delete();
                    }
                }
            }
            catch(\Exception $e)
            {
                if(env('APP_DEBUG'))
                {
                    dd($e->getMessage());
                }
            }
            
            $model->deleted_at = date('Y-m-d H:i:s');
            secureSave($model);
            
            return false;
        }
        else
        {
            return true;
        }
    }
}
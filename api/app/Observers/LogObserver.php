<?php

namespace App\Observers;


use Illuminate\Database\Eloquent\Model;

class LogObserver
{
    /*todo: falta ver como se comportaría con los sync*/
    public function updated(Model $model)
    {
        $except = [ 'updated_at' ];
    
        $after = \Arr::except($model->getDirty(), $except);
        $before = \Arr::only($model->getOriginal(),array_keys($after));
    
        add_log(__FUNCTION__, ['before' => $before, 'after' => $after], $model->getTable(), $model->{$model->getKeyName()});
        
        return true;
    }
    
    public function created(Model $model)
    {
        $primary_key = $model->getKeyName();
        $except      = [ 'created_at', 'updated_at', $primary_key ];
        
        add_log(__FUNCTION__, \Arr::except($model->getDirty(), $except), $model->getTable(), $model->{$primary_key});
        
        return true;
    }
    
    public function deleted(Model $model)
    {
        $primary_key = $model->getKeyName();
        $except      = [ $primary_key ];
        
        add_log(__FUNCTION__, \Arr::except($model->getOriginal(), $except), $model->getTable(), $model->{$primary_key});
        
        return true;
    }
}
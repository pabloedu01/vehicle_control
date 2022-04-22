<?php

namespace App\Observers;


class LogObserver
{
    /*todo: falta ver como se comportaría con los sync*/
    public function updated($model)
    {
        $changes = $model->getAppliedChanges();

        add_log(__FUNCTION__, $changes, $model->getTable(), $model->{$model->getKeyName()});

        return true;
    }

    public function created($model)
    {
        $primary_key = $model->getKeyName();
        $except      = [ 'created_at', 'updated_at', $primary_key ];

        add_log(__FUNCTION__, \Arr::except($model->getDirty(), $except), $model->getTable(), $model->{$primary_key});

        return true;
    }

    public function deleted($model)
    {
        $primary_key = $model->getKeyName();
        $except      = [ $primary_key ];

        add_log(__FUNCTION__, \Arr::except($model->getOriginal(), $except), $model->getTable(), $model->{$primary_key});

        return true;
    }
}

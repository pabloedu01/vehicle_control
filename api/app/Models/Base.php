<?php

namespace App\Models;

use App\Observers\LogObserver;
use App\Traits\RelationshipsTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Validation\Rule;

class Base extends Model
{
    use SoftDeletes, RelationshipsTrait;

    public $hasLogs = true;

    protected $hidden = [
        'deleted_at',
        'created_at',
        'updated_at',
    ];

    protected $changingColumns = [];

    public static function boot()
    {
        parent::boot();

        //self::observe(ModelObserver::class, 0);
        /*if(self::getHasLogs())
        {
            self::observe(LogObserver::class, 1);
        }*/

        if(self::getHasTimestamps())
        {
            static::addGlobalScope('orderByCreatedAt', function($query){
                return $query->orderBy(self::getTableName().'.created_at', 'desc');
            });
        }
    }

    public function secureDelete()
    {
        try
        {
            $this->delete();

            return true;
        }
        catch(\Exception $e)
        {
            if(env('APP_DEBUG'))
            {
                dd($e->getMessage());
            }

            return false;
        }
    }

    public function canBeDeleted(){
        return !$this->hasDependencies();
    }

    public static function bootSoftDeletes()
    {
        if(self::getHasSoftDeletes()){
            static::addGlobalScope(new SoftDeletingScope);
        }
    }

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
    }

    public static function getFillables()
    {
        return with(new static)->getFillable();
    }

    public static function getHasLogs()
    {
        return with(new static)->hasLogs;
    }

    public static function getHasTimestamps()
    {
        return with(new static)->timestamps;
    }

    public static function getHasSoftDeletes()
    {
        return with(new static)->forceDeleting == false;
    }

    public static function getTableName()
    {
        return with(new static)->getTable();
    }

    public static function getPrimaryKeyName()
    {
        return with(new static)->getKeyName();
    }

    public static function getChangingColumns()
    {
        return with(new static)->changingColumns;
    }

    public static function getUniqueRule($id, $conditions = [])
    {
        $someConditionIsNull = count(array_filter($conditions, function($condition){return is_null($condition);})) > 0;

        if(!is_null($id) && !$someConditionIsNull)
        {
            $uniqueRule = Rule::unique(self::getTableName())->ignore($id, 'id');

            if(self::getHasSoftDeletes()){
                $uniqueRule = $uniqueRule->where('deleted_at', null);
            }

            foreach($conditions as $column => $value)
            {
                $uniqueRule = $uniqueRule->where($column, $value);
            }
        }
        else
        {
            if(!$someConditionIsNull)
            {
                $uniqueRule = Rule::unique(self::getTableName());

                if(self::getHasSoftDeletes()){
                    $uniqueRule = $uniqueRule->where('deleted_at', null);
                }

                foreach($conditions as $column => $value)
                {
                    $uniqueRule = $uniqueRule->where($column, $value);
                }
            }
            else
            {
                $uniqueRule = '';
            }
        }

        return $uniqueRule;
    }

    /*
     * Cambio el comportamiento del hasMany para poder enlazar con mongo, ya que por defecto coloca un prefijo de la tabla relacionada y a mongo no le va esto
     */
    /*public function hasMany($related, $foreignKey = null, $localKey = null, $withRelatedTable = true)
    {
        $instance = $this->newRelatedInstance($related);

        $foreignKey = $foreignKey ?: $this->getForeignKey();

        $localKey = $localKey ?: $this->getKeyName();

        return $this->newHasMany(
            $instance->newQuery(), $this, ($withRelatedTable ? $instance->getTable().'.' : '').$foreignKey, $localKey
        );
    }*/

    public function getAppliedChanges(){
        $except = ['updated_at'];
        $after = \Arr::except($this->getDirty(), $except);
        $before = \Arr::only($this->getOriginal(),array_keys($after));

        return ['before' => $before, 'after' => $after];
    }

    public function hasAppliedChanges(){
        $appliedChanges = $this->getAppliedChanges();

        return count($appliedChanges['before']) || count($appliedChanges['after']);
    }

    public static function changeFillablesColumns(){
        $columns = array_flip(self::getChangingColumns());
        $fillables = self::getFillables();

        $newFillables = [];

        foreach($fillables as $fillable)
        {
            if( isset($columns[$fillable]) ){
                $newFillables[] = $columns[$fillable];
            } else {
                $newFillables[] = $fillable;
            }
        }

        return $newFillables;
    }

    public static function changeDataColumns($array, $changingColumns = null){
        $availableColumns = $changingColumns ?? self::getChangingColumns();

        $newArray = [];

        foreach($array as $key_1 => $data)
        {
            if(isset($availableColumns[$key_1]))
            {
                $newArray[$availableColumns[$key_1]] = $data;
            } else{
                $newArray[$key_1] = $data;
            }
        }

        return $newArray;
    }

    #has many
    public function logs()
    {
        //cuando sea necesario hacer uso de ésta relacion, colocar "use HybridRelations;" en el modelo como un trait

        return $this->hasMany('App\Models\Log', 'register_id', self::getKeyName())->where('table', '=', self::getTable())->orderBy('date', 'desc');
    }
}

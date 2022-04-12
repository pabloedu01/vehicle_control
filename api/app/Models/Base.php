<?php

namespace App\Models;

use App\Observers\LogObserver;
use App\Traits\RelationshipsTrait;
use App\Traits\SoftDeleteTrait;
use Illuminate\Database\Eloquent\Model;

class Base extends Model
{
    use SoftDeleteTrait, RelationshipsTrait;
    
    public $hasLogs = true;
    
    protected $hidden = [
        'deleted_at',
        'created_at',
        'updated_at',
    ];
    
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
    }
    
    public static function boot()
    {
        parent::boot();
        
        if(self::getHasLogs()){
            self::observe(LogObserver::class, 0);
        }
    }
    
    public static function getHasLogs(){
        return with(new static)->hasLogs;
    }
    
    public static function getTableName()
    {
        return with(new static)->getTable();
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
    
    #has many
    public function logs()
    {
        //cuando sea necesario hacer uso de ésta relacion, colocar "use HybridRelations;" en el modelo como un trait
        
        return $this->hasMany('App\Models\Log', 'register_id', self::getKeyName(), false)->where('table', '=', self::getTable())->orderBy('date', 'desc');
    }
}
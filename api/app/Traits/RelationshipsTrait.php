<?php

namespace App\Traits;


use Illuminate\Database\Eloquent\Relations\Relation;

trait RelationshipsTrait
{
    public function relationships()
    {
        $model         = new static;
        $model_class   = get_class($model);
        $relationships = [];
        try
        {
            foreach(( new \ReflectionClass($model) )->getMethods(\ReflectionMethod::IS_PUBLIC) as $method)
            {
                if(
                    $method->isStatic() ||
                    $method->class != $model_class ||
                    !empty($method->getParameters()) ||
                    $method->getName() == __FUNCTION__ ||
                    in_array($method->getName(), [ 'logs', 'boot', 'rules', 'getTableName', 'restore', 'relationships']))
                {
                    continue;
                }

                try
                {
                    $return = $method->invoke($model);

                    if($return instanceof Relation)
                    {
                        $relationships[$method->getName()] = [
                            'type'  => ( new \ReflectionClass($return) )->getShortName(),
                            'model' => ( new \ReflectionClass($return->getRelated()) )->getName(),
                        ];
                    }
                }
                catch(\ErrorException $e)
                {
                }
            }
        }
        catch(\ReflectionException $e)
        {
        }

        return $relationships;
    }

    public function hasDependencies(){
        $hasDependencies = false;
        $relationships = $this->relationships();

        $filteredRelationships = array_filter($this->relationships(), function($relation){
            return in_array($relation['type'], ['HasMany', 'BelongsToMany', 'HasOne']);
        });

        $relationsWithoutGlobalScopes = [];
        foreach($filteredRelationships as $relation => $details){
            $relationsWithoutGlobalScopes[$relation] = function($query) use ($details){
                if($details['model']::getHasSoftDeletes()){
                    return $query->withoutGlobalScopes()
                        ->whereNull('deleted_at');
                } else {
                    return $query->withoutGlobalScopes();
                }
            };
        }

        $this->loadCount($relationsWithoutGlobalScopes);

        foreach($filteredRelationships as $relation => $details){
            if($this->{\Str::snake($relation).'_count'} > 0){
                $hasDependencies = true;

                break;
            }
        }

        return $hasDependencies;
    }
}

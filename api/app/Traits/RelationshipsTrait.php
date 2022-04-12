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
}

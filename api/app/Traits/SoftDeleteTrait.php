<?php

namespace App\Traits;

trait SoftDeleteTrait
{
    public function restore()
    {
        if ($this->fireModelEvent('restoring') === false) {
            return false;
        }
        
        $this->deleted_at = null;
        
        $result = secureUpdate($this);
        
        $this->fireModelEvent('restored', false);
        
        return $result;
    }
    
    public static function restoring($callback)
    {
        static::registerModelEvent('restoring', $callback);
    }
    
    public static function restored($callback)
    {
        static::registerModelEvent('restored', $callback);
    }
}

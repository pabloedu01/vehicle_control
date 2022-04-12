<?php

function secureSave($model)
{
    try
    {
        $model->save();
        
        return true;
    }
    catch(Exception $e)
    {
        if(env('APP_DEBUG'))
        {
            dd($e->getMessage());
        }
        
        return false;
    }
}

function secureDelete($model)
{
    try
    {
        $model->delete();
        
        return true;
    }
    catch(Exception $e)
    {
        if(env('APP_DEBUG'))
        {
            dd($e->getMessage());
        }
        
        return false;
    }
}

function enable_query_log()
{
    \DB::enableQueryLog();
}

function last_query()
{
    $queries = \DB::getQueryLog();
    
    $last_query = end($queries);
    
    foreach($last_query['bindings'] as $val)
    {
        $last_query['query'] = preg_replace('/\?/', "'{$val}'", $last_query['query'], 1);
    }
    
    dd($last_query['query']);
}

function all_queries()
{
    $queries = \DB::getQueryLog();
    $data = [];
    
    foreach($queries as $query)
    {
        $result = $query;
        
        foreach($result['bindings'] as $val)
        {
            $result['query'] = preg_replace('/\?/', "'{$val}'", $result['query'], 1);
        }
        
        array_push($data,$result['query']);
    }
    
    dd($data);
}

function add_log($action, $data = null, $table = null, $register_id = null)
{
    $activity = new App\Models\Log();
    
    $user = \Auth::user();
    
    if(!is_null($user))
    {
        $activity->user_id = $user->id;
        $activity->username    = $user->username;
    }
    else
    {
        $activity->user_id = null;
        $activity->username    = 'guest';
    }
    
    $activity->data        = !is_null($data) && is_array($data) && count($data) > 0 ? $data : null;
    $activity->date        = date('Y-m-d H:i:s');
    $activity->action      = $action;
    $activity->{'table'}   = $table;
    $activity->register_id = $register_id;
    
    return secureSave($activity);
}

function getDBConfig($config = 'prefix')
{
    return \DB::connection()->getConfig($config);
}

function getRealQuery($query)
{
    $real_query = $query->toSql();
    
    foreach($query->getBindings() as $val)
    {
        $real_query = preg_replace('/\?/', "'{$val}'", $real_query, 1);
    }
    
    return $real_query;
}

function get_all_tables()
{
    $tables = [];
    
    /*$result = DB::select('SHOW TABLES');*/
    
    $result = DB::getDoctrineSchemaManager()->listTableNames();
    $prefix = getDBConfig();
    
    $ignore = ['migrations', 'oauth'];
    
    foreach($result as $table)
    {
        if(strlen($prefix) > 0)
        {
            $parts = explode($prefix, $table);//$table->Tables_in_robot_project
            if(count($parts) > 1 && !custom_contains($ignore, $parts[1]))
            {
                array_push($tables, $parts[1]);
            }
        }
        else
        {
            if(!custom_contains($ignore, $table))
            {
                array_push($tables, $table);
            }
        }
    }
    
    return $tables;
}
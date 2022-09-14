<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait DynamicFiltersTrait
{
    public function scopeDynamicFilter(Builder $query, $filters = [])
    {
        $request = app('request');

        if(empty($filters)){
            $filters = array_map(function($key) use ($request){
                return array_merge(['column' => $key,'values' => [['value' => $request->get($key)]]],$this->filters[$key]);
            },array_keys(app('request')->only(array_keys($this->filters))));
        }

        $table       = $this->getTable();
        $primaryKey = $this->getKeyName();

        if(count($filters) > 0)
        {
            $sql         = 'SELECT '.$table.'.'.$primaryKey.' FROM '.$table;
            $joinsArray = [];
            $joins       = '';
            $where       = '';

            foreach($filters as $filter)
            {
                switch(@$filter['type'])
                {
                    default:
                        $where = $this->prepareFilterSQL($table, $filter, $where, 'AND');
                        break;
                }
            }

            if(isset($this->filterJoins)){
                $joins .= $this->filterJoins;
            }

            $limit = @$request->limit ?? 50;
            $currentPage = @$request->current_page && is_numeric($request->current_page) ? $request->current_page - 1 : 0;

            $query = $query->limit($limit)
                           ->offset($currentPage*$limit);

            return $query->whereRaw($table.'.'.$primaryKey.' IN ('.$sql.$joins.' WHERE '.$where.')');
        }

        return $query->where($table.'.'.$primaryKey, '>', 0);
    }

    private function prepareFilterSQL($originalTable, $filter, $sql, $concat)
    {
        $newSql   = '';
        $subWhere = '';

        $extraTemp = @$filter['extra'] ?? [];

        $table = (@$filter['model'] ? $filter['model']::getTableName() : $originalTable).'.';
        $type = @$filter['type'] ?? 'text';

        switch($type)
        {
            case 'text':
                if(@$filter['values']){
                    foreach($filter['values'] as $index => $value)
                    {
                        if($index != 0)
                        {
                            $subWhere .= ' OR ';
                        }

                        if(isset($extraTemp['like']))
                        {
                            /*switch($extraTemp['like'])
                            {
                                case 'aqui-podria-ir-algun-valor-que-yo-cree':
                                    $value = ( intval($value['value']) - 1000 );

                                    $subWhere .= $table.$filter['column'].' = '.$value;
                                    break;
                                default:
                                    $subWhere .= $table.$filter['column'].' ILIKE \'%'.$value['value'].'%\'';
                                    break;
                            }*/
                        }
                        else
                        {
                            $subWhere .= $table.$filter['column'].' '.($value['value'] == 'isnull' ? 'IS NULL' : 'ILIKE \'%'.$value['value'].'%\'');
                        }
                    }
                }
                break;
            case 'dateMin':
                foreach($filter['values'] as $index => $value)
                {
                    if($index != 0)
                    {
                        $subWhere .= ' AND ';
                    }

                    $subWhere .= $table.$filter['column'].' >= \''.$value['value'].'\'';
                }
                break;
            case 'dateMax':
                foreach($filter['values'] as $index => $value)
                {
                    if($index != 0)
                    {
                        $subWhere .= ' AND ';
                    }

                    $subWhere .= $table.$filter['column'].' <= \''.$value['value'].'\'';
                }
                break;
            case 'date':
                foreach($filter['values'] as $index => $value)
                {
                    if(isset($value['operator']))
                    {
                        if($index != 0)
                        {
                            $subWhere .= ' AND ';
                        }

                        if($value['operator'] != 'range')
                        {
                            $subWhere .= $table.$filter['column'].' '.$value['operator'].' \''.$value['value'].' '.( $value['operator'] == '>=' ? '00:00:00' : ( $value['operator'] == '<=' ? '23:59:59' : '' ) ).'\'';
                        }
                        else
                        {
                            $dates = explode(',', $value['value']);

                            $subWhere .= $table.$filter['column'].' >= \''.$dates[0].' 00:00:00\' AND '.$table.$filter['column'].' <= \''.$dates[1].' 23:59:59\'';
                        }
                    }
                }
                break;
        }

        if($subWhere != '')
        {
            if($sql != '')
            {
                $newSql = $sql.' '.$concat.' ';
            }

            $newSql .= '('.$subWhere.')';
        }
        else
        {
            $newSql = $sql;
        }

        return $newSql;
    }
}

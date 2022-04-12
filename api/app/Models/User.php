<?php

namespace App\Models;

use App\Casts\Bcrypt;
use App\Observers\LogObserver;
use App\Observers\UserObserver;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    protected $table = 'users';
    
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
        'deleted_at',
        'created_at',
        'updated_at',
    ];
    
    protected $fillable = [
        'user_id',
        'username',
        'password',
        'name',
        'email',
        'phone',
        'birthday',
        'active'
    ];
    
    protected $casts = [
        'password' => Bcrypt::class,
    ];
    
    public static function boot()
    {
        parent::boot();
        
        self::observe(LogObserver::class, 0);
        self::observe(UserObserver::class, 1);
    }
    
    public static function getTableName()
    {
        return with(new static)->getTable();
    }
    
    #has many
    public function logs()
    {
        return $this->hasMany('App\Models\Log', 'register_id', self::getKeyName())->where('table', '=', self::getTable())->orderBy('date', 'desc');
    }
    
    #has many
    public function tokens()
    {
        return $this->hasMany('App\Models\Token', 'user_id', 'id')
                    ->where('type', '=', 'user')
                    ->where('from', '=', 'myself');
    }
    
    #many to many
    public function companies()
    {
        return $this->belongsToMany('App\Models\Company', 'company_user', 'user_id', 'company_id')
                    ->withPivot([ 'role' ])
                    ->whereNull('companies.deleted_at')
                    ->orderBy('company_user.created_at', 'desc')
                    ->withTimestamps();
    }
    
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
    
    public function getJWTCustomClaims()
    {
        return ['username' => $this->username, 'name' => $this->name, 'id' => $this->id, 'email' => $this->email];
    }
}

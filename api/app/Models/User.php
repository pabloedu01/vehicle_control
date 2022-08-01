<?php

namespace App\Models;

use App\Casts\Bcrypt;
use App\Observers\LogObserver;
use App\Observers\UserObserver;
use App\Rules\Password;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use SoftDeletes;

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

    public static function rules()
    {
        return [
            'birthday' => 'nullable|date_format:d/m/Y',
            'name'     => 'required|string',
            'phone'    => 'nullable|string',
            'email'    => 'required|email|unique:users,email',
            'username' => 'required|string|unique:users,username',
            'password' => ['required', 'string', 'min:6', 'max:20', new Password],
        ];
    }

    public static function boot()
    {
        parent::boot();

        //self::observe(ModelObserver::class, 0);
        self::observe(LogObserver::class, 1);
        self::observe(UserObserver::class, 2);
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
                    ->orderBy('company_user.created_at', 'desc')
                    ->withTimestamps();
    }

    #has many
    public function technicalConsultants()
    {
        return $this->hasMany('App\Models\TechnicalConsultant', 'user_id', 'id');
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public static function getFillables()
    {
        return with(new static)->getFillable();
    }

    public function getJWTCustomClaims()
    {
        return ['username' => $this->username, 'name' => $this->name, 'id' => $this->id, 'email' => $this->email];
    }

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
}

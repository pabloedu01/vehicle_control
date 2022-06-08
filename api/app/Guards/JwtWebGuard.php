<?php

namespace App\Guards;

use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;

/**
 * Class PinGuard
 */
class JwtWebGuard implements Guard
{
    protected $user;

    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function check()
    {
        return (bool) $this->user();
    }

    public function guest()
    {
        return !$this->check();
    }

    public function id()
    {
        $user = $this->user();
        return $user ? $user->id : null;
    }

    public function setUser(Authenticatable $user)
    {
        $this->user = $user;
        return $this;
    }

    public function validate(array $credentials = [])
    {
        throw new \BadMethodCallException('Unexpected method call');
    }

    public function authenticate()
    {
        return $this->user();
    }

    public function user()
    {
        return $this->user ?: $this->signInWithPin();
    }

    protected function signInWithPin()
    {
        $token = @$this->request->token;

        try{
            if($token){
                $user = get_jwt_payload_data($token);

                return User::find(@json_decode(json_encode($user),false)->id);
            }
        }
        catch(\Exception $e){

        }

        return null;
    }

    public function logout()
    {
        if ($this->user) {
            $this->setUser(null);
        }
    }
}

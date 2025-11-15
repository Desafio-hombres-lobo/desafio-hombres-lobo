<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Roles_administracion extends Model
{
    protected $table = 'roles_administracion';

    public function usuarios(): HasMany
    {
        return $this->hasMany(User::class, 'rol');
    }
}

